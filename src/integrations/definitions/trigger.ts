import type { IntegrationSchema } from "../types";

export const trigger_schedule: IntegrationSchema[] = [
  {
    type: "trigger_schedule",
    label: "Schedule / Cron",
    category: "Trigger",
    icon: "Clock",
    description: "Run workflow periodically.",
    inputs: [
      {
        key: "cron",
        label: "Cron Expression",
        type: "text",
        placeholder: "0 12 * * * (Every day at 12 PM)",
        defaultValue: "*/5 * * * *", // Every 5 mins
        helperText: "Standard Cron syntax.",
      },
    ],
  },
];
