import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * GET /api/projects/[id]/payment-status
 * Returns payment status and unlock status for renders and final files
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;

    if (!projectId) {
      return NextResponse.json({ 
        error: 'Project ID is required' 
      }, { status: 400 });
    }

    // Get all payments for this project
    const { data: payments, error: paymentsError } = await supabase
      .from('project_design_payments')
      .select('*')
      .eq('project_id', projectId)
      .eq('status', 'paid')
      .order('created_at', { ascending: false });

    if (paymentsError) {
      console.error('Error fetching payments:', paymentsError);
      return NextResponse.json({ 
        error: 'Failed to fetch payment status',
        details: paymentsError.message 
      }, { status: 500 });
    }

    // Check for advance and balance payments
    const advancePayment = payments?.find(p => p.payment_type === 'advance');
    const balancePayment = payments?.find(p => p.payment_type === 'balance');
    const fullPayment = payments?.find(p => p.payment_type === 'full');

    // Determine unlock status
    const advancePaid = !!advancePayment || !!fullPayment;
    const balancePaid = !!balancePayment || !!fullPayment;
    
    // Both renders and final files unlock only after balance payment (final quote paid)
    const rendersUnlocked = balancePaid;
    const finalFilesUnlocked = balancePaid;

    // Get current estimate
    const { data: estimates } = await supabase
      .from('project_design_estimates')
      .select('*')
      .eq('project_id', projectId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1);

    const currentEstimate = estimates?.[0] || null;

    return NextResponse.json({
      success: true,
      status: {
        advancePaid,
        balancePaid,
        rendersUnlocked,
        finalFilesUnlocked,
        payments: payments?.length || 0
      },
      estimate: currentEstimate,
      payments
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
