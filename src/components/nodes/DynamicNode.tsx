import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { getSchema, ICON_MAP } from "../../integrations";

export const DynamicNode = ({ data, selected }: NodeProps<Node>) => {
  const d = data as Record<string, unknown>;
  // 1. Lookup the definition
  const schema = getSchema(d.type as string);

  // Fallback if schema is missing
  if (!schema)
    return (
      <div className="p-2 border border-red-500 bg-red-50">
        Unknown: {String(d.type)}
      </div>
    );

  // 2. Styling Helpers
  const getStyles = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "logic":
        return {
          bg: "bg-orange-100",
          border: "border-orange-300",
          text: "text-orange-700",
        };
      case "tool":
        return {
          bg: "bg-blue-100",
          border: "border-blue-300",
          text: "text-blue-700",
        };
      default:
        return {
          bg: "bg-purple-100",
          border: "border-purple-300",
          text: "text-purple-700",
        };
    }
  };

  const style = getStyles(schema.category);
  const IconComponent = ICON_MAP[schema.icon] || ICON_MAP["Globe"];

  // 3. Determine Visual Mode
  const isCondition = schema.visualType === "condition";

  return (
    <div
      className={`relative min-w-[240px] rounded-xl border-2 bg-white shadow-sm transition-all duration-300 ${selected
        ? "ring-2 ring-purple-500 border-transparent"
        : "border-gray-200"
        } ${d.status === "running" ? "animate-pulse border-blue-400" : ""}`}
    >
      {/* ---------------- INPUT HANDLE ---------------- */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !bg-gray-400 border-2 border-white"
        />
      </div>

      {/* ---------------- HEADER ---------------- */}
      <div
        className={`p-3 rounded-t-lg flex items-center gap-3 border-b ${style.bg} bg-opacity-30`}
      >
        <div className={`p-1.5 rounded-md bg-white shadow-sm ${style.text}`}>
          <IconComponent size={16} />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold text-gray-800 leading-tight">
            {String(d.label) || schema.label}
          </div>
          <div className="text-[10px] uppercase font-semibold opacity-60 tracking-wider">
            {schema.category}
          </div>
        </div>
      </div>

      {/* ---------------- BODY CONTENT ---------------- */}
      <div className="p-3 bg-white min-h-[40px]">
        {isCondition ? (
          // MODE A: Condition Preview
          <div className="text-xs font-mono text-center bg-gray-50 p-2 rounded border border-gray-100">
            <span className="text-gray-600">
              {((d.config as Record<string, unknown>)?.variable as string) || "?"}
            </span>
            <span className="font-bold text-orange-600 mx-2">
              {((d.config as Record<string, unknown>)?.operator as string) || "=="}
            </span>
            <span className="text-gray-800">{((d.config as Record<string, unknown>)?.value as string) || "?"}</span>
          </div>
        ) : (
          // MODE B: Standard Generic Preview (First Input)
          schema.inputs[0] && (
            <div className="text-xs text-gray-500">
              {schema.inputs[0].label}:{" "}
              <span className="font-medium text-gray-800">
                {String(((d.config as Record<string, unknown>)?.[schema.inputs[0].key])) || "-"}
              </span>
            </div>
          )
        )}
      </div>

      {/* ---------------- OUTPUT HANDLES ---------------- */}
      {isCondition ? (
        // MODE A: Split Handles (True/False)
        <div className="flex justify-between items-center px-4 py-3 bg-white rounded-b-lg border-t border-gray-50">
          <div className="relative">
            <span className="text-[10px] font-bold text-red-500 mr-2">
              FALSE
            </span>
            <Handle
              type="source"
              position={Position.Bottom}
              id="false"
              className="!bg-red-500 !-bottom-3 !left-2 !w-3 !h-3 border-2 border-white"
            />
          </div>
          <div className="relative">
            <span className="text-[10px] font-bold text-green-500 ml-2">
              TRUE
            </span>
            <Handle
              type="source"
              position={Position.Bottom}
              id="true"
              className="!bg-green-500 !-bottom-3 !right-2 !w-3 !h-3 border-2 border-white"
            />
          </div>
        </div>
      ) : (
        // MODE B: Single Bottom Handle
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-10">
          <Handle
            type="source"
            position={Position.Bottom}
            className="!w-3 !h-3 !bg-gray-400 border-2 border-white"
          />
        </div>
      )}
    </div>
  );
};
