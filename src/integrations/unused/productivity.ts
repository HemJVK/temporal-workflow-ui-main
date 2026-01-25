import { type IntegrationSchema } from "../types";

export const productivityIntegrations: IntegrationSchema[] = [
  // --- AIRTABLE ---
  {
    type: "tool_airtable",
    label: "Airtable",
    category: "productivity",
    icon: "Table",
    description: "Read or Write to Bases",
    inputs: [
      {
        key: "operation",
        label: "Operation",
        type: "select",
        options: ["List Records", "Create Record", "Update Record"],
      },
      { key: "baseId", label: "Base ID", type: "text", placeholder: "app..." },
      { key: "table", label: "Table Name", type: "text", placeholder: "Tasks" },
      { key: "apiKey", label: "Personal Access Token", type: "password" },
    ],
  },
  // --- ASANA ---
  {
    type: "tool_asana",
    label: "Asana",
    category: "productivity",
    icon: "Layers",
    description: "Manage Tasks and Projects",
    inputs: [
      {
        key: "action",
        label: "Action",
        type: "select",
        options: ["Create Task", "Get Task", "Update Task"],
      },
      { key: "workspace", label: "Workspace ID", type: "text" },
      { key: "project", label: "Project ID", type: "text" },
      { key: "name", label: "Task Name", type: "text" },
    ],
  },
  // --- NOTION ---
  {
    type: "tool_notion",
    label: "Notion",
    category: "productivity",
    icon: "FileText",
    description: "Database & Page management",
    inputs: [
      {
        key: "op",
        label: "Operation",
        type: "select",
        options: ["Query Database", "Create Page"],
      },
      { key: "db_id", label: "Database ID", type: "text" },
      {
        key: "json_body",
        label: "Properties (JSON)",
        type: "textarea",
        placeholder: '{ "Name": { "title": [...] } }',
      },
    ],
  },
];
