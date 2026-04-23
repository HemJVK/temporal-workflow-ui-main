import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Key, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { getToken, setToken, setAuthUser } from '../utils/auth';

export default function AdminBootstrap() {
  const [passkey, setPasskey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleBootstrap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passkey.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/bootstrap-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ passkey }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success! Save new token and user info
        setToken(data.access_token);
        setAuthUser(data.user);
        
        // Redirect to admin portal
        navigate('/admin/users');
      } else {
        setError(data.message || 'Verification failed. Please check your passkey.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-purple-600/20 border border-purple-500/30 rounded-2xl flex items-center justify-center mb-4">
            <Shield size={32} className="text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Bootstrap</h1>
          <p className="text-gray-400 text-sm">
            Enter the super admin passkey to elevate your account permissions.
          </p>
        </div>

        <form onSubmit={handleBootstrap} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
              Super Admin Passkey
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter secret passkey..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 bg-red-900/20 border border-red-800/40 p-3 rounded-xl text-sm animate-shake">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !passkey.trim()}
            className="w-full flex items-center justify-center gap-2 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-900/40 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                Verify and Elevate 
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600 text-xs uppercase tracking-widest font-medium">
          Secure Authorization System
        </p>
      </div>
    </div>
  );
}
