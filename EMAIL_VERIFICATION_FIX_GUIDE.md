# EMAIL VERIFICATION & PROJECT CREATION FIX GUIDE

## Issues Fixed
1. ✅ Email verification showing "Please verify your email" even after clicking verification link
2. ✅ Project creation failing with "account creation failed" error

---

## 🔧 IMMEDIATE FIXES REQUIRED

### Step 1: Configure Supabase Redirect URLs

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/wxbjunhkvhhfzvtaeypg
2. Navigate to: **Authentication** → **URL Configuration**
3. Add these redirect URLs:
   ```
   http://localhost:4000/auth/callback
   http://localhost:4000/*
   ```
4. For production, also add:
   ```
   https://yourdomain.com/auth/callback
   https://yourdomain.com/*
   ```

### Step 2: Run Database Setup Script

1. Go to Supabase SQL Editor: https://supabase.com/dashboard/project/wxbjunhkvhhfzvtaeypg/sql/new
2. Copy the entire contents of `COMPLETE_DATABASE_SETUP.sql`
3. Paste and click **RUN**
4. Verify the output shows:
   - ✅ Trigger created
   - ✅ All users have designer_details
   - ✅ Sample entries visible

### Step 3: Verify Email Settings in Supabase

1. Go to: **Authentication** → **Settings**
2. Ensure these are enabled:
   - ☑️ **Enable email confirmations** (checked)
   - ☑️ **Confirm email** (checked)
3. Go to: **Authentication** → **Email Templates**
4. Edit **Confirm signup** template
5. Ensure the confirmation link URL is: `{{ .ConfirmationURL }}`

---

## 🎯 WHAT WAS CHANGED IN THE CODE

### Changed Files

1. **lib/auth/authContext.tsx**
   - Fixed: `emailRedirectTo` now uses environment variable
   - Changed from: `/verify-email` → `/auth/callback`
   - Why: `/auth/callback` properly handles Supabase verification tokens

2. **app/auth/callback/page.tsx**
   - Added: Automatic `designer_details` creation after email verification
   - Why: Ensures project creation works immediately after signup

---

## 🧪 TESTING THE FIXES

### Test Email Verification
1. Create a new account with a real email
2. Check your inbox for verification email
3. Click the verification link
4. Should see: "Email verified successfully! You can now sign in."
5. Go to login page and sign in
6. Should NOT see "Please verify your email" error

### Test Project Creation
1. After signing in, go to Projects page
2. Click "Create New Project"
3. Fill in project details
4. Click "Create Project"
5. Should succeed without "account creation failed" error

---

## 🔍 TROUBLESHOOTING

### Issue: Still getting "Please verify email" error

**Check 1: Is the redirect URL configured?**
```bash
# Go to Supabase Dashboard → Authentication → URL Configuration
# Ensure http://localhost:4000/auth/callback is listed
```

**Check 2: Is email actually verified?**
```bash
# Go to Supabase Dashboard → Authentication → Users
# Find your user → Check "Email Confirmed" column
```

**Check 3: Clear browser data**
```bash
# Clear cookies and localStorage for localhost:4000
# Try signing in again
```

### Issue: Project creation still fails

**Check 1: Does designer_details entry exist?**
```sql
-- Run in Supabase SQL Editor
SELECT dd.*, u.email 
FROM designer_details dd 
JOIN auth.users u ON u.id = dd.user_id 
WHERE u.email = 'your-email@example.com';
```

**Check 2: Create manually if missing**
```sql
-- Replace USER_ID and EMAIL with your values
INSERT INTO designer_details (user_id, name, email, created_at, updated_at)
VALUES (
  'YOUR_USER_ID',
  'Your Name',
  'your-email@example.com',
  NOW(),
  NOW()
);
```

**Check 3: Verify RLS policies**
```sql
-- Run in Supabase SQL Editor
SELECT * FROM pg_policies WHERE tablename = 'designer_details';
```

### Issue: Not receiving verification emails

**Check 1: Is email service configured?**
- Go to: Supabase Dashboard → Settings → Auth
- Check if custom SMTP is configured
- If not, Supabase uses their default (may go to spam)

**Check 2: Check spam folder**
- Verification emails often end up in spam
- Check promotions/updates tabs in Gmail

**Check 3: Resend verification email**
```bash
# Go to Supabase Dashboard → Authentication → Users
# Find user → Click "..." → "Send email verification"
```

---

## 📋 VERIFICATION CHECKLIST

Before considering the issue resolved:

- [ ] Redirect URL `http://localhost:4000/auth/callback` is added in Supabase
- [ ] Database setup script (`COMPLETE_DATABASE_SETUP.sql`) has been run
- [ ] Verification queries show trigger exists
- [ ] All existing users have `designer_details` entries
- [ ] New test account receives verification email
- [ ] Clicking verification link redirects to `/auth/callback`
- [ ] After verification, can sign in without "verify email" error
- [ ] After sign in, can create projects without errors
- [ ] Profile page loads without 406 errors

---

## 🚀 FOR PRODUCTION DEPLOYMENT

When deploying to production:

1. **Update environment variable:**
   ```bash
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

2. **Add production redirect URLs in Supabase:**
   ```
   https://yourdomain.com/auth/callback
   https://yourdomain.com/*
   ```

3. **Test the full flow:**
   - Signup → Email verification → Login → Create project

---

## 📞 SUPPORT

If issues persist after following this guide:

1. Check browser console for errors
2. Check Supabase logs: Dashboard → Logs → Auth Logs
3. Review the error details in the debug auth page: http://localhost:4000/debug-auth
4. Check if Supabase is having service issues: https://status.supabase.com/

---

## 📝 TECHNICAL DETAILS

### Why `/auth/callback` instead of `/verify-email`?

- `/auth/callback` is designed to handle Supabase's OAuth/verification callbacks
- It exchanges the verification code for a session
- `/verify-email` was just a static success page without proper session handling

### Why create `designer_details` on callback?

- The database trigger might not fire if the user was created outside normal flow
- Email verification happens asynchronously, so we ensure profile exists then
- Prevents 406/404 errors when user tries to create projects or view profile

### Why use environment variable for redirect URL?

- Allows different URLs for development vs production
- Makes the app more portable and configurable
- Prevents hardcoded localhost URLs in production
