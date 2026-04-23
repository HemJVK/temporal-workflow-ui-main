interface AgentFormProps {
  config: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

export default function AgentForm({ config, onChange }: AgentFormProps) {
  return (
    <div className="space-y-5">
      {/* Model Provider */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
          Model Provider
        </label>
        <select
          className="w-full p-2 bg-white border border-gray-200 rounded text-sm focus:border-purple-500 outline-none"
          value={(config.model as string) || "google/gemini-2.0-flash-lite-preview-02-05:free"}
          onChange={(e) => onChange("model", e.target.value)}
        >
          <option value="google/gemini-2.0-flash-lite-preview-02-05:free">🟢 Gemini 2.0 Flash Lite (OpenRouter Free) ⭐</option>
          <option value="meta-llama/llama-3.3-70b-instruct:free">🟢 Llama 3.3 70B (OpenRouter Free) ⭐</option>
          <option value="meta-llama/llama-4-maverick:free">🟢 Llama 4 Maverick (OpenRouter Free)</option>
          <option value="deepseek/deepseek-r1:free">🟢 DeepSeek R1 (OpenRouter Free)</option>
          <option value="gpt-4o">OpenAI GPT-4o</option>
          <option value="gpt-4-turbo">OpenAI GPT-4 Turbo</option>
          <option value="claude-3-5-sonnet">Anthropic Claude 3.5</option>
          <option value="gemini-pro">Google Gemini Pro</option>
        </select>
      </div>

      {/* System Prompt */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
          System Prompt
        </label>
        <textarea
          className="w-full p-2 border border-gray-200 rounded text-sm h-40 font-mono text-xs leading-relaxed focus:border-purple-500 outline-none resize-none"
          placeholder="You are a helpful assistant..."
          value={(config.systemPrompt as string) || ""}
          onChange={(e) => onChange("systemPrompt", e.target.value)}
        />
      </div>

      {/* Temperature */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 flex justify-between">
          <span>Temperature</span>
          <span className="text-gray-900">{String(config.temp) || 1}</span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          className="w-full accent-purple-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          value={(config.temp as number) ?? 1}
          onChange={(e) => onChange("temp", parseFloat(e.target.value))}
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>Precise</span>
          <span>Creative</span>
        </div>
      </div>

      {/* Response Schema */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-blue-800 mb-1">
          Response Schema (JSON)
        </label>
        <p className="text-[10px] text-blue-600 mb-2">
          Force structured output.
        </p>
        <textarea
          className="w-full p-2 border border-blue-200 rounded text-xs font-mono h-24 focus:border-blue-500 outline-none"
          placeholder='{"type": "object", "properties": {...}}'
          value={(config.schema as string) || ""}
          onChange={(e) => onChange("schema", e.target.value)}
        />
      </div>
    </div>
  );
}
