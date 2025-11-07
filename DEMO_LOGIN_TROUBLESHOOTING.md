# 🚨 DEMO LOGIN TROUBLESHOOTING GUIDE

## Issue: "Explore Demo Account" button shows "load failed" or doesn't work

This guide will help you fix the demo login feature step by step.

---

## ✅ STEP 1: Set Up Real Supabase Project

**Current Issue**: Your `.env.local` contains placeholder values, not real Supabase credentials.

### Action Required:

1. **Go to**: https://app.supabase.com
2. **Create a new project** (or use existing)
3. **Get your credentials**:
   - Go to Project Settings → API
   - Copy `Project URL`
   - Copy `anon public` key

4. **Update `.env.local`**:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-anon-key
```

5. **Restart your dev server**:
```bash
# Kill current server
lsof -ti:4000 | xargs kill -9

# Restart
npm run dev
```

---

## ✅ STEP 2: Configure Supabase Authentication

### 2.1 Enable Email Provider

1. Go to: **Authentication → Providers**
2. Find **Email** provider
3. Ensure it's **enabled** (toggle should be ON)
4. **Confirm email** can be ON or OFF (OFF is easier for demo)
5. Click **Save**

### 2.2 Set Up URL Configuration

1. Go to: **Authentication → URL Configuration**
2. Add these URLs:

**Site URL**:
```
http://localhost:4000
```

**Redirect URLs** (add all):
```
http://localhost:4000/**
http://localhost:4000/login
http://localhost:4000/signup
http://localhost:4000/reset-password
```

3. Click **Save**

---

## ✅ STEP 3: Create Demo Account

### Option A: Via Supabase Dashboard (Easiest)

1. Go to: **Authentication → Users**
2. Click: **"Add user"** (green button, top right)
3. Fill in:
   - Email: `demo@designandcart.in`
   - Password: `DesignCart@2025`
   - ✅ **Check "Auto Confirm User"** ← IMPORTANT!
4. Click: **"Create user"**

### Option B: Via Signup Flow

1. Go to: `http://localhost:4000/signup`
2. Enter: `demo@designandcart.in`
3. Verify OTP from email
4. Set password: `DesignCart@2025`

---

## ✅ STEP 4: Test Demo Login

1. Go to: `http://localhost:4000/login`
2. Scroll down to see: **"— or try the demo —"**
3. Click: **"Explore Demo Account"**
4. Should see: Loading spinner, then redirect to home
5. Should see: Demo banner at top ("You're viewing the demo account...")
6. Should see: Protected nav items (Chat, Cart, Orders, Account)

---

## 🐛 Still Not Working? Debug Steps

### Check Browser Console

1. Open Developer Tools (F12)
2. Go to Console tab
3. Click "Explore Demo Account"
4. Look for error messages

**Common Errors:**

#### Error: "Invalid login credentials"
- Demo account doesn't exist in Supabase
- Go back to STEP 3

#### Error: "Missing env.NEXT_PUBLIC_SUPABASE_URL"
- Environment variables not set
- Go back to STEP 1

#### Error: "Email not confirmed"
- When creating demo user, you forgot to check "Auto Confirm User"
- Delete user and recreate with confirmation checked

#### No error, but nothing happens
- Check Network tab in Developer Tools
- Look for failed requests to Supabase
- Verify NEXT_PUBLIC_SUPABASE_URL is correct

### Check Supabase Logs

1. Go to: **Supabase Dashboard → Logs → Auth Logs**
2. Click "Explore Demo Account"
3. Refresh logs
4. Look for sign-in attempts and errors

### Verify Environment Variables

Run in terminal:
```bash
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Should show real URLs, not placeholders.

If empty, your `.env.local` isn't loaded. Restart server.

---

## 📋 Complete Checklist

Before testing, verify:

- [ ] Real Supabase project created
- [ ] `.env.local` has real credentials (not placeholders)
- [ ] Dev server restarted after updating `.env.local`
- [ ] Email provider enabled in Supabase
- [ ] Site URL and Redirect URLs configured
- [ ] Demo account created: `demo@designandcart.in`
- [ ] Demo account email confirmed (Auto Confirm checked)
- [ ] Browser console shows no errors
- [ ] Supabase Auth logs show successful sign-in

---

## 🎯 Expected Behavior

### When Working Correctly:

1. **Click "Explore Demo Account"**
   - Button shows "Loading demo..."
   - ~500ms delay

2. **After Login**
   - Redirect to home page (`/`)
   - Demo banner appears at top
   - Nav shows: Products, Dashboard, Chat, Cart, Orders, Account
   - No "Sign In" button (replaced with profile menu)

3. **Demo Data**
   - Projects load from `lib/demoData.ts`
   - Products display correctly
   - All features accessible (read-only)

4. **Logout**
   - Click profile → Sign Out
   - Returns to logged-out state
   - Can click "Explore Demo Account" again

---

## 🔒 Security Notes

### Read-Only Demo (Optional but Recommended)

To prevent demo account from modifying data, add RLS policies:

```sql
-- Example: Prevent demo account from inserting/updating
CREATE POLICY "Demo read-only"
ON your_table_name
FOR ALL
TO authenticated
USING (
  auth.email() != 'demo@designandcart.in'
  OR current_setting('request.method', true) = 'GET'
);
```

### Production Deployment

When deploying:
1. Add production URL to Supabase Redirect URLs
2. Create demo account in production Supabase project
3. Verify `.env` variables on Vercel/hosting platform
4. Test demo login on production site

---

## 💡 Quick Fix for Local Testing

If you just want to test the UI without Supabase:

You can temporarily mock the auth in `lib/auth.tsx`, but this is NOT recommended for production or investor demos.

---

## Need More Help?

1. Check Supabase Dashboard → Logs for auth errors
2. Open browser DevTools → Console for client errors  
3. Verify all checklist items above
4. Ensure demo account exists and is confirmed
5. Make sure environment variables are real (not placeholders)

Most issues are solved by following STEP 1-3 carefully.
