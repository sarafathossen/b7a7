// src/app/(dashboard)/caller/request-ambulance/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Card, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Ambulance, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldAlert,
  Hospital
} from "lucide-react";

// নির্দিষ্ট অ্যাম্বুলেন্স ক্যাটাগরি ও রেট
const FARE_MAP: Record<string, number> = {
  AC: 2500,
  NON_AC: 1500,
  ICU: 4000,
  FREEZER: 3500,
};

export default function RequestAmbulancePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    pickupAddress: "",
    destinationAddress: "ঢাকা মেডিকেল কলেজ হাসপাতাল",
    priority: "CRITICAL",
    ambulanceType: "AC",
    patientCondition: "",
    contactNumber: "01750187656",
  });

  // ডায়নামিক লাইভ ভাড়া
  const currentFare = FARE_MAP[formData.ambulanceType] ?? 2500;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1 && !formData.pickupAddress.trim()) {
      toast.error("অনুগ্রহ করে পিকআপের ঠিকানা লিখুন");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);

    // নির্বাচিত অ্যাম্বুলেন্স টাইপের আসল ভাড়া নির্ধারণ
    const finalFare = FARE_MAP[formData.ambulanceType] || 2500;

    // পোস্টম্যান কালেকশন ও প্রিজমা স্কিমা অনুযায়ী পে-লোড
    const payload = {
      pickupAddress: formData.pickupAddress,
      destinationAddress: formData.destinationAddress,
      priority: formData.priority,
      totalAmount: Number(finalFare),
    };

    try {
      const res = await api.post("/emergency-requests", payload);
      const savedData = res.data?.data || res.data;

      // লোকাল ক্যাশে সঠিক ভাড়াসহ সেভ রাখা
      const newItem = {
        id: savedData?.id || "REQ-" + Date.now(),
        pickupAddress: formData.pickupAddress,
        destinationAddress: formData.destinationAddress,
        priority: formData.priority,
        totalAmount: Number(finalFare),
        status: "PENDING",
        createdAt: new Date().toISOString(),
      };

      const existing = JSON.parse(localStorage.getItem("caller_requests_cache") || "[]");
      localStorage.setItem("caller_requests_cache", JSON.stringify([newItem, ...existing]));

      toast.success("অ্যাম্বুলেন্স রিকোয়েস্ট সফলভাবে গ্রহণ করা হয়েছে!");
      await queryClient.invalidateQueries({ queryKey: ["myEmergencyRequests"] });
      router.push("/caller");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "রিকোয়েস্ট পাঠাতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Ambulance className="w-6 h-6 text-red-600" /> জরুরি অ্যাম্বুলেন্স বুকিং
        </h1>
        <p className="text-sm text-slate-500">
          আপনার পছন্দ অনুযায়ী গন্তব্য হাসপাতাল ও অ্যাম্বুলেন্সের ধরন নির্ধারণ করুন।
        </p>
      </div>

      {/* ৩-স্টেপ প্রগ্রেস বার */}
      <div className="grid grid-cols-3 gap-2 pb-2">
        <div className={`flex items-center gap-2 border-b-2 py-2 text-xs font-semibold ${step >= 1 ? "border-red-600 text-red-600" : "border-slate-200 text-slate-400"}`}>
          <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold">১</span>
          লোকেশন ও হাসপাতাল
        </div>
        <div className={`flex items-center gap-2 border-b-2 py-2 text-xs font-semibold ${step >= 2 ? "border-red-600 text-red-600" : "border-slate-200 text-slate-400"}`}>
          <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold">২</span>
          অ্যাম্বুলেন্স ও ভাড়া
        </div>
        <div className={`flex items-center gap-2 border-b-2 py-2 text-xs font-semibold ${step >= 3 ? "border-red-600 text-red-600" : "border-slate-200 text-slate-400"}`}>
          <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold">৩</span>
          নিশ্চিতকরণ
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          {/* STEP 1: লোকেশন */}
          {step === 1 && (
            <div className="space-y-4">
              <CardTitle className="text-lg font-bold text-slate-800">পিকআপ ও গন্তব্য নির্ধারণ</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                রোগীর বর্তমান অবস্থান এবং যে হাসপাতালে নিতে চান তা নির্বাচন করুন।
              </CardDescription>

              <div className="space-y-2 pt-2">
                <Label htmlFor="pickupAddress" className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-red-600" /> পিকআপের ঠিকানা (আপনার লোকেশন) *
                </Label>
                <Input
                  id="pickupAddress"
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  placeholder="যেমন: বাড়ি ১২, রোড ৫, ধানমন্ডি / সাতক্ষীরা সদর"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destinationAddress" className="flex items-center gap-1.5 font-medium">
                  <Hospital className="w-4 h-4 text-blue-600" /> গন্তব্য হাসপাতাল নির্বাচন করুন
                </Label>
                <select
                  id="destinationAddress"
                  name="destinationAddress"
                  value={formData.destinationAddress}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="ঢাকা মেডিকেল কলেজ হাসপাতাল">ঢাকা মেডিকেল কলেজ হাসপাতাল</option>
                  <option value="বঙ্গবন্ধু শেখ মুজিব মেডিকেল বিশ্ববিদ্যালয় (BSMMU)">বঙ্গবন্ধু শেখ মুজিব মেডিকেল বিশ্ববিদ্যালয় (BSMMU)</option>
                  <option value="কুর্মিটোলা জেনারেল হাসপাতাল">কুর্মিটোলা জেনারেল হাসপাতাল</option>
                  <option value="স্কয়ার হাসপাতাল, পান্থপথ">স্কয়ার হাসপাতাল, পান্থপথ</option>
                  <option value="ইউনাইটেড হাসপাতাল, গুলশান">ইউনাইটেড হাসপাতাল, গুলশান</option>
                  <option value="সাতক্ষীরা সদর হাসপাতাল">সাতক্ষীরা সদর হাসপাতাল</option>
                  <option value="খুলনা মেডিকেল কলেজ হাসপাতাল">খুলনা মেডিকেল কলেজ হাসপাতাল</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">জরুরি মোবাইল নম্বর</Label>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* STEP 2: অ্যাম্বুলেন্স টাইপ ও লাইভ ভাড়া */}
          {step === 2 && (
            <div className="space-y-4">
              <CardTitle className="text-lg font-bold text-slate-800">অ্যাম্বুলেন্সের ধরন ও জরুরি মাত্রা</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                অ্যাম্বুলেন্সের ক্যাটাগরি পরিবর্তনের সাথে সাথে নির্ধারিত ভাড়া স্বয়ংক্রিয়ভাবে পরিবর্তিত হবে।
              </CardDescription>

              <div className="space-y-2 pt-2">
                <Label htmlFor="ambulanceType" className="flex items-center gap-1.5 font-medium">
                  <Ambulance className="w-4 h-4 text-red-600" /> অ্যাম্বুলেন্সের ক্যাটাগরি সিলেক্ট করুন
                </Label>
                <select
                  id="ambulanceType"
                  name="ambulanceType"
                  value={formData.ambulanceType}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="AC">এসি অ্যাম্বুলেন্স — ৳২,৫০০</option>
                  <option value="NON_AC">নন-এসি সাধারণ অ্যাম্বুলেন্স — ৳১,৫০০</option>
                  <option value="ICU">আইসিইউ ভেন্টিলেটর অ্যাম্বুলেন্স — ৳৪,০০০</option>
                  <option value="FREEZER">ফ্রিজার অ্যাম্বুলেন্স — ৳৩,৫০০</option>
                </select>
              </div>

              {/* সিলেক্ট করা অ্যাম্বুলেন্সের লাইভ ভাড়া কার্ড */}
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center text-sm">
                <div>
                  <span className="font-semibold text-slate-700 block">নির্বাচিত অ্যাম্বুলেন্সের নির্ধারিত ভাড়া:</span>
                  <span className="text-xs text-slate-500">{formData.ambulanceType} Ambulance Base Fare</span>
                </div>
                <span className="text-2xl font-bold text-red-600">৳{currentFare.toLocaleString()}</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> জরুরি মাত্রা (Priority)
                </Label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="CRITICAL">সংকটাপন্ন / ক্রিটিক্যাল</option>
                  <option value="HIGH">উচ্চ জরুরি (High Priority)</option>
                  <option value="MEDIUM">মাঝারি (Medium)</option>
                  <option value="LOW">সাধারণ / নন-ইমার্জেন্সি</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientCondition">রোগীর অবস্থা (সংক্ষেপে)</Label>
                <textarea
                  id="patientCondition"
                  name="patientCondition"
                  rows={2}
                  className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="যেমন: তীব্র শ্বাসকষ্ট, অক্সিজেন সাপোর্ট দরকার..."
                  value={formData.patientCondition}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* STEP 3: নিশ্চিতকরণ ও মোট ভাড়া */}
          {step === 3 && (
            <div className="space-y-4">
              <CardTitle className="text-lg font-bold text-slate-800">বুকিং সারসংক্ষেপ</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                সব তথ্য যাচাই করে সেন্ট্রাল ডিসপ্যাচ সিস্টেমে পাঠান।
              </CardDescription>

              <div className="rounded-lg bg-slate-50 p-4 border space-y-2 text-xs text-slate-700">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">পিকআপ লোকেশন:</span>
                  <span className="font-semibold text-slate-900">{formData.pickupAddress}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">গন্তব্য হাসপাতাল:</span>
                  <span className="font-semibold text-slate-900">{formData.destinationAddress}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">অ্যাম্বুলেন্সের ক্যাটাগরি:</span>
                  <span className="font-semibold text-red-600">{formData.ambulanceType} Ambulance</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">জরুরি মাত্রা:</span>
                  <span className="font-semibold text-amber-600">{formData.priority}</span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-bold">
                  <span>মোট ভাড়া:</span>
                  <span className="text-2xl text-red-600">৳{currentFare.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3 bg-red-50 rounded-lg flex items-start gap-2 text-xs text-red-800 border border-red-100">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>রিকোয়েস্ট সম্পন্ন হলে কলার ড্যাশবোর্ড থেকে সরাসরি বিকাশ দিয়ে এই নির্ধারিত ভাড়া পরিশোধ করতে পারবেন।</span>
              </div>
            </div>
          )}

          {/* নেভিগেশন কন্ট্রোল */}
          <div className="flex justify-between items-center pt-6 mt-6 border-t">
            {step > 1 ? (
              <Button variant="outline" size="sm" onClick={handleBack} disabled={loading} className="gap-1.5">
                <ArrowLeft className="w-4 h-4" /> আগের ধাপ
              </Button>
            ) : <div />}

            {step < 3 ? (
              <Button size="sm" onClick={handleNext} className="bg-red-600 hover:bg-red-700 text-white gap-1.5">
                পরবর্তী ধাপ <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button 
                size="sm" 
                onClick={handleSubmit} 
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white gap-1.5 font-bold shadow-md"
              >
                {loading ? "ডিসপ্যাচ হচ্ছে..." : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> রিকোয়েস্ট নিশ্চিত করুন (৳{currentFare.toLocaleString()})
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}