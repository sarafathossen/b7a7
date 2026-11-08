// src/components/admin/dispatch-analytics-chart.tsx
"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface ChartProps {
  data: Array<{
    name: string;
    requests: number;
    completed: number;
  }>;
}

const DispatchAnalyticsChart = React.memo(({ data }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} />
        <YAxis stroke="#888888" fontSize={12} allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="requests" name="মোট রিকোয়েস্ট" fill="#ef4444" radius={[4, 4, 0, 0]} />
        <Bar dataKey="completed" name="সম্পন্ন ট্রিপ" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
});

DispatchAnalyticsChart.displayName = "DispatchAnalyticsChart";

export default DispatchAnalyticsChart;