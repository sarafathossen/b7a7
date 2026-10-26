
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 bg-slate-100 text-slate-600 rounded-full mb-4">
        <FileQuestion className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 mb-2">৪০৪</h1>
      <h2 className="text-xl font-semibold text-slate-700 mb-2">পেজটি পাওয়া যায়নি</h2>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        আপনি যে পেজটি খুঁজছেন তা মুছে ফেলা হয়েছে অথবা লিংকটি ভুল।
      </p>
      <Link href="/">
        <Button className="bg-red-600 hover:bg-red-700">
          <Home className="w-4 h-4 mr-2" /> হোম পেজে ফিরে যান
        </Button>
      </Link>
    </div>
  );
}