'use client';

import PageAuth from '@/components/PageAuth';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageAuth
      title="Protected Content"
      description="Sign in to access all features and content"
    >
      {children}
    </PageAuth>
  );
}
