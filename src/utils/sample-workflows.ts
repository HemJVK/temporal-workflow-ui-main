export const SAMPLE_WORKFLOWS = [
  {
    id: "sample_1",
    workflowId: "sample_web_scraper",
    name: "Template: Web Scraper to DB",
    updatedAt: new Date().toISOString(),
    nodes: [
      { id: "start_1", type: "trigger_start", position: { x: 100, y: 100 }, data: { label: "Start", type: "trigger_start", config: { triggerType: "Manual" } } },
      { id: "action_1", type: "make_http_call", position: { x: 350, y: 100 }, data: { label: "Fetch Page", type: "make_http_call", config: { method: "GET", url: "https://example.com" } } },
      { id: "action_2", type: "query_db_postgres", position: { x: 600, y: 100 }, data: { label: "Save HTML", type: "query_db_postgres", config: { query: "INSERT INTO scraped (content) VALUES ($1)" } } }
    ],
    edges: [
      { id: "e1", source: "start_1", target: "action_1" },
      { id: "e2", source: "action_1", target: "action_2" }
    ]
  },
  {
    id: "sample_2",
    workflowId: "sample_basic_ai",
    name: "Template: Basic QA Agent",
    updatedAt: new Date().toISOString(),
    nodes: [
      { id: "start_2", type: "trigger_start", position: { x: 100, y: 100 }, data: { label: "Start", type: "trigger_start", config: { triggerType: "Manual" } } },
      { id: "action_3", type: "tool_generic_llm", position: { x: 400, y: 100 }, data: { label: "Prompt Expert", type: "tool_generic_llm", config: { userPrompt: "Explain quantum computing in exact one sentence." } } }
    ],
    edges: [
      { id: "e3", source: "start_2", target: "action_3" }
    ]
  }
];
