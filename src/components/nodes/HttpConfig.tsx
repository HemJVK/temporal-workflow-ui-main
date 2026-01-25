import { INPUT_BASE_CLASS, LABEL_CLASS } from "./common";

interface HttpConfigProps {
  config: any;
  onChange: (key: string, value: any) => void;
}

export const HttpConfig = ({ config, onChange }: HttpConfigProps) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Method & URL Row */}
      <div className="flex gap-2">
        <div className="w-1/3">
          <label className={LABEL_CLASS}>Method</label>
          <select
            className={`${INPUT_BASE_CLASS} bg-white dark:bg-gray-800`}
            value={config.method || "GET"}
            onChange={(e) => onChange("method", e.target.value)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
        </div>
        <div className="flex-1">
          <label className={LABEL_CLASS}>URL</label>
          <input
            className={INPUT_BASE_CLASS}
            placeholder="https://api.example.com"
            value={config.url || ""}
            onChange={(e) => onChange("url", e.target.value)}
          />
        </div>
      </div>

      {/* Headers */}
      <div>
        <label className={LABEL_CLASS}>Headers (JSON)</label>
        <textarea
          className={`${INPUT_BASE_CLASS} h-20 font-mono text-xs`}
          placeholder='{ "Content-Type": "application/json" }'
          value={config.headers || ""}
          onChange={(e) => onChange("headers", e.target.value)}
        />
      </div>

      {/* Body - Only for specific methods */}
      {(config.method === "POST" ||
        config.method === "PUT" ||
        config.method === "PATCH") && (
        <div>
          <label className={LABEL_CLASS}>JSON Body</label>
          <textarea
            className={`${INPUT_BASE_CLASS} h-32 font-mono text-xs`}
            placeholder='{ "name": "{{loopItem.firstname}}" }'
            value={config.body || ""}
            onChange={(e) => onChange("body", e.target.value)}
          />
          <p className="text-[10px] text-gray-400 mt-1">
            Supports variables like <code>{`{{loopItem.name}}`}</code>
          </p>
        </div>
      )}
    </div>
  );
};
