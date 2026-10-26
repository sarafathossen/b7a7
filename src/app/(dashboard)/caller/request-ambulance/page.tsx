
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  Hospital,
  Loader2,
} from "lucide-react";

export default function RequestAmbulancePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  
  const { data: hospitalData, isLoading: isLoadingHospitals } = useQuery({
    queryKey: ["hospitalsList"],
    queryFn: async () => {
      const res = await api.get("/hospitals");
      const list =
        res?.data?.data?.result ||
        res?.data?.data ||
        res?.data?.result ||
        res?.data ||
        [];
      return Array.isArray(list) ? list : [];
    },
  });

  const hospitalList: any[] = Array.isArray(hospitalData) ? hospitalData : [];

 
  const { data: ambulanceData, isLoading: isLoadingAmbulances } = useQuery({
    queryKey: ["availableAmbulances"],
    queryFn: async () => {
      const res = await api.get("/ambulances");
      const list =
        res?.data?.data?.result ||
        res?.data?.data ||
        res?.data?.result ||
        res?.data ||
        [];
      const array = Array.isArray(list) ? list : [];
     
      return array.filter((item: any) => item.isAvailable !== false && !item.isDeleted);
    },
  });

  const availableAmbulances: any[] = Array.isArray(ambulanceData) ? ambulanceData : [];

  // Form States
  const [formData, setFormData] = useState({
    pickupAddress: "",
    hospitalId: "",
    destinationAddress: "",
    ambulanceId: "",
    ambulanceNumber: "",
    ambulanceType: "",
    priority: "CRITICAL",
    totalAmount: 2500,
    patientCondition: "",
    contactNumber: "01750187656",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    
    if (name === "hospitalId") {
      const selectedHospital = hospitalList.find((h: any) => h.id === value);
      setFormData((prev) => ({
        ...prev,
        hospitalId: value,
        destinationAddress: selectedHospital?.name || selectedHospital?.address || "",
      }));
      return;
    }

    
    if (name === "ambulanceId") {
      const selectedAmb = availableAmbulances.find((a: any) => a.id === value);
      setFormData((prev) => ({
        ...prev,
        ambulanceId: value,
        ambulanceNumber: selectedAmb?.vehicleNumber || selectedAmb?.plateNumber || "",
        ambulanceType: selectedAmb?.type || selectedAmb?.category || "Standard",
        totalAmount: Number(selectedAmb?.basePrice || selectedAmb?.fare || 2500),
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.pickupAddress.trim()) {
        toast.error("অনুগ্রহ করে পিকআপের ঠিকানা লিখুন");
        return;
      }
      if (!formData.hospitalId) {
        toast.error("অনুগ্রহ করে তালিকা থেকে একটি হাসপাতাল নির্বাচন করুন");
        return;
      }
    }
    if (step === 2) {
      if (!formData.ambulanceId) {
        toast.error("অনুগ্রহ করে একটি এভেলেবেল অ্যাম্বুলেন্স সিলেক্ট করুন");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      pickupAddress: formData.pickupAddress,
      destinationAddress: formData.destinationAddress,
      hospitalId: formData.hospitalId,
      ambulanceId: formData.ambulanceId || undefined,
      priority: formData.priority,
      totalAmount: Number(formData.totalAmount),
    };

    try {
      const res = await api.post("/emergency-requests", payload);
      const savedData = res.data?.data || res.data;

      const newItem = {
        id: savedData?.id || "REQ-" + Date.now(),
        pickupAddress: formData.pickupAddress,
        destinationAddress: formData.destinationAddress,
        hospitalId: formData.hospitalId,
        ambulanceId: formData.ambulanceId,
        priority: formData.priority,
        totalAmount: Number(formData.totalAmount),
        status: "PENDING",
        createdAt: new Date().toISOString(),
      };

      const existing =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("caller_requests_cache") || "[]")
          : [];
      localStorage.setItem("caller_requests_cache", JSON.stringify([newItem, ...existing]));

      toast.success("অ্যাম্বুলেন্স রিকোয়েস্ট সফলভাবে গ্রহণ করা হয়েছে!");

      await queryClient.invalidateQueries({ queryKey: ["myAmbulanceRequests"] });
      await queryClient.invalidateQueries({ queryKey: ["callerRequests"] });

      router.push("/caller");
      router.refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "রিকোয়েস্ট পাঠাতে সমস্যা হয়েছে");
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
          আপনার পছন্দ অনুযায়ী গন্তব্য হাসপাতাল ও নির্দিষ্ট অ্যাম্বুলেন্স নির্বাচন করুন।
        </p>
      </div>

      
      <div className="grid grid-cols-3 gap-2 pb-2">
        <div
          className={`flex items-center gap-2 border-b-2 py-2 text-xs font-semibold ${
            step >= 1 ? "border-red-600 text-red-600" : "border-slate-200 text-slate-400"
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold">
            ১
          </span>
          লোকেশন ও হাসপাতাল
        </div>
        <div
          className={`flex items-center gap-2 border-b-2 py-2 text-xs font-semibold ${
            step >= 2 ? "border-red-600 text-red-600" : "border-slate-200 text-slate-400"
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold">
            ২
          </span>
          অ্যাম্বুলেন্স ও ভাড়া
        </div>
        <div
          className={`flex items-center gap-2 border-b-2 py-2 text-xs font-semibold ${
            step >= 3 ? "border-red-600 text-red-600" : "border-slate-200 text-slate-400"
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold">
            ৩
          </span>
          নিশ্চিতকরণ
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm bg-white">
        <CardContent className="p-6">
          
          {step === 1 && (
            <div className="space-y-4">
              <CardTitle className="text-lg font-bold text-slate-800">
                পিকআপ ও গন্তব্য নির্ধারণ
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                রোগীর বর্তমান অবস্থান এবং ডেটাবেজে নিবন্ধিত নির্দিষ্ট হাসপাতাল নির্বাচন করুন।
              </CardDescription>

              <div className="space-y-2 pt-2">
                <Label htmlFor="pickupAddress" className="flex items-center gap-1.5 font-medium text-xs">
                  <MapPin className="w-4 h-4 text-red-600" /> পিকআপের ঠিকানা (আপনার লোকেশন) *
                </Label>
                <Input
                  id="pickupAddress"
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  placeholder="যেমন: বাড়ি ১২, রোড ৫, ধানমন্ডি / সাতক্ষীরা সদর"
                  className="text-xs"
                  required
                />
              </div>

              
              <div className="space-y-2">
                <Label htmlFor="hospitalId" className="flex items-center gap-1.5 font-medium text-xs">
                  <Hospital className="w-4 h-4 text-blue-600" /> গন্তব্য হাসপাতাল নির্বাচন করুন *
                </Label>

                {isLoadingHospitals ? (
                  <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-red-600" /> হাসপাতাল তালিকা লোড হচ্ছে...
                  </div>
                ) : (
                  <select
                    id="hospitalId"
                    name="hospitalId"
                    value={formData.hospitalId}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">হাসপাতাল সিলেক্ট করুন...</option>
                    {hospitalList.map((h: any) => (
                      <option key={h.id} value={h.id}>
                        {h.name} {h.address ? `(${h.address})` : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber" className="text-xs font-medium">
                  জরুরি মোবাইল নম্বর
                </Label>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="text-xs"
                />
              </div>
            </div>
          )}

        
          {step === 2 && (
            <div className="space-y-4">
              <CardTitle className="text-lg font-bold text-slate-800">
                অ্যাম্বুলেন্সের ধরন ও জরুরি মাত্রা
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                ফ্লিটে বর্তমানে সক্রিয় ও এভেলেবেল থাকা অ্যাম্বুলেন্সগুলোর তালিকা।
              </CardDescription>

              <div className="space-y-2 pt-2">
                <Label htmlFor="ambulanceId" className="flex items-center gap-1.5 font-medium text-xs">
                  <Ambulance className="w-4 h-4 text-red-600" /> এভেলেবেল অ্যাম্বুলেন্স নির্বাচন করুন *
                </Label>

                {isLoadingAmbulances ? (
                  <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-red-600" /> অ্যাম্বুলেন্স লোড হচ্ছে...
                  </div>
                ) : availableAmbulances.length === 0 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                    বর্তমানে কোনো অ্যাম্বুলেন্স এভেলেবেল নেই। কিছু সময় পর পুনরায় চেষ্টা করুন।
                  </div>
                ) : (
                  <select
                    id="ambulanceId"
                    name="ambulanceId"
                    value={formData.ambulanceId}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">অ্যাম্বুলেন্স সিলেক্ট করুন...</option>
                    {availableAmbulances.map((amb: any) => {
                      const plate = amb.vehicleNumber || amb.plateNumber || amb.id.slice(0, 8);
                      const type = amb.type || amb.category || "General";
                      const fare = amb.basePrice || amb.fare || 2500;
                      return (
                        <option key={amb.id} value={amb.id}>
                          {plate} — {type} (ভাড়া: ৳{Number(fare).toLocaleString()})
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>

              
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center text-sm">
                <div>
                  <span className="font-semibold text-slate-700 block text-xs">
                    নির্বাচিত অ্যাম্বুলেন্সের নির্ধারিত বেস প্রাইস:
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {formData.ambulanceNumber ? `${formData.ambulanceNumber} (${formData.ambulanceType})` : "অ্যাম্বুলেন্স নির্বাচন করুন"}
                  </span>
                </div>
                <span className="text-xl font-bold text-red-600">
                  ৳{Number(formData.totalAmount).toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="flex items-center gap-1.5 font-medium text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> জরুরি মাত্রা (Priority)
                </Label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="CRITICAL">সংকটাপন্ন / ক্রিটিক্যাল</option>
                  <option value="HIGH">উচ্চ জরুরি (High Priority)</option>
                  <option value="MEDIUM">মাঝারি (Medium)</option>
                  <option value="LOW">সাধারণ / নন-ইমার্জেন্সি</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientCondition" className="text-xs font-medium">
                  রোগীর অবস্থা (সংক্ষেপে)
                </Label>
                <textarea
                  id="patientCondition"
                  name="patientCondition"
                  rows={2}
                  className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="যেমন: তীব্র শ্বাসকষ্ট, অক্সিজেন সাপোর্ট দরকার..."
                  value={formData.patientCondition}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

         
          {step === 3 && (
            <div className="space-y-4">
              <CardTitle className="text-lg font-bold text-slate-800">
                বুকিং সারসংক্ষেপ
              </CardTitle>
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
                  <span className="font-semibold text-slate-900">
                    {formData.destinationAddress || "নির্দিষ্ট হাসপাতাল"}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">নির্বাচিত অ্যাম্বুলেন্স:</span>
                  <span className="font-semibold text-red-600">
                    {formData.ambulanceNumber || "অ্যাম্বুলেন্স"} ({formData.ambulanceType})
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">জরুরি মাত্রা:</span>
                  <span className="font-semibold text-amber-600">{formData.priority}</span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-bold">
                  <span>মোট নির্ধারিত ভাড়া:</span>
                  <span className="text-xl text-red-600">
                    ৳{Number(formData.totalAmount).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-red-50 rounded-lg flex items-start gap-2 text-xs text-red-800 border border-red-100">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>
                  রিকোয়েস্ট সম্পন্ন হলে কলার ড্যাশবোর্ড থেকে সরাসরি বিকাশ দিয়ে এই নির্ধারিত ভাড়া পরিশোধ করতে পারবেন।
                </span>
              </div>
            </div>
          )}

          
          <div className="flex justify-between items-center pt-6 mt-6 border-t">
            {step > 1 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                disabled={loading}
                className="gap-1.5 text-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> আগের ধাপ
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button
                size="sm"
                onClick={handleNext}
                disabled={step === 1 ? isLoadingHospitals : isLoadingAmbulances}
                className="bg-red-600 hover:bg-red-700 text-white gap-1.5 text-xs"
              >
                পরবর্তী ধাপ <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white gap-1.5 font-bold shadow-md text-xs"
              >
                {loading ? (
                  "ডিসপ্যাচ হচ্ছে..."
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> রিকোয়েস্ট নিশ্চিত করুন (৳{Number(formData.totalAmount).toLocaleString()})
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