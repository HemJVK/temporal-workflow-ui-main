import { INPUT_BASE_CLASS, LABEL_CLASS } from "./common";

interface LoopConfigProps {
  config: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

export const LoopConfig = ({ config, onChange }: LoopConfigProps) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Variable Input */}
      <div>
        <label className={LABEL_CLASS}>Array Variable</label>
        <input
          className={INPUT_BASE_CLASS}
          placeholder="e.g. query_db_postgres.rows"
          value={(config.variable as string) || ""}
          onChange={(e) => onChange("variable", e.target.value)}
        />
        <p className="text-[10px] text-gray-400 mt-1">
          The list of items to iterate over.
        </p>
      </div>

      {/* Parallel Toggle */}
      <div className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
        <input
          type="checkbox"
          checked={config.isParallel === true}
          onChange={(e) => onChange("isParallel", e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Run in Parallel
        </span>
      </div>

      {/* Batch Size (Only show if Parallel is enabled) */}
      {Boolean(config.isParallel) && (
        <div>
          <label className={LABEL_CLASS}>Batch Size</label>
          <input
            type="number"
            min="1"
            max="100"
            className={INPUT_BASE_CLASS}
            placeholder="10"
            value={(config.batchSize as string) || "10"}
            onChange={(e) => onChange("batchSize", e.target.value)}
          />
          <p className="text-[10px] text-gray-400 mt-1">
            Number of items to process concurrently.
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-xs text-blue-700 dark:text-blue-300 rounded border border-blue-100 dark:border-blue-800">
        Inside the loop, use variable <b>loopItem</b> to access data.
        <br />
        Example: <b>loopItem.email</b>
      </div>
    </div>
  );
};
