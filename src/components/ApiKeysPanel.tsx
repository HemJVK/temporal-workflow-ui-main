import React, { useState, useEffect } from 'react';
import { Key, Plus, Trash2, Copy, Check, AlertCircle, Loader2, Shield, X } from 'lucide-react';
import { apiClient } from '../utils/api-client';

// ── Types (matching Omni's /api/api-keys contract) ──────────────────────────────
interface APIKey {
  key_id: string;
  public_key: string;
  title: string;
  description?: string;
  status: 'active' | 'revoked' | 'expired';
  expires_at?: string;
  last_used_at?: string;
  created_at: string;
}

interface APIKeyCreateResponse extends APIKey {
  secret_key: string; // shown only on creation
}

// ── Sub-component: single key row ────────────────────────────────────────────────
function KeyRow({ apiKey, onRevoke }: { apiKey: APIKey; onRevoke: (id: string) => void }) {
  const [confirming, setConfirming] = useState(false);
  const [revoking, setRevoking] = useState(false);

  const handleRevoke = async () => {
    if (!confirming) { setConfirming(true); return; }
    setRevoking(true);
    try {
      await apiClient.patch(`/api/api-keys/${apiKey.key_id}/revoke`);
      onRevoke(apiKey.key_id);
    } catch (err) {
      console.error('Failed to revoke key', err);
    } finally {
      setRevoking(false);
      setConfirming(false);
    }
  };

  const statusColor =
    apiKey.status === 'active'
      ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      : 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';

  const dateStr = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString() : '—';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800/50 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg shrink-0">
          <Key size={16} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">{apiKey.title}</p>
          <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            {apiKey.public_key}
          </p>
          <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span>Created: {dateStr(apiKey.created_at)}</span>
            {apiKey.last_used_at && <span>Last used: {dateStr(apiKey.last_used_at)}</span>}
            {apiKey.expires_at && <span>Expires: {dateStr(apiKey.expires_at)}</span>}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${statusColor}`}>
          {apiKey.status}
        </span>
        {apiKey.status === 'active' && (
          <button
            onClick={handleRevoke}
            disabled={revoking}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              confirming
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-800'
            }`}
            title="Revoke key"
          >
            {revoking ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Trash2 size={12} />
            )}
            {confirming ? 'Confirm revoke' : 'Revoke'}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Sub-component: newly created key display ────────────────────────────────────
function NewKeyDisplay({ secretKey, onDismiss }: { secretKey: string; onDismiss: () => void }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(secretKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <div className="p-4 border border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-xl space-y-3">
      <div className="flex items-start gap-2">
        <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
          Copy this key now — it will not be shown again.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <code className="flex-1 text-xs font-mono bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-700 rounded-lg px-3 py-2 break-all text-gray-800 dark:text-gray-100 select-all">
          {secretKey}
        </code>
        <button
          onClick={copy}
          className="shrink-0 p-2 rounded-lg bg-amber-200 dark:bg-amber-700/50 hover:bg-amber-300 dark:hover:bg-amber-700 transition-colors"
        >
          {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} className="text-amber-700 dark:text-amber-300" />}
        </button>
      </div>
      <button
        onClick={onDismiss}
        className="text-xs text-amber-700 dark:text-amber-400 hover:underline"
      >
        I've saved it — dismiss
      </button>
    </div>
  );
}

// ── Create key form ─────────────────────────────────────────────────────────────
function CreateKeyForm({ onCreated }: { onCreated: (key: APIKeyCreateResponse) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [expiresInDays, setExpiresInDays] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required'); return; }
    setError('');
    setCreating(true);
    try {
      const resp = await apiClient.post<APIKeyCreateResponse>('/api/api-keys', {
        title: title.trim(),
        description: description.trim() || undefined,
        expires_in_days: expiresInDays ? parseInt(expiresInDays, 10) : undefined,
      });
      onCreated(resp);
      setTitle('');
      setDescription('');
      setExpiresInDays('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create API key');
    } finally {
      setCreating(false);
    }
  };

  return (
    <form onSubmit={handleCreate} className="p-4 border border-dashed border-indigo-300 dark:border-indigo-700 rounded-xl space-y-3 bg-indigo-50/50 dark:bg-indigo-900/10">
      <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">New API Key</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Key title (e.g. Production Bot)"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="col-span-2 sm:col-span-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="number"
          placeholder="Expires in days (optional)"
          value={expiresInDays}
          onChange={e => setExpiresInDays(e.target.value)}
          min="1"
          className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="col-span-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={creating}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
      >
        {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
        Generate Key
      </button>
    </form>
  );
}

// ── Main component ───────────────────────────────────────────────────────────────
interface ApiKeysPanelProps {
  /** Pass false when embedded inside a larger modal without its own shell */
  standalone?: boolean;
  onClose?: () => void;
}

export default function ApiKeysPanel({ standalone = false, onClose }: ApiKeysPanelProps) {
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newKey, setNewKey] = useState<APIKeyCreateResponse | null>(null);
  const [error, setError] = useState('');

  const fetchKeys = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiClient.get<APIKey[]>('/api/api-keys');
      setKeys(data);
    } catch (err) {
      setError('Could not load API keys. Make sure you are logged in and the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchKeys(); }, []);

  const handleCreated = (key: APIKeyCreateResponse) => {
    setNewKey(key);
    setShowForm(false);
    fetchKeys();
  };

  const handleRevoked = (keyId: string) => {
    setKeys(prev => prev.map(k => k.key_id === keyId ? { ...k, status: 'revoked' as const } : k));
  };

  const inner = (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-indigo-500" />
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">API Keys</span>
          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
            {keys.filter(k => k.status === 'active').length} active
          </span>
        </div>
        <button
          onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          {showForm ? <X size={12} /> : <Plus size={12} />}
          {showForm ? 'Cancel' : 'New Key'}
        </button>
      </div>

      {/* Security note */}
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
        API keys allow external services and scripts to authenticate with your workflow backend on your behalf.
        Treat them like passwords — never share or commit them to source control.
      </p>

      {/* New key alert */}
      {newKey && (
        <NewKeyDisplay
          secretKey={newKey.secret_key}
          onDismiss={() => setNewKey(null)}
        />
      )}

      {/* Create form */}
      {showForm && <CreateKeyForm onCreated={handleCreated} />}

      {/* Key list */}
      {loading ? (
        <div className="flex items-center justify-center py-10 text-gray-400">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      ) : keys.length === 0 ? (
        <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">
          <Key size={32} className="mx-auto mb-3 opacity-30" />
          No API keys yet. Create one above to get started.
        </div>
      ) : (
        <div className="space-y-2">
          {keys.map(k => <KeyRow key={k.key_id} apiKey={k} onRevoke={handleRevoked} />)}
        </div>
      )}
    </div>
  );

  if (!standalone) return inner;

  // Standalone modal shell (same style as ProfileModal)
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Key size={20} />
            <h2 className="text-lg font-bold">API Key Management</h2>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-white/70 hover:text-white bg-black/20 rounded-full p-1.5 transition-colors">
              <X size={18} />
            </button>
          )}
        </div>
        <div className="p-6">
          {inner}
        </div>
      </div>
    </div>
  );
}
