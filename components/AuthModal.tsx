'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/authContext';
import { Button, Input } from '@/components/UI';
import { X, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'reset';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset' | 'verify'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signIn, signUp, isDemo, switchToReal } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters long');
        }
        
        await signUp(email, name, password);
        setMode('verify');
        setSuccess('Account created! Please check your email for verification link.');
      } else if (mode === 'signin') {
        await signIn(email, password);
        onClose();
      } else if (mode === 'reset') {
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error);
        }
        
        setSuccess('If an account exists with this email, you will receive a reset link shortly.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoMode = () => {
    if (!isDemo) {
      switchToReal();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Design&Cart" className="h-8 w-auto" />
              <h2 className="text-xl font-semibold text-[#2e2e2e]">
                {mode === 'signin' && 'Sign In'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'reset' && 'Reset Password'}
                {mode === 'verify' && 'Check Your Email'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
              {success}
            </div>
          )}

          {mode === 'verify' ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#2e2e2e] mb-2">Verification Email Sent</h3>
              <p className="text-zinc-600 mb-6">
                We've sent a verification link to <strong>{email}</strong>. 
                Click the link in the email to activate your account.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => setMode('signin')}
                  className="w-full bg-[#d96857] text-white py-3 rounded-2xl font-medium hover:bg-[#c85745] transition"
                >
                  Back to Sign In
                </Button>
                <Button
                  onClick={onClose}
                  className="w-full border border-zinc-300 text-zinc-700 py-3 rounded-2xl font-medium hover:bg-zinc-50 transition"
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-[#2e2e2e] mb-2">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#2e2e2e] mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full"
                />
              </div>

              {mode !== 'reset' && (
                <div>
                  <label className="block text-sm font-medium text-[#2e2e2e] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-zinc-100"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-zinc-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-zinc-500" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-[#2e2e2e] mb-2">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="w-full"
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#d96857] text-white py-3 rounded-2xl font-medium hover:bg-[#c85745] transition disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <>
                    {mode === 'signin' && 'Sign In'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'reset' && 'Send Reset Link'}
                  </>
                )}
              </Button>

              {/* Mode switches */}
              <div className="text-center space-y-2">
                {mode === 'signin' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setMode('reset')}
                      className="text-sm text-[#d96857] hover:underline"
                    >
                      Forgot your password?
                    </button>
                    <p className="text-sm text-zinc-600">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setMode('signup')}
                        className="text-[#d96857] hover:underline font-medium"
                      >
                        Sign up
                      </button>
                    </p>
                  </>
                )}

                {mode === 'signup' && (
                  <p className="text-sm text-zinc-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="text-[#d96857] hover:underline font-medium"
                    >
                      Sign in
                    </button>
                  </p>
                )}

                {mode === 'reset' && (
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="text-sm text-[#d96857] hover:underline"
                  >
                    Back to Sign In
                  </button>
                )}
              </div>

              {/* Demo mode option */}
              <div className="pt-4 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={handleDemoMode}
                  className="w-full text-center text-sm text-zinc-600 hover:text-zinc-800"
                >
                  Or try <span className="font-medium text-[#d96857]">Demo Mode</span> without signup
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}