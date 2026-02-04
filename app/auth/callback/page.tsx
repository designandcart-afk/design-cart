'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const code = searchParams?.get('code');
        const type = searchParams?.get('type');
        const error = searchParams?.get('error');
        const errorDescription = searchParams?.get('error_description');

        // Check for errors in URL
        if (error) {
          setStatus('error');
          setMessage(errorDescription || 'Authentication failed');
          return;
        }

        if (code) {
          // Exchange code for session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            setStatus('error');
            setMessage(exchangeError.message);
            return;
          }

          if (data.user) {
            setStatus('success');
            
            if (type === 'recovery') {
              setMessage('Password reset successful! You can now update your password.');
              // Redirect to password update page
              setTimeout(() => router.push('/new-password'), 2000);
            } else {
              // After email verification, ensure designer_details record exists
              try {
                const { supabase: supabaseClient } = await import('@/lib/supabase');
                const { data: profileData, error: profileError } = await supabaseClient
                  .from('designer_details')
                  .select('id')
                  .eq('user_id', data.user.id)
                  .single();
                
                // If no profile exists, create one
                if (profileError || !profileData) {
                  const userName = data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Designer';
                  await supabaseClient
                    .from('designer_details')
                    .insert({
                      user_id: data.user.id,
                      name: userName,
                      email: data.user.email,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    });
                }
              } catch (profileSetupError) {
                console.error('Error setting up profile:', profileSetupError);
              }
              
              setMessage('Email verified successfully! You can now sign in.');
              // Redirect to login
              setTimeout(() => router.push('/login'), 2000);
            }
          }
        } else {
          // No code found, redirect to login
          setStatus('error');
          setMessage('No authentication code found');
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage(error.message || 'Authentication failed');
      }
    };

    handleAuthCallback();
  }, [searchParams, router]);

  // Auto redirect on error after 3 seconds
  useEffect(() => {
    if (status === 'error') {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  return (
    <main className="min-h-screen bg-[#f2f0ed] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d96857] to-[#c45745] flex items-center justify-center mb-4 mx-auto">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
              <h1 className="text-xl font-semibold text-[#2e2e2e] mb-2">
                Verifying...
              </h1>
              <p className="text-[#2e2e2e]/70">
                Please wait while we verify your authentication.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4 mx-auto">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h1 className="text-xl font-semibold text-[#2e2e2e] mb-2">
                Success!
              </h1>
              <p className="text-[#2e2e2e]/70 mb-4">
                {message}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-[#2e2e2e]/50">
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirecting...
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h1 className="text-xl font-semibold text-[#2e2e2e] mb-2">
                Authentication Failed
              </h1>
              <p className="text-[#2e2e2e]/70 mb-4">
                {message}
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-[#2e2e2e]/50">
                <Loader2 className="w-4 h-4 animate-spin" />
                Redirecting to login...
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#f2f0ed] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#d96857] mx-auto" />
        </div>
      </main>
    }>
      <AuthCallback />
    </Suspense>
  );
}