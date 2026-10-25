// src/app/(dashboard)/admin/ambulances/page.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Ambulance, Plus, Trash2, RefreshCw } from "lucide-react";

export default function AdminAmbulancesPage() {
  const queryClient = useQueryClient();
  const [vehicleNumber, setVehicleNumber] = useState("");
  // ১. ডিফল্ট স্টেট
  const [type, setType] = useState("ADVANCED_LIFE_SUPPORT");
  const [basePrice, setBasePrice] = useState("2500");

  // অ্যাম্বুলেন্স তালিকা ফেচ করা
  const { data: ambulances, isLoading, refetch } = useQuery({
    queryKey: ["adminAmbulances"],
    queryFn: async () => {
      const res = await api.get("/ambulances?page=1&limit=50");
      return res.data?.data?.result || res.data?.data || [];
    },
  });

  // নতুন অ্যাম্বুলেন্স যোগ করার মিউটেশন
  const createAmbulanceMutation = useMutation({
    mutationFn: async (payload: {
      vehicleNumber: string;
      type: string;
      basePrice: number;
      isAvailable: boolean;
    }) => {
      return await api.post("/ambulances", payload);
    },
    onSuccess: () => {
      toast.success("নতুন অ্যাম্বুলেন্স সফলভাবে ফ্লিটে যুক্ত হয়েছে!");
      setVehicleNumber("");
      setBasePrice("2500");
      queryClient.invalidateQueries({ queryKey: ["adminAmbulances"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Validation Error: সঠিক তথ্য দিন";
      toast.error(msg);
    },
  });

  // অ্যাম্বুলেন্স মুছে ফেলার মিউটেশন
  const deleteAmbulanceMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/ambulances/${id}`);
    },
    onSuccess: () => {
      toast.success("অ্যাম্বুলেন্সটি সফলভাবে মুছে ফেলা হয়েছে");
      queryClient.invalidateQueries({ queryKey: ["adminAmbulances"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "মুছে ফেলতে ব্যর্থ হয়েছে");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNumber.trim()) {
      toast.error("গাড়ির নম্বর দিন");
      return;
    }

    createAmbulanceMutation.mutate({
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      type: type, // পোস্টম্যান অনুযায়ী সঠিক Enum মান
      basePrice: Number(basePrice), // অবশ্যই সংখ্যা হিসেবে রূপান্তর
      isAvailable: true,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">অ্যাম্বুলেন্স ফ্লিট ম্যানেজমেন্ট</h1>
        <p className="text-sm text-slate-500">নতুন অ্যাম্বুলেন্স যুক্ত করুন এবং প্রাপ্যতা পর্যবেক্ষণ করুন</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ফর্ম সেকশন */}
        <Card className="border-slate-200 shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-bold">নতুন অ্যাম্বুলেন্স যুক্ত করুন</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="vehicleNumber">গাড়ির নম্বর / প্লেট *</Label>
                <Input
                  id="vehicleNumber"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="যেমন: SATKHIRA-METRO-EM-01"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="type">অ্যাম্বুলেন্সের ধরন *</Label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="ADVANCED_LIFE_SUPPORT">Advanced Life Support (ALS / এসি)</option>
                  <option value="BASIC_LIFE_SUPPORT">Basic Life Support (BLS / নন-এসি)</option>
                  <option value="ICU_AMBULANCE">ICU অ্যাম্বুলেন্স (লাইফ সাপোর্ট)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="basePrice">ভিত্তি ভাড়া (Base Price) *</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  placeholder="2500"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={createAmbulanceMutation.isPending}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                {createAmbulanceMutation.isPending ? "যোগ হচ্ছে..." : "অ্যাম্বুলেন্স যুক্ত করুন"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* টেবিল সেকশন */}
        <Card className="border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-bold">নিবন্ধিত ফ্লিট তালিকা</CardTitle>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
              <RefreshCw className="w-4 h-4" /> রিফ্রেশ
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-32 w-full rounded-lg" />
            ) : !ambulances || ambulances.length === 0 ? (
              <p className="text-center py-8 text-sm text-slate-500">কোনো অ্যাম্বুলেন্স পাওয়া যায়নি</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b bg-slate-50 text-xs font-semibold text-slate-600">
                    <tr>
                      <th className="p-3">গাড়ি নম্বর</th>
                      <th className="p-3">ধরন</th>
                      <th className="p-3">বেস প্রাইস</th>
                      <th className="p-3">স্ট্যাটাস</th>
                      <th className="p-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {ambulances.map((amb: any) => (
                      <tr key={amb.id} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">{amb.vehicleNumber}</td>
                        <td className="p-3 text-slate-600 text-xs">{amb.type}</td>
                        <td className="p-3 font-medium text-slate-800">৳{amb.basePrice}</td>
                        <td className="p-3">
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${amb.isAvailable ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                              }`}
                          >
                            {amb.isAvailable ? "Available" : "Engaged"}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => deleteAmbulanceMutation.mutate(amb.id)}
                            disabled={deleteAmbulanceMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}