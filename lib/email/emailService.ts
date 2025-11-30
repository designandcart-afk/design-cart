// Email service for sending verification and reset emails
import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface VerificationEmailData {
  to: string;
  name: string;
  verificationToken: string;
}

interface PasswordResetEmailData {
  to: string;
  name: string;
  resetToken: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const config: EmailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    };

    this.transporter = nodemailer.createTransport(config);
  }

  async sendVerificationEmail(data: VerificationEmailData): Promise<void> {
    const { to, name, verificationToken } = data;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4000';
    const verificationUrl = `${appUrl}/verify-email?token=${verificationToken}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email - Design&Cart</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #d96857; margin: 0; font-size: 24px;">Design&Cart</h1>
            </div>
            
            <h2 style="color: #2e2e2e; margin-bottom: 20px;">Welcome to Design&Cart, ${name}!</h2>
            
            <p style="color: #2e2e2e; line-height: 1.6; margin-bottom: 30px;">
              Thank you for creating your account. To get started, please verify your email address by clicking the button below.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #d96857; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              If the button doesn't work, you can copy and paste this link into your browser:
              <br>
              <a href="${verificationUrl}" style="color: #d96857; word-break: break-all;">${verificationUrl}</a>
            </p>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 40px;">
              This verification link will expire in 24 hours. If you didn't create an account with Design&Cart, you can safely ignore this email.
            </p>
            
            <div style="border-top: 1px solid #eee; margin-top: 40px; padding-top: 20px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © 2025 Design&Cart. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
Welcome to Design&Cart, ${name}!

Thank you for creating your account. To get started, please verify your email address by visiting this link:

${verificationUrl}

This verification link will expire in 24 hours. If you didn't create an account with Design&Cart, you can safely ignore this email.

© 2025 Design&Cart. All rights reserved.
    `;

    await this.transporter.sendMail({
      from: `"Design&Cart" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Verify Your Email Address - Design&Cart',
      text: textContent,
      html: htmlContent,
    });
  }

  async sendPasswordResetEmail(data: PasswordResetEmailData): Promise<void> {
    const { to, name, resetToken } = data;
    
    // Generate reset URL with token
    const resetUrl = `${process.env.APP_URL || 'http://localhost:4000'}/new-password?token=${resetToken}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password - Design&Cart</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #d96857; margin: 0; font-size: 24px;">Design&Cart</h1>
            </div>
            
            <h2 style="color: #2e2e2e; margin-bottom: 20px;">Reset Your Password</h2>
            
            <p style="color: #2e2e2e; line-height: 1.6; margin-bottom: 30px;">
              Hi ${name},
            </p>
            
            <p style="color: #2e2e2e; line-height: 1.6; margin-bottom: 30px;">
              We received a request to reset your password for your Design&Cart account. Click the button below to create a new password.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #d96857; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              If the button doesn't work, you can copy and paste this link into your browser:
              <br>
              <a href="${resetUrl}" style="color: #d96857; word-break: break-all;">${resetUrl}</a>
            </p>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 40px;">
              This reset link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
            </p>
            
            <div style="border-top: 1px solid #eee; margin-top: 40px; padding-top: 20px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © 2025 Design&Cart. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
Reset Your Password - Design&Cart

Hi ${name},

We received a request to reset your password for your Design&Cart account. Visit this link to create a new password:

${resetUrl}

This reset link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.

© 2025 Design&Cart. All rights reserved.
    `;

    await this.transporter.sendMail({
      from: `"Design&Cart" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Reset Your Password - Design&Cart',
      text: textContent,
      html: htmlContent,
    });
  }

  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Design&Cart</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #d96857; margin: 0; font-size: 24px;">Design&Cart</h1>
            </div>
            
            <h2 style="color: #2e2e2e; margin-bottom: 20px;">Welcome to Design&Cart! 🎉</h2>
            
            <p style="color: #2e2e2e; line-height: 1.6; margin-bottom: 30px;">
              Hi ${name},
            </p>
            
            <p style="color: #2e2e2e; line-height: 1.6; margin-bottom: 30px;">
              Your email has been verified successfully! You're now ready to explore our extensive collection of furniture and home decor items.
            </p>
            
            <h3 style="color: #2e2e2e; margin-bottom: 15px;">What you can do now:</h3>
            <ul style="color: #2e2e2e; line-height: 1.8; margin-bottom: 30px;">
              <li>Browse our product catalog</li>
              <li>Create projects and organize your design ideas</li>
              <li>Chat with our design agents for personalized assistance</li>
              <li>Add items to your cart and place orders</li>
              <li>Track your order history</li>
            </ul>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:4000'}" 
                 style="background-color: #d96857; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                Start Shopping
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 40px;">
              If you have any questions, our support team is here to help. Just reply to this email and we'll get back to you soon.
            </p>
            
            <div style="border-top: 1px solid #eee; margin-top: 40px; padding-top: 20px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © 2025 Design&Cart. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: `"Design&Cart" <${process.env.SMTP_USER}>`,
      to,
      subject: 'Welcome to Design&Cart! 🏡',
      html: htmlContent,
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();