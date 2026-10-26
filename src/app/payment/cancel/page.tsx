
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, ArrowLeft } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center border-slate-200 shadow-sm p-4">
        <CardContent className="space-y-4 pt-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">পেমেন্ট বাতিল করা হয়েছে</h2>
          <p className="text-sm text-slate-500">
            আপনি পেমেন্ট প্রক্রিয়াটি সম্পন্ন করেননি। আপনার সুবিধাজনক সময়ে আবার পেমেন্ট করতে পারবেন।
          </p>
          <div className="pt-2">
            <Link href="/caller">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" /> কলার ড্যাশবোর্ডে ফিরে যান
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}