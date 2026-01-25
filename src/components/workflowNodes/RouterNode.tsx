import { memo, useEffect } from "react";
import type { NodeProps } from "postcss";
import { Network } from "lucide-react";
import { Handle, Position, useUpdateNodeInternals } from "@xyflow/react";

export const RouterNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const routes = (data.config as any)?.routes || [];

  // ⚡️ FIX: Notify React Flow whenever the routes change
  useEffect(() => {
    updateNodeInternals(id);
  }, [id, routes, updateNodeInternals]);

  return (
    <div
      className={`relative min-w-[300px] bg-white rounded-xl border-2 shadow-sm transition-all duration-200 ${
        selected
          ? "border-indigo-500 ring-2 ring-indigo-200"
          : "border-gray-200"
      }`}
    >
      {/* INPUT HANDLE (Top) */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !bg-gray-400 border-2 border-white"
        />
      </div>

      {/* HEADER */}
      <div className="flex items-center gap-3 p-3 border-b border-gray-100 bg-indigo-50/30 rounded-t-xl">
        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
          <Network size={18} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800 text-sm">Logic Router</h3>
          <p className="text-[10px] text-gray-500 uppercase font-semibold">
            VAR:{" "}
            <span className="text-indigo-600">
              {(data.config as any)?.variable || "..."}
            </span>
          </p>
        </div>
      </div>

      {/* BODY */}
      <div className="px-4 py-4 text-xs text-center text-gray-400 italic">
        Select a path based on rules ↓
      </div>

      {/* FOOTER: Horizontal Routes */}
      <div className="flex justify-around items-end px-2 pb-0 bg-gray-50 rounded-b-xl border-t border-gray-100">
        {/* 1. Dynamic Routes */}
        {routes.map((route: any) => (
          <div
            key={route.id}
            className="flex flex-col items-center gap-2 pb-3 relative group min-w-[60px]"
          >
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-1 rounded border border-indigo-200 whitespace-nowrap z-10">
              {route.operator} {route.value}
            </span>

            {/* Handle Wrapper to prevent styling conflicts */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <Handle
                type="source"
                position={Position.Bottom}
                id={route.id}
                className="!w-3 !h-3 !bg-indigo-500 border-2 border-white cursor-pointer"
              />
            </div>
          </div>
        ))}

        {/* 2. Default / Else Route */}
        <div className="flex flex-col items-center gap-2 pb-3 relative min-w-[60px]">
          <span className="text-[10px] font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded border border-gray-300 whitespace-nowrap z-10">
            ELSE
          </span>

          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
            <Handle
              type="source"
              position={Position.Bottom}
              id="default"
              className="!w-3 !h-3 !bg-gray-400 border-2 border-white cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
});
