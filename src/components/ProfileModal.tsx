import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  LogOut,
  Phone,
  Mail,
  Award,
  ShieldCheck,
  User,
  Key,
  Settings,
  Moon,
  Sun,
  Bell,
  BellOff,
} from 'lucide-react';
import { getAuthUser, setAuthUser, setToken } from '../utils/auth';
import ApiKeysPanel from './ApiKeysPanel';

interface Props {
  onClose: () => void;
  onOpenPhonePrompt: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

type Tab = 'profile' | 'api-keys' | 'preferences';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'api-keys', label: 'API Keys', icon: Key },
  { id: 'preferences', label: 'Preferences', icon: Settings },
];

// ── Profile Tab ──────────────────────────────────────────────────────────────────
function ProfileTab({ onClose, onOpenPhonePrompt, navigate }: {
  onClose: () => void;
  onOpenPhonePrompt: () => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const user = getAuthUser();
  if (!user) return null;

  const handleLogout = () => {
    setToken('');
    setAuthUser(null);
    navigate('/login');
  };

  return (
    <div className="space-y-4">
      {/* Avatar + name */}
      <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shrink-0">
          {user.email.substring(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-gray-900 dark:text-white truncate">{user.email}</p>
          {user.sso_id && (
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
              <ShieldCheck size={10} /> Google Identity
            </span>
          )}
        </div>
      </div>

      {/* Info cards */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg shrink-0">
            <Mail size={15} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Email</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg shrink-0">
              <Phone size={15} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Mobile</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {user.phone_number || <span className="text-gray-400 italic font-normal">Not provided</span>}
              </p>
            </div>
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

        {/* Credits — kept from original */}
        <div className="flex items-center gap-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-3.5 rounded-xl border border-amber-200/50 dark:border-amber-700/30">
          <div className="p-2 bg-amber-200 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-lg shrink-0">
            <Award size={15} />
          </div>
          <div>
            <p className="text-[10px] text-amber-700/70 dark:text-amber-500/70 font-medium uppercase tracking-wider">Available Credits</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-amber-700 dark:text-amber-400">{user.credits ?? 0}</span>
              <span className="text-xs font-bold text-amber-600/50 dark:text-amber-500/50">/ month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-red-500/20 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 hover:border-red-500/30 transition-all font-bold text-sm"
      >
        <LogOut size={16} /> Sign Out
      </button>
    </div>
  );
}

// ── Preferences Tab ───────────────────────────────────────────────────────────────
function PreferencesTab({ darkMode, onToggleDarkMode }: { darkMode: boolean; onToggleDarkMode: () => void }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(() =>
    localStorage.getItem('notif_enabled') !== 'false'
  );

  const toggleNotifications = () => {
    const next = !notificationsEnabled;
    setNotificationsEnabled(next);
    localStorage.setItem('notif_enabled', String(next));
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 dark:text-gray-400">These preferences are stored locally in your browser.</p>

      {/* Dark mode */}
      <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800/50 hover:shadow-sm transition-shadow">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'}`}>
            {darkMode ? <Moon size={16} /> : <Sun size={16} />}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Color Mode</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{darkMode ? 'Dark mode is on' : 'Light mode is on'}</p>
          </div>
        </div>
        <button
          onClick={onToggleDarkMode}
          className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${darkMode ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${darkMode ? 'translate-x-5' : 'translate-x-0'}`}
          />
        </button>
      </div>

      {/* Notifications */}
      <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800/50 hover:shadow-sm transition-shadow">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
            {notificationsEnabled ? <Bell size={16} /> : <BellOff size={16} />}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Workflow Notifications</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Show alerts on deploy success / failure</p>
          </div>
        </div>
        <button
          onClick={toggleNotifications}
          className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${notificationsEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`}
          />
        </button>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────────
export default function ProfileModal({ onClose, onOpenPhonePrompt, darkMode, onToggleDarkMode }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const navigate = useNavigate();
  const user = getAuthUser();
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex items-center justify-between relative">
          <div>
            <h2 className="text-lg font-bold text-white">Settings</h2>
            <p className="text-xs text-white/60">{user.email}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white bg-black/20 rounded-full p-1.5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors ${
                activeTab === id
                  ? 'border-b-2 border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400 bg-white dark:bg-gray-900'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-5 max-h-[65vh] overflow-y-auto">
          {activeTab === 'profile' && (
            <ProfileTab
              onClose={onClose}
              onOpenPhonePrompt={onOpenPhonePrompt}
              navigate={navigate}
            />
          )}
          {activeTab === 'api-keys' && <ApiKeysPanel />}
          {activeTab === 'preferences' && (
            <PreferencesTab darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} />
          )}
        </div>
      </div>
    </div>
  );
}
