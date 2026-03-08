import { memo } from "react";
import { type NodeProps, type Node } from "@xyflow/react";
import { Bot, Clock, Mail } from "lucide-react";
import { Handle, Position } from "@xyflow/react";

import { StatusIcon } from "./StatusIcon";
import { getStatusStyle } from "./helpers";

export const DynamicNode = memo(({ data, selected }: NodeProps<Node>) => {
  const statusClass = getStatusStyle(data.status as string);
  const isSelected = selected ? "ring-2 ring-purple-500" : "";

  // Helper to pick icon based on type
  const getIcon = () => {
    if (data.type === "tool_gmail")
      return <Mail size={20} className="text-red-500" />;
    if (data.type === "llm") return <Bot size={20} className="text-blue-500" />;
    return <Clock size={20} className="text-gray-500" />;
  };

  return (
    <div
      className={`relative min-w-[250px] rounded-xl border bg-white shadow-sm transition-all duration-300 ${statusClass} ${isSelected}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gray-400 !w-3 !h-3"
      />

      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100/50">
        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-800 text-sm">
              {data.label as string}
            </h3>
            <StatusIcon status={data.status as string} />
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            {data.type as string}
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="px-4 py-3 bg-gray-50/50 rounded-b-xl">
        <div className="text-xs text-gray-400 font-mono">
          {data.status === "running" ? "Processing..." : "Action: -"}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-400 !w-3 !h-3"
      />
    </div>
  );
});
