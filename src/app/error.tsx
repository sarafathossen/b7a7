// src/app/error.tsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 bg-red-50 text-red-600 rounded-full mb-4">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">কোথাও একটি সমস্যা হয়েছে!</h2>
      <p className="text-sm text-slate-600 max-w-md mb-6">
        সিস্টেম থেকে কাঙ্ক্ষিত তথ্য লোড করা সম্ভব হয়নি। দয়া করে আবার চেষ্টা করুন।
      </p>
      <Button onClick={() => reset()} className="bg-red-600 hover:bg-red-700">
        <RefreshCw className="w-4 h-4 mr-2" /> পুনরায় চেষ্টা করুন
      </Button>
    </div>
  );
}