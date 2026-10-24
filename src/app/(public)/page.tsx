// src/app/(public)/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ambulance, ShieldCheck, Clock, MapPin, Activity, PhoneCall } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-red-50 to-white py-16 sm:py-24 border-b">
        <div className="container mx-auto px-4 sm:px-8 text-center max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5 animate-spin" /> ২৪/৭ লাইভ ইমার্জেন্সি ডিসপ্যাচ
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            জরুরি মুহূর্তে দ্রুততম সময়ে <span className="text-red-600">অ্যাম্বুলেন্স</span> আপনার দরজায়
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            রিয়েল-টাইম ট্র্যাকিং, ভেরিফায়েড ড্রাইভার এবং আইসিইউ সুবিধাসহ দেশের সবচেয়ে নির্ভরযোগ্য ডিজিটাল অ্যাম্বুলেন্স নেটওয়ার্ক।
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/caller/request-ambulance" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold h-12 px-8 text-base shadow-lg shadow-red-600/20">
                <Ambulance className="w-5 h-5 mr-2" /> এখনই অ্যাম্বুলেন্স কল করুন
              </Button>
            </Link>
            <Link href="/hospitals" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-6">
                <MapPin className="w-4 h-4 mr-2 text-red-500" /> নিকটস্থ হাসপাতাল তালিকা
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center p-4">
            <CardContent className="p-0">
              <p className="text-2xl sm:text-3xl font-bold text-red-600">১২ মিনিট</p>
              <p className="text-xs text-slate-500 font-medium">গড় রেসপন্স টাইম</p>
            </CardContent>
          </Card>
          <Card className="text-center p-4">
            <CardContent className="p-0">
              <p className="text-2xl sm:text-3xl font-bold text-slate-800">৫০+ হাসপাতাল</p>
              <p className="text-xs text-slate-500 font-medium">কানেক্টেড পার্টনার</p>
            </CardContent>
          </Card>
          <Card className="text-center p-4">
            <CardContent className="p-0">
              <p className="text-2xl sm:text-3xl font-bold text-slate-800">১০০% ভেরিফাইড</p>
              <p className="text-xs text-slate-500 font-medium">লাইসেন্সপ্রাপ্ত ড্রাইভার</p>
            </CardContent>
          </Card>
          <Card className="text-center p-4">
            <CardContent className="p-0">
              <p className="text-2xl sm:text-3xl font-bold text-emerald-600">২৪/৭</p>
              <p className="text-xs text-slate-500 font-medium">সার্বক্ষণিক কন্ট্রোল রুম</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="container mx-auto px-4 sm:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold">কেন AmbuQuick বেছে নেবেন?</h2>
          <p className="text-sm text-slate-500">জরুরি সেবায় কোনো কালক্ষেপণ নয়</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-200">
            <CardContent className="p-6 space-y-3">
              <div className="p-3 bg-red-100 text-red-600 rounded-xl w-fit">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">দ্রুততম ডিসপ্যাচ</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                আপনার লোকেশনের নিকটবর্তী সক্রিয় অ্যাম্বুলেন্সকে মুহূর্তেই অ্যাসাইন করা হয় স্বয়ংক্রিয় অ্যালগরিদমের মাধ্যমে।
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-6 space-y-3">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl w-fit">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">লাইফ-সাপোর্ট ও আইসিইউ</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                সাধারণ রোগী স্থানান্তর থেকে শুরু করে ভেন্টিলেটর এবং পূর্ণাঙ্গ আইসিইউ সংবলিত আধুনিক অ্যাম্বুলেন্স সেবা।
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-6 space-y-3">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl w-fit">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">অনলাইন পেমেন্ট ও সাপোর্ট</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                সহজে বিকাশ (bKash) ও ডিজিটাল পেমেন্ট সুবিধা এবং নির্ধারিত ভাড়ার নিশ্চয়তা।
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}