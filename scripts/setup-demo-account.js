/**
 * Demo Account Setup Utility
 * 
 * This script helps create the demo account in Supabase.
 * Run this once to set up the demo account.
 * 
 * Prerequisites:
 * - Supabase project set up
 * - Environment variables configured
 * 
 * Usage:
 * node scripts/setup-demo-account.js
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key, not anon key

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupDemoAccount() {
  console.log('🚀 Setting up demo account...');
  
  const demoEmail = 'demo@designandcart.in';
  const demoPassword = 'DesignCart@2025';
  
  try {
    // Check if demo user already exists
    const { data: existingUser, error: checkError } = await supabase.auth.admin.listUsers();
    
    if (checkError) {
      throw checkError;
    }
    
    const demoUser = existingUser.users.find(u => u.email === demoEmail);
    
    if (demoUser) {
      console.log('✅ Demo account already exists!');
      console.log(`   Email: ${demoEmail}`);
      console.log(`   User ID: ${demoUser.id}`);
      console.log(`   Email Confirmed: ${demoUser.email_confirmed_at ? 'Yes' : 'No'}`);
      
      // Update password if needed
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        demoUser.id,
        {
          password: demoPassword,
          email_confirm: true
        }
      );
      
      if (updateError) {
        console.error('⚠️  Could not update password:', updateError.message);
      } else {
        console.log('✅ Password updated successfully');
      }
      
      return demoUser;
    }
    
    // Create new demo user
    console.log('📝 Creating new demo account...');
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: demoEmail,
      password: demoPassword,
      email_confirm: true,
      user_metadata: {
        name: 'Demo User',
        is_demo: true
      }
    });
    
    if (createError) {
      throw createError;
    }
    
    console.log('✅ Demo account created successfully!');
    console.log(`   Email: ${demoEmail}`);
    console.log(`   Password: ${demoPassword}`);
    console.log(`   User ID: ${newUser.user.id}`);
    
    return newUser.user;
    
  } catch (error) {
    console.error('❌ Error setting up demo account:', error);
    throw error;
  }
}

// Run the setup
setupDemoAccount()
  .then(() => {
    console.log('\n✨ Demo account setup complete!');
    console.log('\nNext steps:');
    console.log('1. Verify Supabase Auth settings:');
    console.log('   - Email provider enabled');
    console.log('   - Magic link disabled (optional)');
    console.log('   - Email confirmations enabled');
    console.log('2. Add RLS policies for read-only demo access');
    console.log('3. Test login at /login with "Explore Demo Account" button');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  });
