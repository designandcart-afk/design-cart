'use client';

import { LogOut, BookOpen, Mail } from 'lucide-react';
import Link from 'next/link';

interface ProfileDropdownProps {
  onSignOut: () => void;
  onClose: () => void;
}

export default function ProfileDropdown({ onSignOut, onClose }: ProfileDropdownProps) {
  return (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#2e2e2e]/10 py-2 z-50">
      <Link
        href="/tutorial"
        onClick={onClose}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#2e2e2e] hover:bg-[#f8f7f4] transition-colors"
      >
        <BookOpen className="w-4 h-4" />
        Tutorial
      </Link>
      
      <Link
        href="/contact"
        onClick={onClose}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#2e2e2e] hover:bg-[#f8f7f4] transition-colors"
      >
        <Mail className="w-4 h-4" />
        Contact Support
      </Link>
      
      <div className="my-1 border-t border-[#2e2e2e]/10"></div>
      
      <button
        onClick={onSignOut}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#d96857] hover:bg-[#f8f7f4] transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  );
}
