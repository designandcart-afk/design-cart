#!/usr/bin/env node

// Test the payment API locally to see what's failing
const fetch = require('node-fetch');

async function testPaymentAPI() {
  console.log('🧪 Testing payment API locally...');
  
  try {
    // Test the create-order endpoint with sample data
    const testPayload = {
      amount: 1000,
      currency: 'INR',
      items: [
        {
          productId: 'test-product-1',
          projectId: 'general',
          name: 'Test Product',
          price: 1000,
          qty: 1
        }
      ],
      projectIds: ['general'],
      subtotal: 1000,
      tax: 0,
      taxRate: 0
    };

    console.log('📋 Test payload:', JSON.stringify(testPayload, null, 2));

    const response = await fetch('http://localhost:4000/api/payment/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: No authorization header - this should fail with 401
      },
      body: JSON.stringify(testPayload)
    });

    const result = await response.json();
    
    console.log('📊 Response status:', response.status);
    console.log('📋 Response body:', JSON.stringify(result, null, 2));

    if (response.status === 401) {
      console.log('✅ API is working - returns 401 for unauthorized requests as expected');
    } else if (response.status === 500) {
      console.log('❌ API is returning 500 error');
    } else {
      console.log('🤔 Unexpected response status');
    }

  } catch (error) {
    console.error('💥 Test failed:', error.message);
  }
}

testPaymentAPI();