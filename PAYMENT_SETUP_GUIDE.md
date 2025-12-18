# Payment System Setup Guide

## Issue: "Payment verification failed" Error

If you see this error after successful Razorpay payment, it means the backend cannot verify and update orders due to missing environment variables.

---

## 🔧 Quick Fix

### Step 1: Add Missing Environment Variables

#### For Local Development (.env.local):

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/wxbjunhkvhhfzvtaeypg/settings/api)
2. Copy the **service_role** key (NOT the anon key)
3. Add it to `.env.local`:

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...YOUR_KEY_HERE
```

#### For Production (Vercel):

1. Go to [Vercel Dashboard](https://vercel.com/designandcart-afks-projects) → Your Project → Settings → Environment Variables
2. Add new variable:
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** Your service_role key from Supabase
   - **Environment:** Production, Preview, Development

3. **Redeploy** your application after adding the variable

---

## ⚠️ Important Notes

### Security
- **NEVER** commit `SUPABASE_SERVICE_ROLE_KEY` to Git
- This key bypasses Row Level Security (RLS) - keep it secret
- Only use it in server-side code (API routes)

### Why This Key is Needed
The payment verification endpoint needs to:
1. Update order status from 'created' to 'paid'
2. Add payment IDs and signatures
3. Generate and assign invoice numbers
4. Create bill records for projects

All these operations require bypassing RLS, which only the service role can do.

---

## 🧪 Testing the Fix

After adding the environment variable:

1. **Restart your dev server** (if running locally):
   ```bash
   npm run dev
   ```

2. **For Vercel**, redeploy or trigger a new deployment

3. Try a test payment:
   - Add items to cart
   - Click "Proceed to Payment"
   - Complete payment with Razorpay
   - Should now redirect to Orders page successfully

---

## 🐛 Troubleshooting

### Still seeing the error?

Check browser console (F12) for detailed logs:
- Look for "Payment verification failed" with details
- Check Network tab for the `/api/payment/verify` request
- Response should show specific error message

### Common issues:

1. **"Missing SUPABASE_SERVICE_ROLE_KEY"**
   - Variable not set or wrong name
   - Restart dev server after adding to .env.local
   - Redeploy on Vercel after adding variable

2. **"Missing RAZORPAY_KEY_SECRET"**
   - Check `.env.local` has: `RAZORPAY_KEY_SECRET=0HiHuLKS3oigirCDfN18p1UC`
   - For Vercel: Add this variable too

3. **"Invalid payment signature"**
   - Wrong Razorpay secret key
   - Mismatch between test/live keys

4. **"Unauthorized - No auth header"**
   - User session expired
   - Refresh page and try again

---

## 📋 Complete Environment Variables Checklist

Make sure you have ALL these variables set:

### Local (.env.local):
```bash
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY          # ← Often missing!
✅ RAZORPAY_KEY_ID
✅ RAZORPAY_KEY_SECRET                # ← Backend only
✅ NEXT_PUBLIC_RAZORPAY_KEY_ID        # ← Frontend
```

### Production (Vercel):
Same as above, plus:
```bash
✅ DATABASE_URL (if using direct connections)
✅ NODE_ENV=production
```

---

## 🎯 What Happens After Fix

1. ✅ Payment completes on Razorpay
2. ✅ Verification succeeds on backend
3. ✅ Orders marked as 'paid' in database
4. ✅ Invoice numbers generated
5. ✅ Bill records created
6. ✅ Cart items removed
7. ✅ Redirect to Orders page with success message

---

## 🆘 Need Help?

If payment verification still fails after following this guide:

1. Check Supabase logs: Dashboard → Logs → API
2. Check Vercel logs: Dashboard → Deployments → [Latest] → Logs
3. Share error details from browser console
4. Note: Payment IS processed by Razorpay even if verification fails
   - Check Razorpay dashboard for payment confirmation
   - Orders can be manually updated in Supabase if needed
