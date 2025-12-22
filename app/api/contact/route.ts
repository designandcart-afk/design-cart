import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create transporter using existing SMTP config
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email to support team
    const supportEmail = {
      from: process.env.SMTP_USER,
      to: process.env.SUPPORT_EMAIL || process.env.SMTP_USER, // fallback to SMTP_USER if no SUPPORT_EMAIL
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #d96857; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background-color: #f8f7f4; padding: 20px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #2e2e2e; }
            .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; }
            .footer { margin-top: 20px; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">From:</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            <div class="footer">
              <p>This message was sent from the Design&Cart contact form.</p>
              <p>Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Contact Form Submission

From: ${name}
Email: ${email}

Message:
${message}

Received: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      `,
    };

    // Auto-reply to user
    const autoReplyEmail = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Thank you for contacting Design&Cart',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #d96857; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background-color: #f8f7f4; padding: 20px; }
            .footer { background-color: #2e2e2e; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">Thank You for Reaching Out!</h2>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thank you for contacting Design&Cart. We've received your message and our support team will get back to you within 24 hours.</p>
              <p><strong>Your message:</strong></p>
              <p style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #d96857;">
                ${message.replace(/\n/g, '<br>')}
              </p>
              <p>If you need immediate assistance, please reply to this email or visit our Tutorial page for quick answers.</p>
              <p>Best regards,<br>
              <strong>Design&Cart Support Team</strong></p>
            </div>
            <div class="footer">
              <p>Design&Cart - Your B2B Interior Design Platform</p>
              <p>Support Hours: Monday-Saturday, 9 AM - 6 PM IST</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send both emails
    await transporter.sendMail(supportEmail);
    await transporter.sendMail(autoReplyEmail);

    return NextResponse.json(
      { 
        success: true,
        message: 'Message sent successfully. Check your email for confirmation.' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send message. Please try again or email us directly at support@designcart.com' 
      },
      { status: 500 }
    );
  }
}
