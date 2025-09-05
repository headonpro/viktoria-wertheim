// Contact Form API Route (Modernized)
import { NextRequest } from 'next/server'
import { contactService } from '@/lib/services/contact.service'
import { ContactSubmission } from '@/lib/api/types'
import { formatSuccessResponse } from '@/lib/api/errors'
import { createApiHandler, parseRequest } from '@/lib/api/middleware'

// POST /api/contact - Send contact form email
export const POST = createApiHandler(async (request: NextRequest) => {
  const { body } = await parseRequest(request)
  
  await contactService.sendContactEmail(body as ContactSubmission)
  
  return formatSuccessResponse({
    message: 'Nachricht erfolgreich gesendet'
  })
}, {
  rateLimit: { requests: 3, window: 60000 } // 3 requests per minute per IP
})