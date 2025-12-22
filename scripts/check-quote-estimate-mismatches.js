// Script to find mismatches between project_quotes_bills and project_design_estimates in Supabase
// Usage: node scripts/check-quote-estimate-mismatches.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMismatches() {
  console.log('Checking all project_design_estimates data...\n');
  
  // Get all estimates from project_design_estimates
  const { data: estimates, error: estimatesError } = await supabase
    .from('project_design_estimates')
    .select('*')
    .order('created_at', { ascending: false });

  if (estimatesError) {
    console.error('Error fetching estimates:', estimatesError);
    return;
  }

  if (!estimates || estimates.length === 0) {
    console.log('❌ No estimates found in project_design_estimates table!');
    return;
  }

  console.log(`✅ Found ${estimates.length} estimates\n`);
  
  estimates.forEach((est, index) => {
    console.log(`--- Estimate ${index + 1} ---`);
    console.log(`ID: ${est.id}`);
    console.log(`Project ID: ${est.project_id}`);
    console.log(`Estimate Number: ${est.estimate_number}`);
    console.log(`Estimate Type: ${est.estimate_type}`);
    console.log(`Total Amount: ${est.total_amount} (Type: ${typeof est.total_amount})`);
    console.log(`Status: ${est.status}`);
    console.log(`Created At: ${est.created_at}`);
    console.log('');
  });

  // Check for zero or null amounts
  const zeroAmounts = estimates.filter(e => !e.total_amount || e.total_amount === 0);
  if (zeroAmounts.length > 0) {
    console.log(`⚠️  WARNING: ${zeroAmounts.length} estimates have zero or null total_amount:`);
    zeroAmounts.forEach(e => {
      console.log(`  - ${e.estimate_number} (ID: ${e.id}): total_amount = ${e.total_amount}`);
    });
  }
}

checkMismatches();
