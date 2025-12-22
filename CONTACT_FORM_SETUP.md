# Contact Form Email Setup

The contact form now sends emails using nodemailer with automatic notifications!

## What happens when someone submits the contact form:

1. **Support Team Notification** - You receive an email with the contact details
2. **Auto-Reply to User** - User gets a confirmation email immediately
3. **Both emails are beautifully formatted** with your brand colors

## Setup Instructions:

### Option 1: Gmail (Easiest)

1. Open `.env.local` file
2. Update these values:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-specific-password
SUPPORT_EMAIL=support@designcart.com
```

3. **Get Gmail App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Generate and copy the 16-character password
   - Use this as `SMTP_PASS`

### Option 2: Other Email Providers

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

**Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

**Custom Domain (e.g., support@designcart.com):**
Ask your domain hosting provider for SMTP credentials.

## Features:

✅ Professional HTML email templates
✅ Auto-reply to users with their message copy
✅ Support team gets notification instantly
✅ Indian Standard Time (IST) timestamps
✅ Error handling with fallback message
✅ Mobile-responsive email design

## Testing:

1. Make sure your `.env.local` has the correct email credentials
2. Restart your dev server: `npm run dev`
3. Fill out the contact form
4. Check both inboxes (support email and user's email)

## Support Email Address:

The `SUPPORT_EMAIL` is where all contact form submissions will be sent. If not set, it defaults to `SMTP_USER`.

## Security Note:

Never commit your real email passwords to Git! The `.env.local` file is already in `.gitignore`.
