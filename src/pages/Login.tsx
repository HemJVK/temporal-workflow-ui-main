import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ArrowRight, Loader2, Github } from 'lucide-react';
import { setToken, setAuthUser } from '../utils/auth';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      setToken(data.access_token);
      setAuthUser(data.user);
      navigate('/app');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSso = async (provider: string) => {
     // Mock SSO login for Github right now
     setLoading(true);
     try {
       const res = await fetch('/api/auth/sso', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ sso_id: `mock_${provider}_123`, email: `user@${provider}.com` })
       });
       if(res.ok){
         const data = await res.json();
         setToken(data.access_token);
         setAuthUser(data.user);
         navigate('/app');
       }
     } catch(e) {
         setError('SSO failed.');
     } finally {
         setLoading(false);
     }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      });
      if (!res.ok) throw new Error('Google SSO Login failed');
      const data = await res.json();
      setToken(data.access_token);
      setAuthUser(data.user);
      navigate('/app');
    } catch (err: any) {
      setError(err.message);
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
        
        <h2 className="text-3xl font-bold mb-2 text-center text-white">Welcome Back</h2>
        <p className="text-gray-400 mb-8 text-center text-sm">Enter your credentials to access your workflows.</p>

        {error && <div className="mb-4 text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-500/20 text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white transition-all placeholder:text-gray-500" placeholder="you@company.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white transition-all placeholder:text-gray-500" placeholder="••••••••" />
          </div>
          <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold flex items-center justify-center gap-2 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all">
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Log In'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
           <span className="w-full h-px bg-white/10"></span>
           <span className="shrink-0">OR CONTINUE WITH</span>
           <span className="w-full h-px bg-white/10"></span>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
           <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Login Failed')}
              shape="pill"
           />
           <button onClick={() => handleSso('github')} className="w-[80%] flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-2 rounded-full hover:bg-white/10 transition-colors text-sm font-medium">
             <Github size={18} /> Continue with Github
           </button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          Don't have an account? <Link to="/signup" className="text-purple-400 font-medium hover:text-purple-300 transition-colors">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
