import { useState } from 'react';
import { X, ArrowRight, Zap, Loader2, Smartphone, Gift } from 'lucide-react';
import { getToken, setAuthUser, getAuthUser } from '../utils/auth';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function PhoneEnrollmentPrompt({ onClose, onSuccess }: Props) {
  const [step, setStep] = useState<'prompt' | 'input' | 'verify'>('prompt');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/add-phone', {
        method: 'POST',
        headers: { 
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ phone }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to send OTP');
      }
      setStep('verify');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-add-phone', {
        method: 'POST',
        headers: { 
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ phone, code: otpCode }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Verification failed');
      }
      const data = await res.json();
      
      // Update local storage
      const user = getAuthUser();
      if (user) {
         user.phone_number = phone;
         user.credits = data.user.credits; // Ensure credits sync
         setAuthUser(user);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="bg-gray-900 border border-green-500/30 w-full max-w-md rounded-3xl p-8 shadow-[0_0_100px_rgba(34,197,94,0.15)] relative overflow-hidden transition-all text-center">
        {/* Abstract shapes */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-green-600/20 blur-[80px] rounded-full" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-emerald-600/20 blur-[80px] rounded-full" />
        
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-full p-2 z-20">
           <X size={20} />
        </button>

        <div className="relative z-10 flex flex-col items-center pt-2">
           {step === 'prompt' && (
             <div className="animate-in slide-in-from-bottom-4 duration-500">
               <div className="mb-6 bg-gradient-to-tr from-green-500/20 to-emerald-500/20 p-6 rounded-full border border-green-500/30 shadow-inner inline-flex">
                 <Gift size={48} className="text-green-400" />
               </div>
               <h2 className="text-3xl font-bold text-white mb-2">Claim 30 Free Credits!</h2>
               <p className="text-gray-400 leading-relaxed mb-8">
                 It looks like you logged in with Google! Link your mobile phone number securely to unlock <strong className="text-green-400">30 free Agent Flow credits</strong> every single month.
               </p>
               <button onClick={() => setStep('input')} className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all transform hover:scale-105 mb-4">
                 Add Phone Number <ArrowRight size={20} />
               </button>
               <button onClick={onClose} className="text-gray-500 text-sm hover:text-gray-300 transition-colors">
                 No thanks, I'll pass on the 30 free credits
               </button>
             </div>
           )}

           {step === 'input' && (
             <form onSubmit={handleRequestOtp} className="w-full animate-in slide-in-from-right-8 duration-500">
               <div className="mb-6 bg-white/5 p-4 rounded-full border border-white/10 shadow-inner inline-flex">
                 <Smartphone size={32} className="text-blue-400" />
               </div>
               <h2 className="text-2xl font-bold text-white mb-2">Enter Mobile Number</h2>
               <p className="text-gray-400 mb-6 text-sm">We'll send you a 6-digit verification code to confirm ownership.</p>
               
               {error && <div className="mb-4 text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
               
               <div className="text-left mb-6">
                 <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                 <input type="tel" required value={phone} onChange={e=>setPhone(e.target.value)} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white transition-all" placeholder="+1 (555) 000-0000" />
               </div>
               
               <button disabled={loading} type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all">
                 {loading ? <Loader2 size={20} className="animate-spin" /> : 'Send Verification Code'}
               </button>
             </form>
           )}

           {step === 'verify' && (
             <form onSubmit={handleVerifyOtp} className="w-full animate-in slide-in-from-right-8 duration-500">
               <div className="mb-6 bg-white/5 p-4 rounded-full border border-white/10 shadow-inner inline-flex">
                 <Zap size={32} className="text-yellow-400 fill-yellow-400/20" />
               </div>
               <h2 className="text-2xl font-bold text-white mb-2">Verify Mobile</h2>
               <p className="text-gray-400 mb-6 text-sm">Check your terminal logs for the mock OTP sent to {phone}.</p>
               
               {error && <div className="mb-4 text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
               
               <div className="mb-6">
                 <input type="text" maxLength={6} required value={otpCode} onChange={e=>setOtpCode(e.target.value)} className="w-full px-4 py-4 text-center text-2xl tracking-[0.5em] font-mono bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-white transition-all" placeholder="------" />
               </div>
               
               <button disabled={loading || otpCode.length !== 6} type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all disabled:opacity-50">
                 {loading ? <Loader2 size={20} className="animate-spin" /> : 'Confirm & Claim 30 Credits'}
               </button>
               <button type="button" onClick={() => setStep('input')} className="w-full text-sm text-gray-400 hover:text-white transition-colors py-4">
                 Back
               </button>
             </form>
           )}
        </div>
      </div>
    </div>
  );
}
