import type { IntegrationSchema } from "../types";

export const googleIntegrations: IntegrationSchema[] = [
  {
    type: "tool_gmail",
    label: "Gmail",
    category: "communication",
    icon: "Mail",
    description: "Send and Read Emails",
    inputs: [
      {
        key: "action",
        label: "Action",
        type: "select",
        options: ["Send Email", "Create Draft"],
      },
      { key: "to", label: "To", type: "text" },
      { key: "subject", label: "Subject", type: "text" },
      { key: "body", label: "Message", type: "textarea" },
    ],
  },
  {
    type: "tool_google_sheets",
    label: "Google Sheets",
    category: "productivity",
    icon: "Table",
    description: "Spreadsheet automation",
    inputs: [
      {
        key: "op",
        label: "Operation",
        type: "select",
        options: ["Read Row", "Append Row", "Clear Sheet"],
      },
      {
        key: "sheetId",
        label: "Spreadsheet ID",
        type: "text",
        placeholder: "1BxiMVs...",
      },
      {
        key: "range",
        label: "Range",
        type: "text",
        placeholder: "Sheet1!A1:B10",
      },
      {
        key: "values",
        label: "Values (JSON Array)",
        type: "textarea",
        placeholder: '["Name", "Email"]',
      },
    ],
  },
  {
    type: "tool_google_calendar",
    label: "Google Calendar",
    category: "productivity",
    icon: "Calendar",
    description: "Schedule events",
    inputs: [
      {
        key: "op",
        label: "Operation",
        type: "select",
        options: ["Create Event", "List Events"],
      },
      {
        key: "calendarId",
        label: "Calendar ID",
        type: "text",
        defaultValue: "primary",
      },
      { key: "summary", label: "Event Title", type: "text" },
      {
        key: "time",
        label: "Start Time",
        type: "text",
        placeholder: "2025-10-10T10:00:00Z",
      },
    ],
  },
];
