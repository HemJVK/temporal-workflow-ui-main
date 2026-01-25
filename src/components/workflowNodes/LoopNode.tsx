import { memo } from "react";
import { Repeat } from "lucide-react";
import type { NodeProps } from "postcss";
import { Handle, Position } from "@xyflow/react";

import { getStatusStyle } from "./helpers";

export const LoopNode = memo(({ data, selected }: NodeProps) => {
  const statusClass = getStatusStyle(data.status as string);

  return (
    <div
      className={`relative min-w-[250px] bg-white rounded-xl border-2 shadow-sm transition-all duration-200 ${
        selected
          ? "border-purple-500 ring-2 ring-purple-200"
          : "border-gray-200"
      } ${statusClass}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-gray-400 border-2 border-white"
      />

      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b border-gray-100 bg-purple-50/30 rounded-t-xl">
        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
          <Repeat size={18} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-sm">Loop / For Each</h3>
          <p className="text-[10px] text-gray-500 uppercase font-semibold">
            Array:{" "}
            <span className="text-purple-600">
              {(data.config as any)?.variable || "..."}
            </span>
          </p>
        </div>
      </div>

      {/* Body Handles */}
      <div className="flex justify-between items-center px-4 py-3">
        {/* Left: Continue Path */}
        <div className="relative">
          <span className="text-[10px] font-bold text-gray-400 mr-2">DONE</span>
          <Handle
            type="source"
            position={Position.Bottom}
            id="done"
            className="!w-3 !h-3 !bg-gray-400 border-2 border-white"
            style={{ left: 0 }}
          />
        </div>

        {/* Right: Loop Body Path */}
        <div className="relative">
          <span className="text-[10px] font-bold text-purple-600 ml-2">
            DO STEP
          </span>
          <Handle
            type="source"
            position={Position.Right}
            id="body"
            className="!w-3 !h-3 !bg-purple-600 border-2 border-white"
          />
        </div>
      </div>
    </div>
  );
});
