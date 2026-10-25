// src/app/(public)/contact/page.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MapPin, Send, AlertCircle, Headphones } from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("আপনার বার্তাটি সেন্ট্রাল সাপোর্টে সফলভাবে পাঠানো হয়েছে!");
      setLoading(false);
      (e.target as HTMLFormElement).reset();
    }, 600);
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 py-12 max-w-5xl space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-red-600 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">
          ২৪/৭ জরুরি হেল্পলাইন
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">আমাদের সাথে যোগাযোগ করুন</h1>
        <p className="text-sm text-slate-600">
          জরুরি অ্যাম্বুলেন্স সহায়তা অথবা অভিযোগের জন্য আমাদের সেন্ট্রাল কন্ট্রোল রুমে যোগাযোগ করুন।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Emergency Info Card */}
        <div className="space-y-6">
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-red-600">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h3 className="font-bold text-lg">জরুরি পরিস্থিতিতে সরাসরি কল করুন</h3>
              </div>
              <p className="text-xs text-slate-600">
                তাৎক্ষণিক মেডিকেল ইমার্জেন্সিতে ফর্ম পূরণের অপেক্ষা না করে সরাসরি আমাদের টোল-ফ্রি ও জরুরি নম্বরে কল করুন।
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-3 text-sm font-bold text-slate-900 bg-white p-3 rounded-lg border">
                  <Phone className="w-5 h-5 text-red-600" />
                  <span>জরুরি ডিসপ্যাচ: 01750187656 / 999</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-slate-900 bg-white p-3 rounded-lg border">
                  <Headphones className="w-5 h-5 text-blue-600" />
                  <span>হেল্পডেস্ক: +880 1700-000000</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3 text-sm text-slate-600">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>hello.sarafat@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>সাতক্ষীরা সদর ও ঢাকা সেন্ট্রাল হাব, বাংলাদেশ</span>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">বার্তা বা মতামত পাঠান</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">আপনার নাম</Label>
                <Input id="name" required placeholder="পুরো নাম লিখুন" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">মোবাইল নম্বর</Label>
                <Input id="phone" required placeholder="01XXXXXXXXX" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">বার্তা</Label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  className="w-full rounded-md border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="আপনার বার্তা বা প্রশ্ন লিখুন..."
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white gap-2">
                <Send className="w-4 h-4" /> {loading ? "পাঠানো হচ্ছে..." : "বার্তা পাঠান"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}