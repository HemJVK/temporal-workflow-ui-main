import { useState, useRef, useEffect } from 'react';
import {
  X, Bot, Save, Sparkles, Send, ChevronRight,
  Settings, FileText, Wrench, Loader2, Check, RefreshCw
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
interface Agent {
  id?: string;
  name: string;
  description: string;
  systemPrompt: string;
  modelName: string;
  tools: string[];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AgentBuilderModalProps {
  agent?: Agent;
  onClose: () => void;
  onSaved: (agent: Agent) => void;
}

const AVAILABLE_MODELS = [
  { value: 'google/gemini-2.0-flash-lite-preview-02-05:free', label: '🟢 Gemini 2.0 Flash Lite (OpenRouter Free) ⭐' },
  { value: 'meta-llama/llama-3.3-70b-instruct:free', label: '🟢 Llama 3.3 70B (OpenRouter Free) ⭐' },
  { value: 'nvidia/nemotron-3-super-120b-a12b:free', label: '🟢 Nemotron 120B (OpenRouter Free)' },
  { value: 'meta-llama/llama-4-scout:free', label: '🟢 Llama 4 Scout (OpenRouter Free)' },
  { value: 'meta-llama/llama-4-maverick:free', label: '🟢 Llama 4 Maverick (OpenRouter Free)' },
  { value: 'deepseek/deepseek-r1:free', label: '🟢 DeepSeek R1 (OpenRouter Free)' },
  { value: 'gpt-4o', label: 'OpenAI GPT-4o' },
  { value: 'gpt-4o-mini', label: 'OpenAI GPT-4o Mini' },
  { value: 'claude-3-5-sonnet-20240620', label: 'Claude 3.5 Sonnet' },
  { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
  { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
  { value: 'llama3-70b-8192', label: 'Llama 3 70B (Groq)' },
];

const AVAILABLE_TOOLS = [
  { id: 'web_search', label: 'Web Search', description: 'Search the web for information' },
  { id: 'http_call', label: 'HTTP Calls', description: 'Make HTTP requests to external APIs' },
  { id: 'db_query', label: 'Database Query', description: 'Query PostgreSQL databases' },
  { id: 'send_email', label: 'Send Email', description: 'Send emails via SendGrid or Gmail' },
  { id: 'send_sms', label: 'Send SMS', description: 'Send SMS via Twilio' },
  { id: 'code_runner', label: 'Code Runner', description: 'Execute code snippets' },
];

type TabType = 'general' | 'instructions' | 'tools';

// ── Component ──────────────────────────────────────────────────────────────
export default function AgentBuilderModal({ agent, onClose, onSaved }: AgentBuilderModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [draft, setDraft] = useState<Agent>({
    name: agent?.name ?? 'New Agent',
    description: agent?.description ?? '',
    systemPrompt: agent?.systemPrompt ?? '',
    modelName: agent?.modelName ?? 'google/gemini-2.0-flash-lite-preview-02-05:free',
    tools: agent?.tools ?? [],
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Helper chat state
  const [showHelperChat, setShowHelperChat] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [draftedConfig, setDraftedConfig] = useState<Record<string, unknown> | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // ── Save ────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!draft.name.trim()) return;
    setSaving(true);
    try {
      const url = agent?.id ? `/api/agents/${agent.id}` : '/api/agents';
      const method = agent?.id ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error('Failed to save agent');
      const saved = await res.json() as Agent;
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSaved(saved);
    } catch (e) {
      console.error(e);
      alert('❌ Failed to save agent');
    } finally {
      setSaving(false);
    }
  };

  // ── Helper Chat ──────────────────────────────────────────────────────────
  const sendChatMessage = async (msg?: string) => {
    const message = msg ?? chatInput.trim();
    if (!message) return;
    setChatInput('');
    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: message }];
    setChatHistory(newHistory);
    setChatLoading(true);
    try {
      const res = await fetch('/api/agents/helper-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history: chatHistory }),
      });
      const data = await res.json() as { reply: string; agentConfig?: Record<string, unknown> };
      setChatHistory([...newHistory, { role: 'assistant', content: data.reply }]);
      if (data.agentConfig) {
        setDraftedConfig(data.agentConfig);
      }
    } catch {
      setChatHistory([...newHistory, { role: 'assistant', content: '❌ Error connecting to the Agent Helper. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const applyDraftedConfig = () => {
    if (!draftedConfig) return;
    setDraft(prev => ({
      ...prev,
      name: (draftedConfig.name as string) || prev.name,
      description: (draftedConfig.description as string) || prev.description,
      systemPrompt: (draftedConfig.systemPrompt as string) || prev.systemPrompt,
      modelName: (draftedConfig.modelName as string) || prev.modelName,
    }));
    setShowHelperChat(false);
    setActiveTab('instructions');
  };

  const resetHelperChat = () => {
    setChatHistory([]);
    setDraftedConfig(null);
    setChatInput('');
  };

  const toggleTool = (toolId: string) => {
    setDraft(prev => ({
      ...prev,
      tools: prev.tools.includes(toolId)
        ? prev.tools.filter(t => t !== toolId)
        : [...prev.tools, toolId],
    }));
  };

  // ── Render ───────────────────────────────────────────────────────────────
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General', icon: <Settings size={15} /> },
    { id: 'instructions', label: 'Instructions', icon: <FileText size={15} /> },
    { id: 'tools', label: 'Tools', icon: <Wrench size={15} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
              <Bot size={18} className="text-purple-400" />
            </div>
            <div>
              <input
                className="bg-transparent text-white font-semibold text-lg leading-tight focus:outline-none focus:border-b focus:border-purple-500 transition-colors"
                value={draft.name}
                onChange={e => setDraft(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Agent Name"
              />
              <p className="text-xs text-gray-500 mt-0.5">Configure your agent's capabilities</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-all shadow-md disabled:opacity-60"
            >
              {saved ? <Check size={15} /> : saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-gray-800 bg-gray-900/40 shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-purple-500 text-purple-400 bg-purple-500/5'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/40'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Panel */}
          <div className={`flex flex-col p-6 overflow-y-auto transition-all ${showHelperChat ? 'w-1/2' : 'w-full'}`}>
            {activeTab === 'general' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Model</label>
                  <select
                    value={draft.modelName}
                    onChange={e => setDraft(prev => ({ ...prev, modelName: e.target.value }))}
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                  >
                    {AVAILABLE_MODELS.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Description</label>
                  <textarea
                    value={draft.description}
                    onChange={e => setDraft(prev => ({ ...prev, description: e.target.value }))}
                    rows={6}
                    placeholder="Describe what this agent does..."
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none placeholder-gray-600"
                  />
                </div>
              </div>
            )}

            {activeTab === 'instructions' && (
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">System Prompt</label>
                  <button
                    onClick={() => {
                      setShowHelperChat(!showHelperChat);
                      if (!showHelperChat && chatHistory.length === 0) {
                        // Auto-start the conversation
                        sendChatMessage("Hi, I need help creating an agent system prompt.");
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 border border-purple-500/30 text-purple-400 hover:bg-purple-600/30 text-xs font-medium transition-all"
                  >
                    <Sparkles size={13} />
                    {showHelperChat ? 'Hide AI Helper' : '✨ Draft with AI'}
                  </button>
                </div>
                <textarea
                  value={draft.systemPrompt}
                  onChange={e => setDraft(prev => ({ ...prev, systemPrompt: e.target.value }))}
                  className="flex-1 min-h-[300px] w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none placeholder-gray-600 font-mono"
                  placeholder="You are a helpful assistant that..."
                />
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 mb-4">Enable tools to give your agent extra capabilities</p>
                {AVAILABLE_TOOLS.map(tool => (
                  <div
                    key={tool.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-gray-800 bg-gray-900/50 hover:border-gray-700 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{tool.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{tool.description}</p>
                    </div>
                    <button
                      onClick={() => toggleTool(tool.id)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        draft.tools.includes(tool.id) ? 'bg-purple-600' : 'bg-gray-700'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          draft.tools.includes(tool.id) ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Helper Chat Panel */}
          {showHelperChat && (
            <div className="w-1/2 border-l border-gray-800 flex flex-col bg-gray-950">
              {/* Chat Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/60 shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-purple-400" />
                  <span className="text-sm font-medium text-white">System Prompt Helper</span>
                </div>
                <div className="flex items-center gap-1">
                  {draftedConfig && (
                    <button
                      onClick={applyDraftedConfig}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-600/20 border border-green-500/30 text-green-400 text-xs font-medium hover:bg-green-600/30 transition-all"
                    >
                      <Check size={12} /> Use this config
                    </button>
                  )}
                  <button onClick={resetHelperChat} className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors" title="Reset chat">
                    <RefreshCw size={13} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatHistory.length === 0 && (
                  <div className="text-center py-8">
                    <Sparkles size={32} className="mx-auto text-purple-500/40 mb-3" />
                    <p className="text-gray-500 text-sm">AI is thinking...</p>
                  </div>
                )}
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-full bg-purple-600/30 border border-purple-500/30 flex items-center justify-center mr-2 mt-1 shrink-0">
                        <Bot size={12} className="text-purple-400" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-purple-600 text-white rounded-br-sm'
                          : 'bg-gray-800 text-gray-200 rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="w-6 h-6 rounded-full bg-purple-600/30 border border-purple-500/30 flex items-center justify-center mr-2 mt-1">
                      <Bot size={12} className="text-purple-400" />
                    </div>
                    <div className="bg-gray-800 px-3 py-2 rounded-xl rounded-bl-sm">
                      <Loader2 size={14} className="animate-spin text-gray-400" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-gray-800 shrink-0">
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors placeholder-gray-600"
                    placeholder="Describe your agent..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }}
                    disabled={chatLoading}
                  />
                  <button
                    onClick={() => sendChatMessage()}
                    disabled={chatLoading || !chatInput.trim()}
                    className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors disabled:opacity-50"
                  >
                    {chatLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-2 text-center">Answer a few questions — the AI will draft your system prompt</p>
              </div>
            </div>
          )}
        </div>

        {/* Chevron hint for instructions tab */}
        {activeTab !== 'instructions' && (
          <div className="px-6 py-3 border-t border-gray-800 bg-gray-900/30 shrink-0">
            <button
              onClick={() => setActiveTab('instructions')}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-400 transition-colors"
            >
              <Sparkles size={12} /> Switch to Instructions to draft a system prompt with AI <ChevronRight size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
