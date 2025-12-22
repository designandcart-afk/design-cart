#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCartPayment() {
  console.log('Testing cart payment flow...');
  
  try {
    // Test if we can authenticate (using demo approach)
    console.log('🔍 Testing authentication...');
    
    // Check Razorpay environment variables
    console.log('🔍 Checking environment variables...');
    console.log('RAZORPAY_KEY_ID exists:', !!process.env.RAZORPAY_KEY_ID);
    console.log('RAZORPAY_KEY_SECRET exists:', !!process.env.RAZORPAY_KEY_SECRET);
    console.log('NEXT_PUBLIC_RAZORPAY_KEY_ID exists:', !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
    
    // Test orders table structure
    console.log('🔍 Testing orders table...');
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(1);
    
    console.log('Orders query result:', { ordersError, count: orders?.length });
    
    // Test cart_items table
    console.log('🔍 Testing cart_items table...');
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('*')
      .limit(1);
    
    console.log('Cart items query result:', { cartError, count: cartItems?.length });
    
    // Test products table
    console.log('🔍 Testing products table...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, selling_price')
      .limit(2);
    
    console.log('Products query result:', { productsError, count: products?.length });
    if (products?.length > 0) {
      console.log('Sample product:', products[0]);
    }
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testCartPayment().then(() => {
  console.log('Cart payment test completed!');
});