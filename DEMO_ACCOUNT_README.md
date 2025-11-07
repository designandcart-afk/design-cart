# 🎯 Demo Account - Quick Start Guide

## Current Status: ⚠️ SETUP REQUIRED

The demo login feature is implemented, but **requires Supabase configuration** to work.

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Set Up Supabase Project (5 minutes)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create new project or select existing one
3. Go to **Project Settings → API**
4. Copy these values:
   - Project URL
   - anon public key

### Step 2: Update Environment Variables

Edit `.env.local` in your project root:

```bash
# Replace with your actual Supabase values
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODEyMzQ1NjcsImV4cCI6MTk5NjgxMDU2N30.abc123def456
```

**Then restart your dev server:**
```bash
npm run dev
```

### Step 3: Create Demo Account in Supabase

**Via Supabase Dashboard:**
1. Go to **Authentication → Users**
2. Click **"Add user"**
3. Fill in:
   - Email: `demo@designandcart.in`
   - Password: `DesignCart@2025`
   - ✅ Check **"Auto Confirm User"**
4. Click **"Create user"**

**Alternative - Via Signup Flow:**
1. Go to `http://localhost:4000/signup`
2. Sign up with `demo@designandcart.in`
3. Verify OTP
4. Set password: `DesignCart@2025`

---

## ✅ Testing Demo Login

1. Go to: `http://localhost:4000/login`
2. Look for: **"— or try the demo —"** divider
3. Click: **"Explore Demo Account"** button
4. Should see:
   - ⏳ "Loading demo..." (brief loading)
   - ✅ Redirect to homepage
   - 📢 Demo banner at top
   - 🔐 Protected nav items visible (Chat, Cart, Orders, Account)

---

## 🐛 Troubleshooting

### Demo Button Does Nothing

**Check browser console (F12):**
- Look for error messages
- Most common: "Invalid login credentials" = Demo account doesn't exist

**Fix:**
1. Verify demo account exists in Supabase Dashboard
2. Ensure email is confirmed (Auto Confirm User was checked)
3. Check `.env.local` has real Supabase credentials (not placeholders)

### "Missing env.NEXT_PUBLIC_SUPABASE_URL" Error

**Fix:**
1. Update `.env.local` with real values (see Step 2)
2. Restart dev server: `npm run dev`

### Login Works But No Data Shows

**Fix:**
- Demo data is loaded from `lib/demoData.ts` (already included)
- Check browser console for errors
- Verify protected routes are accessible

---

## 📚 Additional Configuration

### Supabase Auth Settings

1. **Authentication → Providers**
   - ✅ Enable "Email" provider
   - Save changes

2. **Authentication → URL Configuration**
   - Site URL: `http://localhost:4000`
   - Redirect URLs:
     - `http://localhost:4000/**`
     - `http://localhost:4000/login`
     - `http://localhost:4000/signup`
     - `http://localhost:4000/reset-password`

### Optional: Read-Only Demo Account

To prevent demo account from modifying data, add RLS policies in Supabase:

```sql
-- Example: Prevent demo user from inserting/updating
CREATE POLICY "demo_read_only" ON your_table
FOR ALL TO authenticated
USING (
  auth.email() != 'demo@designandcart.in'
  OR current_setting('request.method', true) = 'GET'
);
```

---

## 🎨 Demo Account Features

Once working:
- ✅ One-click login (no OTP required)
- ✅ Automatic session management
- ✅ Demo banner shows at top of all pages
- ✅ Full access to all protected routes
- ✅ Sample data preloaded
- ✅ Professional investor-ready UX

---

## 📞 Need Help?

See detailed guides:
- **DEMO_LOGIN_TROUBLESHOOTING.md** - Complete debugging steps
- **DEMO_ACCOUNT_SETUP.md** - Detailed setup instructions

Most issues are solved by:
1. Using real Supabase credentials (not placeholders)
2. Creating the demo account in Supabase Dashboard
3. Checking "Auto Confirm User" when creating account
4. Restarting dev server after updating `.env.local`

---

## ✨ For Production Deployment

Before deploying:
1. Add production URL to Supabase Redirect URLs
2. Create demo account in production Supabase project  
3. Set environment variables on hosting platform (Vercel, etc.)
4. Test demo login on production site

---

**Status Check:**
- [ ] Real Supabase project created
- [ ] `.env.local` updated with real credentials
- [ ] Dev server restarted
- [ ] Demo account created in Supabase
- [ ] Demo account email confirmed
- [ ] Tested demo login button
- [ ] Demo banner appears after login
- [ ] Protected routes accessible

Once all checkboxes are complete, demo login is ready for investor presentations! 🚀
