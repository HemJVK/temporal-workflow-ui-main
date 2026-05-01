import { useState, useEffect } from 'react';
import { X, Search, Plus, Code, Box, BrainCircuit, Globe, Loader2, Save, Trash, Sparkles } from 'lucide-react';
import { getToken } from '../utils/auth';

interface BlockLibraryModalProps {
  onClose: () => void;
  onRefreshSidebar: () => void;
}

interface CustomBlock {
  id: string;
  name: string;
  description: string;
  inputs: string[];
  customLogic: string;
  isPublic: boolean;
}

export default function BlockLibraryModal({ onClose, onRefreshSidebar }: BlockLibraryModalProps) {
  const [blocks, setBlocks] = useState<CustomBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editor State
  const [editingBlock, setEditingBlock] = useState<Partial<CustomBlock> | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatingAi, setGeneratingAi] = useState(false);

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/custom-blocks', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error('Failed to fetch blocks');
      setBlocks(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingBlock?.name || !editingBlock?.customLogic) return;
    setSaving(true);
    setError(null);
    try {
      const isNew = !editingBlock.id;
      const url = isNew ? '/api/custom-blocks' : `/api/custom-blocks/${editingBlock.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(editingBlock)
      });
      if (!res.ok) throw new Error('Failed to save block');
      
      setEditingBlock(null);
      await fetchBlocks();
      onRefreshSidebar();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this block?')) return;
    try {
      await fetch(`/api/custom-blocks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      await fetchBlocks();
      onRefreshSidebar();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setGeneratingAi(true);
    setError(null);
    try {
      const res = await fetch('/api/workflow-helper/generate-block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      
      if (!res.ok) throw new Error('AI Generation failed');
      const data = await res.json();
      
      setEditingBlock({
        name: data.name,
        description: data.description,
        inputs: data.inputs || [],
        customLogic: data.customLogic || '',
        isPublic: false
      });
      setAiPrompt('');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setGeneratingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex overflow-hidden border border-gray-200">
        
        {/* Left Sidebar: Block List */}
        <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Box className="text-purple-600" size={20} /> Block Library
            </h2>
            <button 
              onClick={() => setEditingBlock({ name: '', description: '', inputs: [], customLogic: '', isPublic: false })}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-600"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="p-3 border-b border-gray-200 bg-white">
             <div className="relative">
                <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search blocks..." 
                  className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gray-400" /></div>
            ) : blocks.length === 0 ? (
              <div className="text-center text-gray-500 text-sm mt-10">No custom blocks yet.</div>
            ) : (
              <div className="space-y-1">
                {blocks.map(b => (
                  <div key={b.id} onClick={() => setEditingBlock(b)} className={`p-3 rounded-xl border cursor-pointer transition-all ${editingBlock?.id === b.id ? 'border-purple-500 bg-purple-50' : 'border-transparent hover:bg-gray-100'}`}>
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-sm text-gray-900">{b.name}</div>
                      {b.isPublic && <Globe size={12} className="text-gray-400" />}
                    </div>
                    <div className="text-xs text-gray-500 truncate mt-1">{b.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Area: Editor */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800">
              {editingBlock ? (editingBlock.id ? 'Edit Block' : 'Create Block') : 'Select or Create a Block'}
            </h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-md text-gray-500"><X size={20} /></button>
          </div>

          {!editingBlock ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <BrainCircuit size={48} className="text-gray-200 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">Block Helper</h3>
              <p className="text-gray-500 text-sm max-w-sm mb-6">Describe the functionality you need, and our AI will instantly generate the JavaScript logic and schema for your custom block.</p>
              
              <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-1 shadow-sm flex items-center">
                <input 
                  type="text" 
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  placeholder="e.g. A block that extracts email addresses from text..."
                  className="flex-1 px-4 py-2 text-sm focus:outline-none"
                  onKeyDown={e => e.key === 'Enter' && handleAiGenerate()}
                />
                <button 
                  onClick={handleAiGenerate}
                  disabled={generatingAi || !aiPrompt.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {generatingAi ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  Generate
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
              {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">{error}</div>}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Block Name</label>
                  <input 
                    type="text" 
                    value={editingBlock.name}
                    onChange={e => setEditingBlock({...editingBlock, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Inputs (JSON Array)</label>
                  <input 
                    type="text" 
                    value={JSON.stringify(editingBlock.inputs || [])}
                    onChange={e => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        setEditingBlock({...editingBlock, inputs: Array.isArray(parsed) ? parsed : []});
                      } catch {
                        // ignore invalid json during typing
                      }
                    }}
                    placeholder='["field1", "field2"]'
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  value={editingBlock.description}
                  onChange={e => setEditingBlock({...editingBlock, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  rows={2}
                />
              </div>

              <div className="flex-1 flex flex-col min-h-[250px]">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-1">
                  <Code size={14} /> JavaScript Logic
                </label>
                <div className="bg-gray-900 rounded-lg p-3 flex-1 flex flex-col">
                  <div className="text-gray-500 text-xs font-mono mb-2">
                    // Variables accessible: input (the evaluated node parameters)
                    <br/>// Must return an object, e.g. return {"{"} result: "success" {"}"};
                  </div>
                  <textarea 
                    value={editingBlock.customLogic}
                    onChange={e => setEditingBlock({...editingBlock, customLogic: e.target.value})}
                    className="flex-1 w-full bg-transparent text-gray-300 text-sm font-mono focus:outline-none resize-none"
                    spellCheck={false}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="isPublic"
                    checked={editingBlock.isPublic}
                    onChange={e => setEditingBlock({...editingBlock, isPublic: e.target.checked})}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="isPublic" className="text-sm text-gray-700">Make Public (Export to Library)</label>
                </div>
                
                <div className="flex items-center gap-3">
                  {editingBlock.id && (
                    <button onClick={() => handleDelete(editingBlock.id!)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                      <Trash size={18} />
                    </button>
                  )}
                  <button onClick={() => setEditingBlock(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Block
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
