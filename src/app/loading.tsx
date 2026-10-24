// src/app/loading.tsx
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-10 h-10 animate-spin text-red-600" />
      <p className="text-sm font-medium text-slate-500">ডাটা লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</p>
    </div>
  );
}