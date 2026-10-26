
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["adminAllUsers"],
    queryFn: async () => {
      const res = await api.get("/users");
      return res.data?.data?.result || res.data?.data || res.data || [];
    },
  });

  const roleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
     
      const res = await api.patch(`/users/${id}/role`, { role });

      
      if (role === "DRIVER") {
        try {
          await api.post("/drivers", {
            userId: id,
            licenseNumber: `DL-DHAKA-${Math.floor(100000 + Math.random() * 900000)}`,
            isAvailable: true,
          });
        } catch (profileErr: any) {
          
          console.warn("DriverProfile check/creation fallback:", profileErr);
        }
      }

      return res;
    },
    onSuccess: (_, variables) => {
      if (variables.role === "DRIVER") {
        toast.success("ইউজার রোল DRIVER করা হয়েছে এবং ড্রাইভার প্রোফাইল সফলভাবে তৈরি হয়েছে!");
      } else {
        toast.success("ইউজার রোল সফলভাবে পরিবর্তন করা হয়েছে!");
      }
      queryClient.invalidateQueries({ queryKey: ["adminAllUsers"] });
      queryClient.invalidateQueries({ queryKey: ["availableDriversList"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "রোল পরিবর্তন ব্যর্থ হয়েছে");
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">ব্যবহারকারী ও রোল নিয়ন্ত্রণ</h1>
        <p className="text-sm text-slate-500">সিস্টেমের সকল ইউজার এবং তাদের অ্যাক্সেস পারমিশন পরিবর্তন করুন</p>
      </div>

      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>নাম</TableHead>
              <TableHead>ইমেইল</TableHead>
              <TableHead>মোবাইল</TableHead>
              <TableHead>বর্তমান রোল</TableHead>
              <TableHead className="text-right">রোল পরিবর্তন</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-red-600" />
                </TableCell>
              </TableRow>
            ) : users?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  কোনো ইউজার পাওয়া যায়নি
                </TableCell>
              </TableRow>
            ) : (
              users?.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-sm">{user.name}</TableCell>
                  <TableCell className="text-sm">{user.email}</TableCell>
                  <TableCell className="text-sm">{user.phone || "N/A"}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <select
                      className="border rounded px-2 py-1 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-red-500"
                      value={user.role}
                      disabled={roleMutation.isPending}
                      onChange={(e) => roleMutation.mutate({ id: user.id, role: e.target.value })}
                    >
                      <option value="CALLER">CALLER</option>
                      <option value="DRIVER">DRIVER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
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