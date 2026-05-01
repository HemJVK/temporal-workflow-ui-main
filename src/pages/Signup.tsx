import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ArrowRight, Loader2, Smartphone, Gift, Eye, EyeOff } from 'lucide-react';
import { setToken, setAuthUser } from '../utils/auth';
import { GoogleLogin } from '@react-oauth/google';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifyUserId, setVerifyUserId] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, phone_number: phone || undefined }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      const data = await res.json();
      if (data.userId) {
         setVerifyUserId(data.userId);
         setError('');
      } else {
         throw new Error('Unexpected response format');
      }
    } catch (_err: any) {
      setError(_err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyUserId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: verifyUserId, code: otpCode }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'OTP Verification failed');
      }
      const data = await res.json();
      setToken(data.access_token);
      setAuthUser(data.user);
      navigate('/app');
    } catch (_err: any) {
      setError(_err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!verifyUserId || resendCooldown > 0) return;
    try {
      await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: verifyUserId }),
      });
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) { clearInterval(interval); return 0; }
          return prev - 1;
        });
      }, 1000);
      setError('OTP resent successfully!');
      setTimeout(() => setError(''), 3000);
    } catch {
      setError('Failed to resend OTP');
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
      if (!res.ok) throw new Error('Google SSO Signup failed');
      const data = await res.json();
      setToken(data.access_token);
      setAuthUser(data.user);
      navigate('/app');
    } catch (_err: any) {
      setError(_err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] opacity-40 mix-blend-screen pointer-events-none" />
      
      <div className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl relative z-10 shadow-2xl shadow-blue-500/10 hover:border-blue-500/30 transition-colors">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
            <Zap size={24} className="text-white fill-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Agent Flow</span>
        </Link>
        
        <h2 className="text-3xl font-bold mb-2 text-center text-white">Create an Account</h2>
        <p className="text-gray-400 mb-6 text-center text-sm">Join the next generation workflow builder.</p>
        
        <div className="mb-8 p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl flex items-start gap-4">
           <Gift size={24} className="text-indigo-400 mt-1 shrink-0" />
           <div>
             <h4 className="text-sm font-semibold text-white">30 Free Monthly Credits</h4>
             <p className="text-xs text-indigo-200/70 mt-1">Enroll with a mobile number today and instantly unlock 30 free credits every month for premium nodes.</p>
           </div>
        </div>

        {error && <div className="mb-4 text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-500/20 text-center">{error}</div>}

        {!verifyUserId ? (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white transition-all placeholder:text-gray-500" placeholder="you@company.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                <Smartphone size={14} className="text-indigo-400" /> Phone Number <span className="text-xs text-indigo-400/50">(Optional but recommended)</span>
              </label>
              <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white transition-all placeholder:text-gray-500" placeholder="+1 (555) 000-0000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} required value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white transition-all placeholder:text-gray-500 pr-12" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button disabled={loading} type="submit" className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all">
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Sign Up Free'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in zoom-in duration-500">
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-center mb-6">
              <p className="text-sm text-blue-200">We've sent a 6-digit verification code to your provided contact method. Check your terminal logs for the MOCK OTP.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1 text-center">Enter OTP Code</label>
              <input type="text" maxLength={6} required value={otpCode} onChange={e=>setOtpCode(e.target.value)} className="w-full px-4 py-4 text-center text-2xl tracking-[0.5em] font-mono bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white transition-all" placeholder="------" />
            </div>
            <button disabled={loading || otpCode.length !== 6} type="submit" className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex items-center justify-center gap-2 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all disabled:opacity-50">
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Verify & Continue'}
              {!loading && <Zap size={18} className="fill-white" />}
            </button>
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setVerifyUserId(null)} className="text-sm text-gray-400 hover:text-white transition-colors py-2">
                Back to Sign Up
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors py-2 disabled:opacity-50"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center gap-3">
               <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google Signup Failed')}
                  shape="pill"
               />
            </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account? <Link to="/login" className="text-blue-400 font-medium hover:text-blue-300 transition-colors">Log in</Link>
        </p>
      </div>
    </div>
  );
}
