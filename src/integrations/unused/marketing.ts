import { type IntegrationSchema } from "../types";

export const marketingIntegrations: IntegrationSchema[] = [
  {
    type: "tool_mailchimp",
    label: "Mailchimp",
    category: "marketing",
    icon: "Megaphone",
    description: "Email Marketing Automation",
    inputs: [
      { key: "listId", label: "Audience ID", type: "text" },
      { key: "email", label: "Subscriber Email", type: "text" },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["subscribed", "unsubscribed", "pending"],
      },
    ],
  },
  {
    type: "tool_shopify",
    label: "Shopify",
    category: "marketing",
    icon: "ShoppingBag",
    description: "E-commerce Platform",
    inputs: [
      {
        key: "resource",
        label: "Resource",
        type: "select",
        options: ["Order", "Product", "Customer"],
      },
      {
        key: "action",
        label: "Action",
        type: "select",
        options: ["Get All", "Get One", "Create", "Update"],
      },
      { key: "storeName", label: "Store Subdomain", type: "text" },
    ],
  },
  {
    type: "tool_stripe",
    label: "Stripe",
    category: "finance",
    icon: "CreditCard",
    description: "Payments Infrastructure",
    inputs: [
      {
        key: "resource",
        label: "Resource",
        type: "select",
        options: ["Charge", "Customer", "Subscription", "Invoice"],
      },
      {
        key: "op",
        label: "Operation",
        type: "select",
        options: ["Create", "Retrieve", "Update", "List"],
      },
      { key: "apiKey", label: "Secret Key", type: "password" },
    ],
  },
  {
    type: "tool_paypal",
    label: "PayPal",
    category: "finance",
    icon: "DollarSign",
    description: "Online Payments",
    inputs: [
      {
        key: "op",
        label: "Operation",
        type: "select",
        options: ["Create Payment", "Execute Payment", "Refund"],
      },
      { key: "amount", label: "Amount", type: "number" },
      { key: "currency", label: "Currency", type: "text", defaultValue: "USD" },
    ],
  },
  {
    type: "tool_klaviyo",
    label: "Klaviyo",
    category: "marketing",
    icon: "Mail",
    description: "SMS & Email Marketing",
    inputs: [
      { key: "metric", label: "Metric Name", type: "text" },
      { key: "event", label: "Track Event", type: "text" },
    ],
  },
  {
    type: "tool_woocommerce",
    label: "WooCommerce",
    category: "marketing",
    icon: "ShoppingCart",
    description: "WordPress E-commerce",
    inputs: [
      {
        key: "endpoint",
        label: "Endpoint",
        type: "select",
        options: ["orders", "products", "customers"],
      },
      { key: "data", label: "Data JSON", type: "textarea" },
    ],
  },
  {
    type: "tool_typeform",
    label: "Typeform",
    category: "marketing",
    icon: "FileText",
    description: "Online Form Builder",
    inputs: [
      { key: "formId", label: "Form ID", type: "text" },
      {
        key: "op",
        label: "Action",
        type: "select",
        options: ["Get Responses", "Get Form Definition"],
      },
    ],
  },
  {
    type: "tool_google_ads",
    label: "Google Ads",
    category: "marketing",
    icon: "Megaphone",
    description: "Ad Campaign Management",
    inputs: [
      { key: "customerId", label: "Customer ID", type: "text" },
      { key: "campaignId", label: "Campaign ID", type: "text" },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["ENABLED", "PAUSED"],
      },
    ],
  },
  {
    type: "tool_meta_ads",
    label: "Facebook Ads",
    category: "marketing",
    icon: "Megaphone",
    description: "Meta Advertising",
    inputs: [
      { key: "accountId", label: "Ad Account ID", type: "text" },
      { key: "objective", label: "Objective", type: "text" },
    ],
  },
];
