import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TotpSetup() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { email?: string; qrCodeUrl?: string } | null;

  if (!state?.email || !state?.qrCodeUrl) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <p className="text-red-400 mb-4">Invalid setup state. Please start over.</p>
        <button onClick={() => navigate('/login')} className="text-purple-400 hover:text-purple-300">
          Go back to Login
        </button>
      </div>
    );
  }

  const { email, qrCodeUrl } = state;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Code must be 6 digits');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/totp/verify-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Verification failed');
      }

      // Automatically log them in by redirecting them back to login to use the flow?
      // Actually, we could just log them in here if verify-setup returned a token, 
      // but let's redirect them to login page to sign in with their new TOTP.
      navigate('/login', { state: { message: 'Authenticator setup complete! You can now log in.' } });
    } catch (err: any) {
      setError(err.message || 'Invalid code. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] opacity-40 mix-blend-screen pointer-events-none" />

      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl relative z-10 shadow-2xl shadow-purple-500/10 hover:border-purple-500/30 transition-colors">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <Zap size={24} className="text-white fill-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Agent Flow</span>
        </Link>

        <h2 className="text-2xl font-bold mb-2 text-center text-white flex justify-center items-center gap-2">
          <ShieldCheck className="text-purple-400" /> Secure Your Account
        </h2>
        <p className="text-gray-400 mb-6 text-center text-sm">
          Scan the QR code with Google Authenticator, Microsoft Authenticator, or Authy.
        </p>

        {error && <div className="mb-4 text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-500/20 text-center">{error}</div>}

        <div className="flex justify-center mb-6 bg-white p-4 rounded-xl shadow-inner w-max mx-auto">
          <img src={qrCodeUrl} alt="Authenticator QR Code" className="w-48 h-48" />
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 text-center">
              Enter 6-digit code from your app
            </label>
            <input 
              type="text" 
              required 
              value={code} 
              onChange={e => setCode(e.target.value.replace(/\D/g, ''))} 
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-white text-center text-2xl tracking-[1em] transition-all" 
              placeholder="000000"
              maxLength={6}
            />
          </div>

          <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold flex items-center justify-center gap-2 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all">
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Verify & Enable'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}
