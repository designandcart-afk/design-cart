'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/authContext';
import { X, Info } from 'lucide-react';

export default function DemoBanner() {
  const { user, isDemo } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed in this session
    const dismissed = sessionStorage.getItem('demoBannerDismissed');
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('demoBannerDismissed', 'true');
  };

  // Show banner for demo mode or when signed in with demo account
  if (isDismissed) {
    return null;
  }

  const isDemoAccount = user?.email === 'demo@designandcart.in';
  const shouldShowBanner = isDemo || isDemoAccount;

  if (!shouldShowBanner) {
    return null;
  }

  return (
    <div className="bg-[#f2f0ed] border-b border-[#2e2e2e]/10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-[#2e2e2e]/10 flex items-center justify-center">
                <Info className="w-4 h-4 text-[#2e2e2e]/60" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              {isDemo && !user ? (
                <p className="text-sm text-[#2e2e2e]/70">
                  <span className="font-medium text-[#2e2e2e]">Demo Mode</span>: Login using{' '}
                  <span className="font-mono bg-[#2e2e2e]/5 px-1.5 py-0.5 rounded text-xs">demo@designandcart.in</span>
                  {' '}and password{' '}
                  <span className="font-mono bg-[#2e2e2e]/5 px-1.5 py-0.5 rounded text-xs">demo123</span>
                  {' '}to see the demo interface
                </p>
              ) : (
                <p className="text-sm text-[#2e2e2e]/70">
                  You're viewing the <span className="font-medium text-[#2e2e2e]">demo account</span> — changes won't be saved.
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1.5 rounded-lg hover:bg-[#2e2e2e]/5 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4 text-[#2e2e2e]/50" />
          </button>
        </div>
      </div>
    </div>
  );
}
