import { Plus, Trash2 } from "lucide-react";
import { INPUT_BASE_CLASS, LABEL_CLASS } from "./common";

export const RouterConfig = ({
  config,
  onChange,
}: {
  config: Record<string, unknown>;
  onChange: (k: string, v: unknown) => void;
}) => {
  const routes = Array.isArray(config.routes) ? config.routes : [];

  const addRoute = () => {
    const newRoute = { id: `r_${Date.now()}`, operator: ">", value: "0" };
    onChange("routes", [...routes, newRoute]);
  };

  const removeRoute = (id: string) => {
    onChange(
      "routes",
      routes.filter((r: Record<string, unknown>) => r.id !== id)
    );
  };

  const updateRoute = (id: string, key: string, val: unknown) => {
    onChange(
      "routes",
      routes.map((r: Record<string, unknown>) => (r.id === id ? { ...r, [key]: val } : r))
    );
  };

  return (
    <div className="space-y-6">
      {/* Variable */}
      <div>
        <label className={LABEL_CLASS}>Variable to Check</label>
        <input
          className={INPUT_BASE_CLASS}
          placeholder="e.g. lead_score"
          value={(config.variable as string) || ""}
          onChange={(e) => onChange("variable", e.target.value)}
        />
      </div>

      {/* Routes */}
      <div>
        <label className={LABEL_CLASS}>Routing Rules</label>
        <div className="space-y-2">
          {routes.map((route: Record<string, unknown>) => (
            <div
              key={String(route.id)}
              className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="relative w-1/3">
                <select
                  className="w-full appearance-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs rounded px-2 py-1.5 pr-6 cursor-pointer text-gray-700 dark:text-gray-200"
                  value={String(route.operator)}
                  onChange={(e) =>
                    updateRoute(String(route.id), "operator", e.target.value)
                  }
                >
                  <option value="==">==</option>
                  <option value=">">&gt;</option>
                  <option value="<">&lt;</option>
                  <option value="contains">has</option>
                </select>
              </div>

              <input
                className="w-1/3 flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs rounded px-2 py-1.5 text-gray-700 dark:text-gray-200"
                placeholder="Value"
                value={String(route.value)}
                onChange={(e) => updateRoute(String(route.id), "value", e.target.value)}
              />

              <button
                onClick={() => removeRoute(String(route.id))}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addRoute}
          className="w-full mt-3 py-2 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={14} /> Add Route
        </button>
      </div>
    </div>
  );
};
