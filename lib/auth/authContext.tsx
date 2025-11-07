// Enhanced auth context that works with both demo and real users
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { DEMO_MODE } from '@/lib/config';
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Types for both demo and real users
export interface DemoUser {
  id: string;
  email: string;
  name: string;
  type: 'demo';
}

export interface RealUser {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  type: 'real';
}

export type User = DemoUser | RealUser | SupabaseUser;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, name: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  switchToDemo: () => void;
  switchToReal: () => void;
  resetPassword?: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: DemoUser = {
  id: 'demo_user',
  email: 'demo@designandcart.in',
  name: 'Demo User',
  type: 'demo'
};

const DEMO_MODE_KEY = 'dc:demo:mode';
const DEMO_USER_KEY = 'dc:demo:user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(DEMO_MODE);
  const router = useRouter();

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Use the configuration setting as primary, localStorage as override only
        const localDemoMode = localStorage.getItem(DEMO_MODE_KEY);
        
        // If localStorage has a setting, use it; otherwise use the config
        let isDemoMode = DEMO_MODE;
        if (localDemoMode !== null) {
          isDemoMode = localDemoMode === 'true';
        }
        
        // However, if DEMO_MODE is false in config, force real mode
        if (!DEMO_MODE) {
          isDemoMode = false;
          // Clear any conflicting localStorage setting
          localStorage.setItem(DEMO_MODE_KEY, 'false');
        }

        setIsDemo(isDemoMode);

        if (isDemoMode) {
          // Demo mode - check localStorage
          const demoUser = localStorage.getItem(DEMO_USER_KEY);
          if (demoUser) {
            setUser(JSON.parse(demoUser));
          }
        } else {
          // Real mode - check Supabase auth
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Auth check failed:', error);
          } else if (session?.user) {
            setUser(session.user);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for Supabase auth changes when not in demo mode
    if (!DEMO_MODE) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Supabase auth state changed:', event);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    if (isDemo) {
      // Demo sign in - only accept specific demo credentials
      if (email === 'demo@designandcart.in' && password === 'demo123') {
        setUser(DEMO_USER);
        localStorage.setItem(DEMO_USER_KEY, JSON.stringify(DEMO_USER));
      } else {
        throw new Error('Please use demo credentials: demo@designandcart.in / demo123');
      }
    } else {
      // Real Supabase sign in
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase().trim(),
          password
        });

        if (error) {
          console.error('Supabase auth error:', error);
          
          // Provide specific error messages
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password. Please check your credentials and try again.');
          } else if (error.message.includes('Email not confirmed')) {
            throw new Error('Please verify your email address before signing in. Check your inbox for the verification link.');
          } else if (error.message.includes('email_confirmed_at')) {
            throw new Error('Please verify your email address before signing in. Check your inbox for the verification link.');
          } else {
            throw new Error(error.message || 'Failed to sign in');
          }
        }

        // Check if email is confirmed
        if (data.user && !data.user.email_confirmed_at) {
          throw new Error('Please verify your email address before signing in. Check your inbox for the verification link.');
        }

        if (data.user) {
          setUser(data.user);
        }
      } catch (error: any) {
        throw error; // Re-throw to preserve the specific error message
      } finally {
        setIsLoading(false);
      }
    }
  };

  const signUp = async (email: string, name: string, password: string) => {
    if (isDemo) {
      // Demo sign up - redirect to specific demo credentials
      throw new Error('In demo mode, please use the sign in page with: demo@designandcart.in / demo123');
    }

    // Real Supabase sign up
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            name: name.trim()
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }

      // Note: User will need to verify email before they can sign in
      if (data.user && !data.session) {
        // Email verification required
        return;
      }

    } catch (error: any) {
      throw new Error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (isDemo) {
      // Demo sign out
      setUser(null);
      localStorage.removeItem(DEMO_USER_KEY);
    } else {
      // Real Supabase sign out
      setIsLoading(true);
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          throw error;
        }
        setUser(null);
      } catch (error: any) {
        console.error('Sign out error:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    router.push('/');
  };

  const resetPassword = async (email: string) => {
    if (isDemo) {
      throw new Error('Password reset not available in demo mode');
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send reset email');
    }
  };

  const switchToDemo = () => {
    setIsDemo(true);
    setUser(null);
    localStorage.setItem(DEMO_MODE_KEY, 'true');
    localStorage.removeItem(DEMO_USER_KEY);
  };

  const switchToReal = () => {
    setIsDemo(false);
    setUser(null);
    localStorage.setItem(DEMO_MODE_KEY, 'false');
    localStorage.removeItem(DEMO_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isDemo,
        signIn,
        signUp,
        signOut,
        switchToDemo,
        switchToReal,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}