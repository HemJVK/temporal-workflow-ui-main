import { useState, useEffect } from 'react';
import { X, Search, Globe, Plus, Trash2, Loader2 } from 'lucide-react';

interface ServerDef {
    id: string;
    name?: string;
    description?: string;
    package?: string;
    config?: { command?: string; args?: string[] };
}

export default function McpMarketplace({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [activeTab, setActiveTab] = useState<'installed' | 'smithery' | 'glama'>('installed');
    const [servers, setServers] = useState<ServerDef[]>([]);
    const [installed, setInstalled] = useState<ServerDef[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const fetchInstalled = async () => {
        try {
            const res = await fetch('/api/mcp/servers');
            const data = await res.json();
            setInstalled(data);
        } catch {
            console.error("Failed to fetch installed");
        }
    };

    const fetchRegistry = async (registry: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/mcp/marketplace/${registry}?q=${search}`);
            const data = await res.json();
            setServers(Array.isArray(data) ? data : data.data || []);
        } catch {
            console.error("Failed to fetch registry");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => { fetchInstalled(); }, 0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (activeTab === 'smithery' || activeTab === 'glama') {
            setTimeout(() => { fetchRegistry(activeTab); }, 0);
        }
    }, [activeTab, search]);

    const installServer = async (serverDef: ServerDef) => {
        const config = serverDef.config || {
            command: 'npx',
            args: ['-y', serverDef.package || serverDef.name],
        };
        await fetch('/api/mcp/servers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: serverDef.name || serverDef.id, transportType: 'stdio', config })
        });
        fetchInstalled();
        alert(`Installed ${serverDef.name || serverDef.id}`);
    };

    const uninstallServer = async (id: string) => {
        await fetch(`/api/mcp/servers/${id}`, { method: 'DELETE' });
        fetchInstalled();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
                        <Globe className="text-blue-500" /> MCP Marketplace
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-gray-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    {['installed', 'smithery', 'glama'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as 'installed' | 'smithery' | 'glama')}
                            className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50 dark:bg-gray-900">
                    {activeTab !== 'installed' && (
                        <div className="mb-4 relative">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search providers..."
                                className="w-full pl-10 pr-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-500" size={32} /></div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {activeTab === 'installed' ? installed.map(s => (
                                <div key={s.id} className="border p-4 rounded-lg flex justify-between items-center dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <div>
                                        <h3 className="font-bold text-gray-800 dark:text-gray-100">{s.name}</h3>
                                        <p className="text-xs text-gray-500 font-mono mt-1">{s.config?.command} {s.config?.args?.join(' ')}</p>
                                    </div>
                                    <button onClick={() => uninstallServer(s.id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                </div>
                            )) : servers.map(s => (
                                <div key={s.name || s.id} className="border p-4 rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-gray-800 dark:text-gray-100">{s.name || s.id}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{s.description}</p>
                                    </div>
                                    <button onClick={() => installServer(s)} className="mt-3 flex items-center gap-1 w-max text-sm bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors">
                                        <Plus size={16} /> Install
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
