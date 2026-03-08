import {
  Bot,
  Mail,
  Search,
  Database,
  MessageSquare,
  Globe,
  Cpu,
  Table,
  FileText,
  Cloud,
  Layers,
  Calendar,
  CreditCard,
  Code,
  Zap,
} from "lucide-react";
import type { ElementType } from "react";

export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "multiselect"
  | "password"
  | "number"
  | "range"
  | "boolean"
  | "field_list"
  | "logic_loop"
  | "make_http_call"
  | "mcp_select"
  | "json";

export interface IntegrationField {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  helperText?: string;
  defaultValue?: unknown;
  subFields?: IntegrationField[];
  description?: string;
  min?: number;
  max?: number;
}

export interface IntegrationSchema {
  type: string;
  label: string;
  category: string;
  icon: string;
  description: string;
  visualType?: "default" | "condition" | "router";
  inputs: IntegrationField[];
}

// Map strings to actual Icon Components for the UI to use
export const ICON_MAP: Record<string, ElementType> = {
  Bot,
  Mail,
  Search,
  Database,
  MessageSquare,
  Globe,
  Cpu,
  Table,
  FileText,
  Cloud,
  Layers,
  Calendar,
  CreditCard,
  Code,
  Zap,
};
