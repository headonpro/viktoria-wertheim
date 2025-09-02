import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      )
    }

    // Create transporter
    // For production, use real SMTP credentials
    // For development, you can use services like:
    // - Gmail (needs app password)
    // - SendGrid
    // - Mailgun
    // - etc.
    
    // Example with Gmail (requires app-specific password)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS  // Your Gmail app password
      }
    })

    // Alternative: Using generic SMTP
    // const transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST,
    //   port: parseInt(process.env.SMTP_PORT || '587'),
    //   secure: false, // true for 465, false for other ports
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS
    //   }
    // })

    // Email options
    const mailOptions = {
      from: `"${name}" <${email}>`, // sender address
      to: 'info@viktoria-wertheim.de', // receiver
      replyTo: email, // reply to the sender
      subject: `[Website Kontakt] ${subject}`, // Subject line
      text: message, // plain text body
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #003366;">Neue Kontaktanfrage über die Website</h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>E-Mail:</strong> ${email}</p>
            <p><strong>Betreff:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <h3 style="color: #003366;">Nachricht:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          
          <p style="color: #666; font-size: 12px;">
            Diese Nachricht wurde über das Kontaktformular auf www.viktoria-wertheim.de gesendet.
          </p>
        </div>
      `
    }

    // Send email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions)
      
      // Optional: Send confirmation email to sender
      const confirmationMail = {
        from: '"SV Viktoria Wertheim" <info@viktoria-wertheim.de>',
        to: email,
        subject: 'Ihre Nachricht wurde erhalten - SV Viktoria Wertheim',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #003366;">Vielen Dank für Ihre Nachricht!</h2>
            
            <p>Guten Tag ${name},</p>
            
            <p>wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Ihre Anfrage:</strong></p>
              <p><strong>Betreff:</strong> ${subject}</p>
              <p style="white-space: pre-wrap;">${message}</p>
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
      
      await transporter.sendMail(confirmationMail)
    } else {
      console.warn('E-Mail-Konfiguration fehlt. Bitte EMAIL_USER und EMAIL_PASS in .env.local setzen.')
      // In development without email config, just log the message
      console.log('Contact form submission:', { name, email, subject, message })
    }

    return NextResponse.json(
      { success: true, message: 'Nachricht erfolgreich gesendet' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error)
    return NextResponse.json(
      { error: 'Fehler beim Senden der Nachricht' },
      { status: 500 }
    )
  }
}