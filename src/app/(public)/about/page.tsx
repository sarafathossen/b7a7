
import { Card, CardContent } from "@/components/ui/card";
import { Ambulance, ShieldCheck, HeartPulse, Award, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-8 py-12 space-y-12 max-w-5xl">
      
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">
          আমাদের লক্ষ্য ও উদ্দেশ্য
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          জরুরি স্বাস্থ্যসেবায় সময় বাঁচানোই আমাদের মূল অঙ্গীকার
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          AmbuQuick হলো একটি সমন্বিত ডিজিটাল ইমার্জেন্সি ডিসপ্যাচ প্ল্যাটফর্ম, যা রোগী, অ্যাম্বুলেন্স চালক এবং হাসপাতালের মধ্যে রিয়েল-টাইম সেতুবন্ধন তৈরি করে।
        </p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200">
          <CardContent className="p-6 space-y-3">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl w-fit">
              <Ambulance className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg">দ্রুততম ডিসপ্যাচ</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              জরুরি মুহূর্তে কয়েক ক্লিকের মধ্যে নিকটস্থ ফ্রি অ্যাম্বুলেন্সকে রোগীর লোকেশনে পৌঁছে দেওয়ার জন্য আধুনিক ট্র্যাকিং অ্যালগরিদম।
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-6 space-y-3">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg">যাচাইকৃত নেটওয়ার্ক</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              আমাদের সকল ড্রাইভার এবং অ্যাম্বুলেন্স লাইসেন্সপ্রাপ্ত ও সার্টিফাইড, যা নিরাপদ ও পেশাদার রোগী পরিবহন নিশ্চিত করে।
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-6 space-y-3">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl w-fit">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg">স্বচ্ছ ভাড়া নীতি</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              কোনো প্রকার অতিরিক্ত বা লুকায়িত চার্জ নেই। ফিক্সড বেস প্রাইস এবং সরাসরি ডিজিটাল ভেরিফায়েড পেমেন্ট সুবিধা।
            </p>
          </CardContent>
        </Card>
      </div>

      
      <div className="bg-slate-50 p-8 rounded-2xl border space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">কেন আমরা এই প্ল্যাটফর্ম গড়ে তুলেছি?</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          বাংলাদেশে সড়ক যোগাযোগ ও ট্রাফিক ব্যবস্থাপনায় রোগীর জন্য সময়মতো অ্যাম্বুলেন্স পাওয়া অনেক বড় চ্যালেঞ্জ। সঠিক সমন্বয়ের অভাবে বহু মূল্যবান প্রাণ নষ্ট হয়। আমাদের প্ল্যাটফর্মটি রোগীদের কল পাওয়ার সাথে সাথে অ্যাডমিন ডিসপ্যাচ প্যানেল থেকে নিকটবর্তী অ্যাম্বুলেন্স চালককে রুট ও রোগীর অবস্থার সঠিক বিবরণ পৌঁছে দেয়, যেন প্রতিটি সেকেন্ডকে কাজে লাগানো যায়।
        </p>
      </div>
    </div>
  );
}