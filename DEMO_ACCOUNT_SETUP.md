# Demo Account Setup Guide

## 🚨 IMPORTANT: Creating the Demo Account in Supabase

The demo account MUST be created in Supabase before the "Explore Demo Account" button will work.

### Option 1: Via Supabase Dashboard (⭐ Recommended - Easiest)

1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Select your project**
3. **Navigate to**: Authentication → Users
4. **Click**: "Add user" (green button, top right)
5. **Fill in the form**:
   - Email: `demo@designandcart.in`
   - Password: `DesignCart@2025`
   - ✅ Check "Auto Confirm User" (IMPORTANT!)
6. **Click**: "Create user"
7. ✅ Done! The demo button will now work.

### Option 2: Via SQL (For Development)

Run this SQL in your Supabase SQL Editor:

```sql
-- Create demo user with confirmed email
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'demo@designandcart.in',
  crypt('DesignCart@2025', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

### Option 3: Via signup flow (Easiest for testing)

1. Go to `/signup` on your app
2. Enter email: `demo@designandcart.in`
3. Complete OTP verification
4. Set password: `DesignCart@2025`
5. Done!

## Demo Account Features

- **Email**: demo@designandcart.in
- **Password**: DesignCart@2025
- **Access Level**: Read-only (view all features)
- **Data**: Pre-loaded with sample projects, renders, and products
- **Banner**: Shows "You're viewing the demo account — changes won't be saved"
- **Use Case**: Investor previews, testing, demonstrations

## Demo Account Behavior

1. **One-Click Login**: Click "Explore Demo Account" button on login page
2. **Session Banner**: Dismissible banner appears at top of all pages
3. **Full Navigation**: Access to all protected routes (chat, cart, orders, account)
4. **Sample Data**: Preloaded demo projects and products from `lib/demoData.ts`
5. **No Persistence**: Changes made in demo mode won't be saved (read-only)

## Security Notes

- Password meets Supabase minimum requirements (8+ characters)
- Account is for preview purposes only
- Consider adding row-level security policies to prevent demo account from modifying data
- For production, you may want to add a `is_demo` flag to user metadata

## Adding Demo-Specific Restrictions (Optional)

If you want to prevent the demo account from making changes, add this to your Supabase RLS policies:

```sql
-- Example: Prevent demo account from inserting/updating/deleting
CREATE POLICY "Demo account read-only"
ON your_table_name
FOR ALL
TO authenticated
USING (
  auth.email() != 'demo@designandcart.in' OR 
  current_setting('request.method') = 'GET'
);
```

## Testing the Demo Flow

1. Open your app at `http://localhost:4000/login`
2. Look for the divider "— or try the demo —"
3. Click "Explore Demo Account" button
4. You should be instantly logged in as demo@designandcart.in
5. Notice the banner at the top: "You're viewing the demo account — changes won't be saved"
6. Navigate to protected routes to verify access
7. Dismiss the banner if desired (persists for session)

## Investor Presentation Tips

- Emphasize the one-click demo access
- Show pre-loaded sample data
- Explain the read-only nature
- Highlight the professional UI/UX
- Demo the full workflow (projects, renders, products, chat, orders)
