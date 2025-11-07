'use client';

import RequireAuth from '@/components/RequireAuth';

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}