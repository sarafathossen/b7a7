
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const requestId = searchParams.get("requestId");
  const paymentStatus = searchParams.get("status");

  useEffect(() => {
    if (paymentStatus === "cancel" || paymentStatus === "failure") {
      setStatus("failed");
      return;
    }

    
    queryClient.invalidateQueries();
    setStatus("success");

    const timer = setTimeout(() => {
      router.replace("/caller");
    }, 2000);

    return () => clearTimeout(timer);
  }, [paymentStatus, queryClient, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border p-8 text-center space-y-6">
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="w-16 h-16 animate-spin text-red-600 mx-auto" />
            <h2 className="text-xl font-bold text-slate-800">পেমেন্ট যাচাই করা হচ্ছে...</h2>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
            <h2 className="text-xl font-bold text-slate-800">পেমেন্ট সফল হয়েছে!</h2>
            {requestId && (
              <p className="text-xs text-slate-400 font-mono">ট্রিপ আইডি: {requestId}</p>
            )}
            <p className="text-sm text-slate-500">আপনাকে কলার ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...</p>
            <Button
              onClick={() => router.replace("/caller")}
              className="bg-red-600 hover:bg-red-700 text-white w-full"
            >
              ড্যাশবোর্ডে ফিরে যান
            </Button>
          </div>
        )}

        {status === "failed" && (
          <div className="space-y-4">
            <XCircle className="w-16 h-16 text-red-600 mx-auto" />
            <h2 className="text-xl font-bold text-slate-800">পেমেন্ট বাতিল হয়েছে</h2>
            <Button
              onClick={() => router.replace("/caller/request-ambulance")}
              className="bg-slate-800 hover:bg-slate-900 text-white w-full"
            >
              পুনরায় চেষ্টা করুন
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}