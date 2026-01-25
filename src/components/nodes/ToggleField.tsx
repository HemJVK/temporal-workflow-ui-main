import { type FieldProps, LABEL_CLASS } from "./common";

export const ToggleField = ({ field, value, onChange }: FieldProps) => {
  return (
    <div className="group">
      <label className={LABEL_CLASS}>{field.label}</label>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(!value)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
            value ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <span
            className={`block w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
              value ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
          {value ? "Enabled" : "Disabled"}
        </span>
      </div>
    </div>
  );
};
