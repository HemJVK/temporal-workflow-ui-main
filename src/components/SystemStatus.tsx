import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { getToken } from '../utils/auth';

export const SystemStatus = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health', {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        const data = await res.json();
        setStatus(data);
      } catch (e) {
        console.error('Health check failed', e);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return null;

  const isAllUp = status?.database === 'up' && status?.openRouter === 'up';

  return (
    <div className="flex items-center gap-4 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${status?.database === 'up' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">DB</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${status?.openRouter === 'up' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">AI</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Globe size={12} className={isAllUp ? 'text-green-500' : 'text-yellow-500'} />
        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cloud</span>
      </div>
    </div>
  );
};
