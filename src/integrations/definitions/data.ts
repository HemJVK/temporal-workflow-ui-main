import { type IntegrationSchema } from "../types";

export const dataIntegrations: IntegrationSchema[] = [
  {
    type: "query_db_postgres",
    label: "PostgreSQL",
    category: "data",
    icon: "Database",
    description: "Relational Database",
    inputs: [
      { key: "query", label: "SQL Query", type: "textarea" },
      { key: "params", label: "Parameters (JSON)", type: "text" },
    ],
  },
];
