import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

interface SavedWorkflowsListProps {
  onLoad: (workflow: any) => void;
  onClose: () => void;
}

export const SavedWorkflowsList = ({
  onLoad,
  onClose,
}: SavedWorkflowsListProps) => {
  const [workflows, setWorkflows] = useState([]);

  useEffect(() => {
    fetch("/api/workflows") // Ensure Next.js proxy points to NestJS
      .then((res) => res.json())
      .then((data) => setWorkflows(data))
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
        {workflows.map((wf: any) => (
          <button
            key={wf.id}
            onClick={() => onLoad(wf)}
            className="flex items-center gap-3 p-3 text-left border rounded hover:bg-purple-50 hover:border-purple-300 transition-all group"
          >
            <div className="p-2 bg-gray-100 group-hover:bg-purple-100 rounded">
              <FileText
                size={16}
                className="text-gray-600 group-hover:text-purple-600"
              />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800">
                {wf.name}
              </div>
              <div className="text-[10px] text-gray-400">
                {new Date(wf.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </button>
        ))}

        {workflows.length === 0 && (
          <div className="text-center text-sm text-gray-400 py-4">
            No saved workflows
          </div>
        )}
      </div>
    </div>
  );
};
