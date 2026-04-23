import { useState, useRef, useEffect } from 'react';
import { Zap, X, Send, Loader2, Sparkles, MessageSquare, ChevronDown, ChevronUp, Bot } from 'lucide-react';
import { getToken } from '../utils/auth';

interface WorkflowHelperPanelProps {
  onLoadWorkflow: (data: Record<string, unknown>) => void;
}

interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
}

type Mode = 'generate' | 'chat';

const EXAMPLE_PROMPTS = [
  'Fetch data from API and email results',
  'Loop over users and send SMS',
  'Run LLM on webhook data and store in DB',
  'Daily cron to check DB and Slack alert',
];

export default function WorkflowHelperPanel({ onLoadWorkflow }: WorkflowHelperPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('chat');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Chat state
  const [chatHistory, setChatHistory] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen, mode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // ── One-shot generation ─────────────────────────────────────────────────────
  const generateWorkflow = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setError(null);
    setLastResult(null);
    try {
      const token = getToken();
      const res = await fetch('/api/workflow-helper/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ description }),
      });
      if (!res.ok) {
        const errText = await res.text();
        let errData;
        try { errData = JSON.parse(errText); } catch { /* ignore */ }
        throw new Error(errData?.message || errText || `Server error: ${res.statusText}`);
      }
      const data = await res.json() as Record<string, unknown>;
      if (data.error) throw new Error(String(data.error));
      if (!data.nodes) throw new Error('No nodes returned');

      setLastResult(`Generated "${data.name || 'workflow'}" with ${(data.nodes as unknown[]).length} node(s)`);
      onLoadWorkflow(data);
      setDescription('');
      setTimeout(() => setIsOpen(false), 2000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to generate workflow');
    } finally {
      setLoading(false);
    }
  };

  // ── Chat mode ───────────────────────────────────────────────────────────────
  const sendChat = async (msgOverride?: string) => {
    const message = msgOverride ?? chatInput.trim();
    if (!message) return;

    const newHistory: ChatMsg[] = [...chatHistory, { role: 'user', content: message }];
    setChatHistory(newHistory);
    setChatInput('');
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      const res = await fetch('/api/workflow-helper/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message, history: chatHistory }),
      });

      if (!res.ok) {
        const errText = await res.text();
        let errData;
        try { errData = JSON.parse(errText); } catch { /* ignore */ }
        throw new Error(errData?.message || errText || `Server error: ${res.statusText}`);
      }

      const data = await res.json() as { reply: string; workflowData?: Record<string, unknown>; remainingCredits?: number };

      // Add assistant reply (strip the json block for display)
      const displayReply = data.reply.replace(/```workflow-json[\s\S]*?```/g, '✅ *Workflow generated — loading on canvas…*').trim();
      setChatHistory(prev => [...prev, { role: 'assistant', content: displayReply }]);

      // If workflow JSON was embedded, load it
      if (data.workflowData?.nodes) {
        onLoadWorkflow(data.workflowData);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to chat');
      setChatHistory(prev => [...prev, { role: 'assistant', content: '❌ Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-2">
      {/* Expanded Panel */}
      {isOpen && (
        <div className="bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl w-96 overflow-hidden flex flex-col"
             style={{ maxHeight: '520px' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-900/80 border-b border-gray-800 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                <Sparkles size={12} className="text-yellow-400" />
              </div>
              <span className="text-white text-sm font-semibold">Workflow Helper</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Mode toggle */}
              <div className="flex bg-gray-800 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setMode('chat')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${mode === 'chat' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <MessageSquare size={10} /> Chat
                </button>
                <button
                  onClick={() => setMode('generate')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${mode === 'generate' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Zap size={10} /> Quick
                </button>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>

          {/* ── Chat Mode ─────────────────────────────────────────────────────── */}
          {mode === 'chat' && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
                {chatHistory.length === 0 && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot size={12} className="text-purple-400" />
                      </div>
                      <div className="bg-gray-900 rounded-xl rounded-tl-sm px-3 py-2 text-xs text-gray-300 leading-relaxed">
                        Hi! I'm your workflow architect. Tell me what you want to automate and I'll design it for you — step by step.
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pl-8">
                      {EXAMPLE_PROMPTS.map(p => (
                        <button
                          key={p}
                          onClick={() => sendChat(p)}
                          className="text-xs px-2 py-1 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-colors text-left"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot size={12} className="text-purple-400" />
                      </div>
                    )}
                    <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white rounded-tr-sm'
                        : 'bg-gray-900 text-gray-300 rounded-tl-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                      <Bot size={12} className="text-purple-400" />
                    </div>
                    <div className="bg-gray-900 rounded-xl rounded-tl-sm px-3 py-2">
                      <Loader2 size={12} className="animate-spin text-purple-400" />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="text-red-400 text-xs bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-gray-800 shrink-0">
                <div className="flex gap-2 items-end">
                  <textarea
                    ref={inputRef}
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    rows={2}
                    placeholder="Describe your workflow idea..."
                    className="flex-1 bg-gray-900 border border-gray-700 text-white text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500 transition-colors resize-none placeholder-gray-600"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendChat();
                      }
                    }}
                  />
                  <button
                    onClick={() => sendChat()}
                    disabled={loading || !chatInput.trim()}
                    className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all disabled:opacity-50 shrink-0"
                  >
                    <Send size={14} />
                  </button>
                </div>
                {chatHistory.length > 0 && (
                  <button
                    onClick={() => { setChatHistory([]); setError(null); }}
                    className="mt-1.5 text-xs text-gray-600 hover:text-gray-400 transition-colors"
                  >
                    Clear chat
                  </button>
                )}
              </div>
            </>
          )}

          {/* ── Quick Generate Mode ────────────────────────────────────────────── */}
          {mode === 'generate' && (
            <div className="p-4 space-y-3">
              <p className="text-xs text-gray-500">
                Describe a workflow and I'll instantly generate it on the canvas.
              </p>

              <div className="flex flex-wrap gap-1.5">
                {EXAMPLE_PROMPTS.map(example => (
                  <button
                    key={example}
                    onClick={() => setDescription(example)}
                    className="text-xs px-2 py-1 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-colors text-left"
                  >
                    {example}
                  </button>
                ))}
              </div>

              <textarea
                ref={inputRef}
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder="e.g. When a webhook fires, call an API, then send an email..."
                className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-purple-500 transition-colors resize-none placeholder-gray-600"
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) generateWorkflow();
                }}
              />

              {error && (
                <div className="text-red-400 text-xs bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">
                  ❌ {error}
                </div>
              )}
              {lastResult && (
                <div className="text-green-400 text-xs bg-green-900/20 border border-green-800/40 rounded-lg px-3 py-2">
                  ✅ {lastResult}
                </div>
              )}

              <button
                onClick={generateWorkflow}
                disabled={loading || !description.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-all disabled:opacity-50 shadow-md"
              >
                {loading ? (
                  <><Loader2 size={15} className="animate-spin" /> Generating...</>
                ) : (
                  <><Zap size={15} fill="currentColor" /> Generate Workflow</>
                )}
              </button>
              <p className="text-center text-xs text-gray-600">⌘+Enter to generate</p>
            </div>
          )}
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl transition-all font-medium text-sm ${
          isOpen
            ? 'bg-gray-900 text-gray-300 border border-gray-700 hover:bg-gray-800'
            : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-400 hover:to-orange-400 shadow-yellow-900/30'
        }`}
      >
        <Sparkles size={16} />
        <span>Workflow AI</span>
        {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>
    </div>
  );
}
