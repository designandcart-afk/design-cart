// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/lib/auth/authContext';
import { ProjectsProvider } from '@/lib/contexts/projectsContext';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProjectsProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#2e2e2e',
                color: '#fff',
                borderRadius: '999px',
              },
            }}
          />
        </ProjectsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}