import React, { useState, useMemo } from "react";
import { Search, ChevronsLeft, PanelLeft, Globe, Shield } from "lucide-react"; // Import Icons
import { INTEGRATION_REGISTRY } from "../integrations";
import { BrandIcon } from "./BrandIcon";
import { getAuthUser } from "../utils/auth";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onOpenMarketplace: () => void;
}

export default function Sidebar({ isCollapsed, onToggle, onOpenMarketplace }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredItem, setHoveredItem] = useState<{
    label: string;
    top: number;
    left: number;
  } | null>(null);
  const [mcpLoaded, setMcpLoaded] = useState(false);
  const user = getAuthUser();

  React.useEffect(() => {
    fetch('/api/mcp/servers')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          data.forEach(server => {
            const type = `tool_mcp_${server.id}`;
            if (!INTEGRATION_REGISTRY.find(i => i.type === type)) {
              INTEGRATION_REGISTRY.push({
                type,
                label: server.name || server.id,
                category: "MCP Plugins",
                icon: "Globe",
                description: server.description || "MCP Server Plugin",
                inputs: []
              });
            }
          });
          setMcpLoaded(true);
        }
      })
      .catch(console.error);
  }, []);

  const filteredTools = useMemo(() => {
    const lowerTerm = searchTerm.toLowerCase();
    return INTEGRATION_REGISTRY.filter((tool) => {
      if (tool.type === "trigger_start") return false;
      return (
        tool.label.toLowerCase().includes(lowerTerm) ||
        tool.description.toLowerCase().includes(lowerTerm) ||
        tool.category.toLowerCase().includes(lowerTerm)
      );
    });
  }, [searchTerm, mcpLoaded]);

  const onDragStart = (event: React.DragEvent, type: string, label: string) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type, label })
    );
    event.dataTransfer.effectAllowed = "move";
    setHoveredItem(null);
  };

  const handleMouseEnter = (e: React.MouseEvent, label: string) => {
    if (!isCollapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredItem({
      label,
      top: rect.top + rect.height / 2,
      left: rect.right + 10,
    });
  };

  return (
    <div className="w-full h-full bg-white dark:bg-gray-900 flex flex-col transition-all duration-300 relative border-r border-gray-200 dark:border-gray-800">
      {/* HEADER SECTION */}
      <div
        className={`
        border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300 flex flex-col gap-3
        ${isCollapsed ? "p-4 items-center" : "p-4"}
      `}
      >
        {/* TOP ROW: Title + Toggle Button */}
        <div
          className={`flex items-center ${isCollapsed ? "justify-center w-full" : "justify-between w-full"
            }`}
        >
          {!isCollapsed && (
            <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100 truncate">
              Toolbox
            </h2>
          )}

          {/* MINIMIZE / EXPAND BUTTON */}
          <button
            onClick={onToggle}
            className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Minimize Sidebar"}
          >
            {isCollapsed ? <PanelLeft size={20} /> : <ChevronsLeft size={20} />}
          </button>
        </div>

        {/* SEARCH BAR (Hidden when collapsed) */}
        {!isCollapsed && (
          <div className="relative">
            <Search
              className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Search tools..."
              className="w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-900 border focus:border-blue-500 rounded-lg text-sm outline-none transition-all text-gray-700 dark:text-gray-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* TOOL LIST */}
      <div
        className={`flex-1 overflow-y-auto custom-scrollbar ${isCollapsed ? "p-2 space-y-4 mt-2" : "p-3 space-y-2"
          }`}
      >
        {filteredTools.map((tool) => {
          return (
            <div
              key={tool.type}
              className={`
                bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg cursor-move 
                hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all group select-none
                ${isCollapsed
                  ? "p-3 flex justify-center aspect-square items-center"
                  : "p-3 flex items-center gap-3"
                }
              `}
              draggable
              onDragStart={(e) => onDragStart(e, tool.type, tool.label)}
              onMouseEnter={(e) => handleMouseEnter(e, tool.label)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="shrink-0">
                <BrandIcon
                  type={tool.type}
                  iconName={tool.icon}
                  className={isCollapsed ? "w-6 h-6" : "w-5 h-5"}
                />
              </div>

              {!isCollapsed && (
                <div className="overflow-hidden">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                    {tool.label}
                  </div>
                  <div className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider truncate">
                    {tool.category}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col gap-2">
        {user?.is_admin && (
          <button
            onClick={() => window.location.href = '/admin/users'}
            className={`w-full flex items-center justify-center gap-2 p-2 rounded-lg font-medium transition-all ${isCollapsed ? 'bg-transparent hover:bg-purple-50 text-purple-600' : 'bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50'}`}
            title="Admin Portal"
          >
            <Shield size={18} />
            {!isCollapsed && <span>Admin Portal</span>}
          </button>
        )}
        <button
          onClick={onOpenMarketplace}
          className={`w-full flex items-center justify-center gap-2 p-2 rounded-lg font-medium transition-all ${isCollapsed ? 'bg-transparent hover:bg-blue-50 text-blue-600' : 'bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50'}`}
          title="MCP Marketplace"
        >
          <Globe size={18} />
          {!isCollapsed && <span>MCP Plugins</span>}
        </button>
      </div>

      {/* HOVER TOOLTIP */}
      {hoveredItem && isCollapsed && (
        <div
          className="fixed z-50 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150"
          style={{
            top: hoveredItem.top,
            left: hoveredItem.left,
            transform: "translateY(-50%)",
          }}
        >
          {hoveredItem.label}
          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
        </div>
      )}
    </div>
  );
}
