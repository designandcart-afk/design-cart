# Email Setup Guide

This guide explains how to set up email functionality for account verification and password reset emails.

## Quick Setup

1. **Copy environment file:**
```bash
cp .env.local.example .env.local
```

2. **Choose your email provider and configure:**

### Option A: Gmail (Recommended)

1. **Enable 2-Factor Authentication:**
   - Go to Google Account settings
   - Security → 2-Step Verification → Turn on

2. **Generate App Password:**
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (custom name)"
   - Enter "Design&Cart" as the name
   - Copy the generated 16-character password

3. **Update .env.local:**
```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-16-character-app-password"
```

### Option B: Outlook/Hotmail

```bash
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_USER="your-email@outlook.com"
SMTP_PASS="your-password"
```

### Option C: Yahoo Mail

```bash
SMTP_HOST="smtp.mail.yahoo.com"
SMTP_PORT="587"
SMTP_USER="your-email@yahoo.com"
SMTP_PASS="your-app-password"
```

### Option D: Custom SMTP Provider

For services like SendGrid, Mailgun, Amazon SES, etc.:

```bash
SMTP_HOST="your-smtp-host"
SMTP_PORT="587"
SMTP_USER="your-smtp-username"
SMTP_PASS="your-smtp-password"
```

## Testing Email Configuration

1. **Test email connection:**
```bash
# Create a test script
node -e "
const { emailService } = require('./lib/email/emailService');
emailService.testConnection().then(result => {
  console.log('Email connection:', result ? 'SUCCESS' : 'FAILED');
  process.exit(result ? 0 : 1);
});
"
```

2. **Send test email:**
```bash
# Test sending an email
node -e "
const { emailService } = require('./lib/email/emailService');
emailService.sendWelcomeEmail('test@example.com', 'Test User').then(() => {
  console.log('Test email sent successfully');
}).catch(err => {
  console.error('Failed to send test email:', err);
});
"
```

## Email Flow

### Account Registration
1. User fills registration form
2. Account created with `isVerified: false`
3. Verification email sent automatically
4. User clicks link in email
5. Account verified and welcome email sent

### Password Reset
1. User requests password reset
2. Reset email sent (if account exists)
3. User clicks link in email
4. User sets new password

## Email Templates

The system includes responsive HTML email templates for:

- **Verification Email**: Welcome message with verification link
- **Welcome Email**: Sent after successful verification
- **Password Reset**: Secure reset link with 1-hour expiration

## Security Features

- **Token Expiration**: Verification tokens expire in 24 hours
- **Reset Tokens**: Password reset tokens expire in 1 hour
- **No Email Disclosure**: Password reset doesn't reveal if email exists
- **HTTPS Required**: Email links use HTTPS in production

## Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Check SMTP credentials
   - For Gmail, ensure you're using App Password, not regular password
   - Verify 2FA is enabled for Gmail

2. **"Connection timeout"**
   - Check SMTP_HOST and SMTP_PORT
   - Verify firewall isn't blocking port 587
   - Try port 465 with secure: true

3. **"Email not received"**
   - Check spam/junk folder
   - Verify email address is correct
   - Check email provider limits

4. **"Invalid token"**
   - Tokens expire after 24 hours (verification) or 1 hour (reset)
   - Check if user already verified
   - Ensure token wasn't modified

### Debug Mode

Enable email debugging:

```bash
# Add to .env.local
DEBUG_EMAIL="true"
```

This will log email operations to the console.

## Production Recommendations

1. **Use Professional Email Service:**
   - SendGrid, Mailgun, Amazon SES
   - Better deliverability and analytics
   - Higher sending limits

2. **Custom Domain:**
   - Use your own domain for sender address
   - Improves trust and deliverability

3. **Email Templates:**
   - Brand your email templates
   - Add company logo and styling

4. **Monitoring:**
   - Track email delivery rates
   - Monitor bounce and complaint rates
   - Set up alerts for failures

## Example Production Setup with SendGrid

```bash
# .env.local
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

## Email Provider Comparison

| Provider | Free Tier | Paid From | Deliverability | Setup Difficulty |
|----------|-----------|-----------|----------------|------------------|
| Gmail | 100/day | N/A | Good | Easy |
| SendGrid | 100/day | $15/month | Excellent | Medium |
| Mailgun | 10k/month | $35/month | Excellent | Medium |
| Amazon SES | 200/day | $0.10/1000 | Excellent | Hard |
| Outlook | Limited | N/A | Good | Easy |

## Need Help?

- Check the [Nodemailer documentation](https://nodemailer.com/about/)
- Test your SMTP settings with an email client first
- Contact your email provider's support for SMTP issues