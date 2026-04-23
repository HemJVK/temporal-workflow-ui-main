import type { IntegrationSchema } from "../types";

export const aiIntegrations: IntegrationSchema[] = [
  {
    type: "tool_generic_llm",
    label: "LLM",
    category: "ai",
    icon: "Cpu",
    description: "LLM",
    inputs: [
      {
        key: "op",
        label: "Operation",
        type: "select",
        defaultValue: "Chat Completion",
        options: ["Chat Completion", "Image Generation", "Embeddings"],
      },
      {
        key: "model",
        label: "Model",
        type: "select",
        defaultValue: "google/gemini-2.0-flash-lite-preview-02-05:free",
        options: [
          "google/gemini-2.0-flash-lite-preview-02-05:free",
          "meta-llama/llama-3.3-70b-instruct:free",
          "nvidia/nemotron-3-super-120b-a12b:free",
          "meta-llama/llama-4-scout:free",
          "meta-llama/llama-4-maverick:free",
          "deepseek/deepseek-r1:free",
          "gpt-4o",
          "gpt-4o-mini",
          "gemini-2.5-pro",
          "gemini-2.5-flash",
          "claude-3-5-sonnet-20240620",
          "claude-3-opus-20240229",
          "llama3-70b-8192",
          "mixtral-8x7b-32768",
        ],
      },
      {
        key: "systemPrompt",
        label: "System Prompt",
        type: "textarea",
        placeholder: "You are a helpful assistant...",
        defaultValue: "You are a helpful assistant.",
      },
      {
        key: "userPrompt",
        label: "User Prompt",
        type: "textarea",
        placeholder: "Analyze the following text: {{loopItem.content}}",
        helperText: "Use {{variables}} to insert data from previous steps.",
      },
      {
        key: "temp",
        label: "Temperature",
        type: "range",
        defaultValue: 1,
        min: 0,
        max: 1,
      },
      {
        key: "boundTools",
        label: "Bind Tools (Agent Mode)",
        type: "multiselect",
        description: "Select tools this LLM is allowed to call.",
      },
      {
        key: "mcpServers",
        label: "Bind MCP Plugins",
        type: "mcp_select",
        description: "Select installed MCP plugins for this Agent."
      },
      {
        key: "maxRetries",
        label: "Max API Retries",
        type: "number",
        defaultValue: "3",
        placeholder: "e.g. 3",
        helperText: "How many times to retry on 500/RateLimit errors.",
      },
      {
        key: "maxIterations",
        label: "Max Agent Steps",
        type: "number",
        defaultValue: "2",
        placeholder: "e.g. 2",
        helperText: "Prevent the Agent from looping infinitely.",
      },
      {
        key: "jsonMode",
        label: "JSON Mode",
        type: "boolean",
        defaultValue: false,
      },
      {
        key: "outputFields",
        label: "Structured Output (JSON Schema)",
        type: "field_list",
        description:
          "Define the fields you want the AI to extract. If empty, returns plain text.",
        subFields: [
          {
            key: "name",
            label: "Key Name",
            type: "text",
            placeholder: "e.g. sentiment",
            defaultValue: "",
          },
          {
            key: "type",
            label: "Data Type",
            type: "select",
            options: ["string", "number", "boolean"],
            defaultValue: "string",
          },
          {
            key: "description",
            label: "Description",
            type: "text",
            placeholder: "Instructions for the AI...",
            defaultValue: "",
          },
        ],
      },
    ],
  },
  {
    type: "agent_researcher",
    label: "Deep Researcher",
    category: "ai",
    icon: "Globe",
    description:
      "Autonomous LangGraph agent that searches the web and synthesizes findings.",
    inputs: [
      {
        key: "model",
        label: "Reasoning Model",
        type: "select",
        defaultValue: "google/gemini-2.0-flash-lite-preview-02-05:free",
        options: [
          "google/gemini-2.0-flash-lite-preview-02-05:free",
          "meta-llama/llama-3.3-70b-instruct:free",
          "nvidia/nemotron-3-super-120b-a12b:free",
          "meta-llama/llama-4-maverick:free",
          "deepseek/deepseek-r1:free",
          "gpt-4o",
          "gemini-2.5-pro",
          "claude-3-5-sonnet-20240620",
          "claude-3-opus-20240229",
          "llama3-70b-8192"
        ],
        helperText:
          "Complex research requires smarter models (Nemotron 120B or GPT-4o recommended).",
      },
      {
        key: "topic",
        label: "Research Topic / Query",
        type: "textarea",
        placeholder:
          "e.g. Find the latest stock price and news for {{loopItem.company}}...",
        helperText:
          "Describe exactly what you want the agent to find. Supports {{variables}}.",
      },
      {
        key: "maxIterations",
        label: "Max Loop Steps",
        type: "number",
        defaultValue: "3",
        placeholder: "3",
        helperText:
          "Safety limit. Determines how many times the agent can search & read before forcing an answer.",
      },
      {
        key: "searchProvider",
        label: "Search Provider",
        type: "select",
        defaultValue: "Tavily",
        options: ["Tavily", "Google Serper", "Bing"],
        helperText:
          "Ensure the API key for the selected provider is set in your .env",
      },
    ],
  },
  {
    type: "ai_agent",
    label: "Custom AI Agent",
    category: "ai",
    icon: "Bot",
    description: "An AI Agent executing custom logic.",
    inputs: [
      {
        key: "agentName",
        label: "Agent Name",
        type: "text",
        placeholder: "e.g. Writer Agent"
      },
      {
        key: "systemPrompt",
        label: "System Prompt",
        type: "textarea",
        placeholder: "You are an expert..."
      },
      {
        key: "userPrompt",
        label: "User Prompt",
        type: "textarea",
        defaultValue: "{{input}}",
        helperText: "Input variables"
      }
    ]
  }
];
