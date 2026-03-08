import React, { useEffect, useState } from "react";
import type { FieldProps } from "./common";

interface ServerDef {
    id: string;
    name?: string;
    config?: { command?: string; args?: string[] };
}

export const McpSelectField = ({ field, value, onChange }: FieldProps) => {
    const [servers, setServers] = useState<ServerDef[]>([]);

    useEffect(() => {
        fetch('/api/mcp/servers')
            .then(res => res.json())
            .then(data => setServers(data))
            .catch(console.error);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(opt => {
            return servers.find(s => s.id === opt.value);
        });

        // Convert to McpServerConfig objects
        const configs = selectedOptions.filter((s): s is ServerDef => s !== undefined).map(server => ({
            id: server.id,
            command: server.config?.command,
            args: server.config?.args,
        }));

        onChange(configs);
    };

    const selectedValues = (Array.isArray(value) ? value : []).map(v => v.id as string);

    return (
        <div className="flex flex-col gap-1 mb-4">
            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {field.label}
            </label>
            {field.description && (
                <p className="text-[10px] text-gray-400 mb-1">{field.description}</p>
            )}
            <select
                multiple
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 min-h-[100px] focus:ring-2 focus:ring-blue-500 outline-none custom-scrollbar"
                onChange={handleChange}
                value={selectedValues}
            >
                {servers.length === 0 && <option disabled>No MCP Servers Installed</option>}
                {servers.map(s => (
                    <option key={s.id} value={s.id} className="py-1 px-2 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                        {s.name}
                    </option>
                ))}
            </select>
        </div>
    );
};
