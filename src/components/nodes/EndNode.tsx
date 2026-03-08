import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { Flag } from "lucide-react";

export const EndNode = memo(({ data, selected }: NodeProps<Node>) => {
  return (
    <div
      className={`relative min-w-[200px] bg-white rounded-xl border-2 shadow-sm transition-all duration-200 ${selected ? "border-red-500 ring-2 ring-red-200" : "border-gray-200"
        }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-gray-400 border-2 border-white"
      />

      <div className="flex items-center gap-3 p-3 border-b border-gray-100 bg-red-50/30 rounded-t-xl">
        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
          <Flag size={18} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-sm">End Workflow</h3>
          <p className="text-[10px] text-gray-500 uppercase font-semibold">
            Final Output
          </p>
        </div>
      </div>

      <div className="p-3">
        <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">
          Return Value
        </div>
        <div className="text-xs text-gray-700 truncate font-mono bg-gray-50 p-1 rounded">
          {((data.config as Record<string, unknown>)?.output as string) || "Full State"}
        </div>
      </div>
    </div>
  );
});
