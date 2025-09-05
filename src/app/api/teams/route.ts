// Teams API Routes
import { NextRequest } from 'next/server'
import { teamService } from '@/lib/services/team.service'
import { CreateTeamRequest } from '@/lib/api/types'
import { formatSuccessResponse } from '@/lib/api/errors'
import { 
  createApiHandler, 
  parseRequest, 
  parsePaginationParams 
} from '@/lib/api/middleware'
import { validateString } from '@/lib/api/validation'

// GET /api/teams - List all teams
export const GET = createApiHandler(async (request: NextRequest) => {
  const { searchParams } = await parseRequest(request)
  const pagination = parsePaginationParams(searchParams)
  
  // Optional category filter
  const category = validateString(searchParams.category, 'Kategorie')
  
  let result
  if (category) {
    result = await teamService.getTeamsByCategory(category, pagination)
  } else {
    result = await teamService.getActiveTeams(pagination)
  }

  return formatSuccessResponse(result.data, {
    page: pagination.page,
    limit: pagination.limit,
    total: result.total
  })
}, {
  rateLimit: { requests: 60, window: 60000 } // 60 requests per minute
})

// POST /api/teams - Create new team
export const POST = createApiHandler(async (request: NextRequest) => {
  const { body } = await parseRequest(request)
  
  const team = await teamService.createTeam(body as CreateTeamRequest)
  
  return formatSuccessResponse(team)
}, {
  requireAdmin: true,
  rateLimit: { requests: 10, window: 60000 } // 10 requests per minute for admin
})