import { type IntegrationField } from "../../integrations/types";

export interface FieldProps {
  field: IntegrationField;
  value: any;
  onChange: (value: any) => void;
}

export const INPUT_BASE_CLASS =
  "w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm";

export const LABEL_CLASS =
  "text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 block";
