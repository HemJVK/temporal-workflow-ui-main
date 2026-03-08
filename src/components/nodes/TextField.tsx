import { type FieldProps, INPUT_BASE_CLASS, LABEL_CLASS } from "./common";

export const TextField = ({ field, value, onChange }: FieldProps) => {
  return (
    <div className="group">
      <label className={LABEL_CLASS}>{field.label}</label>
      {field.type === "textarea" ? (
        <textarea
          className={`${INPUT_BASE_CLASS} min-h-[100px] resize-none leading-relaxed`}
          placeholder={field.placeholder}
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={field.type === "password" ? "password" : "text"}
          className={`${INPUT_BASE_CLASS} ${field.type === "password" ? "font-mono" : ""
            }`}
          placeholder={field.placeholder}
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
};
