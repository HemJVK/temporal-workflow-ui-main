import { ChevronDown } from "lucide-react";
import { type FieldProps, INPUT_BASE_CLASS, LABEL_CLASS } from "./common";

export const SelectField = ({ field, value, onChange }: FieldProps) => {
  return (
    <div className="group">
      <label className={LABEL_CLASS}>{field.label}</label>
      <div className="relative">
        <select
          className={`${INPUT_BASE_CLASS} appearance-none cursor-pointer`}
          value={(value as string) || (field.defaultValue as string) || ""}
          onChange={(e) => onChange(e.target.value)}
        >
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-2.5 pointer-events-none text-gray-400">
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
};
