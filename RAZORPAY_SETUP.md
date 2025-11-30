# Razorpay Payment Integration Setup

This guide will help you integrate Razorpay payment gateway into your Design & Cart application.

## Prerequisites

1. A Razorpay account (sign up at https://razorpay.com/)
2. Your Razorpay API keys

## Setup Steps

### 1. Get Your Razorpay API Keys

1. Log in to your Razorpay Dashboard: https://dashboard.razorpay.com/
2. Navigate to **Settings** → **API Keys**
3. Generate API keys if you haven't already
4. You'll get two keys:
   - **Key ID** (starts with `rzp_test_` for test mode or `rzp_live_` for live mode)
   - **Key Secret** (keep this secret and never expose it in frontend code)

### 2. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Add your Razorpay credentials to `.env.local`:
   ```
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
   RAZORPAY_KEY_SECRET=your_secret_key_here
   ```

   **Important:** 
   - Only `NEXT_PUBLIC_RAZORPAY_KEY_ID` is used in the frontend
   - Never expose `RAZORPAY_KEY_SECRET` in client-side code
   - Use test keys (`rzp_test_`) during development
   - Switch to live keys (`rzp_live_`) only in production

### 3. Test Mode vs Live Mode

**Test Mode:**
- Use test API keys (starting with `rzp_test_`)
- Test cards: https://razorpay.com/docs/payments/payments/test-card-details/
- Example test card: 4111 1111 1111 1111, any future expiry, any CVV
- No real money is charged

**Live Mode:**
- Use live API keys (starting with `rzp_live_`)
- Real transactions with actual payment
- Enable only after KYC verification

### 4. Payment Flow

1. **User adds items to cart** and clicks "Proceed to Payment"
2. **Razorpay checkout modal opens** with payment options
3. **User completes payment** using their preferred method
4. **Payment success handler** is triggered with payment ID
5. **Order is saved** with payment details
6. **Cart items are removed** and user is notified

### 5. Webhook Setup (Optional but Recommended)

For production, set up webhooks to handle payment events:

1. Go to **Settings** → **Webhooks** in Razorpay Dashboard
2. Add webhook URL: `https://yourdomain.com/api/razorpay/webhook`
3. Select events: `payment.captured`, `payment.failed`, `order.paid`
4. Save the webhook secret
5. Implement webhook handler in your API

### 6. Customization

You can customize the Razorpay checkout in `app/(protected)/cart/page.tsx`:

```typescript
const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: subtotal * 100, // Amount in paise
  currency: 'INR',
  name: 'Your Company Name', // Customize this
  description: 'Order description', // Customize this
  image: '/your-logo.png', // Your logo
  theme: {
    color: '#d96857' // Your brand color
  },
  // ... other options
};
```

### 7. Security Best Practices

1. ✅ **Never expose** `RAZORPAY_KEY_SECRET` in frontend code
2. ✅ **Verify payments** on the server-side using webhooks
3. ✅ **Use HTTPS** in production
4. ✅ **Validate payment amounts** on the backend
5. ✅ **Log all transactions** for audit purposes
6. ✅ **Implement proper error handling**

### 8. Testing Payments

Use these test cards in test mode:

| Card Type | Card Number | CVV | Expiry |
|-----------|-------------|-----|--------|
| Success | 4111 1111 1111 1111 | Any | Any future date |
| Failure | 4111 1111 1111 1234 | Any | Any future date |

More test cards: https://razorpay.com/docs/payments/payments/test-card-details/

### 9. Going Live

Before going live:

1. ✅ Complete KYC verification in Razorpay Dashboard
2. ✅ Replace test keys with live keys in production environment
3. ✅ Set up webhooks for production
4. ✅ Test thoroughly in test mode first
5. ✅ Enable only required payment methods
6. ✅ Set up proper error monitoring

### 10. Support

- Razorpay Documentation: https://razorpay.com/docs/
- Razorpay Support: https://razorpay.com/support/
- Integration Issues: Check the Razorpay dashboard logs

## Troubleshooting

**Issue:** Razorpay script not loading
- **Solution:** Check your internet connection and firewall settings

**Issue:** Payment modal not opening
- **Solution:** Verify your API key is correct and starts with `rzp_test_` or `rzp_live_`

**Issue:** Payment succeeds but order not saved
- **Solution:** Check browser console for errors in the payment handler

**Issue:** Invalid key error
- **Solution:** Ensure `NEXT_PUBLIC_RAZORPAY_KEY_ID` is properly set in `.env.local` and restart the dev server

## Additional Features

You can enhance the integration with:
- **Subscription payments** for recurring orders
- **EMI options** for larger purchases
- **UPI AutoPay** for recurring payments
- **International payments** (requires additional setup)
- **Payment links** for offline orders

Refer to Razorpay documentation for implementing these features.
