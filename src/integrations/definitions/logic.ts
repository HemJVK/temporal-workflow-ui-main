import type { IntegrationSchema } from "../types";

export const logicIntegrations: IntegrationSchema[] = [
  {
    type: "logic_wait",
    label: "Wait Timer",
    category: "Logic",
    icon: "Clock",
    description: "Pause execution for a set amount of time.",
    inputs: [
      {
        key: "duration",
        label: "Duration",
        type: "text",
        placeholder: "e.g. 30s, 5m, 1h, 2d",
        defaultValue: "5s",
        helperText:
          "Supported units: s (seconds), m (minutes), h (hours), d (days).",
      },
    ],
  },
  {
    type: "logic_condition",
    label: "Condition",
    category: "Logic",
    icon: "GitFork", // Make sure this is in your ICON_MAP
    visualType: "condition", // <--- The Flag
    description: "Branch flow based on data.",
    inputs: [
      {
        key: "variable",
        label: "Variable",
        type: "text",
        placeholder: "e.g. email_verified",
      },
      {
        key: "operator",
        label: "Operator",
        type: "select",
        options: ["==", ">", "<", "contains"],
      },
      { key: "value", label: "Value", type: "text", placeholder: "true" },
    ],
  },
  {
    type: "logic_router",
    label: "Router",
    category: "Logic",
    icon: "Network", // This string maps to the Lucide icon
    description: "Branch workflow into multiple paths based on rules.",
    inputs: [
      // We leave this empty because the Property Panel
      // renders a custom UI for adding routes dynamically.
    ],
  },
  {
    type: "logic_loop",
    label: "Loop / For Each",
    category: "Logic",
    icon: "Repeat",
    description: "Iterate over a list of items.",
    inputs: [
      {
        key: "variable",
        label: "Array Variable",
        type: "text",
        placeholder: "e.g. query_db_postgres.rows",
      },
      {
        key: "batchSize",
        label: "Batch Size",
        type: "text",
        placeholder: "e.g. 10",
      },
      {
        key: "executionType",
        label: "Execution Type",
        type: "select",
        options: ["Sequential", "Parallel"],
      },
    ],
  },
  {
    type: "logic_parallel",
    label: "Parallel Split",
    category: "Logic",
    icon: "GitMerge", // Ensure this icon exists in your ICON_MAP
    description: "Split execution into multiple parallel paths.",
    inputs: [
      {
        key: "branches",
        label: "Execution Branches",
        type: "field_list", // Reuses the generic list component
        description: "Define the paths to execute simultaneously.",
        subFields: [
          {
            key: "id",
            label: "Handle ID",
            type: "text",
            placeholder: "e.g. b_email",
            defaultValue: "b_1",
            helperText: "Unique ID for the connection handle",
          },
          {
            key: "label",
            label: "Branch Name",
            type: "text",
            placeholder: "e.g. Send Email Flow",
            defaultValue: "New Branch",
          },
        ],
      },
    ],
  },
];
