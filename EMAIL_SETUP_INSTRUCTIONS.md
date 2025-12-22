# 📧 Email Setup Guide for Contact Form

## What You Need to Do:

### Step 1: Get Gmail App Password (5 minutes)

1. **Go to Gmail Settings:**
   - Visit: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App Passwords

2. **Create App Password:**
   - Click "Select app" → Choose "Mail"
   - Click "Select device" → Choose "Other (Custom name)"
   - Type: "Design&Cart Contact Form"
   - Click "Generate"

3. **Copy the Password:**
   - You'll see a 16-character password like: `abcd efgh ijkl mnop`
   - Copy this password (you'll need it in Step 2)

---

### Step 2: Update Your .env.local File

Open your `.env.local` file and update these three lines:

```env
SMTP_USER=your-actual-gmail@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
SUPPORT_EMAIL=support@designcart.com
```

**Example:**
```env
SMTP_USER=neeraj@gmail.com
SMTP_PASS=xmpl yhjk dfgh qwer
SUPPORT_EMAIL=support@designcart.com
```

**What each means:**
- `SMTP_USER` = Your Gmail address that will SEND the emails
- `SMTP_PASS` = The 16-character app password from Step 1 (NOT your regular Gmail password)
- `SUPPORT_EMAIL` = Where you want to RECEIVE contact form submissions (can be any email)

---

### Step 3: Restart Your Server

After updating `.env.local`:

```bash
# Stop your current server (Ctrl+C)
# Then restart:
npm run dev
```

---

### Step 4: Test It!

1. Go to: http://localhost:4000/contact
2. Fill out the form and submit
3. Check your inbox at `SUPPORT_EMAIL` - you should receive the message
4. The person who submitted should also get an auto-reply confirmation

---

## ⚠️ Important Notes:

1. **Use Gmail App Password, NOT your regular password**
   - Regular passwords won't work
   - App passwords are more secure

2. **Keep .env.local Secret**
   - Never share or commit this file
   - It's already in `.gitignore`

3. **If you don't have 2-Step Verification enabled:**
   - You need to enable it first: https://myaccount.google.com/security
   - Then you can create app passwords

---

## 🎯 What Happens When Form is Submitted:

1. **You receive:** Email with person's name, email, and message
2. **They receive:** Professional auto-reply confirming you got their message
3. **Both emails:** Beautifully designed with your brand colors (#d96857)

---

## 💡 Alternative: Use a Different Email Provider

If you don't want to use Gmail, you can use:

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-outlook-password
```

**Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-yahoo-app-password
```

---

## ❓ Troubleshooting:

**Error: "Authentication failed"**
- Make sure you're using the App Password, not your regular password
- Double-check there are no extra spaces in the password

**Not receiving emails:**
- Check spam folder
- Verify `SUPPORT_EMAIL` is correct
- Make sure you restarted the server after updating `.env.local`

**Need help?**
The contact form has error messages that will help identify issues.

---

## 🔒 Security:

✅ App passwords are safer than regular passwords
✅ .env.local is never committed to Git
✅ Only your server can access these credentials
✅ Emails are sent over encrypted connection (TLS)
