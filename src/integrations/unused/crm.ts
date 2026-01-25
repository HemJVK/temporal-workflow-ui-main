import type { IntegrationSchema } from "../types";

export const crmIntegrations: IntegrationSchema[] = [
  {
    type: "tool_salesforce",
    label: "Salesforce",
    category: "crm",
    icon: "Cloud",
    description: "CRM Platform",
    inputs: [
      {
        key: "object",
        label: "Object",
        type: "select",
        options: ["Account", "Contact", "Lead", "Opportunity"],
      },
      {
        key: "op",
        label: "Operation",
        type: "select",
        options: ["Create", "Update", "Upsert", "Delete", "Query"],
      },
      { key: "soql", label: "SOQL Query", type: "textarea" },
    ],
  },
  {
    type: "tool_hubspot",
    label: "HubSpot",
    category: "crm",
    icon: "Users",
    description: "Inbound Marketing & Sales",
    inputs: [
      {
        key: "resource",
        label: "Resource",
        type: "select",
        options: ["Contacts", "Companies", "Deals"],
      },
      {
        key: "op",
        label: "Action",
        type: "select",
        options: ["Create", "Get", "Update", "Search"],
      },
      { key: "properties", label: "Properties (JSON)", type: "textarea" },
    ],
  },
  {
    type: "tool_zendesk",
    label: "Zendesk",
    category: "support",
    icon: "Headphones",
    description: "Customer Service Software",
    inputs: [
      {
        key: "op",
        label: "Operation",
        type: "select",
        options: ["Create Ticket", "Update Ticket", "List Tickets"],
      },
      { key: "subject", label: "Subject", type: "text" },
      {
        key: "priority",
        label: "Priority",
        type: "select",
        options: ["Urgent", "High", "Normal", "Low"],
      },
    ],
  },
  {
    type: "tool_intercom",
    label: "Intercom",
    category: "support",
    icon: "MessageCircle",
    description: "Customer Messaging",
    inputs: [
      {
        key: "op",
        label: "Action",
        type: "select",
        options: ["Create User", "Send Message", "Tag User"],
      },
      { key: "email", label: "User Email", type: "text" },
    ],
  },
  {
    type: "tool_pipedrive",
    label: "Pipedrive",
    category: "crm",
    icon: "BarChart",
    description: "Sales CRM",
    inputs: [
      {
        key: "resource",
        label: "Resource",
        type: "select",
        options: ["Deals", "Persons", "Organizations"],
      },
      { key: "title", label: "Title", type: "text" },
    ],
  },
  {
    type: "tool_zoho",
    label: "Zoho CRM",
    category: "crm",
    icon: "Briefcase",
    description: "Business Operation OS",
    inputs: [
      {
        key: "module",
        label: "Module",
        type: "select",
        options: ["Leads", "Contacts", "Accounts"],
      },
      {
        key: "op",
        label: "Operation",
        type: "select",
        options: ["Get Records", "Insert Records"],
      },
    ],
  },
  {
    type: "tool_freshdesk",
    label: "Freshdesk",
    category: "support",
    icon: "Headphones",
    description: "Customer Support",
    inputs: [
      {
        key: "op",
        label: "Operation",
        type: "select",
        options: ["Create Ticket", "Reply to Ticket"],
      },
      { key: "requester", label: "Requester Email", type: "text" },
    ],
  },
];
