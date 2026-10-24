// src/app/(public)/contact/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneCall, Mail, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = () => {
    toast.success("আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে! আমাদের টিম শীঘ্রই যোগাযোগ করবে।");
    reset();
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 py-12 max-w-4xl space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold">যোগাযোগ করুন</h1>
        <p className="text-sm text-slate-500">জরুরি সহায়তা বা যেকোনো অনুসন্ধানে সার্বক্ষণিক কন্ট্রোল রুমের সাথে যোগাযোগ করুন</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Card className="p-4 border-slate-200">
            <div className="flex items-center gap-3">
              <PhoneCall className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-xs text-slate-500">জরুরি কল (২৪/৭)</p>
                <p className="text-sm font-bold">১৬২৬৩ / ৯৯৯</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-slate-200">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-slate-500">ইমেইল</p>
                <p className="text-sm font-bold">support@ambuquick.com</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-slate-200">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-xs text-slate-500">প্রধান কার্যালয়</p>
                <p className="text-sm font-bold">ধানমন্ডি, ঢাকা, বাংলাদেশ</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="md:col-span-2 border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">সরাসরি মেসেজ পাঠান</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label>আপনার নাম</Label>
                <Input required placeholder="নাম লিখুন" {...register("name")} />
              </div>
              <div className="space-y-1">
                <Label>ইমেইল বা ফোন</Label>
                <Input required placeholder="যোগাযোগের নম্বর বা ইমেইল" {...register("contact")} />
              </div>
              <div className="space-y-1">
                <Label>বার্তা / বিষয়</Label>
                <textarea
                  required
                  rows={4}
                  className="w-full border rounded-md p-2 text-sm bg-background"
                  placeholder="আপনার বার্তা বিস্তারিত লিখুন..."
                  {...register("message")}
                />
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                <Send className="w-4 h-4 mr-2" /> বার্তা পাঠান
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}