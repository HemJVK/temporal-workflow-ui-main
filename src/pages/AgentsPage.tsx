import { useState, useEffect } from 'react';
import { Bot, Plus, Pencil, Trash2, Loader2, Cpu, ArrowLeft } from 'lucide-react';
import AgentBuilderModal from '../components/AgentBuilderModal';

interface Agent {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  modelName: string;
  tools: string[];
  createdAt: string;
  updatedAt: string;
}

interface AgentsPageProps {
  onBack: () => void;
}

export default function AgentsPage({ onBack }: AgentsPageProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | undefined>();

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agents');
      const data = await res.json() as Agent[];
      setAgents(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAgents(); }, []);

  const deleteAgent = async (id: string) => {
    if (!confirm('Delete this agent?')) return;
    await fetch(`/api/agents/${id}`, { method: 'DELETE' });
    await fetchAgents();
  };

  const handleSaved = () => {
    setShowBuilder(false);
    setEditingAgent(undefined);
    fetchAgents();
  };

  const openNew = () => { setEditingAgent(undefined); setShowBuilder(true); };
  const openEdit = (agent: Agent) => { setEditingAgent(agent); setShowBuilder(true); };

  return (
    <div className="fixed inset-0 z-40 bg-gray-950 flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-gray-800 bg-gray-900 flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
            <Bot size={16} className="text-purple-400" />
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg">Agents</h1>
            <p className="text-xs text-gray-500">Manage your AI agents</p>
          </div>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition-all shadow-md shadow-purple-900/30"
        >
          <Plus size={16} /> New Agent
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex justify-center pt-20">
            <Loader2 size={32} className="animate-spin text-purple-500" />
          </div>
        ) : agents.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-24 gap-4">
            <div className="w-20 h-20 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center">
              <Bot size={40} className="text-purple-500/40" />
            </div>
            <h2 className="text-gray-300 text-xl font-semibold">No agents yet</h2>
            <p className="text-gray-500 text-sm">Create your first AI agent to get started</p>
            <button
              onClick={openNew}
              className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition-all"
            >
              <Plus size={16} /> Create your first agent
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map(agent => (
              <div
                key={agent.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-3 hover:border-gray-700 transition-colors group"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                      <Bot size={18} className="text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm leading-tight">{agent.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Cpu size={11} className="text-gray-600" />
                        <span className="text-xs text-gray-500">{agent.modelName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEdit(agent)}
                      className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-purple-400 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => deleteAgent(agent.id)}
                      className="p-1.5 rounded-lg hover:bg-red-900/30 text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                  {agent.description || 'No description provided.'}
                </p>

                {/* Tools */}
                {agent.tools.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {agent.tools.slice(0, 3).map(t => (
                      <span key={t} className="px-2 py-0.5 bg-gray-800 border border-gray-700 text-gray-400 text-xs rounded-full">
                        {t.replace('_', ' ')}
                      </span>
                    ))}
                    {agent.tools.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-800 border border-gray-700 text-gray-500 text-xs rounded-full">
                        +{agent.tools.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="pt-1 border-t border-gray-800">
                  <button
                    onClick={() => openEdit(agent)}
                    className="w-full text-center text-xs text-gray-600 hover:text-purple-400 transition-colors py-1"
                  >
                    Edit configuration →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showBuilder && (
        <AgentBuilderModal
          agent={editingAgent}
          onClose={() => { setShowBuilder(false); setEditingAgent(undefined); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
