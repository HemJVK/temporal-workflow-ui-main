import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Zap, ArrowRight, Loader2, Eye, EyeOff,
  Phone, MessageSquare, ShieldCheck, Mail, KeyRound,
} from 'lucide-react';
import { setToken, setAuthUser } from '../utils/auth';
import {
  setupRecaptcha, requestPhoneOtp,
  signInWithGoogle, signInWithGithub,
} from '../utils/firebase';
import { RecaptchaVerifier } from 'firebase/auth';

// Google & GitHub SVG brand icons
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const GithubIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

type Tab = 'phone' | 'email' | 'totp';
type PhoneStep = 'enter' | 'verify';

export default function Login() {
  const [tab, setTab] = useState<Tab>('phone');

  // Email/password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // TOTP
  const [totpEmail, setTotpEmail] = useState('');
  const [totpCode, setTotpCode] = useState('');

  // Phone (Firebase)
  const [phoneStep, setPhoneStep] = useState<PhoneStep>('enter');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const verifierRef = useRef<RecaptchaVerifier | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if ((location.state as any)?.message) setError((location.state as any).message);
  }, [location.state]);

  // Initialise invisible reCAPTCHA when the phone tab is active
  useEffect(() => {
    if (tab === 'phone' && phoneStep === 'enter') {
      const v = setupRecaptcha('recaptcha-login');
      verifierRef.current = v;
      return () => { try { v.clear(); } catch { /**/ } };
    }
  }, [tab, phoneStep]);

  // ── Common: finalize login after backend issues JWT ──────────────────────
  const finish = (token: string, user: any) => {
    setToken(token);
    setAuthUser(user);
    navigate('/app');
  };

  // ── Backend exchange helper ──────────────────────────────────────────────
  const exchangeFirebaseToken = async (idToken: string, endpoint = '/api/auth/firebase') => {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: idToken }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.message || 'Authentication failed');
    }
    return res.json();
  };

  // ── Phone: send OTP ──────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!verifierRef.current) throw new Error('reCAPTCHA not ready — please refresh');
      const result = await requestPhoneOtp(phone, verifierRef.current);
      setConfirmationResult(result);
      setPhoneStep('verify');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // ── Phone: verify OTP ────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const credential = await confirmationResult.confirm(otp);
      const idToken = await credential.user.getIdToken();
      const data = await exchangeFirebaseToken(idToken);
      finish(data.access_token, data.user);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // ── Email/password ───────────────────────────────────────────────────────
  const handleEmailLogin = async (e: React.FormEvent) => {
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
      finish(data.access_token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── TOTP ─────────────────────────────────────────────────────────────────
  const handleTotpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/totp/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: totpEmail, code: totpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Invalid code');
      finish(data.access_token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Google (Firebase popup) ──────────────────────────────────────────────
  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      const { idToken } = await signInWithGoogle();
      const data = await exchangeFirebaseToken(idToken, '/api/auth/firebase');
      finish(data.access_token, data.user);
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  // ── GitHub (Firebase popup) ──────────────────────────────────────────────
  const handleGithub = async () => {
    setLoading(true);
    setError('');
    try {
      const { idToken } = await signInWithGithub();
      const data = await exchangeFirebaseToken(idToken, '/api/auth/firebase');
      finish(data.access_token, data.user);
    } catch (err: any) {
      setError(err.message || 'GitHub sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    setError('');
    setPhoneStep('enter');
    setOtp('');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-10 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
            <Zap size={22} className="text-white fill-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Agent Flow</span>
        </Link>

        {/* Card */}
        <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-7 backdrop-blur-xl shadow-2xl shadow-black/40">

          {/* Invisible reCAPTCHA anchor */}
          <div id="recaptcha-login" />

          {/* Tab bar */}
          <div className="flex bg-black/40 p-1 rounded-2xl mb-7 gap-0.5">
            {([
              { id: 'phone', icon: <Phone size={13} />, label: 'Mobile' },
              { id: 'email', icon: <Mail size={13} />, label: 'Email' },
              { id: 'totp',  icon: <KeyRound size={13} />, label: 'Auth App' },
            ] as { id: Tab; icon: React.ReactNode; label: string }[]).map((t) => (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  tab === t.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
              {error}
            </div>
          )}

          {/* ── PHONE TAB ─────────────────────────────────────────────────── */}
          {tab === 'phone' && phoneStep === 'enter' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="flex flex-col items-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-purple-600/15 border border-purple-500/25 flex items-center justify-center mb-3">
                  <Phone size={26} className="text-purple-400" />
                </div>
                <h2 className="text-xl font-bold">Sign in with Mobile</h2>
                <p className="text-gray-500 text-xs mt-1 text-center">We'll send a one-time code via SMS</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Phone number</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-xl hover:shadow-[0_0_24px_rgba(147,51,234,0.35)] transition-all disabled:opacity-60 text-sm"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <><MessageSquare size={16} /> Send OTP</>}
              </button>
            </form>
          )}

          {tab === 'phone' && phoneStep === 'verify' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex flex-col items-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-green-600/15 border border-green-500/25 flex items-center justify-center mb-3">
                  <ShieldCheck size={26} className="text-green-400" />
                </div>
                <h2 className="text-xl font-bold">Enter the Code</h2>
                <p className="text-gray-500 text-xs mt-1 text-center">
                  Sent to <span className="text-white font-medium">{phone}</span>
                </p>
              </div>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="— — — — — —"
                autoFocus
                className="w-full px-4 py-4 text-center text-3xl tracking-[0.65em] font-mono bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 rounded-xl hover:shadow-[0_0_24px_rgba(34,197,94,0.35)] transition-all disabled:opacity-50 text-sm"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <><ShieldCheck size={16} /> Verify & Sign In</>}
              </button>
              <button
                type="button"
                onClick={() => { setPhoneStep('enter'); setOtp(''); setError(''); }}
                className="w-full text-xs text-gray-600 hover:text-gray-300 transition-colors py-1"
              >
                ← Change number
              </button>
            </form>
          )}

          {/* ── EMAIL TAB ─────────────────────────────────────────────────── */}
          {tab === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-11 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-xl hover:shadow-[0_0_24px_rgba(147,51,234,0.35)] transition-all disabled:opacity-60 text-sm"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
              </button>
            </form>
          )}

          {/* ── TOTP TAB ──────────────────────────────────────────────────── */}
          {tab === 'totp' && (
            <form onSubmit={handleTotpLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={totpEmail}
                  onChange={e => setTotpEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">6-digit Authenticator Code</label>
                <input
                  type="text"
                  required
                  value={totpCode}
                  onChange={e => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  maxLength={6}
                  placeholder="000000"
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white text-center tracking-[0.4em] placeholder:text-gray-600 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-xl hover:shadow-[0_0_24px_rgba(147,51,234,0.35)] transition-all disabled:opacity-60 text-sm"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <>Verify & Sign In <ArrowRight size={16} /></>}
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!totpEmail) { setError('Enter your email first'); return; }
                  setLoading(true);
                  try {
                    const res = await fetch('/api/auth/totp/setup', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: totpEmail }),
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message || 'Failed');
                    navigate('/totp-setup', { state: { email: totpEmail, qrCodeUrl: data.qrCodeUrl } });
                  } catch (err: any) { setError(err.message); }
                  finally { setLoading(false); }
                }}
                className="w-full text-xs text-purple-400 hover:text-purple-300 transition-colors py-1"
              >
                Set up Authenticator App →
              </button>
            </form>
          )}

          {/* ── SSO Divider + Buttons ─────────────────────────────────────── */}
          <div className="mt-6 flex items-center gap-3">
            <span className="flex-1 h-px bg-white/8" />
            <span className="text-[10px] text-gray-600 uppercase tracking-widest">or</span>
            <span className="flex-1 h-px bg-white/8" />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
            >
              <GoogleIcon /> Google
            </button>
            <button
              onClick={handleGithub}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
            >
              <GithubIcon /> GitHub
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/signup" className="text-purple-400 font-medium hover:text-purple-300 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
