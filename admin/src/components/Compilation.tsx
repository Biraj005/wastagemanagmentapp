import { AlertCircle } from "lucide-react";

export default function ComplaintIcon() {
  return (
    <div className="flex items-center gap-2 text-red-500">
      <AlertCircle size={20} />
    </div>
  );
}