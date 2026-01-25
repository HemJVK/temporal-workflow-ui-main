import { type IntegrationSchema } from "../types";

export const microsoftIntegrations: IntegrationSchema[] = [
  {
    type: "tool_outlook",
    label: "Outlook 365",
    category: "communication",
    icon: "Mail",
    description: "Office 365 Email",
    inputs: [
      {
        key: "action",
        label: "Operation",
        type: "select",
        options: ["Send Mail", "Get Messages"],
      },
      { key: "subject", label: "Subject", type: "text" },
      { key: "recipients", label: "To (Semicolon separated)", type: "text" },
    ],
  },
  {
    type: "tool_teams",
    label: "Microsoft Teams",
    category: "communication",
    icon: "MessageSquare",
    description: "Teams Chat & Channels",
    inputs: [
      { key: "teamId", label: "Team ID", type: "text" },
      { key: "channelId", label: "Channel ID", type: "text" },
      { key: "message", label: "Message", type: "textarea" },
    ],
  },
];
