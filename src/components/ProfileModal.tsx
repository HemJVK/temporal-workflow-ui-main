import { useNavigate } from 'react-router-dom';
import { X, LogOut, Phone, Mail, Award, ShieldCheck } from 'lucide-react';
import { getAuthUser, setAuthUser, setToken } from '../utils/auth';

interface Props {
  onClose: () => void;
  onOpenPhonePrompt: () => void;
}

export default function ProfileModal({ onClose, onOpenPhonePrompt }: Props) {
  const user = getAuthUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken('');
    setAuthUser(null);
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-md rounded-2xl shadow-2xl relative overflow-hidden transition-all">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex flex-col items-center justify-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors bg-black/20 rounded-full p-1.5 focus:outline-none focus:ring-2 focus:ring-white/50">
             <X size={18} />
          </button>
          
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full border-4 border-white/30 flex items-center justify-center shadow-lg mb-3">
             <span className="text-3xl font-bold text-white tracking-widest uppercase">
               {user.email.substring(0, 2)}
             </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">{user.email}</h2>
          {user.sso_id && (
            <span className="mt-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={12} /> Google Identity
            </span>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-6">
          <div className="space-y-4">
             <div className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10">
               <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <Mail size={18} />
               </div>
               <div className="flex-1">
                 <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Email Address</p>
                 <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.email}</p>
               </div>
             </div>

             <div className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10">
               <div className="p-2 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg">
                  <Phone size={18} />
               </div>
               <div className="flex-1 flex items-center justify-between">
                 <div>
                   <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Mobile Number</p>
                   <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {user.phone_number || <span className="text-gray-400 italic font-normal">Not provided</span>}
                   </p>
                 </div>
                 {!user.phone_number && (
                   <button 
                     onClick={() => { onClose(); onOpenPhonePrompt(); }}
                     className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/20 px-3 py-1.5 rounded-lg hover:bg-green-200 dark:hover:bg-green-500/30 transition-colors"
                   >
                     Add (+30 Credits)
                   </button>
                 )}
               </div>
             </div>

             <div className="flex items-center gap-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-4 rounded-xl border border-amber-200/50 dark:border-amber-700/30">
               <div className="p-2 bg-amber-200 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-lg">
                  <Award size={18} />
               </div>
               <div className="flex-1">
                 <p className="text-xs text-amber-700/80 dark:text-amber-500/80 font-medium uppercase tracking-wider">Available Credits</p>
                 <div className="flex items-baseline gap-1 mt-0.5">
                    <p className="text-2xl font-black text-amber-700 dark:text-amber-400">{user.credits}</p>
                    <span className="text-xs font-bold text-amber-600/50 dark:text-amber-500/50">/ month</span>
                 </div>
               </div>
             </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
             <button 
               onClick={handleLogout}
               className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-red-500/20 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 dark:hover:bg-red-500/20 hover:bg-red-100 hover:border-red-500/30 transition-all font-bold text-sm"
             >
               <LogOut size={18} /> Sign Out securely
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
