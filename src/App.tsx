import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  type Connection,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Moon,
  Sun,
  Zap,
  Loader2,
  Save,
  FolderOpen,
  ExternalLink,
  Activity,
} from "lucide-react";
import { SavedWorkflowsList } from "./components/SavedWorkflowsList";

import Sidebar from "./components/Sidebar";
import { HttpNode } from "./components/workflowNodes/HttpNode";
import { LoopNode } from "./components/workflowNodes/LoopNode";
import { RouterNode } from "./components/workflowNodes/RouterNode";
import { StartNode } from "./components/workflowNodes/StartNode";
import { ParallelNode } from "./components/workflowNodes/ParallelNode";
import { DynamicNode } from "./components/workflowNodes/DynamicNode";
import DynamicPropertyPanel from "./components/nodes/DynamicPropertyPanel";
import { EndNode } from "./components/nodes/EndNode";

// 2. REGISTER THE NODE TYPES
// This tells React Flow: "When you see type='logic_router', render <RouterNode />"
const nodeTypes = {
  trigger_start: StartNode,
  trigger_end: EndNode,
  start: StartNode,

  // DB Nodes
  query_db_postgres: DynamicNode,

  // Logic Nodes
  logic_condition: DynamicNode,
  logic_router: RouterNode,
  logic_wait: DynamicNode,
  logic_loop: LoopNode,
  logic_parallel: ParallelNode,

  // Communication Nodes
  tool_gmail: DynamicNode,
  send_sms_twilio: DynamicNode,
  send_email_sendgrid: DynamicNode,
  make_voice_call_twilio: DynamicNode,

  // HTTP Nodes
  make_http_call: HttpNode,

  // LLM Nodes
  ai_agent: DynamicNode,
  tool_generic_llm: DynamicNode,
  agent_researcher: DynamicNode,

  // Fallback Node
  default: DynamicNode,
};

const initialNodes: Node[] = [
  {
    id: "start_node",
    type: "trigger_start",
    position: { x: 400, y: 100 },
    data: {
      label: "Start Trigger",
      type: "trigger_start",
      config: { triggerType: "Webhook" },
      status: "idle",
    },
  },
];

