import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    
    // Test payment creation with minimal data
    const testResponse = await fetch(`${req.nextUrl.origin}/api/projects/${projectId}/create-design-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.get('authorization') || '',
      },
      body: JSON.stringify({
        estimateId: 'test-estimate-id',
        paymentType: 'advance',
        amount: 100,
        currency: 'INR',
      }),
    });

    const testData = await testResponse.json();

    return NextResponse.json({
      success: true,
      projectId,
      paymentTestResult: testData,
      responseStatus: testResponse.status,
      message: 'Payment API test completed'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      message: 'Payment API test failed'
    });
  }
}