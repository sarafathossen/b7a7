// src/app/(dashboard)/caller/request-ambulance/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
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

export default function RequestAmbulancePage() {
  const router = useRouter();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.pickupAddress.trim()) {
        toast.error("অনুগ্রহ করে পিকআপ লোকেশন লিখুন");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Calculate estimated cost based on ambulance tier
      const costMap: Record<string, number> = {
        NON_AC: 1500,
        AC: 2500,
        ICU: 4000,
        FREEZER: 3500,
      };

      await api.post("/emergency-requests", {
        pickupAddress: formData.pickupAddress,
        destinationAddress: formData.destinationAddress,
        priority: formData.priority,
        ambulanceType: formData.ambulanceType,
        totalAmount: costMap[formData.ambulanceType] || 2500,
        description: formData.patientCondition || "জরুরি রোগী স্থানান্তর",
      });

      toast.success("অ্যাম্বুলেন্স রিকোয়েস্ট সফলভাবে সেন্ট্রাল ডিসপ্যাচে পাঠানো হয়েছে!");
      router.push("/caller");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "রিকোয়েস্ট পাঠাতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Ambulance className="w-6 h-6 text-red-600" /> জরুরি অ্যাম্বুলেন্স বুকিং
        </h1>
        <p className="text-sm text-slate-500">
          নিকটস্থ সক্রিয় অ্যাম্বুলেন্স ও হাসপাতালের সাথে দ্রুত সংযোগ স্থাপন করুন।
        </p>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-3 gap-2 pb-2">
        <div className={`flex items-center gap-2 border-b-2 py-2 text-xs font-semibold ${step >= 1 ? "border-red-600 text-red-600" : "border-slate-200 text-slate-400"}`}>
          <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold">১</span>
          লোকেশন ও হাসপাতাল
        </div>
        <div className={`flex items-center gap-2 border-b-2 py-2 text-xs font-semibold ${step >= 2 ? "border-red-600 text-red-600" : "border-slate-200 text-slate-400"}`}>
          <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold">২</span>
          অ্যাম্বুলেন্স ও অবস্থা
        </div>
        <div className={`flex items-center gap-2 border-b-2 py-2 text-xs font-semibold ${step >= 3 ? "border-red-600 text-red-600" : "border-slate-200 text-slate-400"}`}>
          <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold">৩</span>
          কনফার্মেশন ও খরচ
        </div>
      </div>

      {/* Form Wizard Card */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          {/* STEP 1: Locations */}
          {step === 1 && (
            <div className="space-y-4">
              <CardTitle className="text-lg font-bold text-slate-800">পিকআপ ও গন্তব্য নির্ধারণ</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                রোগীর বর্তমান অবস্থান এবং যে হাসপাতালে নিতে চান তা নির্বাচন করুন।
              </CardDescription>

              <div className="space-y-2 pt-2">
                <Label htmlFor="pickupAddress" className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-600" /> পিকআপের ঠিকানা (আপনার বর্তমান লোকেশন) *
                </Label>
                <Input
                  id="pickupAddress"
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  placeholder="যেমন: বাড়ি ১২, রোড ৫, ধানমন্ডি, ঢাকা"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destinationAddress" className="flex items-center gap-1.5">
                  <Hospital className="w-3.5 h-3.5 text-blue-600" /> গন্তব্য হাসপাতাল
                </Label>
                <Select
                  id="destinationAddress"
                  name="destinationAddress"
                  value={formData.destinationAddress}
                  onChange={handleChange}
                >
                  <SelectItem value="ঢাকা মেডিকেল কলেজ হাসপাতাল">ঢাকা মেডিকেল কলেজ হাসপাতাল</SelectItem>
                  <SelectItem value="বঙ্গবন্ধু শেখ মুজিব মেডিকেল বিশ্ববিদ্যালয় (BSMMU)">বঙ্গবন্ধু শেখ মুজিব মেডিকেল বিশ্ববিদ্যালয় (BSMMU)</SelectItem>
                  <SelectItem value="কুর্মিটোলা জেনারেল হাসপাতাল">কুর্মিটোলা জেনারেল হাসপাতাল</SelectItem>
                  <SelectItem value="স্কয়ার হাসপাতাল, পান্থপথ">স্কয়ার হাসপাতাল, পান্থপথ</SelectItem>
                  <SelectItem value="ইউনাইটেড হাসপাতাল, গুলশান">ইউনাইটেড হাসপাতাল, গুলশান</SelectItem>
                  <SelectItem value="সাতক্ষীরা সদর হাসপাতাল">সাতক্ষীরা সদর হাসপাতাল</SelectItem>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">জরুরি যোগাযোগ নম্বর</Label>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="01XXXXXXXXX"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Vehicle & Medical Tiers */}
          {step === 2 && (
            <div className="space-y-4">
              <CardTitle className="text-lg font-bold text-slate-800">রোগীর অবস্থা ও অ্যাম্বুলেন্সের ধরন</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                সঠিক অ্যাম্বুলেন্স পাঠাতে রোগীর শারীরিক সংকটাপন্নতার মাত্রা নির্বাচন করুন।
              </CardDescription>

              <div className="space-y-2 pt-2">
                <Label htmlFor="priority" className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> জরুরি মাত্রা (Priority Level)
                </Label>
                <Select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <SelectItem value="CRITICAL">সংকটাপন্ন / ক্রিটিক্যাল (অবিলম্বে লাইফ সাপোর্ট প্রয়োজন)</SelectItem>
                  <SelectItem value="HIGH">জরুরি (হাই প্রায়োরিটি)</SelectItem>
                  <SelectItem value="MEDIUM">মাঝারি (স্ট্যান্ডার্ড ট্রান্সপোর্ট)</SelectItem>
                  <SelectItem value="LOW">সাধারণ চেকআপ / নন-ইমার্জেন্সি</SelectItem>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ambulanceType" className="flex items-center gap-1.5">
                  <Ambulance className="w-3.5 h-3.5 text-red-600" /> অ্যাম্বুলেন্সের ক্যাটাগরি
                </Label>
                <Select
                  id="ambulanceType"
                  name="ambulanceType"
                  value={formData.ambulanceType}
                  onChange={handleChange}
                >
                  <SelectItem value="AC">এসি অ্যাম্বুলেন্স (বেস রেট: ৳২৫০০)</SelectItem>
                  <SelectItem value="NON_AC">নন-এসি সাধারণ অ্যাম্বুলেন্স (বেস রেট: ৳১৫০০)</SelectItem>
                  <SelectItem value="ICU">আইসিইউ লাইফ সাপোর্ট ভেন্টিলেটর (বেস রেট: ৳৪০০০)</SelectItem>
                  <SelectItem value="FREEZER">ফ্রিজার অ্যাম্বুলেন্স (বেস রেট: ৳৩৫০০)</SelectItem>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientCondition">রোগীর লক্ষণ / অবস্থা (সংক্ষেপে)</Label>
                <textarea
                  id="patientCondition"
                  name="patientCondition"
                  rows={2}
                  className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="যেমন: তীব্র শ্বাসকষ্ট, অক্সিজেন সাপোর্ট দরকার ইত্যাদি..."
                  value={formData.patientCondition}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Summary & Dispatch Confirmation */}
          {step === 3 && (
            <div className="space-y-4">
              <CardTitle className="text-lg font-bold text-slate-800">বুকিং বিবরণী ও নিশ্চিতকরণ</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                সকল তথ্য যাচাই করে সেন্ট্রাল ডিসপ্যাচ সিস্টেমে রিকোয়েস্ট পাঠান।
              </CardDescription>

              <div className="rounded-lg bg-slate-50 p-4 border space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">পিকআপ লোকেশন:</span>
                  <span className="font-semibold text-slate-900">{formData.pickupAddress}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">গন্তব্য হাসপাতাল:</span>
                  <span className="font-semibold text-slate-900">{formData.destinationAddress}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">নির্বাচিত অ্যাম্বুলেন্স:</span>
                  <span className="font-semibold text-red-600">{formData.ambulanceType} Ambulance</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">ইমার্জেন্সি প্রায়োরিটি:</span>
                  <span className="font-semibold text-amber-600">{formData.priority}</span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-bold text-slate-900">
                  <span>আনুমানিক ভাড়া:</span>
                  <span className="text-red-600">
                    ৳{formData.ambulanceType === "ICU" ? "৪,০০০" : formData.ambulanceType === "AC" ? "২,৫০০" : formData.ambulanceType === "FREEZER" ? "৩,৫০০" : "১,৫০০"}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-red-50 rounded-lg flex items-start gap-2.5 text-xs text-red-800 border border-red-100">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>কল নিশ্চিত করার সাথে সাথে নিকটস্থ চালককে নোটিফিকেশন পাঠানো হবে। ট্রিপ চলাকালীন বা শেষে বিকাশ (bKash) দিয়ে ভাড়া পরিশোধ করতে পারবেন।</span>
              </div>
            </div>
          )}

          {/* Wizard Action Controls */}
          <div className="flex justify-between items-center pt-6 mt-6 border-t">
            {step > 1 ? (
              <Button variant="outline" size="sm" onClick={handleBack} disabled={loading} className="gap-1.5">
                <ArrowLeft className="w-4 h-4" /> পূর্ববর্তী ধাপ
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
                    <CheckCircle2 className="w-4 h-4" /> রিকোয়েস্ট নিশ্চিত করুন
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