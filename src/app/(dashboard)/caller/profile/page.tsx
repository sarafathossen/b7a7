// src/app/(dashboard)/caller/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Mail, Loader2, Save } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "ন্যূনতম ২ অক্ষরের নাম লিখুন"),
  phone: z.string().regex(/^01[3-9]\d{8}$/, "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      const res = await api.get("/users/me");
      return res.data?.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || "",
        phone: profile.phone || "",
      });
    }
  }, [profile, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      return api.patch("/users/me", data);
    },
    onSuccess: () => {
      toast.success("প্রোফাইল সফলভাবে আপডেট করা হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "প্রোফাইল আপডেট করতে সমস্যা হয়েছে");
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 my-6">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 text-red-600 rounded-full">
              <User className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl">আমার প্রোফাইল</CardTitle>
              <CardDescription>ব্যক্তিগত তথ্য পর্যালোচনা ও আপডেট করুন</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">পুরো নাম</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">ইমেইল (পরিবর্তনযোগ্য নয়)</Label>
              <Input id="email" value={profile?.email || ""} disabled className="bg-slate-50 cursor-not-allowed" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone">মোবাইল নম্বর</Label>
              <Input id="phone" {...register("phone")} />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                তথ্য সংরক্ষণ করুন
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}