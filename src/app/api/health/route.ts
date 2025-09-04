import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import * as fs from 'fs'
import * as os from 'os'
import { getAllRateLimits } from '@/config/rate-limits'

export async function GET() {
  const startTime = Date.now()
  
  const checks = {
    status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    node: {
      version: process.version,
      platform: process.platform,
      arch: process.arch,
    },
    checks: {
      app: 'ok' as 'ok' | 'warning' | 'error',
      database: 'checking' as 'ok' | 'warning' | 'error' | 'checking',
      supabaseAuth: 'checking' as 'ok' | 'warning' | 'error' | 'checking',
      memory: 'ok' as 'ok' | 'warning' | 'error',
      diskSpace: 'ok' as 'ok' | 'warning' | 'error',
      rateLimit: 'ok' as 'ok' | 'warning' | 'error',
    },
    metrics: {
      memoryUsage: {} as any,
      diskSpace: {} as any,
      responseTime: 0,
    },
    rateLimits: [] as any[],
  }

  // Check database connection
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('news').select('id').limit(1)
    checks.checks.database = error ? 'error' : 'ok'
  } catch (err) {
    checks.checks.database = 'error'
    checks.status = 'degraded'
  }

  // Check Supabase auth service
  try {
    const supabase = await createClient()
    const { data: session } = await supabase.auth.getSession()
    checks.checks.supabaseAuth = 'ok'
  } catch (err) {
    checks.checks.supabaseAuth = 'error'
    checks.status = 'degraded'
  }

  // Check memory usage
  const memUsage = process.memoryUsage()
  const heapUsedPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100
  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  const systemMemPercent = ((totalMem - freeMem) / totalMem) * 100
  
  checks.metrics.memoryUsage = {
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB',
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB',
    heapUsedPercent: Math.round(heapUsedPercent) + '%',
    systemTotal: Math.round(totalMem / 1024 / 1024) + ' MB',
    systemFree: Math.round(freeMem / 1024 / 1024) + ' MB',
    systemUsedPercent: Math.round(systemMemPercent) + '%',
  }
  
  if (heapUsedPercent > 90) {
    checks.checks.memory = 'error'
    checks.status = 'unhealthy'
  } else if (heapUsedPercent > 70) {
    checks.checks.memory = 'warning'
    checks.status = 'degraded'
  }

  // Check disk space (for the root partition)
  try {
    // This is a simplified check - in production you might want to use a more robust solution
    const stats = fs.statfsSync('/')
    const totalSpace = stats.blocks * stats.bsize
    const freeSpace = stats.bavail * stats.bsize
    const usedPercent = ((totalSpace - freeSpace) / totalSpace) * 100
    
    checks.metrics.diskSpace = {
      total: Math.round(totalSpace / 1024 / 1024 / 1024) + ' GB',
      free: Math.round(freeSpace / 1024 / 1024 / 1024) + ' GB',
      usedPercent: Math.round(usedPercent) + '%',
    }
    
    if (usedPercent > 95) {
      checks.checks.diskSpace = 'error'
      checks.status = 'unhealthy'
    } else if (usedPercent > 85) {
      checks.checks.diskSpace = 'warning'
      checks.status = 'degraded'
    }
  } catch (err) {
    // If we can't check disk space, just mark as warning
    checks.checks.diskSpace = 'warning'
  }

  // Check rate limit cache status
  try {
    // Get configured rate limits for documentation
    checks.rateLimits = getAllRateLimits()
    checks.checks.rateLimit = 'ok'
  } catch (err) {
    checks.checks.rateLimit = 'warning'
  }

  // Calculate response time
  checks.metrics.responseTime = Date.now() - startTime

  // Determine overall status
  const errorCount = Object.values(checks.checks).filter(v => v === 'error').length
  const warningCount = Object.values(checks.checks).filter(v => v === 'warning').length
  
  if (errorCount > 0) {
    checks.status = 'unhealthy'
  } else if (warningCount > 0) {
    checks.status = 'degraded'
  }

  // Return appropriate status code
  const statusCode = checks.status === 'healthy' ? 200 : 
                    checks.status === 'degraded' ? 200 : 503

  return NextResponse.json(checks, { status: statusCode })
}