// Contact Form API Route
import { NextRequest, NextResponse } from 'next/server'
import { contactService } from '@/lib/services/contact.service'
import { ContactSubmission } from '@/lib/api/types'

// POST /api/contact - Send contact form email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    await contactService.sendContactEmail(body as ContactSubmission)
    
    return NextResponse.json({
      success: true,
      message: 'Nachricht erfolgreich gesendet'
    })
  } catch (error) {
    console.error('Contact form error:', error)
    
    // Check if it's our custom API error
    if (error && typeof error === 'object' && 'code' in error) {
      return NextResponse.json({
        success: false,
        error: {
          code: (error as any).code,
          message: (error as any).message
        }
      }, { status: (error as any).statusCode || 500 })
    }
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Ein interner Fehler ist aufgetreten'
      }
    }, { status: 500 })
  }
}