const AppContent = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [id, setId] = useState<string>("");
  const [workflowId, setWorkflowId] = useState<string>("");
  const [runId, setRunId] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showSavedList, setShowSavedList] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("dark", "light");
    if (darkMode) root.classList.add("dark");
    else root.classList.add("light");
  }, [darkMode]);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");

  const openTemporalHistory = () => {
    // 1. Detect Environment
    // Vite sets import.meta.env.DEV to true when running 'npm run dev'
    const isDev = import.meta.env.DEV;

    // 2. Choose Base URL
    // Dev: Direct connection to Temporal (bypassing Vite proxy issue)
    // Prod: Use the '/temporal' proxy path (assuming Docker setup allows it)
    const baseUrl = isDev
      ? import.meta.env.VITE_NEXT_PUBLIC_TEMPORAL_UI_URL
      : "/temporal";

    const namespace = import.meta.env.VITE_NEXT_PUBLIC_TEMPORAL_NAMESPACE;

    // 3. Construct Path
    const path = `/namespaces/${namespace}/workflows`;
    const fullUrl = `${baseUrl}${path}`;

    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { stroke: "#9333ea", strokeWidth: 2 },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!reactFlowWrapper.current) return;

      const dataString = event.dataTransfer.getData("application/reactflow");
      if (!dataString) return;

      const { type, label } = JSON.parse(dataString);
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left - 120,
        y: event.clientY - reactFlowBounds.top - 40,
      };

      //DEFINE DEFAULTS BASED ON TYPE
      let defaultConfig = {};

      if (type === "make_http_call") {
        defaultConfig = { method: "GET", url: "", headers: "{}" };
      } else if (type === "logic_wait") {
        defaultConfig = { duration: "5s" };
      } else if (type === "send_sms_twilio") {
        defaultConfig = { to: "{{loopItem.mobile}}" };
      }

      const newNode: Node = {
        id: `${type}_${Date.now()}`,
        type: type,
        position,
        data: { label, type, config: defaultConfig, status: "idle" },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
    setIsPanelOpen(true);
  };

  const onConfigChange = (key: string, value: any) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === selectedNodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              config: { ...node.data.config, [key]: value },
            },
          };
        }
        return node;
      })
    );
  };

  // --- 4. UPDATED DEPLOY LOGIC ---
  const onDeploy = async () => {
    setIsDeploying(true);

    // Reset statuses visual state
    setNodes((nds) =>
      nds.map((n) => ({ ...n, data: { ...n.data, status: "pending" } }))
    );

    try {
      const startNode = nodes.find((n) => n.type === "trigger_start");
      if (!startNode) throw new Error("Workflow must have a Start Trigger");

      // Initialize Steps Dictionary
      const steps: Record<string, any> = {};

      nodes.forEach((node) => {
        steps[node.id] = {
          id: node.id,
          name: node.data.label,
          type: node.data.type,
          params: node.data.config || {},
          next: null, // Default linear path
          branches: {}, // Map for Router/Condition paths (HandleID -> NodeID)
        };
      });

      // Map Edges to 'next' or 'branches'
      edges.forEach((edge) => {
        const sourceStep = steps[edge.source];

        // Safety check
        if (!sourceStep) return;

        if (sourceStep.type === "logic_parallel") {
          // If the handle is "next" (bottom handle), it's the Fan-In path
          if (edge.sourceHandle === "next") {
            sourceStep.next = edge.target;
          }
          // Otherwise, it's a specific branch (Right handles)
          else if (edge.sourceHandle) {
            sourceStep.branches[edge.sourceHandle] = edge.target;
          }
        }

        // CASE B: Router Node (Everything is a branch/path)
        else if (sourceStep.type === "logic_router") {
          if (edge.sourceHandle === "default") {
            sourceStep.branches["default"] = edge.target;
          } else if (edge.sourceHandle) {
            sourceStep.branches[edge.sourceHandle] = edge.target;
          }
        }

        // CASE C: Loop Node (Body vs Done)
        else if (sourceStep.type === "logic_loop") {
          if (edge.sourceHandle === "body")
            sourceStep.branches["body"] = edge.target;
          if (edge.sourceHandle === "done")
            sourceStep.branches["done"] = edge.target;
        }

        // CASE D: Standard Linear Nodes
        else {
          sourceStep.next = edge.target;
        }
      });

      const payload = {
        id: id,
        workflowId: workflowId,
        startAt: startNode.id,
        steps: steps,
      };

      console.log("Sending Payload:", JSON.stringify(payload, null, 2));

      const response = await fetch("/api/workflows/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`deploy_result: ${JSON.stringify(result)}`);

      if (result.workflowId || result.runId) {
        const runId = result.runId;
        setRunId(runId);
        console.log(`Workflow deployed: ${result.workflowId}, runId: ${runId}`);
      } else {
        alert("Workflow deployed but no ID returned");
      }
    } catch (error: any) {
      console.error(error);
      alert(`❌ Deployment Failed: ${error.message}`);
    } finally {
      setIsDeploying(false);
    }
  };

  const onSave = async () => {
    const name = prompt(
      "Enter workflow name:",
      `Workflow ${new Date().toLocaleTimeString()}`
    );
    if (!name) return;

    try {
      const response = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          nodes, // React Flow nodes state
          edges, // React Flow edges state
        }),
      });

      if (response.ok) {
        const resp = await response.json();
        setId(resp.id);
        setWorkflowId(resp.workflowId);
        alert("✅ Workflow Saved!");
      }
    } catch (e) {
      alert("❌ Failed to save");
    }
  };

  // --- LOAD FUNCTION ---
  const onLoadWorkflow = (workflowData: any) => {
    // 1. Restore Nodes and Edges
    console.log("Loading workflow:", workflowData);
    setNodes(workflowData.nodes || []);
    setEdges(workflowData.edges || []);
    setWorkflowName(workflowData.name || "Untitled Workflow");
    setWorkflowId(workflowData.workflowId);

    // 2. Close modal
    setShowSavedList(false);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className="h-screen w-full flex flex-col font-sans transition-colors duration-300 bg-white dark:bg-black text-gray-900 dark:text-white overflow-hidden">
      {/* HEADER */}
      <div className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center px-6 justify-between z-20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/30">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-800 dark:text-white hidden sm:inline">
              Agent Workflow
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-all border border-transparent dark:border-gray-700"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* LOAD BUTTON */}
          <button
            onClick={() => setShowSavedList(!showSavedList)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-sm font-medium"
          >
            <FolderOpen size={18} />
            <span className="hidden sm:inline">Load</span>
          </button>

          {/* SAVE BUTTON */}
          <button
            onClick={onSave}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-sm font-medium mr-2"
          >
            <Save size={18} />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            onClick={onDeploy}
            disabled={isDeploying}
            className="bg-purple-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 shadow-md transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ml-2"
          >
            {isDeploying ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deploying...
              </>
            ) : (
              "Deploy Workflow"
            )}
          </button>

          <button
            onClick={openTemporalHistory}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
              text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100"
            `}
            title="View Execution History in Temporal"
          >
            <Activity size={18} />
            <span className="hidden sm:inline">Monitor Runs</span>
            <ExternalLink size={12} className="opacity-20" />
          </button>
        </div>
      </div>

      {/* WORKSPACE */}
      <div className="flex flex-1 overflow-hidden" ref={reactFlowWrapper}>
        <div
          className={`
            transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900
            ${isSidebarOpen ? "w-72" : "w-20"} 
          `}
        >
          <Sidebar
            isCollapsed={!isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>

        {/* CANVAS */}
        <div className="flex-1 h-full bg-gray-50 dark:bg-black/90 relative transition-colors duration-300 min-w-0">
          {showSavedList && (
            <SavedWorkflowsList
              onLoad={onLoadWorkflow}
              onClose={() => setShowSavedList(false)}
            />
          )}

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.1}
          >
            <Background
              gap={24}
              size={1.5}
              color={darkMode ? "#444" : "#cbd5e1"}
            />
            <Controls className="dark:bg-gray-800 dark:border-gray-700 dark:fill-white shadow-xl bg-white fill-gray-900" />
          </ReactFlow>
        </div>

        {/* RIGHT PANEL */}
        <div
          className={`
            transition-all duration-300 ease-in-out border-l border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900
            ${isPanelOpen ? "w-96 opacity-100" : "w-0 opacity-0 border-l-0"}
           `}
        >
          <div className="w-96 h-full">
            <DynamicPropertyPanel
              selectedNode={selectedNode}
              onChange={onConfigChange}
              onClose={() => setIsPanelOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <AppContent />
    </ReactFlowProvider>
  );
}
