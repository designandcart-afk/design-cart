'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/authContext';
import { supabase } from '@/lib/supabase';
import { DEMO_MODE } from '@/lib/config';
import { Button } from '@/components/UI';
import { Settings, RefreshCw, Trash2, Info, Mail, User } from 'lucide-react';

export default function DebugAuthPage() {
  const [localStorageData, setLocalStorageData] = useState<any>({});
  const [testEmail, setTestEmail] = useState('');
  const [userStatus, setUserStatus] = useState<any>(null);
  const [checking, setChecking] = useState(false);
  const { user, isDemo, isLoading } = useAuth();

  useEffect(() => {
    // Read current localStorage data
    const data = {
      demoMode: localStorage.getItem('dc:demo:mode'),
      demoUser: localStorage.getItem('dc:demo:user'),
    };
    setLocalStorageData(data);
  }, []);

  const clearAllAuthData = () => {
    localStorage.removeItem('dc:demo:mode');
    localStorage.removeItem('dc:demo:user');
    setLocalStorageData({
      demoMode: null,
      demoUser: null,
    });
    // Reload page to restart auth context
    window.location.reload();
  };

  const forceRealMode = () => {
    localStorage.setItem('dc:demo:mode', 'false');
    localStorage.removeItem('dc:demo:user');
    setLocalStorageData({
      demoMode: 'false',
      demoUser: null,
    });
    // Reload page to restart auth context
    window.location.reload();
  };

  const forceDemoMode = () => {
    localStorage.setItem('dc:demo:mode', 'true');
    setLocalStorageData({
      demoMode: 'true',
      demoUser: localStorageData.demoUser,
    });
    // Reload page to restart auth context
    window.location.reload();
  };

  const checkEmailStatus = async () => {
    if (!testEmail) return;
    
    setChecking(true);
    try {
      // Try to get user by email (this requires admin access)
      const { data, error } = await supabase.auth.admin.getUserByEmail(testEmail);
      
      if (error) {
        setUserStatus({
          error: 'Unable to check user status (requires admin access)',
          details: error.message
        });
      } else if (data.user) {
        setUserStatus({
          exists: true,
          email: data.user.email,
          emailConfirmed: !!data.user.email_confirmed_at,
          emailConfirmedAt: data.user.email_confirmed_at,
          lastSignIn: data.user.last_sign_in_at,
          createdAt: data.user.created_at
        });
      } else {
        setUserStatus({
          exists: false,
          message: 'User not found'
        });
      }
    } catch (error: any) {
      setUserStatus({
        error: 'Failed to check user status',
        details: error.message
      });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f0ed] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d96857] to-[#c45745] flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-[#2e2e2e]">
              Authentication Debug
            </h1>
          </div>
          <p className="text-[#2e2e2e]/70">
            Debug and reset authentication state for Design & Cart
          </p>
        </div>

        {/* Email Verification Checker */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#2e2e2e] mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Check Email Verification Status
          </h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter email address to check"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="flex-1 px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d96857]/20 focus:border-[#d96857]"
              />
              <Button
                onClick={checkEmailStatus}
                disabled={!testEmail || checking}
                className="px-4 py-2 bg-[#d96857] text-white rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {checking ? 'Checking...' : 'Check Status'}
              </Button>
            </div>
            
            {userStatus && (
              <div className="p-4 bg-zinc-50 rounded-lg">
                {userStatus.error ? (
                  <div className="text-red-600">
                    <strong>Error:</strong> {userStatus.error}
                    {userStatus.details && <div className="text-sm mt-1">{userStatus.details}</div>}
                  </div>
                ) : userStatus.exists ? (
                  <div className="space-y-2 text-sm">
                    <div><strong>Email:</strong> {userStatus.email}</div>
                    <div><strong>Email Verified:</strong> 
                      <span className={`ml-2 font-medium ${userStatus.emailConfirmed ? 'text-green-600' : 'text-red-600'}`}>
                        {userStatus.emailConfirmed ? 'Yes' : 'No'}
                      </span>
                    </div>
                    {userStatus.emailConfirmedAt && (
                      <div><strong>Verified At:</strong> {new Date(userStatus.emailConfirmedAt).toLocaleString()}</div>
                    )}
                    <div><strong>Created:</strong> {new Date(userStatus.createdAt).toLocaleString()}</div>
                    {userStatus.lastSignIn && (
                      <div><strong>Last Sign In:</strong> {new Date(userStatus.lastSignIn).toLocaleString()}</div>
                    )}
                  </div>
                ) : (
                  <div className="text-orange-600">
                    <strong>User not found:</strong> {userStatus.message}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#2e2e2e] mb-4">Current Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-zinc-50 rounded-lg">
              <h3 className="font-medium text-[#2e2e2e] mb-2">Configuration</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>DEMO_MODE (config):</span>
                  <span className={`font-medium ${DEMO_MODE ? 'text-blue-600' : 'text-green-600'}`}>
                    {DEMO_MODE ? 'true' : 'false'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>isDemo (runtime):</span>
                  <span className={`font-medium ${isDemo ? 'text-blue-600' : 'text-green-600'}`}>
                    {isDemo ? 'true' : 'false'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Loading:</span>
                  <span className="font-medium">{isLoading ? 'true' : 'false'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-zinc-50 rounded-lg">
              <h3 className="font-medium text-[#2e2e2e] mb-2">Current User</h3>
              <div className="text-sm">
                {user ? (
                  <div className="space-y-1">
                    <div><strong>Email:</strong> {user.email || 'N/A'}</div>
                    <div><strong>ID:</strong> {user.id}</div>
                    <div><strong>Type:</strong> {(user as any).type || 'Supabase'}</div>
                    {(user as any).email_confirmed_at && (
                      <div><strong>Email Verified:</strong> 
                        <span className="text-green-600 ml-1">Yes</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-[#2e2e2e]/60">No user logged in</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Common Issues & Solutions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#2e2e2e] mb-4">Common Login Issues & Solutions</h2>
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <strong className="text-red-800">❌ "Invalid login credentials"</strong>
              <p className="text-red-700 mt-1">Wrong email or password. Double-check your credentials.</p>
            </div>
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <strong className="text-orange-800">⚠️ "Email not confirmed"</strong>
              <p className="text-orange-700 mt-1">Check your email inbox for verification link and click it.</p>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <strong className="text-blue-800">ℹ️ Authentication Failed</strong>
              <p className="text-blue-700 mt-1">Generic error - usually means email not verified or wrong credentials.</p>
            </div>
          </div>
        </div>

        {/* LocalStorage Data */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#2e2e2e] mb-4">LocalStorage Data</h2>
          <div className="space-y-3">
            <div className="p-3 bg-zinc-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">dc:demo:mode</span>
                <span className="font-mono text-sm bg-zinc-200 px-2 py-1 rounded">
                  {localStorageData.demoMode || 'null'}
                </span>
              </div>
            </div>
            <div className="p-3 bg-zinc-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">dc:demo:user</span>
                <span className="font-mono text-sm bg-zinc-200 px-2 py-1 rounded">
                  {localStorageData.demoUser ? 'exists' : 'null'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-[#2e2e2e] mb-4">Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={forceRealMode}
              className="flex items-center gap-2 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Force Real Auth Mode
            </Button>
            
            <Button
              onClick={forceDemoMode}
              className="flex items-center gap-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Force Demo Mode
            </Button>
            
            <Button
              onClick={clearAllAuthData}
              className="flex items-center gap-2 bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition"
            >
              <Trash2 className="w-4 h-4" />
              Clear All Auth Data
            </Button>
          </div>
        </div>

        {/* Issue Diagnosis */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-2">Issue Diagnosis</h3>
              <div className="text-yellow-800 text-sm space-y-2">
                {DEMO_MODE !== isDemo && (
                  <p>⚠️ <strong>Problem:</strong> Config and runtime mode don't match. Check localStorage overrides.</p>
                )}
                {DEMO_MODE === isDemo && (
                  <p>✅ <strong>Good:</strong> Configuration and runtime mode match.</p>
                )}
                <p><strong>Most Common Issue:</strong> Email verification not completed. Check your inbox!</p>
                <p><strong>Solution:</strong> Use email checker above to verify status, then complete verification.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 text-center space-x-4">
          <a href="/login" className="text-[#d96857] hover:underline">Go to Login</a>
          <a href="/signup" className="text-[#d96857] hover:underline">Go to Signup</a>
          <a href="/" className="text-[#d96857] hover:underline">Go to Home</a>
        </div>
      </div>
    </div>
  );
}