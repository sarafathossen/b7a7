// src/app/(dashboard)/admin/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Ambulance, Users, Clock, CheckCircle, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const analyticsData = [
  { name: "শনিবার", requests: 14, completed: 12 },
  { name: "রবিবার", requests: 20, completed: 18 },
  { name: "সোমবার", requests: 18, completed: 15 },
  { name: "মঙ্গলবার", requests: 25, completed: 22 },
  { name: "বুধবার", requests: 22, completed: 20 },
  { name: "বৃহস্পতিবার", requests: 30, completed: 28 },
  { name: "শুক্রবার", requests: 27, completed: 26 },
];

export default function AdminOverviewPage() {
  const { data: requests, isLoading: reqLoading } = useQuery({
    queryKey: ["adminRequests"],
    queryFn: async () => {
      const res = await api.get("/emergency-requests?limit=100");
      return res.data?.data || [];
    },
  });

  const { data: ambulances, isLoading: ambLoading } = useQuery({
    queryKey: ["adminAmbulances"],
    queryFn: async () => {
      const res = await api.get("/ambulances?limit=100");
      return res.data?.data || [];
    },
  });

  if (reqLoading || ambLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  const totalRequests = requests?.length || 0;
  const pendingRequests = requests?.filter((r: any) => r.status === "PENDING")?.length || 0;
  const activeAmbulances = ambulances?.filter((a: any) => a.isAvailable)?.length || 0;
  const totalRevenue = requests?.reduce((acc: number, r: any) => acc + (r.totalAmount || 0), 0) || 0;

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">অ্যাডমিন ডিসপ্যাচ ওভারভিউ</h1>
        <p className="text-sm text-slate-500">জরুরি অ্যাম্বুলেন্স কল ও সিস্টেমের রিয়েল-টাইম পরিসংখ্যান</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">মোট কল রিকোয়েস্ট</CardTitle>
            <Clock className="w-4 h-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests}</div>
            <p className="text-xs text-slate-500 mt-1">সর্বমোট ডিসপ্যাচ রেকর্ড</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">পেন্ডিং রিকোয়েস্ট</CardTitle>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{pendingRequests}</div>
            <p className="text-xs text-slate-500 mt-1">অ্যাসাইন করার অপেক্ষায়</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">সক্রিয় অ্যাম্বুলেন্স</CardTitle>
            <Ambulance className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{activeAmbulances}</div>
            <p className="text-xs text-slate-500 mt-1">ফিল্ডে মোতায়েন আছে</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">মোট সার্ভিস ভলিউম</CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-slate-500 mt-1">বুকিংয়ের আনুমানিক ফি</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle>সাপ্তাহিক ডিসপ্যাচ অ্যানালিটিক্স</CardTitle>
          <CardDescription>বিগত ৭ দিনের সফল রেসপন্স ও মোট রিকোয়েস্টের তুলনা</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} />
              <Tooltip />
              <Bar dataKey="requests" name="মোট রিকোয়েস্ট" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="সম্পন্ন ট্রিপ" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function AlertCircle(props: any) {
  return <Clock {...props} />;
}