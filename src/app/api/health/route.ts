import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    checks: {
      app: 'ok',
      database: 'checking',
      memory: 'ok',
    }
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

  // Check memory usage
  const memUsage = process.memoryUsage()
  const heapUsedPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100
  if (heapUsedPercent > 90) {
    checks.checks.memory = 'warning'
    checks.status = 'degraded'
  }

  // Return appropriate status code
  const statusCode = checks.status === 'healthy' ? 200 : 503

  return NextResponse.json(checks, { status: statusCode })
}