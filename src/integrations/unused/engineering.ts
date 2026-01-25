import type { IntegrationSchema } from "../types";

export const engineeringIntegrations: IntegrationSchema[] = [
  {
    type: "tool_github",
    label: "GitHub",
    category: "engineering",
    icon: "Code",
    description: "Manage Repos, Issues & PRs",
    inputs: [
      {
        key: "op",
        label: "Operation",
        type: "select",
        options: ["Get Issue", "Create Issue", "List PRs", "Trigger Workflow"],
      },
      {
        key: "repo",
        label: "Repository",
        type: "text",
        placeholder: "owner/repo",
      },
      { key: "title", label: "Issue Title", type: "text" },
      { key: "body", label: "Body", type: "textarea" },
    ],
  },
  {
    type: "tool_gitlab",
    label: "GitLab",
    category: "engineering",
    icon: "Code",
    description: "DevOps Lifecycle Tool",
    inputs: [
      {
        key: "op",
        label: "Operation",
        type: "select",
        options: ["Create Merge Request", "Get Pipeline", "Create Issue"],
      },
      { key: "projectId", label: "Project ID", type: "text" },
    ],
  },
  {
    type: "tool_jira",
    label: "Jira Software",
    category: "engineering",
    icon: "Layers",
    description: "Issue & Project Tracking",
    inputs: [
      {
        key: "op",
        label: "Action",
        type: "select",
        options: ["Create Issue", "Update Issue", "Transition Issue"],
      },
      { key: "projectKey", label: "Project Key", type: "text" },
      { key: "summary", label: "Summary", type: "text" },
      {
        key: "issuetype",
        label: "Issue Type",
        type: "select",
        options: ["Bug", "Story", "Task"],
      },
    ],
  },
  {
    type: "tool_linear",
    label: "Linear",
    category: "engineering",
    icon: "Layers",
    description: "Issue tracking for modern teams",
    inputs: [
      {
        key: "op",
        label: "Action",
        type: "select",
        options: ["Create Issue", "Update Issue"],
      },
      { key: "teamId", label: "Team ID", type: "text" },
      { key: "title", label: "Title", type: "text" },
    ],
  },
  {
    type: "tool_sentry",
    label: "Sentry",
    category: "engineering",
    icon: "AlertTriangle",
    description: "Error Tracking",
    inputs: [
      {
        key: "op",
        label: "Action",
        type: "select",
        options: ["List Issues", "Resolve Issue"],
      },
      { key: "orgSlug", label: "Organization Slug", type: "text" },
    ],
  },
  {
    type: "tool_pagerduty",
    label: "PagerDuty",
    category: "engineering",
    icon: "Bell",
    description: "Incident Management",
    inputs: [
      {
        key: "op",
        label: "Action",
        type: "select",
        options: [
          "Trigger Incident",
          "Acknowledge Incident",
          "Resolve Incident",
        ],
      },
      { key: "routingKey", label: "Integration Key", type: "password" },
      { key: "summary", label: "Incident Summary", type: "text" },
    ],
  },
  {
    type: "tool_circleci",
    label: "CircleCI",
    category: "engineering",
    icon: "RefreshCw",
    description: "CI/CD Pipelines",
    inputs: [
      {
        key: "op",
        label: "Action",
        type: "select",
        options: ["Trigger Pipeline", "Get Build Status"],
      },
      { key: "projectSlug", label: "Project Slug", type: "text" },
    ],
  },
  {
    type: "tool_jenkins",
    label: "Jenkins",
    category: "engineering",
    icon: "Settings",
    description: "Automation Server",
    inputs: [
      { key: "jobName", label: "Job Name", type: "text" },
      { key: "params", label: "Build Parameters (JSON)", type: "textarea" },
    ],
  },
  {
    type: "tool_docker",
    label: "Docker Hub",
    category: "engineering",
    icon: "Box",
    description: "Container Registry",
    inputs: [
      { key: "image", label: "Image Name", type: "text" },
      { key: "tag", label: "Tag", type: "text" },
    ],
  },
  {
    type: "tool_kubernetes",
    label: "Kubernetes",
    category: "engineering",
    icon: "Grid",
    description: "Container Orchestration",
    inputs: [
      {
        key: "op",
        label: "Action",
        type: "select",
        options: ["Get Pods", "Scale Deployment", "Apply YAML"],
      },
      {
        key: "namespace",
        label: "Namespace",
        type: "text",
        defaultValue: "default",
      },
      { key: "manifest", label: "Manifest (YAML)", type: "textarea" },
    ],
  },
];
