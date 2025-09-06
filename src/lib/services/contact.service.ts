// Contact Service - Business logic for contact form
import nodemailer from 'nodemailer'
import { ContactSubmission } from '@/lib/api/types'
import { API_ERRORS } from '@/lib/api/errors'
import { 
  validateString, 
  validateEmail 
} from '@/lib/api/validation'
import logger from '@/lib/logger'

class ContactService {
  private transporter: nodemailer.Transporter | null = null

  constructor() {
    this.initializeTransporter()
  }

  // Initialize email transporter
  private initializeTransporter() {
    const emailUser = process.env.EMAIL_USER
    const emailPass = process.env.EMAIL_PASS

    if (!emailUser || !emailPass) {
      logger.warn('Email configuration missing. Contact form will not send emails.')
      return
    }

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: emailUser,
        pass: emailPass
      },
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,   // 10 seconds
      socketTimeout: 10000      // 10 seconds
    })
  }

  // Validate contact form data
  private validateContactData(data: ContactSubmission) {
    const name = validateString(data.name, 'Name', { 
      required: true, 
      maxLength: 100,
      minLength: 2
    })
    
    const email = validateEmail(data.email, 'E-Mail-Adresse', true)
    
    const subject = validateString(data.subject, 'Betreff', { 
      required: true, 
      maxLength: 200,
      minLength: 5
    })
    
    const message = validateString(data.message, 'Nachricht', { 
      required: true, 
      maxLength: 2000,
      minLength: 10
    })

    return { name, email, subject, message }
  }

  // Send contact form email
  async sendContactEmail(data: ContactSubmission): Promise<void> {
    try {
      // Validate input
      const { name, email, subject, message } = this.validateContactData(data)

      // Check if transporter is available
      if (!this.transporter) {
        throw API_ERRORS.EMAIL_CONFIG_MISSING()
      }

      // Email to admin - using development email for now
      const adminEmail = process.env.NODE_ENV === 'production' 
        ? 'info@viktoria-wertheim.de' 
        : 'headonpro@gmail.com'
      
      const adminMailOptions = {
        from: `"${name}" <${email}>`,
        to: adminEmail,
        replyTo: email,
        subject: `[Website Kontakt] ${subject}`,
        text: message,
        html: this.generateAdminEmailHTML(name, email, subject, message)
      }

      // Send email to admin
      await this.transporter.sendMail(adminMailOptions)
      logger.info('Contact form email sent to admin', {
        from: email,
        subject,
        timestamp: new Date().toISOString()
      })

      // Send confirmation email to user
      const confirmationMailOptions = {
        from: '"SV Viktoria Wertheim" <headonpro@gmail.com>',
        to: email,
        subject: 'Ihre Nachricht wurde erhalten - SV Viktoria Wertheim',
        html: this.generateConfirmationEmailHTML(name, subject, message)
      }

      await this.transporter.sendMail(confirmationMailOptions)
      logger.info('Contact form confirmation email sent', {
        to: email,
        timestamp: new Date().toISOString()
      })

    } catch (error) {
      logger.error('Error sending contact email', {
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : error,
        data: { name: data.name, email: data.email, subject: data.subject }
      })

      if (error instanceof Error && error.name === 'ApiError') {
        throw error
      }

      throw API_ERRORS.EMAIL_SEND_FAILED(error)
    }
  }

  // Generate HTML for admin email
  private generateAdminEmailHTML(name: string, email: string, subject: string, message: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #003366;">Neue Kontaktanfrage über die Website</h2>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Name:</strong> ${this.escapeHtml(name)}</p>
          <p><strong>E-Mail:</strong> ${this.escapeHtml(email)}</p>
          <p><strong>Betreff:</strong> ${this.escapeHtml(subject)}</p>
        </div>
        
        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h3 style="color: #003366;">Nachricht:</h3>
          <p style="white-space: pre-wrap;">${this.escapeHtml(message)}</p>
        </div>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        
        <p style="color: #666; font-size: 12px;">
          Diese Nachricht wurde über das Kontaktformular auf www.viktoria-wertheim.de gesendet.
        </p>
      </div>
    `
  }

  // Generate HTML for confirmation email
  private generateConfirmationEmailHTML(name: string, subject: string, message: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #003366;">Vielen Dank für Ihre Nachricht!</h2>
        
        <p>Guten Tag ${this.escapeHtml(name)},</p>
        
        <p>wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Ihre Anfrage:</strong></p>
          <p><strong>Betreff:</strong> ${this.escapeHtml(subject)}</p>
          <p style="white-space: pre-wrap;">${this.escapeHtml(message)}</p>
        </div>
        
        <p>Mit sportlichen Grüßen,<br>
        SV Viktoria Wertheim 2000 e.V.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        
        <p style="color: #666; font-size: 12px;">
          SV Viktoria Wertheim 2000 e.V.<br>
          Haslocher Weg 85<br>
          97877 Wertheim<br>
          E-Mail: info@viktoria-wertheim.de<br>
          Web: www.viktoria-wertheim.de
        </p>
      </div>
    `
  }

  // Escape HTML to prevent XSS
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }
    return text.replace(/[&<>"']/g, (m) => map[m])
  }

  // Test email configuration
  async testEmailConfig(): Promise<boolean> {
    try {
      if (!this.transporter) {
        return false
      }

      await this.transporter.verify()
      logger.info('Email configuration verified successfully')
      return true
    } catch (error) {
      logger.error('Email configuration test failed', { error })
      return false
    }
  }
}

// Singleton instance
export const contactService = new ContactService()