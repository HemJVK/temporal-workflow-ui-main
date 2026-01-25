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
  {
    type: "tool_mysql",
    label: "MySQL",
    category: "data",
    icon: "Database",
    description: "Relational Database",
    inputs: [{ key: "query", label: "SQL Query", type: "textarea" }],
  },
  {
    type: "tool_mongo",
    label: "MongoDB",
    category: "data",
    icon: "Database",
    description: "NoSQL Database",
    inputs: [
      { key: "collection", label: "Collection", type: "text" },
      {
        key: "op",
        label: "Operation",
        type: "select",
        options: ["Find", "Insert", "Update", "Delete"],
      },
      { key: "filter", label: "Filter (JSON)", type: "textarea" },
    ],
  },
  {
    type: "tool_snowflake",
    label: "Snowflake",
    category: "data",
    icon: "Cloud",
    description: "Data Warehousing",
    inputs: [
      { key: "schema", label: "Schema", type: "text" },
      { key: "sql", label: "SQL Statement", type: "textarea" },
    ],
  },
  {
    type: "tool_bigquery",
    label: "Google BigQuery",
    category: "data",
    icon: "Search",
    description: "Serverless Data Warehouse",
    inputs: [
      { key: "query", label: "SQL Query", type: "textarea" },
      { key: "location", label: "Location", type: "text", defaultValue: "US" },
    ],
  },
  {
    type: "tool_redis",
    label: "Redis",
    category: "data",
    icon: "Zap",
    description: "In-memory Cache",
    inputs: [
      {
        key: "command",
        label: "Command",
        type: "select",
        options: ["GET", "SET", "DEL", "HGET"],
      },
      { key: "key", label: "Key", type: "text" },
      { key: "value", label: "Value", type: "text" },
    ],
  },
  {
    type: "tool_s3",
    label: "AWS S3",
    category: "aws",
    icon: "HardDrive",
    description: "Object Storage",
    inputs: [
      { key: "bucket", label: "Bucket", type: "text" },
      { key: "key", label: "File Key", type: "text" },
    ],
  },
  {
    type: "tool_gcs",
    label: "Google Cloud Storage",
    category: "data",
    icon: "HardDrive",
    description: "Object Storage",
    inputs: [
      { key: "bucket", label: "Bucket", type: "text" },
      { key: "filename", label: "File Name", type: "text" },
    ],
  },
  {
    type: "tool_firebase",
    label: "Firebase",
    category: "data",
    icon: "Flame",
    description: "Realtime DB & Firestore",
    inputs: [
      { key: "path", label: "Document Path", type: "text" },
      {
        key: "op",
        label: "Operation",
        type: "select",
        options: ["Get", "Set", "Update"],
      },
    ],
  },
];
