import { type IntegrationSchema, ICON_MAP } from "./types";

// Import all category files
import { dataIntegrations } from "./definitions/data";
import { aiIntegrations } from "./definitions/ai";
import { logicIntegrations } from "./definitions/logic";
import { httpIntegrations } from "./definitions/http";

// Start Trigger Definition
const triggerDefinition: IntegrationSchema = {
  type: "trigger_start",
  label: "Start Trigger",
  category: "processing",
  icon: "Zap",
  description: "How this workflow begins",
  inputs: [
    {
      key: "triggerType",
      label: "Trigger Type",
      type: "select",
      options: ["Webhook", "Cron", "Manual", "App Event"],
    },
    { key: "isActive", label: "Active", type: "boolean", defaultValue: true },
    { key: "cronExpression", label: "Cron Expression", type: "text" },
    {
      key: "webhookMethod",
      label: "Method",
      type: "select",
      options: ["GET", "POST", "PUT"],
    },
  ],
};

const triggerEnd: IntegrationSchema = {
  type: "trigger_end",
  label: "End Trigger",
  category: "processing",
  icon: "Zap",
  description: "How this workflow ends",
  inputs: [],
};

const triggerSchedule: IntegrationSchema = {
  type: "trigger_schedule",
  label: "Schedule Trigger",
  category: "processing",
  icon: "Clock",
  description: "Runs on a recurring schedule",
  inputs: [
    { key: "cron", label: "Cron Expression", type: "text", defaultValue: "0 9 * * 1-5" }
  ],
};

// --- MASTER REGISTRY ---
export const INTEGRATION_REGISTRY: IntegrationSchema[] = [
  triggerDefinition,
  triggerEnd,
  triggerSchedule,
  ...dataIntegrations,
  ...aiIntegrations,
  ...logicIntegrations,
  ...httpIntegrations,
];

export const getSchema = (type: string) =>
  INTEGRATION_REGISTRY.find((i) => i.type === type);
export { ICON_MAP };
