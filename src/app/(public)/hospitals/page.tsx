
"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Phone, MapPin, Activity } from "lucide-react";

export default function HospitalsPage() {
  const { data: hospitals, isLoading } = useQuery({
    queryKey: ["publicHospitals"],
    queryFn: async () => {
      const res = await api.get("/hospitals");
      return res.data?.data || [];
    },
  });

  return (
    <div className="container mx-auto px-4 sm:px-8 py-10 space-y-6">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">জরুরি হাসপাতাল ও স্বাস্থ্যকেন্দ্র</h1>
        <p className="text-sm text-slate-500 mt-1">
          জরুরি লাইফ-সাপোর্ট এবং অ্যাম্বুলেন্স পার্কিংযুক্ত নিকটস্থ হাসপাতালের তথ্য
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals?.map((hospital: any) => (
            <Card key={hospital.id} className="border-slate-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-red-600" />
                  {hospital.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" /> {hospital.address}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-500" /> {hospital.contactNumber}
                </p>
                <div className="pt-2 border-t flex justify-between items-center text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-red-500" /> ইমার্জেন্সি ইউনিট:
                  </span>
                  <span className="font-bold text-red-600">{hospital.emergencyUnits || 10} টি প্রস্তুত</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}