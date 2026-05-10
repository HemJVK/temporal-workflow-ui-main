import React, { useState, useEffect, useRef } from 'react';
import { Phone, ArrowRight, Loader2, MessageSquare } from 'lucide-react';
import { setupRecaptcha, requestPhoneOtp } from '../utils/firebase';
import { setToken, setAuthUser } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { RecaptchaVerifier } from 'firebase/auth';

export default function FirebasePhoneLogin() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const verifierRef = useRef<RecaptchaVerifier | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize reCAPTCHA
    const verifier = setupRecaptcha('recaptcha-container');
    verifierRef.current = verifier;
    return () => {
      verifier.clear();
    };
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!verifierRef.current) throw new Error('reCAPTCHA not initialized');
      const result = await requestPhoneOtp(phone, verifierRef.current);
      setConfirmationResult(result);
      setStep('code');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await confirmationResult.confirm(code);
      const idToken = await userCredential.user.getIdToken();

      // Send to backend
      const res = await fetch('/api/auth/firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: idToken }),
      });

      if (!res.ok) throw new Error('Backend verification failed');
      
      const data = await res.json();
      setToken(data.access_token);
      setAuthUser(data.user);
      navigate('/app');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <div className="text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-500/20 text-center">{error}</div>}
      
      <div id="recaptcha-container"></div>

      {step === 'phone' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number (with +country code)</label>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="tel" 
                required 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-white transition-all placeholder:text-gray-500" 
                placeholder="+1 234 567 8900" 
              />
            </div>
          </div>
          <button disabled={loading} type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center justify-center gap-2 py-3 rounded-xl transition-all shadow-lg shadow-purple-500/20">
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Send OTP'}
            {!loading && <MessageSquare size={18} />}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Verification Code</label>
            <input 
              type="text" 
              required 
              value={code} 
              onChange={e => setCode(e.target.value)} 
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-white text-center text-2xl tracking-[1em] transition-all" 
              placeholder="000000"
              maxLength={6}
            />
          </div>
          <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold flex items-center justify-center gap-2 py-3 rounded-xl transition-all">
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Verify & Log In'}
            {!loading && <ArrowRight size={18} />}
          </button>
          <button type="button" onClick={() => setStep('phone')} className="w-full text-sm text-gray-500 hover:text-white transition-colors py-2">
            Change phone number
          </button>
        </form>
      )}
    </div>
  );
}
