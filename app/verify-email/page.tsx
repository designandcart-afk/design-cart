'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/UI';

export default function VerifyEmailPage() {
  const router = useRouter();
  // Supabase handles verification automatically, so just show a success message
  const status: 'success' = 'success';
  const message = 'Your email has been verified successfully!';

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="text-center">
          <div className="mb-8">
            <img src="/logo.png" alt="Design&Cart" className="h-12 w-auto mx-auto" />
          </div>

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

        </div>
      </div>
    </main>
  );
}