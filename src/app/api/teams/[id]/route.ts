// Individual Team API Routes
import { NextRequest } from 'next/server'
import { teamService } from '@/lib/services/team.service'
import { CreateTeamRequest } from '@/lib/api/types'
import { formatSuccessResponse } from '@/lib/api/errors'
import { 
  createApiHandler, 
  parseRequest 
} from '@/lib/api/middleware'
import { validateUUID } from '@/lib/api/validation'

// GET /api/teams/[id] - Get team by ID
export const GET = createApiHandler(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id: rawId } = await params
  const id = validateUUID(rawId, 'Team-ID', true)
  
  const team = await teamService.findById(id)
  
  return formatSuccessResponse(team)
}, {
  rateLimit: { requests: 100, window: 60000 } // 100 requests per minute
})

// PUT /api/teams/[id] - Update team
export const PUT = createApiHandler(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id: rawId } = await params
  const id = validateUUID(rawId, 'Team-ID', true)
  const { body } = await parseRequest(request)
  
  const team = await teamService.updateTeam(id, body as Partial<CreateTeamRequest>)
  
  return formatSuccessResponse(team)
}, {
  requireAdmin: true,
  rateLimit: { requests: 20, window: 60000 }
})

// DELETE /api/teams/[id] - Deactivate team (soft delete)
export const DELETE = createApiHandler(async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id: rawId } = await params
  const id = validateUUID(rawId, 'Team-ID', true)
  
  const team = await teamService.deactivateTeam(id)
  
  return formatSuccessResponse({ 
    message: 'Team wurde deaktiviert',
    team 
  })
}, {
  requireAdmin: true,
  rateLimit: { requests: 10, window: 60000 }
})