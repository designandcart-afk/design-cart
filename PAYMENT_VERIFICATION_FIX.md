# Payment Verification Issue - Fix Guide

## 🔴 Problem
After successful Razorpay payment, you see: **"Payment verification failed. Please contact support."**

The payment goes through in Razorpay but fails to update in your database, so products remain in cart.

---

## 🎯 Root Cause
**Missing Environment Variable:** `SUPABASE_SERVICE_ROLE_KEY`

The payment verification API (`/api/payment/verify`) needs this key to:
1. Bypass Row Level Security (RLS) 
2. Update order status from `pending` to `paid`
3. Create bill records in the database

---

## ✅ Solution

### **Step 1: Get Your Supabase Service Role Key**

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Under **Project API keys**, find the **`service_role`** key
5. Copy it (it starts with `eyJ...`)

⚠️ **IMPORTANT:** This is a SECRET key. Never commit it to GitHub or share it publicly.

---

### **Step 2: Add to Vercel (Production)**

Since your site is deployed on Vercel:

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project (`design-cart`)
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** `[paste your service_role key]`
   - **Environments:** Check all (Production, Preview, Development)
5. Click **Save**

6. **Redeploy your app:**
   - Go to **Deployments** tab
   - Click on the latest deployment
   - Click **"Redeploy"** or just push a new commit

---

### **Step 3: Add to Local Development (Optional)**

If you want to test payments locally:

1. Open `.env.local` file in your project root
2. Add this line:
```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

3. Restart your development server:
```bash
npm run dev
```

---

## 🧪 Testing After Fix

1. Add products to cart
2. Proceed to checkout
3. Complete payment with Razorpay (you can use test mode)
4. After payment success, you should:
   - See cart cleared automatically
   - Be redirected to Orders page with success message
   - See the order in Orders page with "Paid" status

---

## 🔍 How to Verify It's Fixed

### Check Browser Console:
- **Before fix:** `"Server configuration error - Missing SUPABASE_SERVICE_ROLE_KEY"`
- **After fix:** `"✅ Payment verified successfully!"`

### Check Vercel Logs:
1. Go to Vercel Dashboard → Your Project → **Logs**
2. Make a test payment
3. Look for:
   - ❌ Before: `"SUPABASE_SERVICE_ROLE_KEY not configured"`
   - ✅ After: `"Signature verified, updating orders..."`

---

## 📋 Checklist

- [ ] Got service_role key from Supabase Dashboard
- [ ] Added `SUPABASE_SERVICE_ROLE_KEY` to Vercel environment variables
- [ ] Redeployed the app on Vercel
- [ ] Tested payment flow
- [ ] Verified order appears in Orders page
- [ ] Confirmed cart is cleared after payment

---

## 🚨 Still Having Issues?

If it still doesn't work after adding the key:

1. **Check Vercel Logs** for any errors
2. **Open Browser Console** during payment to see error details
3. **Verify the key is correct** - it should start with `eyJ`
4. **Make sure you redeployed** after adding the environment variable

---

## 📝 Additional Notes

### Other Required Environment Variables:
```env
# Razorpay (for payments)
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx

# Supabase (for database)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx  ← THIS ONE WAS MISSING
```

All these should be set in **both**:
- Vercel Environment Variables (for production)
- `.env.local` file (for local development)

---

## ✅ Expected Behavior After Fix

1. **User adds products to cart**
2. **User clicks checkout** → Creates pending order in DB
3. **Razorpay payment successful** → Returns payment details
4. **Backend verifies payment** → Updates order to "paid" using service_role key
5. **Cart is cleared** → Items removed from cart
6. **User redirected to Orders page** → Can see the completed order

---

**Need help?** Check Vercel logs and browser console for specific error messages.
