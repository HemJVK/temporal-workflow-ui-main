import type { IntegrationSchema } from "../types";

export const httpIntegrations: IntegrationSchema[] = [
  {
    type: "make_http_call",
    label: "HTTP",
    category: "http",
    icon: "http",
    description: "tool to make http requests",
    inputs: [
      {
        key: "method",
        label: "Method",
        type: "select",
        options: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      },
      {
        key: "url",
        label: "URL",
        type: "text",
      },
      {
        key: "headers",
        label: "Headers (JSON)",
        type: "textarea",
      },
      {
        key: "body",
        label: "Body",
        type: "textarea",
      },
    ],
  },
];
