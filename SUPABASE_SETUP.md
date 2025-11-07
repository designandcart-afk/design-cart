# Supabase Authentication Setup

This application now supports Supabase authentication for real user management. Follow these steps to set up Supabase authentication.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create an account
2. Click "New Project"
3. Choose your organization
4. Enter a project name (e.g., "design-and-cart")
5. Create a strong database password
6. Select a region close to your users
7. Click "Create new project"

## 2. Get Your Supabase Credentials

Once your project is created:

1. Go to **Settings** → **API**
2. Copy your **Project URL** and **anon public key**
3. Update your `.env.local` file:

```bash
# Replace with your actual Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3. Configure Authentication Settings

1. Go to **Authentication** → **Settings**
2. Under **Site URL**, add your local development URL:
   ```
   http://localhost:3000
   ```
3. Under **Redirect URLs**, add:
   ```
   http://localhost:3000/auth/callback
   ```
4. **Enable Email Confirmations** (recommended for production)

## 4. Set Up Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize the email templates for:
   - Confirm signup
   - Reset password
   - Magic link

## 5. Database Schema (Optional)

The application uses Supabase's built-in auth schema. If you need additional user profile data:

1. Go to **Table Editor**
2. Create a `profiles` table:
   ```sql
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     name TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Enable RLS
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   
   -- Policy for users to read/write their own profile
   CREATE POLICY "Users can view own profile" ON profiles
     FOR SELECT USING (auth.uid() = id);
   
   CREATE POLICY "Users can update own profile" ON profiles
     FOR UPDATE USING (auth.uid() = id);
   ```

## 6. Test the Setup

1. Restart your development server:
   ```bash
   npm run dev -- -p 3000
   ```

2. Go to `http://localhost:3000/login`

3. Try creating a new account with a real email address

4. Check your email for the verification link

5. Complete the email verification process

## 7. Switching Between Demo and Real Mode

The application supports both demo mode and real authentication:

- **Demo Mode**: Uses local storage, no database required
- **Real Mode**: Uses Supabase authentication

To switch modes, update `/lib/config.ts`:

```typescript
// For demo mode
export const DEMO_MODE = true;

// For real Supabase authentication
export const DEMO_MODE = false;
```

## Current Status

✅ Supabase client configured  
✅ Authentication context updated  
✅ Login page supports both modes  
✅ Auth callback handling implemented  
✅ Environment variables structured  

## Next Steps

1. Add your real Supabase credentials to `.env.local`
2. Test user registration and login
3. Customize email templates if needed
4. Set up additional user profile fields if required

## Troubleshooting

**Error: "Missing Supabase environment variables"**
- Make sure you've added the correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`

**Email verification not working**
- Check your Supabase email settings
- Ensure redirect URLs are configured correctly
- Check spam folder for verification emails

**Authentication context errors**
- Restart your development server after changing environment variables
- Clear browser cache and localStorage

For more help, check the [Supabase Auth Documentation](https://supabase.com/docs/guides/auth).