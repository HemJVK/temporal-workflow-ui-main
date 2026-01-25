import { Info } from "lucide-react";
import { TextField } from "./TextField";
import { SelectField } from "./SelectField";
import { ToggleField } from "./ToggleField";
import { ListField } from "./ListField";
import { type FieldProps } from "./common";
import { MultiSelectField } from "./MultiSelectField";

export const FieldFactory = (props: FieldProps) => {
  const { field } = props;

  let Component = TextField; // Default

  switch (field.type) {
    case "text":
    case "textarea":
    case "password":
      Component = TextField;
      break;
    case "select":
      Component = SelectField;
      break;
    case "boolean":
      Component = ToggleField;
      break;
    case "field_list":
      Component = ListField;
      break;
    case "multiselect":
      Component = MultiSelectField;
      break;
    default:
      // Keep TextField as fallback
      break;
  }

  return (
    <div>
      <Component {...props} />
      {field.helperText && (
        <div className="flex items-start gap-1.5 mt-2 text-gray-400 dark:text-gray-500">
          <Info size={12} className="mt-0.5 shrink-0" />
          <p className="text-[10px] leading-tight">{field.helperText}</p>
        </div>
      )}
    </div>
  );
};
