
"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Building2, Plus, Loader2, MapPin, Phone } from "lucide-react";

export default function AdminHospitalsPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  
  const { data: hospitals, isLoading } = useQuery({
    queryKey: ["adminAllHospitals"],
    queryFn: async () => {
      const res = await api.get("/hospitals");
      return res.data?.data?.result || res.data?.data || res.data || [];
    },
  });

  
  const createMutation = useMutation({
    mutationFn: async (payload: {
      name: string;
      address: string;
      contactNumber?: string;
    }) => {
      return await api.post("/hospitals", payload);
    },
    onSuccess: () => {
      toast.success("নতুন হাসপাতাল সফলভাবে সিস্টেমে যুক্ত হয়েছে!");
      queryClient.invalidateQueries({ queryKey: ["adminAllHospitals"] });
      setOpen(false);
      setName("");
      setAddress("");
      setContactNumber("");
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "হাসপাতাল যুক্ত করতে ব্যর্থ হয়েছে"
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) {
      toast.error("হাসপাতালের নাম ও ঠিকানা প্রদান আবশ্যক");
      return;
    }
    createMutation.mutate({
      name,
      address,
      contactNumber: contactNumber || undefined,
    });
  };

  const hospitalList: any[] = Array.isArray(hospitals) ? hospitals : [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">হাসপাতাল নেটওয়ার্ক</h1>
          <p className="text-sm text-slate-500">
            জরুরি সেবার জন্য তালিকাভুক্ত হাসপাতালসমূহ এবং নতুন হাসপাতাল সংযোজন
          </p>
        </div>

        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-red-700 transition-colors">
            <Plus className="w-4 h-4" /> নতুন হাসপাতাল যোগ করুন
          </DialogTrigger>

          <DialogContent className="sm:max-w-md bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-slate-900">
                <Building2 className="w-5 h-5 text-red-600" /> নতুন হাসপাতাল তথ্য
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  হাসপাতালের নাম *
                </label>
                <Input
                  placeholder="যেমন: ঢাকা মেডিকেল কলেজ হাসপাতাল"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  ঠিকানা ও এলাকা *
                </label>
                <Input
                  placeholder="যেমন: সেক্রেটারিয়েট রোড, ঢাকা"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  জরুরি হটলাইন / ফোন
                </label>
                <Input
                  placeholder="যেমন: 01700000000"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  সংরক্ষণ করুন
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>হাসপাতালের নাম</TableHead>
              <TableHead>ঠিকানা</TableHead>
              <TableHead>যোগাযোগ নম্বর</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-red-600" />
                </TableCell>
              </TableRow>
            ) : hospitalList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-slate-500">
                  কোনো হাসপাতাল পাওয়া যায়নি
                </TableCell>
              </TableRow>
            ) : (
              hospitalList.map((hospital: any) => (
                <TableRow key={hospital.id}>
                  <TableCell className="font-medium text-sm flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    {hospital.name}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {hospital.address}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {hospital.contactNumber || hospital.phone || "উপলব্ধ নয়"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}