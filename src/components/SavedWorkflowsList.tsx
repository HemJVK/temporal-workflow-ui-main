import { useEffect, useState } from "react";
import { FileText, ExternalLink } from "lucide-react";

interface SavedWorkflowsListProps {
  onLoad: (workflow: Record<string, unknown>) => void;
  onClose: () => void;
}

export const SAMPLE_WORKFLOWS = [
  {
    id: "sample_1",
    workflowId: "sample_web_scraper",
    name: "Template: Web Scraper to DB",
    updatedAt: new Date().toISOString(),
    nodes: [
      { id: "start_1", type: "trigger_start", position: { x: 100, y: 100 }, data: { label: "Start", type: "trigger_start", config: { triggerType: "Manual" } } },
      { id: "action_1", type: "make_http_call", position: { x: 350, y: 100 }, data: { label: "Fetch Page", type: "make_http_call", config: { method: "GET", url: "https://example.com" } } },
      { id: "action_2", type: "query_db_postgres", position: { x: 600, y: 100 }, data: { label: "Save HTML", type: "query_db_postgres", config: { query: "INSERT INTO scraped (content) VALUES ($1)" } } }
    ],
    edges: [
      { id: "e1", source: "start_1", target: "action_1" },
      { id: "e2", source: "action_1", target: "action_2" }
    ]
  },
  {
    id: "sample_2",
    workflowId: "sample_basic_ai",
    name: "Template: Basic QA Agent",
    updatedAt: new Date().toISOString(),
    nodes: [
      { id: "start_2", type: "trigger_start", position: { x: 100, y: 100 }, data: { label: "Start", type: "trigger_start", config: { triggerType: "Manual" } } },
      { id: "action_3", type: "tool_generic_llm", position: { x: 400, y: 100 }, data: { label: "Prompt Expert", type: "tool_generic_llm", config: { userPrompt: "Explain quantum computing in exact one sentence." } } }
    ],
    edges: [
      { id: "e3", source: "start_2", target: "action_3" }
    ]
  }
];

export const SavedWorkflowsList = ({
  onLoad,
  onClose,
}: SavedWorkflowsListProps) => {
  const [workflows, setWorkflows] = useState<Record<string, unknown>[]>([]);
  const [localWorkflows, setLocalWorkflows] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    Promise.all([
      fetch("/api/workflows").then((res) => res.json()),
      fetch("/api/workflows/local").then((res) => res.json())
    ])
      .then(([dbData, localData]) => {
        setWorkflows(dbData);
        setLocalWorkflows(localData);
      })
      .catch((err) => console.error("Failed to load workflows", err));
  }, []);

  return (
    <div className="absolute top-16 right-4 w-64 bg-white shadow-xl border rounded-lg z-50 p-4 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-700">Saved Workflows</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-red-500">
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {workflows.map((wf) => (
          <div key={String(wf.id)} className="flex items-stretch group w-full mb-2">
            <button
              onClick={() => onLoad(wf)}
              className="flex-1 flex items-center gap-3 p-3 text-left border border-r-0 border-gray-200 rounded-l hover:bg-purple-50 transition-all"
              title="Load in current workspace"
            >
              <div className="p-2 bg-gray-100 rounded">
                <FileText
                  size={16}
                  className="text-gray-600 group-hover:text-purple-600"
                />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">
                  {String(wf.name)}
                </div>
                <div className="text-[10px] text-gray-400">
                  {new Date(String(wf.updatedAt)).toLocaleDateString()}
                </div>
              </div>
            </button>
            <button
              onClick={() => window.open(`/?workflowId=${wf.id}`, '_blank')}
              className="p-3 border border-gray-200 rounded-r text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all flex items-center justify-center"
              title="Open in new workspace"
            >
              <ExternalLink size={16} />
            </button>
          </div>
        ))}

        {workflows.length === 0 && (
          <div className="text-center text-sm text-gray-400 py-4">
            No saved workflows
          </div>
        )}

        {/* --- LOCAL WORKSPACE SECTION --- */}
        <div className="mt-4 border-t pt-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Local Workflows
          </h4>
          {localWorkflows.map((wf) => (
            <div key={String(wf.id)} className="flex items-stretch group w-full mb-2">
              <button
                onClick={() => onLoad(wf)}
                className="flex-1 flex items-center gap-3 p-3 text-left border border-r-0 border-gray-200 rounded-l hover:bg-blue-50 transition-all"
                title="Load into active workspace (Appends nodes)"
              >
                <div className="p-2 bg-gray-100 rounded">
                  <FileText
                    size={16}
                    className="text-gray-600 group-hover:text-blue-600"
                  />
                </div>
                <div className="overflow-hidden">
                  <div className="text-sm font-semibold text-gray-800 truncate">
                    {String(wf.name)}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {new Date(String(wf.updatedAt)).toLocaleDateString()}
                  </div>
                </div>
              </button>
              <button
                onClick={() => window.open(`/?workflowId=${wf.id}`, '_blank')}
                className="p-3 border border-gray-200 rounded-r text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center"
                title="Open in new workspace"
              >
                <ExternalLink size={16} />
              </button>
            </div>
          ))}

          {localWorkflows.length === 0 && (
            <div className="text-center text-sm text-gray-400 py-2">
              No local workflows found
            </div>
          )}
        </div>

        {/* --- TEMPLATES SECTION --- */}
        <div className="mt-4 border-t pt-4">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Sample Templates
          </h4>
          {SAMPLE_WORKFLOWS.map((wf) => (
            <div key={String(wf.id)} className="flex items-stretch group w-full mb-2">
              <button
                onClick={() => onLoad(wf as Record<string, unknown>)}
                className="flex-1 flex items-center gap-3 p-3 text-left border border-r-0 border-gray-200 rounded-l hover:bg-green-50 transition-all"
                title="Load in current workspace"
              >
                <div className="p-2 bg-gray-100 rounded">
                  <FileText
                    size={16}
                    className="text-gray-600 group-hover:text-green-600"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    {String(wf.name)}
                  </div>
                  <div className="text-[10px] text-gray-400">Default</div>
                </div>
              </button>
              <button
                onClick={() => window.open(`/?workflowId=${wf.id}`, '_blank')}
                className="p-3 border border-gray-200 rounded-r text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all flex items-center justify-center"
                title="Open in new workspace"
              >
                <ExternalLink size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
