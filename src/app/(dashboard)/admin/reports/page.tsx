// src/app/(dashboard)/admin/reports/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Download, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminReportsPage() {
  const { data: requests, isLoading } = useQuery({
    queryKey: ["adminReportLogs"],
    queryFn: async () => {
      const res = await api.get("/emergency-requests?limit=100");
      return res.data?.data || [];
    },
  });

  const totalCalls = requests?.length || 0;
  const completedCalls = requests?.filter((r: any) => r.status === "COMPLETED")?.length || 0;
  const cancelledCalls = requests?.filter((r: any) => r.status === "CANCELLED")?.length || 0;
  const totalRevenue = requests
    ?.filter((r: any) => r.status === "COMPLETED")
    ?.reduce((sum: number, r: any) => sum + (r.totalAmount || 0), 0) || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">অডিট লগ ও সিস্টেম রিপোর্ট</h1>
          <p className="text-sm text-slate-500">জরুরি সেবার মাসিক পারফরম্যান্স ও ট্রানজেকশন নিরীক্ষা</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          className="gap-2"
        >
          <Download className="w-4 h-4" /> রিপোর্ট প্রিন্ট / ডাউনলোড
        </Button>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">সম্পন্ন ট্রিপের হার</p>
              <p className="text-2xl font-bold text-slate-900">
                {totalCalls > 0 ? `${Math.round((completedCalls / totalCalls) * 100)}%` : "0%"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">মোট সংগৃহীত আয়</p>
              <p className="text-2xl font-bold text-emerald-600">৳{totalRevenue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">বাতিলকৃত কল</p>
              <p className="text-2xl font-bold text-red-600">{cancelledCalls}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log Table */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>তারিখ ও সময়</TableHead>
              <TableHead>ট্রিপ আইডি</TableHead>
              <TableHead>পিকআপ লোকেশন</TableHead>
              <TableHead>হাসপাতাল</TableHead>
              <TableHead>স্ট্যাটাস</TableHead>
              <TableHead className="text-right">পরিমাণ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                </TableCell>
              </TableRow>
            ) : requests?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  কোনো অডিট লগ রেকর্ড নেই
                </TableCell>
              </TableRow>
            ) : (
              requests?.map((log: any) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-slate-500">
                    {new Date(log.createdAt || Date.now()).toLocaleDateString("bn-BD")}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{log.id.slice(0, 8)}...</TableCell>
                  <TableCell className="text-xs">{log.pickupAddress}</TableCell>
                  <TableCell className="text-xs">{log.destinationAddress}</TableCell>
                  <TableCell>
                    <Badge variant={log.status === "COMPLETED" ? "default" : "secondary"}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-xs">৳{log.totalAmount}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}