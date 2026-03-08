import { memo } from "react";
import { Zap } from "lucide-react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";

import { StatusIcon } from "./StatusIcon";
import { getStatusStyle } from "./helpers";

export const StartNode = memo(({ data, selected }: NodeProps<Node>) => {
  const statusClass = getStatusStyle(data.status as string);
  const isSelected = selected ? "ring-2 ring-purple-500" : "";

  return (
    <div
      className={`px-4 py-3 shadow-md rounded-full border-2 transition-all duration-300 flex items-center gap-3 min-w-[180px] ${statusClass} ${isSelected}`}
    >
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-purple-500"
      />

      <div className="p-2 bg-purple-100 rounded-full">
        <Zap size={18} className="text-purple-600" fill="currentColor" />
      </div>

      <div className="flex flex-col">
        <span className="font-bold text-sm text-gray-800">
          {(data.label as string) || "Start Trigger"}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold flex items-center gap-1">
          {data.status === "completed"
            ? "Done"
            : (data.config as Record<string, unknown>)?.triggerType as string || "WEBHOOK"}
          <StatusIcon status={data.status as string} />
        </span>
      </div>
    </div>
  );
});
