import { type IntegrationSchema } from "../types";

export const socialIntegrations: IntegrationSchema[] = [
  {
    type: "tool_twitter",
    label: "X (Twitter)",
    category: "social",
    icon: "Twitter", // Map to a generic icon if missing
    description: "Post Tweets & Threads",
    inputs: [
      { key: "content", label: "Tweet Text", type: "textarea" },
      { key: "mediaIds", label: "Media IDs (Optional)", type: "text" },
    ],
  },
  {
    type: "tool_linkedin",
    label: "LinkedIn",
    category: "social",
    icon: "Linkedin",
    description: "Post to Profile/Page",
    inputs: [
      {
        key: "op",
        label: "Operation",
        type: "select",
        options: ["Create Post", "Get Profile"],
      },
      { key: "text", label: "Post Content", type: "textarea" },
      {
        key: "visibility",
        label: "Visibility",
        type: "select",
        options: ["PUBLIC", "CONNECTIONS"],
      },
    ],
  },
  {
    type: "tool_instagram",
    label: "Instagram",
    category: "social",
    icon: "Instagram",
    description: "Post Photos & Reels",
    inputs: [
      { key: "imageUrl", label: "Image URL", type: "text" },
      { key: "caption", label: "Caption", type: "textarea" },
    ],
  },
  {
    type: "tool_youtube",
    label: "YouTube",
    category: "social",
    icon: "Youtube",
    description: "Video Management",
    inputs: [
      {
        key: "op",
        label: "Operation",
        type: "select",
        options: ["Upload Video", "Update Metadata", "Get Stats"],
      },
      { key: "title", label: "Video Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },
  {
    type: "tool_discord",
    label: "Discord",
    category: "communication",
    icon: "MessageSquare",
    description: "Manage Servers & Bots",
    inputs: [
      { key: "channelId", label: "Channel ID", type: "text" },
      { key: "content", label: "Message Content", type: "textarea" },
      { key: "embed", label: "Embed JSON", type: "textarea" },
    ],
  },
  {
    type: "tool_whatsapp",
    label: "WhatsApp",
    category: "communication",
    icon: "MessageCircle",
    description: "Business API",
    inputs: [
      { key: "phone", label: "To Phone Number", type: "text" },
      { key: "template", label: "Template Name", type: "text" },
      { key: "vars", label: "Variables (JSON)", type: "textarea" },
    ],
  },
];
