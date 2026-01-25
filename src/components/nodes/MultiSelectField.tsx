import { type FieldProps, LABEL_CLASS } from "./common";

export const MultiSelectField = ({ field, value, onChange }: FieldProps) => {
  const selected = Array.isArray(value) ? value : [];

  // Define available tools (In a real app, fetch this from API)
  const options = field.options || [
    { value: "query_db_postgres", label: "Postgres DB" },
    { value: "send_sms_twilio", label: "Twilio SMS" },
    { value: "send_email_sendgrid", label: "SendGrid Email" },
    { value: "make_http_call", label: "HTTP Request" },
  ];

  const toggle = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((item: string) => item !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  return (
    <div className="group">
      <label className={LABEL_CLASS}>{field.label}</label>
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800 max-h-40 overflow-y-auto">
        {options.map((opt: any) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 p-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
          >
            <input
              type="checkbox"
              className="rounded text-blue-600 focus:ring-blue-500"
              checked={selected.includes(opt.value)}
              onChange={() => toggle(opt.value)}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
