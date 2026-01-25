import { Settings } from "lucide-react";
import AgentForm from "./properties/AgentForm";
import GmailForm from "./properties/GmailForm";
import GoogleSearchForm from "./properties/GoogleSearchForm";

export default function PropertyPanel({ selectedNode, onChange }: any) {
  if (!selectedNode) {
    return (
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col items-center justify-center text-gray-400 text-sm h-full">
        <Settings size={48} className="mb-4 opacity-10" />
        <p className="font-medium">Select a block to configure</p>
      </div>
    );
  }

  // Determine header color based on type
  const getTypeColor = (type: string) => {
    if (type === "agent") return "bg-purple-600";
    if (type.startsWith("tool")) return "bg-blue-600";
    if (type.startsWith("logic")) return "bg-orange-500";
    return "bg-gray-500";
  };

  const typeLabel = selectedNode.data.type.replace("tool_", "").toUpperCase();

  return (
    <div className="w-96 bg-gray-50 border-l border-gray-200 flex flex-col h-full shadow-xl z-20 font-sans transition-all duration-300">
      {/* Header */}
      <div className="p-5 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded shadow-sm ${getTypeColor(
              selectedNode.data.type
            )}`}
          >
            {typeLabel}
          </span>
        </div>
        <h2 className="font-bold text-xl text-gray-900 leading-tight">
          {selectedNode.data.label}
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
            ID: {selectedNode.id}
          </span>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 overflow-y-auto p-6">
        {selectedNode.data.type === "tool_email" && (
          <GmailForm
            config={selectedNode.data.config || {}}
            onChange={onChange}
          />
        )}

        {selectedNode.data.type === "tool_search" && (
          <GoogleSearchForm
            config={selectedNode.data.config || {}}
            onChange={onChange}
          />
        )}

        {selectedNode.data.type === "agent" && (
          <AgentForm
            config={selectedNode.data.config || {}}
            onChange={onChange}
          />
        )}

        {/* Fallback for other nodes */}
        {!["tool_email", "tool_search", "agent"].includes(
          selectedNode.data.type
        ) && (
          <div className="text-center text-gray-400 mt-10">
            <p>No configuration available for this block type.</p>
          </div>
        )}
      </div>
    </div>
  );
}
