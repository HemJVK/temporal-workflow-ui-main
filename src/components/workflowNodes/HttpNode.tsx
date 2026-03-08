import { memo } from "react";
import { type NodeProps, type Node } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";

import { getStatusStyle } from "./helpers";
import { Globe } from "lucide-react";

export const HttpNode = memo(({ data, selected }: NodeProps<Node>) => {
  console.log("HTTP Node Data:", data);
  const statusClass = getStatusStyle(data.status as string);
  const method = (data.config as Record<string, unknown>)?.method as string || "GET";

  // Color code the method
  const methodColor =
    ({
      GET: "bg-blue-100 text-blue-700",
      POST: "bg-green-100 text-green-700",
      PUT: "bg-orange-100 text-orange-700",
      DELETE: "bg-red-100 text-red-700",
    } as Record<string, string>)[method] || "bg-gray-100 text-gray-700";

  return (
    <div
      className={`relative min-w-[280px] bg-white rounded-xl border-2 shadow-sm transition-all duration-200 ${statusClass} ${selected ? "border-sky-500 ring-2 ring-sky-200" : "border-gray-200"
        }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-gray-400 border-2 border-white"
      />

      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b border-gray-100 bg-sky-50/30 rounded-t-xl">
        <div className="p-2 bg-sky-100 text-sky-600 rounded-lg">
          <Globe size={18} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-sm">HTTP Request</h3>
          <p className="text-[10px] text-gray-500 uppercase font-semibold">
            API Integration
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-3 flex items-center gap-2">
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${methodColor}`}
        >
          {method}
        </span>
        <span className="text-xs text-gray-600 truncate font-mono flex-1">
          {(data.config as Record<string, unknown>)?.url as string || "https://..."}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-gray-400 border-2 border-white"
      />
    </div>
  );
});
