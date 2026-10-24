// src/app/(dashboard)/admin/ambulances/page.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Ambulance, Loader2 } from "lucide-react";

export default function AdminAmbulancesPage() {
  const queryClient = useQueryClient();
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [type, setType] = useState("ICU_AMBULANCE");
  const [basePrice, setBasePrice] = useState("2500");

  const { data: ambulances, isLoading } = useQuery({
    queryKey: ["allAmbulances"],
    queryFn: async () => {
      const res = await api.get("/ambulances");
      return res.data?.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      return api.post("/ambulances", {
        vehicleNumber,
        type,
        basePrice: Number(basePrice),
        isAvailable: true,
      });
    },
    onSuccess: () => {
      toast.success("নতুন অ্যাম্বুলেন্স তালিকাভুক্ত হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["allAmbulances"] });
      setVehicleNumber("");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "যুক্ত করতে ব্যর্থ হয়েছে");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/ambulances/${id}`);
    },
    onSuccess: () => {
      toast.success("অ্যাম্বুলেন্স রিমুভ করা হয়েছে");
      queryClient.invalidateQueries({ queryKey: ["allAmbulances"] });
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">অ্যাম্বুলেন্স ফ্লিট ম্যানেজমেন্ট</h1>
        <p className="text-sm text-slate-500">নতুন অ্যাম্বুলেন্স যুক্ত করুন এবং প্রাপ্যতা পর্যবেক্ষণ করুন</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ফর্ম: নতুন অ্যাম্বুলেন্স যুক্ত */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">নতুন অ্যাম্বুলেন্স যুক্ত করুন</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium">গাড়ির নম্বর / প্লেট</label>
              <Input
                placeholder="যেমন: DHAKA-METRO-EM-05"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">অ্যাম্বুলেন্সের ধরন</label>
              <select
                className="w-full border rounded-md p-2 text-sm bg-background"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="ICU_AMBULANCE">ICU অ্যাম্বুলেন্স</option>
                <option value="AC_AMBULANCE">AC অ্যাম্বুলেন্স</option>
                <option value="NORMAL_AMBULANCE">সাধারণ নন-এসি</option>
                <option value="FREEZER_AMBULANCE">ফ্রিজার অ্যাম্বুলেন্স</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium">ভিত্তি ভাড়া (Base Price)</label>
              <Input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
              />
            </div>

            <Button
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={!vehicleNumber || createMutation.isPending}
              onClick={() => createMutation.mutate()}
            >
              <Plus className="w-4 h-4 mr-1.5" /> অ্যাম্বুলেন্স যুক্ত করুন
            </Button>
          </CardContent>
        </Card>

        {/* টেবিল: অ্যাম্বুলেন্স তালিকা */}
        <div className="lg:col-span-2 border rounded-xl bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>গাড়ি নম্বর</TableHead>
                <TableHead>ধরন</TableHead>
                <TableHead>বেস প্রাইস</TableHead>
                <TableHead>স্ট্যাটাস</TableHead>
                <TableHead className="text-right">অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-red-600" />
                  </TableCell>
                </TableRow>
              ) : ambulances?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    কোনো অ্যাম্বুলেন্স পাওয়া যায়নি
                  </TableCell>
                </TableRow>
              ) : (
                ambulances?.map((amb: any) => (
                  <TableRow key={amb.id}>
                    <TableCell className="font-semibold text-sm">{amb.vehicleNumber}</TableCell>
                    <TableCell className="text-xs">{amb.type}</TableCell>
                    <TableCell>৳{amb.basePrice}</TableCell>
                    <TableCell>
                      <Badge variant={amb.isAvailable ? "default" : "secondary"}>
                        {amb.isAvailable ? "Available" : "On Trip"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => deleteMutation.mutate(amb.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}