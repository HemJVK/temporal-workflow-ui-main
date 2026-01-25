import { CheckCircle2, Loader2 } from "lucide-react";

export const StatusIcon = ({ status }: { status?: string }) => {
  if (status === "running")
    return <Loader2 size={16} className="text-blue-500 animate-spin" />;
  if (status === "completed")
    return <CheckCircle2 size={16} className="text-green-500" />;
  if (status === "failed")
    return <div className="w-2 h-2 rounded-full bg-red-500" />;
  return null;
};
