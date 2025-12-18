'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Menu, Home, Package, MessageCircle, ShoppingCart, FileText, User } from 'lucide-react';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/products', label: 'Products', icon: Package },
    { href: '/chat', label: 'Chat', icon: MessageCircle },
    { href: '/cart', label: 'Cart', icon: ShoppingCart },
    { href: '/orders', label: 'Orders', icon: FileText },
    { href: '/account', label: 'Account', icon: User },
  ];

  return (
    <>
      {/* Hamburger Button - Only visible on mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-[#2e2e2e]/10 hover:border-[#d96857]/30 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5 text-[#2e2e2e]" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2e2e2e]/10">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Design&Cart" className="h-8 w-auto" />
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 rounded-full bg-[#f2f0ed] hover:bg-[#e8e6e3] flex items-center justify-center transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-[#2e2e2e]" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-3.5 transition-colors ${
                  isActive
                    ? 'bg-[#d96857]/10 text-[#d96857] border-r-4 border-[#d96857]'
                    : 'text-[#2e2e2e]/70 hover:bg-[#f2f0ed] hover:text-[#2e2e2e]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-[15px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2e2e2e]/10 bg-[#f9f8f7]">
          <p className="text-xs text-center text-[#2e2e2e]/60">
            © 2025 Design&Cart
          </p>
        </div>
      </div>
    </>
  );
}
