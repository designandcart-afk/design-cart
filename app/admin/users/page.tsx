'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth/authContext';
import { Users, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';

interface User {
  id: string;
  email: string;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  created_at: string;
  user_metadata: {
    name?: string;
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Note: This requires admin privileges or RLS policy
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        setError('Unable to fetch users. This requires admin access.');
        console.error('Error fetching users:', error);
      } else {
        setUsers(data.users as User[]);
      }
    } catch (err) {
      setError('Failed to load users');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f0ed] p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d96857] mx-auto mb-4"></div>
            <p className="text-[#2e2e2e]/70">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f0ed] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d96857] to-[#c45745] flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-[#2e2e2e]">
              Registered Users
            </h1>
          </div>
          <p className="text-[#2e2e2e]/70">
            View and manage user registrations for Design & Cart
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 font-medium">Error</p>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
            <p className="text-red-600 text-sm mt-2">
              Note: User management requires admin access or proper RLS policies in Supabase.
            </p>
          </div>
        )}

        {/* Users List */}
        {users.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-zinc-200">
              <h2 className="text-lg font-semibold text-[#2e2e2e]">
                {users.length} Registered User{users.length !== 1 ? 's' : ''}
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-[#2e2e2e]">User</th>
                    <th className="text-left py-3 px-6 font-medium text-[#2e2e2e]">Email</th>
                    <th className="text-left py-3 px-6 font-medium text-[#2e2e2e]">Status</th>
                    <th className="text-left py-3 px-6 font-medium text-[#2e2e2e]">Registered</th>
                    <th className="text-left py-3 px-6 font-medium text-[#2e2e2e]">Last Sign In</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-zinc-50/50'}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d96857] to-[#c45745] flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {(user.user_metadata?.name || user.email)[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-[#2e2e2e]">
                              {user.user_metadata?.name || 'Unknown'}
                            </p>
                            <p className="text-sm text-[#2e2e2e]/60">
                              ID: {user.id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[#2e2e2e]/40" />
                          <span className="text-[#2e2e2e]">{user.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {user.email_confirmed_at ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-green-700 text-sm font-medium">Verified</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-orange-600" />
                              <span className="text-orange-700 text-sm font-medium">Pending</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#2e2e2e]/40" />
                          <span className="text-[#2e2e2e]/70 text-sm">
                            {formatDate(user.created_at)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-[#2e2e2e]/70 text-sm">
                          {formatDate(user.last_sign_in_at)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Users className="w-12 h-12 text-[#2e2e2e]/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#2e2e2e] mb-2">No Users Yet</h3>
            <p className="text-[#2e2e2e]/70 mb-6">
              No users have registered yet. Share your signup link to get started!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/signup"
                className="px-4 py-2 bg-[#d96857] text-white rounded-lg hover:opacity-90 transition"
              >
                View Signup Page
              </a>
              <button
                onClick={fetchUsers}
                className="px-4 py-2 border border-[#d96857] text-[#d96857] rounded-lg hover:bg-[#d96857] hover:text-white transition"
              >
                Refresh
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">📋 User Management Instructions</h3>
          <div className="text-blue-800 text-sm space-y-2">
            <p>• <strong>New registrations:</strong> Users sign up at <code>/signup</code></p>
            <p>• <strong>Email verification:</strong> Required before users can sign in</p>
            <p>• <strong>User data:</strong> Stored securely in Supabase Auth</p>
            <p>• <strong>Admin access:</strong> This page requires proper permissions</p>
          </div>
        </div>
      </div>
    </div>
  );
}