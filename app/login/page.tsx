'use client';

import { useState, Suspense } from 'react';
import { useAuth } from '@/lib/auth/authContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, Eye, EyeOff, ArrowLeft, Loader2, BookOpen } from 'lucide-react';
import { Button } from '@/components/UI';

export const dynamic = 'force-dynamic';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams?.get('returnTo') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      await signIn(email, password);
      // Redirect to the page user was trying to access or home
      router.push(returnTo);
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to sign in'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f2f0ed] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#2e2e2e]/70 hover:text-[#d96857] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d96857] to-[#c45745] flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-[#2e2e2e] mb-2">
              Welcome Back
            </h1>
            <p className="text-[#2e2e2e]/70">
              Sign in to your account to continue
            </p>
          </div>

          {/* Tutorial Link - Prominent placement */}
          <Link
            href="/tutorial"
            className="mb-6 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#d96857]/10 border-2 border-[#d96857]/20 text-[#d96857] hover:bg-[#d96857]/20 hover:border-[#d96857]/40 transition-all"
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-semibold">New here? Watch Tutorial First</span>
          </Link>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2e2e2e] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2e2e2e]/30" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 focus:border-[#d96857] focus:outline-none focus:ring-2 focus:ring-[#d96857]/20 transition-all disabled:opacity-50"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#2e2e2e] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2e2e2e]/30" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-zinc-200 focus:border-[#d96857] focus:outline-none focus:ring-2 focus:ring-[#d96857]/20 transition-all disabled:opacity-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#2e2e2e]/50 hover:text-[#2e2e2e] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link 
                href="/reset-password"
                className="text-sm text-[#d96857] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-[#d96857] text-white rounded-xl py-3 font-medium hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>



          {/* Footer */}
          <p className="mt-6 text-center text-sm text-[#2e2e2e]/70">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[#d96857] hover:underline font-medium">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f2f0ed] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#d96857]" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}