'use client';

import Link from 'next/link';
import { X, Lock, UserPlus } from 'lucide-react';
import { Button } from './UI';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export default function SignInModal({
  isOpen,
  onClose,
  title = 'Sign in to Continue',
  description = 'Access your account or create a new one'
}: SignInModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-zinc-100 transition-colors"
        >
          <X className="w-5 h-5 text-zinc-600" />
        </button>

        {/* Content */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#2e2e2e] mb-2">
            {title}
          </h2>
          <p className="text-[#2e2e2e]/70">
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/login" onClick={onClose}>
            <Button className="w-full bg-[#d96857] text-white rounded-xl py-3 font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" />
              Sign In
            </Button>
          </Link>

          <Link href="/signup" onClick={onClose}>
            <Button className="w-full bg-white text-[#2e2e2e] border-2 border-[#2e2e2e]/10 rounded-xl py-3 font-medium hover:border-[#d96857]/30 hover:bg-[#f2f0ed] transition-all flex items-center justify-center gap-2">
              <UserPlus className="w-5 h-5" />
              Create Account
            </Button>
          </Link>
        </div>

        {/* Demo Link */}
        <div className="mt-4 text-center">
          <Link 
            href="/login"
            onClick={onClose}
            className="text-xs text-[#2e2e2e]/50 hover:text-[#d96857] transition-colors"
          >
            or try the demo account →
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-4 text-xs text-center text-zinc-500">
          Secure authentication with email verification
        </p>
      </div>
    </div>
  );
}
