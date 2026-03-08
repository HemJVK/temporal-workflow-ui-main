interface ConfigProps {
  config: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

export const ResearcherNode = ({ config = {}, onChange }: ConfigProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="p-3 bg-indigo-50 text-indigo-700 text-xs border border-indigo-200 rounded">
        <b>Subgraph Node:</b> This runs an autonomous LangGraph agent that
        searches the web and summarizes findings.
      </div>

      <div>
        <label className="text-xs font-bold text-gray-500 uppercase">
          Research Topic
        </label>
        <textarea
          className="w-full border p-2 rounded text-sm mt-1 h-32"
          placeholder="e.g. Current stock price of {{loopItem.company}} and recent news."
          value={(config?.topic as string) || ""}
          onChange={(e) => onChange("topic", e.target.value)}
        />
      </div>
    </div>
  );
};
