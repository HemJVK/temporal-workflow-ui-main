import { Settings, X } from "lucide-react";
import { getSchema } from "../../integrations";
import { FieldFactory } from "./FieldFactory";
import { HttpConfig } from "./HttpConfig";
import { LoopConfig } from "./LoopConfig";
import { RouterConfig } from "./RouterConfig";

export default function DynamicPropertyPanel({
  selectedNode,
  onChange,
  onClose,
}: any) {
  // 1. Empty State
  if (!selectedNode) {
    return (
      <div className="w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 text-sm h-full transition-colors duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full shadow-sm mb-4">
          <Settings
            size={32}
            className="opacity-20 text-gray-900 dark:text-gray-100"
          />
        </div>
        <p className="font-medium">Select a block to configure</p>
      </div>
    );
  }

  // 2. Load Schema & Config
  const schema = getSchema(selectedNode.data.type);
  const config = selectedNode.data.config || {};

  const handleFieldChange = (key: string, value: any) => {
    onChange(key, value);
  };

  // 3. Render Logic
  const renderContent = () => {
    if (!schema)
      return <div className="p-10 text-gray-400">Unknown Node Type</div>;

    // --- A. Specific Overrides (Custom Forms) ---

    if (selectedNode.data.type === "logic_router") {
      return <RouterConfig config={config} onChange={onChange} />;
    }

    // Explicit check for Special Config Components
    if (selectedNode.data.type === "make_http_call") {
      return <HttpConfig config={config} onChange={onChange} />;
    }

    if (selectedNode.data.type === "logic_loop") {
      return <LoopConfig config={config} onChange={onChange} />;
    }

    if (selectedNode.data.type === "trigger_end") {
      return (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">
              Output Value
            </label>
            <textarea
              className="w-full border p-2 rounded text-sm mt-1 h-32 font-mono"
              placeholder='{ "result": "{{ai_agent.answer}}" }'
              value={config.output || ""}
              onChange={(e) => onChange("output", e.target.value)}
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Define the JSON to return. Leave empty to return full state.
            </p>
          </div>
        </div>
      );
    }

    // --- B. Generic Schema Renderer ---
    return (
      <div className="space-y-6">
        {schema.inputs.map((field) => {
          // Fallback for legacy types if not caught above
          if (field.type === "make_http_call")
            return (
              <HttpConfig key={field.key} config={config} onChange={onChange} />
            );
          if (field.type === "logic_loop")
            return (
              <LoopConfig key={field.key} config={config} onChange={onChange} />
            );

          // Standard Fields
          return (
            <FieldFactory
              key={field.key}
              field={field}
              value={config[field.key] ?? field.defaultValue}
              onChange={(val) => handleFieldChange(field.key, val)}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col h-full shadow-xl z-20 font-sans transition-colors duration-300">
      {schema && (
        <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-[4px] shadow-sm bg-blue-600 text-white">
            {schema.category}
          </span>
          <h2 className="font-bold text-2xl text-gray-900 dark:text-white tracking-tight mt-3">
            {schema.label}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {schema.description}
          </p>
        </div>
      )}

      <button
        onClick={onClose}
        className="absolute top-25 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-full transition-colors z-10"
      >
        <X size={20} />
      </button>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {renderContent()}
      </div>
    </div>
  );
}
