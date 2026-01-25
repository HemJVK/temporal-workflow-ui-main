import React from "react";
import { ExternalLink, AlertCircle } from "lucide-react";

interface GoogleSearchFormProps {
  config: any;
  onChange: (key: string, value: any) => void;
}

export default function GoogleSearchForm({
  config,
  onChange,
}: GoogleSearchFormProps) {
  return (
    <div className="space-y-4">
      {/* Search Query */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
          Search Query
        </label>
        <div className="relative">
          <input
            type="text"
            className="w-full p-2 pr-8 border border-gray-200 rounded text-sm focus:border-blue-500 outline-none"
            placeholder="e.g. latest tech news"
            value={config.query || ""}
            onChange={(e) => onChange("query", e.target.value)}
          />
          <div className="absolute right-2 top-2 text-gray-400 text-[10px] font-bold pointer-events-none mt-0.5">
            TXT
          </div>
        </div>
        <p className="text-[10px] text-gray-400 mt-1">
          Supports variables like {"{{input.body}}"}
        </p>
      </div>

      {/* CSE ID */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 flex justify-between items-center">
          <span>Custom Search Engine ID</span>
          <a
            href="#"
            className="text-[10px] text-blue-500 hover:underline flex items-center gap-1"
          >
            Get ID <ExternalLink size={8} />
          </a>
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-200 rounded text-sm font-mono text-xs focus:border-blue-500 outline-none"
          placeholder="0123456789..."
          value={config.cse_id || ""}
          onChange={(e) => onChange("cse_id", e.target.value)}
        />
      </div>

      {/* API Key */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
          API Key
        </label>
        <input
          type="password"
          className="w-full p-2 border border-gray-200 rounded text-sm font-mono text-xs focus:border-blue-500 outline-none"
          placeholder="AIzaSy..."
          value={config.api_key || ""}
          onChange={(e) => onChange("api_key", e.target.value)}
        />
      </div>

      {/* Number of Results */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
          Number Of Results
        </label>
        <input
          type="number"
          min="1"
          max="10"
          className="w-full p-2 border border-gray-200 rounded text-sm focus:border-blue-500 outline-none"
          value={config.num_results || 3}
          onChange={(e) => onChange("num_results", parseInt(e.target.value))}
        />
      </div>

      {/* Error Display Field */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
          Error Output
        </label>
        <div className="bg-white border-l-4 border-red-500 rounded shadow-sm p-3 flex items-start gap-3">
          <AlertCircle size={16} className="text-red-500 mt-0.5" />
          <div className="text-xs text-gray-600">
            <span className="font-semibold text-gray-800 block mb-0.5">
              No Error
            </span>
            Running normally.
          </div>
        </div>
      </div>
    </div>
  );
}
