import { memo } from "react";
import { GitFork } from "lucide-react";
import { type NodeProps, type Node } from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import { getStatusStyle } from "./helpers";

export const ConditionNode = memo(({ data, selected }: NodeProps<Node>) => {
  const statusClass = getStatusStyle(data.status as string);

  return (
    <div
      className={`relative min-w-[250px] rounded-xl border bg-white shadow-sm transition-all duration-300 ${statusClass} ${selected ? "ring-2 ring-purple-500" : ""
        }`}
    >
      {/* Input Handle */}
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <div className="p-2 bg-orange-50 rounded-lg border border-orange-100">
          <GitFork size={20} className="text-orange-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-sm">Condition</h3>
          <p className="text-xs text-gray-500">If / Else Logic</p>
        </div>
      </div>

      {/* Logic Preview */}
      <div className="p-3 bg-gray-50 text-xs font-mono text-center border-b border-gray-100">
        {(data.config as Record<string, unknown>)?.variable as string || "var"}
        <span className="text-orange-600 font-bold mx-1">
          {(data.config as Record<string, unknown>)?.operator as string || "=="}
        </span>
        {(data.config as Record<string, unknown>)?.value as string || "val"}
      </div>

      {/* Dual Outputs */}
      <div className="flex justify-between items-center px-4 py-2 bg-white rounded-b-xl">
        <div className="relative">
          <span className="text-xs font-bold text-red-500 mr-2">FALSE</span>
          {/* Handle ID is crucial for mapping edges! */}
          <Handle
            type="source"
            position={Position.Bottom}
            id="false"
            className="!bg-red-500 !-bottom-3 !left-2"
          />
        </div>
        <div className="relative">
          <span className="text-xs font-bold text-green-500 ml-2">TRUE</span>
          <Handle
            type="source"
            position={Position.Bottom}
            id="true"
            className="!bg-green-500 !-bottom-3 !right-2"
          />
        </div>
      </div>
    </div>
  );
});
