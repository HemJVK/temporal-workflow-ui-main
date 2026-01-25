import { Plus, X } from "lucide-react";
import { type FieldProps, INPUT_BASE_CLASS, LABEL_CLASS } from "./common";

export const ListField = ({ field, value, onChange }: FieldProps) => {
  const items = Array.isArray(value) ? value : [];

  const addItem = () => {
    // Create new item based on subFields structure
    const newItem =
      field.subFields?.reduce(
        (acc: any, curr: any) => ({ ...acc, [curr.key]: "" }),
        {}
      ) || {};
    onChange([...items, newItem]);
  };

  const removeItem = (index: number) => {
    const newList = [...items];
    newList.splice(index, 1);
    onChange(newList);
  };

  const updateItem = (index: number, key: string, val: string) => {
    const newList = [...items];
    newList[index] = { ...newList[index], [key]: val };
    onChange(newList);
  };

  return (
    <div className="group mt-2">
      <div className="flex justify-between items-center mb-2">
        <label className={LABEL_CLASS}>{field.label}</label>
      </div>

      <div className="space-y-3">
        {items.map((item: any, i: number) => (
          <div
            key={i}
            className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 relative"
          >
            <button
              onClick={() => removeItem(i)}
              className="absolute right-2 top-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>

            <div className="space-y-2 pr-4">
              {field.subFields?.map((sub: any) => (
                <div key={sub.key} className="flex flex-col gap-1">
                  <input
                    className={`${INPUT_BASE_CLASS} py-1.5 text-xs`}
                    placeholder={sub.placeholder || sub.label}
                    value={item[sub.key] || ""}
                    onChange={(e) => updateItem(i, sub.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={addItem}
          className="w-full py-2 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={14} /> Add Field
        </button>
      </div>
    </div>
  );
};
