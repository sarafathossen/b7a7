"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Trash2, RefreshCw, Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

// ১. অপ্টিমাইজেশন: মেমোইজড রো কম্পোনেন্ট (React.memo)
interface AmbulanceRowProps {
  amb: any;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const AmbulanceRow = React.memo(({ amb, onDelete, isDeleting }: AmbulanceRowProps) => {
  return (
    <div className="flex items-center border-b px-3 py-2.5 text-sm hover:bg-slate-50 transition-colors w-full bg-white">
      <div className="w-[30%] font-semibold text-slate-900 truncate pr-2">
        {amb.vehicleNumber}
      </div>
      <div className="w-[25%] text-slate-600 text-xs truncate pr-2">
        {amb.type}
      </div>
      <div className="w-[20%] font-medium text-slate-800">
        ৳{amb.basePrice}
      </div>
      <div className="w-[15%]">
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-block ${
            amb.isAvailable
              ? "bg-emerald-100 text-emerald-800"
              : "bg-slate-200 text-slate-700"
          }`}
        >
          {amb.isAvailable ? "Available" : "Engaged"}
        </span>
      </div>
      <div className="w-[10%] text-right">
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:bg-red-50 h-8 w-8 p-0"
          onClick={() => onDelete(amb.id)}
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});

AmbulanceRow.displayName = "AmbulanceRow";

export default function AdminAmbulancesPage() {
  const queryClient = useQueryClient();
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [type, setType] = useState("ADVANCED_LIFE_SUPPORT");
  const [basePrice, setBasePrice] = useState("2500");
  const [searchTerm, setSearchTerm] = useState("");

  // ২. সার্চ ইনপুটে ৩০০ms ডিবউন্স
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: rawAmbulances, isLoading, refetch } = useQuery({
    queryKey: ["adminAmbulances"],
    queryFn: async () => {
      const res = await api.get("/ambulances?page=1&limit=100");
      return res.data?.data?.result || res.data?.data || [];
    },
  });

  // ৩. মেমোইজড ফিল্টারিং
  const ambulances = useMemo(() => {
    const list = Array.isArray(rawAmbulances) ? rawAmbulances : [];
    if (!debouncedSearch) return list;
    const lower = debouncedSearch.toLowerCase();
    return list.filter(
      (a: any) =>
        a.vehicleNumber?.toLowerCase().includes(lower) ||
        a.type?.toLowerCase().includes(lower)
    );
  }, [rawAmbulances, debouncedSearch]);

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
      toast.success("নতুন অ্যাম্বুলেন্স সফলভাবে ফ্লিটে যুক্ত হয়েছে!");
      setVehicleNumber("");
      setBasePrice("2500");
      queryClient.invalidateQueries({ queryKey: ["adminAmbulances"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Validation Error: সঠিক তথ্য দিন";
      toast.error(msg);
    },
  });

  const deleteAmbulanceMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/ambulances/${id}`);
    },
    onSuccess: () => {
      toast.success("অ্যাম্বুলেন্সটি সফলভাবে মুছে ফেলা হয়েছে");
      queryClient.invalidateQueries({ queryKey: ["adminAmbulances"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "মুছে ফেলতে ব্যর্থ হয়েছে");
    },
  });

  const handleDelete = useCallback(
    (id: string) => {
      deleteAmbulanceMutation.mutate(id);
    },
    [deleteAmbulanceMutation]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNumber.trim()) {
      toast.error("গাড়ির নম্বর দিন");
      return;
    }

    createAmbulanceMutation.mutate({
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      type: type,
      basePrice: Number(basePrice),
      isAvailable: true,
    });
  };

  // ৪. TanStack Virtualizer সেটআপ (Requirement 3: দ্বিতীয় ভার্চুয়ালাইজড লিস্ট)
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: ambulances.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 48,
    overscan: 5,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          অ্যাম্বুলেন্স ফ্লিট ম্যানেজমেন্ট
        </h1>
        <p className="text-sm text-slate-500">
          নতুন অ্যাম্বুলেন্স যুক্ত করুন এবং প্রাপ্যতা পর্যবেক্ষণ করুন (ভার্চুয়ালাইজড)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-slate-200 shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-bold">নতুন অ্যাম্বুলেন্স যুক্ত করুন</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="vehicleNumber">গাড়ির নম্বর / প্লেট *</Label>
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
                <Label htmlFor="basePrice">ভিত্তি ভাড়া (Base Price) *</Label>
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

        <Card className="border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4">
            <div>
              <CardTitle className="text-lg font-bold">নিবন্ধিত ফ্লিট তালিকা</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                মোট অ্যাম্বুলেন্স: {ambulances.length} টি
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-3 text-slate-400" />
                <Input
                  placeholder="খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 pl-8 text-xs"
                />
              </div>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5 h-9">
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <Skeleton className="h-48 w-full rounded-lg" />
            ) : ambulances.length === 0 ? (
              <p className="text-center py-12 text-sm text-slate-500">কোনো অ্যাম্বুলেন্স পাওয়া যায়নি</p>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                {/* ফিক্সড হেডার */}
                <div className="flex bg-slate-50 border-b px-3 py-2.5 text-xs font-semibold text-slate-600 uppercase">
                  <div className="w-[30%]">গাড়ি নম্বর</div>
                  <div className="w-[25%]">ধরন</div>
                  <div className="w-[20%]">বেস প্রাইস</div>
                  <div className="w-[15%]">স্ট্যাটাস</div>
                  <div className="w-[10%] text-right">অ্যাকশন</div>
                </div>

                {/* ভার্চুয়ালাইজড লিস্ট কনটেইনার */}
                <div ref={tableContainerRef} className="h-[420px] overflow-auto relative">
                  <div
                    style={{
                      height: `${rowVirtualizer.getTotalSize()}px`,
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                      const amb = ambulances[virtualRow.index];
                      return (
                        <div
                          key={virtualRow.key}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: `${virtualRow.size}px`,
                            transform: `translateY(${virtualRow.start}px)`,
                          }}
                        >
                          <AmbulanceRow
                            amb={amb}
                            onDelete={handleDelete}
                            isDeleting={deleteAmbulanceMutation.isPending}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}