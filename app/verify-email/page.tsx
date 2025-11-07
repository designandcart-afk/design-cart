'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/UI';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('Your email has been verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Failed to verify email. Please try again.');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="text-center">
          <div className="mb-8">
            <img src="/logo.png" alt="Design&Cart" className="h-12 w-auto mx-auto" />
          </div>

          {status === 'loading' && (
            <div>
              <div className="w-8 h-8 border-2 border-[#d96857] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h1 className="text-2xl font-semibold text-[#2e2e2e] mb-4">
                Verifying your email...
              </h1>
              <p className="text-zinc-600">
                Please wait while we verify your email address.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-[#2e2e2e] mb-4">
                Email Verified!
              </h1>
              <p className="text-zinc-600 mb-8">
                {message}
              </p>
              <p className="text-zinc-600 mb-8">
                You can now sign in and start using Design&Cart.
              </p>
              <Button
                onClick={() => router.push('/')}
                className="w-full bg-[#d96857] text-white py-3 rounded-2xl font-medium hover:bg-[#c85745] transition"
              >
                Continue to Dashboard
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-[#2e2e2e] mb-4">
                Verification Failed
              </h1>
              <p className="text-zinc-600 mb-8">
                {message}
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/')}
                  className="w-full bg-[#d96857] text-white py-3 rounded-2xl font-medium hover:bg-[#c85745] transition"
                >
                  Back to Home
                </Button>
                <Button
                  onClick={() => window.location.href = '/contact'}
                  className="w-full border border-zinc-300 text-zinc-700 py-3 rounded-2xl font-medium hover:bg-zinc-50 transition"
                >
                  Contact Support
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}