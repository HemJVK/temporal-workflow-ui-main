import { memo } from "react";
import { GitMerge } from "lucide-react";
import type { NodeProps } from "postcss";
import { Handle, Position } from "@xyflow/react";
import { getStatusStyle } from "./helpers";

export const ParallelNode = memo(({ data, selected }: NodeProps) => {
  const statusClass = getStatusStyle(data.status as string);
  const branches = (data.config as any)?.branches || [];

  return (
    <div
      className={`relative min-w-[280px] bg-white rounded-xl border-2 shadow-sm transition-all duration-200 ${statusClass} ${
        selected ? "border-pink-500 ring-2 ring-pink-200" : "border-gray-200"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-gray-400 border-2 border-white"
      />

      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b border-gray-100 bg-pink-50/30 rounded-t-xl">
        <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
          <GitMerge size={18} className="rotate-90" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-sm">Parallel Split</h3>
          <p className="text-[10px] text-gray-500 uppercase font-semibold">
            Run All Paths
          </p>
        </div>
      </div>

      {/* Dynamic Handles */}
      <div className="py-2 flex flex-col gap-1">
        {branches.map((branch: any) => (
          <div
            key={branch.id}
            className="relative group flex items-center justify-end px-4 py-2 hover:bg-gray-50"
          >
            <span className="text-xs font-bold text-gray-600 mr-3">
              {branch.label}
            </span>
            <Handle
              type="source"
              position={Position.Right}
              id={branch.id}
              className="!w-3 !h-3 !bg-pink-500 border-2 border-white"
              style={{ right: -7 }}
            />
          </div>
        ))}
      </div>
      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
        <Handle
          type="source"
          position={Position.Bottom}
          id="next"
          className="!w-3 !h-3 !bg-gray-400 border-2 border-white"
        />
      </div>
    </div>
  );
});
