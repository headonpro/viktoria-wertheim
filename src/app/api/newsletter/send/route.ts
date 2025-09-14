import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createServiceClient } from '@/lib/supabase/server';

// Email configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email template wrapper
const wrapInTemplate = (content: string, subject: string) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 2px solid #1e40af;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #1e40af;
    }
    .content {
      padding: 20px 0;
    }
    .content h1, .content h2, .content h3 {
      color: #1e40af;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    .content p {
      margin: 10px 0;
    }
    .content ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .content li {
      margin: 5px 0;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    .footer a {
      color: #1e40af;
      text-decoration: none;
    }
    .unsubscribe {
      margin-top: 20px;
      font-size: 11px;
      color: #999;
    }
    @media only screen and (max-width: 600px) {
      body {
        padding: 10px;
      }
      .container {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">SV Viktoria Wertheim</div>
    </div>

    <div class="content">
      ${content}
    </div>

    <div class="footer">
      <p>
        <strong>SV Viktoria Wertheim e.V.</strong><br>
        Sportplatz Wertheim<br>
        97877 Wertheim<br>
        <a href="https://viktoria.headon.pro">www.sv-viktoria-wertheim.de</a>
      </p>

      <div class="unsubscribe">
        <p>
          Sie erhalten diese E-Mail, weil Sie sich für unseren Newsletter angemeldet haben.<br>
          <a href="https://viktoria.headon.pro/newsletter/unsubscribe">Newsletter abbestellen</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

export async function POST(request: Request) {
  try {
    // Check authentication
    const supabase = await createServiceClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    const { subject, content, recipients, recipientType } = await request.json();

    if (!subject || !content || !recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: 'Fehlende Pflichtfelder' },
        { status: 400 }
      );
    }

    // Prepare email HTML
    const htmlContent = wrapInTemplate(content, subject);

    // Send emails in batches to avoid overwhelming the server
    const batchSize = 10;
    const batches = [];

    for (let i = 0; i < recipients.length; i += batchSize) {
      batches.push(recipients.slice(i, i + batchSize));
    }

    let successCount = 0;
    const failedEmails: string[] = [];

    for (const batch of batches) {
      const sendPromises = batch.map(async (email: string) => {
        try {
          await transporter.sendMail({
            from: `"SV Viktoria Wertheim" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: subject,
            html: htmlContent,
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to send to ${email}:`, error);
          failedEmails.push(email);
        }
      });

      await Promise.all(sendPromises);

      // Small delay between batches
      if (batches.indexOf(batch) < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Log the newsletter send in the database (if not a test)
    if (recipientType !== 'test') {
      await supabase
        .from('newsletter_history')
        .insert({
          subject,
          content,
          sent_by: user.email,
          recipient_count: successCount,
        });
    }

    return NextResponse.json({
      success: true,
      successCount,
      failedCount: failedEmails.length,
      failedEmails: failedEmails.length > 0 ? failedEmails : undefined,
      message: `Newsletter erfolgreich an ${successCount} Empfänger versendet`,
    });

  } catch (error: any) {
    console.error('Newsletter send error:', error);
    return NextResponse.json(
      { error: error.message || 'Fehler beim Versenden des Newsletters' },
      { status: 500 }
    );
  }
}