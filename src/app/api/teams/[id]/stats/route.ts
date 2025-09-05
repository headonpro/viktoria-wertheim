// Team Statistics API Route
import { NextRequest } from 'next/server'
import { teamService } from '@/lib/services/team.service'
import { formatSuccessResponse } from '@/lib/api/errors'
import { createApiHandler } from '@/lib/api/middleware'
import { validateUUID } from '@/lib/api/validation'

// GET /api/teams/[id]/stats - Get team statistics
export const GET = createApiHandler(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id: rawId } = await params
  const id = validateUUID(rawId, 'Team-ID', true)
  
  const stats = await teamService.getTeamStats(id)
  
  return formatSuccessResponse(stats)
}, {
  rateLimit: { requests: 30, window: 60000 }
})