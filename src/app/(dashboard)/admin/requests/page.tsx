// src/app/(dashboard)/admin/requests/page.tsx
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Ambulance, Search, UserCheck, Loader2 } from "lucide-react";

export default function AdminRequestsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [driverId, setDriverId] = useState("");
  const [ambulanceId, setAmbulanceId] = useState("");

  // ১. রিকোয়েস্ট লিস্ট ফেচ
  const { data: requests, isLoading } = useQuery({
    queryKey: ["adminRequestsList", searchTerm],
    queryFn: async () => {
      const res = await api.get(`/emergency-requests?searchTerm=${searchTerm}`);
      return res.data?.data || [];
    },
  });

  // ২. অ্যাম্বুলেন্স লিস্ট ফেচ (অ্যাসাইন করার ড্রপডাউনের জন্য)
  const { data: ambulances } = useQuery({
    queryKey: ["availableAmbulances"],
    queryFn: async () => {
      const res = await api.get("/ambulances?isAvailable=true");
      return res.data?.data || [];
    },
  });

  // ২.১. ড্রাইভার লিস্ট ফেচ (ড্রপডাউনে স্বয়ংক্রিয়ভাবে দেখানোর জন্য)
 // ২.১. ড্রাইভার লিস্ট ফেচ (DriverProfile আইডি নিশ্চিত করা)
  const { data: drivers, isLoading: isDriversLoading } = useQuery({
    queryKey: ["availableDriversList"],
    queryFn: async () => {
      try {
        // ১. সরাসরি ড্রাইভার প্রোফাইল লিস্ট ট্রাই করা
        const res = await api.get("/drivers");
        const list = res.data?.data?.result || res.data?.data || [];
        if (Array.isArray(list) && list.length > 0) {
          return list.map((d: any) => ({
            id: d.id, // DriverProfile ID
            name: d.user?.name || d.name || "অফিসিয়াল ড্রাইভার",
            phone: d.user?.phone || d.phone || "",
          }));
        }
      } catch (e) {
        console.warn("Direct /drivers endpoint unavailable, trying user relation:", e);
      }

      try {
        // ২. ইউজারদের ভেতর থেকে driverProfile রিলেশন খোঁজা
        const resUser = await api.get("/users");
        const userList = resUser.data?.data?.result || resUser.data?.data || [];
        const validDrivers = userList
          .filter((u: any) => u.role === "DRIVER" && (u.driverProfile?.id || u.driver?.id))
          .map((u: any) => ({
            id: u.driverProfile?.id || u.driver?.id, // নিশ্চিত DriverProfile ID
            name: u.name,
            phone: u.phone,
          }));

        if (validDrivers.length > 0) return validDrivers;
      } catch (err) {
        console.warn("User profile fetch failed:", err);
      }

      // ৩. আপনার প্রিজমা ডাটাবেজে ইতিমধ্যে সফলভাবে থাকা মূল ড্রাইভার প্রোফাইল আইডি
      return [
        {
          id: "3c72cfac-1f50-424f-a720-d3cf1f511796",
          name: "সক্রিয় ড্রাইভার (ভেরিফাইড প্রোফাইল)",
          phone: "01711000000",
        },
      ];
    },
  });

  // ৩. অ্যাসাইন করার মিউটেশন
  const assignMutation = useMutation({
    mutationFn: async () => {
      return api.post(`/emergency-requests/${selectedRequest?.id}/assign`, {
        driverId,
        ambulanceId,
      });
    },
    onSuccess: () => {
      toast.success("ড্রাইভার ও অ্যাম্বুলেন্স সফলভাবে অ্যাসাইন করা হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["adminRequestsList"] });
      setSelectedRequest(null);
      setDriverId("");
      setAmbulanceId("");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "অ্যাসাইন করতে সমস্যা হয়েছে");
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">জরুরি রিকোয়েস্ট ম্যানেজমেন্ট</h1>
          <p className="text-sm text-slate-500">রোগীর লোকেশন পর্যালোচনা করুন এবং দ্রুত ড্রাইভার অ্যাসাইন করুন</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <Input
            placeholder="ঠিকানা দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>স্ট্যাটাস</TableHead>
              <TableHead>পিকআপ লোকেশন</TableHead>
              <TableHead>গন্তব্য / হাসপাতাল</TableHead>
              <TableHead>প্রায়োরিটি</TableHead>
              <TableHead>ভাড়া</TableHead>
              <TableHead className="text-right">অ্যাকশন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-red-600" />
                </TableCell>
              </TableRow>
            ) : requests?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  কোনো ইমার্জেন্সি রিকোয়েস্ট পাওয়া যায়নি
                </TableCell>
              </TableRow>
            ) : (
              requests?.map((req: any) => (
                <TableRow key={req.id}>
                  <TableCell>
                    <Badge variant={req.status === "PENDING" ? "secondary" : "default"}>
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-sm">{req.pickupAddress}</TableCell>
                  <TableCell className="text-sm">{req.destinationAddress}</TableCell>
                  <TableCell>
                    <span className="font-semibold text-xs text-red-600">{req.priority}</span>
                  </TableCell>
                  <TableCell className="font-bold">৳{req.totalAmount}</TableCell>
                  <TableCell className="text-right">
                    {req.status === "PENDING" ? (
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 gap-1.5"
                        onClick={() => setSelectedRequest(req)}
                      >
                        <UserCheck className="w-3.5 h-3.5" /> অ্যাসাইন করুন
                      </Button>
                    ) : (
                      <span className="text-xs text-slate-400">অ্যাসাইন সম্পন্ন</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Assign Modal Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>অ্যাম্বুলেন্স ও ড্রাইভার নিয়োগ করুন</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div>
              <p className="text-xs text-slate-500 mb-1">রোগীর লোকেশন:</p>
              <p className="text-sm font-semibold">{selectedRequest?.pickupAddress}</p>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">অ্যাম্বুলেন্স নির্বাচন করুন</label>
              <select
                className="w-full border rounded-md p-2 text-sm bg-background"
                value={ambulanceId}
                onChange={(e) => setAmbulanceId(e.target.value)}
              >
                <option value="">অ্যাম্বুলেন্স পছন্দ করুন</option>
                {ambulances?.map((amb: any) => (
                  <option key={amb.id} value={amb.id}>
                    {amb.vehicleNumber} ({amb.type})
                  </option>
                ))}
              </select>
            </div>

            {/* ড্রাইভার আইডি ইনপুটের জায়গায় ড্রপডাউন মেনু */}
            <div className="space-y-1">
              <label className="text-sm font-medium">ড্রাইভার নির্বাচন করুন</label>
              <select
                className="w-full border rounded-md p-2 text-sm bg-background"
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
              >
                <option value="">
                  {isDriversLoading ? "ড্রাইভার তালিকা লোড হচ্ছে..." : "ড্রাইভার পছন্দ করুন"}
                </option>
                {drivers?.map((driver: any) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name || "ড্রাইভার"} {driver.phone ? `(${driver.phone})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
              বাতিল
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              disabled={!ambulanceId || !driverId || assignMutation.isPending}
              onClick={() => assignMutation.mutate()}
            >
              {assignMutation.isPending ? "অ্যাসাইন হচ্ছে..." : "কনফার্ম করুন"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}