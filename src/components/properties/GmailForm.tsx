import React from "react";
import { Paperclip, AlertCircle } from "lucide-react";

interface GmailFormProps {
  config: any;
  onChange: (key: string, value: any) => void;
}

export default function GmailForm({ config, onChange }: GmailFormProps) {
  return (
    <div className="space-y-4">
      {/* Operation */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
          Operation
        </label>
        <select
          className="w-full p-2 bg-white border border-gray-200 rounded text-sm focus:border-blue-500 outline-none"
          value={config.operation || "Send Email"}
          onChange={(e) => onChange("operation", e.target.value)}
        >
          <option value="Send Email">Send Email</option>
          <option value="Create Draft">Create Draft</option>
          <option value="Read Email">Read Email</option>
        </select>
      </div>

      {/* Gmail Account */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
          Gmail Account
        </label>
        <select
          className="w-full p-2 bg-white border border-gray-200 rounded text-sm focus:border-blue-500 outline-none"
          value={config.account || ""}
          onChange={(e) => onChange("account", e.target.value)}
        >
          <option value="" disabled>
            Select Account...
          </option>
          <option value="personal">mukund@gmail.com (Personal)</option>
          <option value="work">admin@company.com (Work)</option>
          <option value="add_new">+ Connect New Account</option>
        </select>
      </div>

      {/* To */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
          To
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-200 rounded text-sm focus:border-blue-500 outline-none"
          placeholder="recipient@example.com"
          value={config.to || ""}
          onChange={(e) => onChange("to", e.target.value)}
        />
      </div>

      {/* Subject */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
          Subject
        </label>
        <input
          type="text"
          className="w-full p-2 border border-gray-200 rounded text-sm focus:border-blue-500 outline-none"
          placeholder="Enter subject..."
          value={config.subject || ""}
          onChange={(e) => onChange("subject", e.target.value)}
        />
      </div>

      {/* Body */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
          Body
        </label>
        <textarea
          className="w-full p-2 border border-gray-200 rounded text-sm h-32 focus:border-blue-500 outline-none resize-none"
          placeholder="Type your message here..."
          value={config.body || ""}
          onChange={(e) => onChange("body", e.target.value)}
        />
      </div>

      {/* Content Type */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
          Content Type
        </label>
        <select
          className="w-full p-2 bg-white border border-gray-200 rounded text-sm focus:border-blue-500 outline-none"
          value={config.contentType || "Plain Text"}
          onChange={(e) => onChange("contentType", e.target.value)}
        >
          <option value="Plain Text">Plain Text</option>
          <option value="HTML">HTML</option>
        </select>
      </div>

      {/* Attachments */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 flex items-center gap-1">
          Attachments <Paperclip size={10} />
        </label>
        <div className="relative">
          <input
            type="text"
            className="w-full p-2 pl-8 border border-gray-200 rounded text-sm focus:border-blue-500 outline-none"
            placeholder="URL or Variable..."
            value={config.attachments || ""}
            onChange={(e) => onChange("attachments", e.target.value)}
          />
          <div className="absolute left-2.5 top-2.5 text-gray-400">
            <Paperclip size={14} />
          </div>
        </div>
      </div>

      {/* Error Indicator */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
          Error Output
        </label>
        <div className="bg-white border-l-4 border-red-500 rounded shadow-sm p-3 flex items-start gap-3">
          <AlertCircle size={16} className="text-red-500 mt-0.5" />
          <div className="text-xs text-gray-600">
            <span className="font-semibold text-gray-800 block mb-0.5">
              Error State
            </span>
            <span className="italic">null</span> (No active error)
          </div>
        </div>
      </div>
    </div>
  );
}
