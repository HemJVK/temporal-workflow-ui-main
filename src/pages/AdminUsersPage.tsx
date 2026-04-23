import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Shield,
  ShieldOff,
  Search,
  ArrowLeft,
  Mail,
  Phone,
  Coins,
  Calendar,
  CheckCircle2,
  Trash2,
  Loader2
} from 'lucide-react';
import { getToken } from '../utils/auth';

interface User {
  id: string;
  email: string;
  phone_number: string;
  credits: number;
  is_admin: boolean;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  has_seen_tutorial: boolean;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (id: string, currentStatus: boolean) => {
    setUpdating(id);
    try {
      const response = await fetch(`/api/users/${id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ is_admin: !currentStatus }),
      });
      if (response.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, is_admin: !currentStatus } : u));
      }
    } catch (e) {
      console.error('Failed to update role', e);
    } finally {
      setUpdating(null);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    setUpdating(id);
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (response.ok) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        alert('Failed to delete user');
      }
    } catch (e) {
      console.error('Failed to delete user', e);
      alert('An error occurred while deleting user');
    } finally {
      setUpdating(null);
    }
  };

  const filteredUsers = users.filter(u => 
    (u.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.phone_number?.includes(searchTerm)) ||
    (u.id.includes(searchTerm))
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/app')}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="text-purple-600" />
              Admin Portal
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage users and platform access</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-800/30">
            <div className="flex items-center gap-2">
              <Users className="text-gray-400" size={20} />
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {users.length} Users Total
              </span>
            </div>
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by email, phone, or ID..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all dark:text-white"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center text-gray-400 gap-3">
                <Loader2 className="animate-spin" size={32} />
                <p>Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                No users found matching your search.
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="px-6 py-4 font-medium">User ID</th>
                    <th className="px-6 py-4 font-medium">Contact</th>
                    <th className="px-6 py-4 font-medium">Credits</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Role Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-gray-500 dark:text-gray-400">
                          {user.id.substring(0, 8)}...{user.id.substring(user.id.length - 4)}
                        </div>
                        <div className="text-[11px] flex items-center gap-1 mt-1 text-gray-400">
                          <Calendar size={12} />
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.email && (
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-gray-400" />
                            <span className={user.is_email_verified ? 'text-gray-900 dark:text-white' : 'text-gray-500'}>
                              {user.email}
                            </span>
                            {user.is_email_verified && <CheckCircle2 size={12} className="text-green-500" />}
                          </div>
                        )}
                        {user.phone_number && (
                          <div className="flex items-center gap-2 mt-1">
                            <Phone size={14} className="text-gray-400" />
                            <span className={user.is_phone_verified ? 'text-gray-900 dark:text-white' : 'text-gray-500'}>
                              {user.phone_number}
                            </span>
                            {user.is_phone_verified && <CheckCircle2 size={12} className="text-green-500" />}
                          </div>
                        )}
                        {!user.email && !user.phone_number && (
                          <span className="text-gray-400 italic">No contact info</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Coins size={14} className={user.credits > 0 ? "text-yellow-500" : "text-gray-400"} />
                          {user.credits.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {user.is_admin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                            <Shield size={12} /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                            User
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => toggleAdmin(user.id, user.is_admin)}
                          disabled={updating === user.id}
                          className={`
                            inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border
                            ${user.is_admin 
                              ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30 dark:hover:bg-red-500/20' 
                              : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 dark:hover:bg-emerald-500/20'}
                            disabled:opacity-50 disabled:cursor-not-allowed
                          `}
                        >
                          {updating === user.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : user.is_admin ? (
                            <>Revoke Admin <ShieldOff size={16} /></>
                          ) : (
                            <>Make Admin <Shield size={16} /></>
                          )}
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          disabled={updating === user.id}
                          className="ml-2 inline-flex items-center justify-center p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 border border-transparent hover:border-red-200 dark:hover:border-red-500/30 transition-all disabled:opacity-50"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
