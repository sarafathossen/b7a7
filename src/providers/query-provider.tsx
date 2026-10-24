// src/providers/query-provider.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // ডাটা ৫ মিনিট ফ্রেশ থাকবে (ক্যাশিং)
            gcTime: 1000 * 60 * 10,   // মেমোরি থেকে ডাটা মুছবে ১০ মিনিট পর
            refetchOnWindowFocus: false, // ট্যাব পরিবর্তন করলে অপ্রয়োজনীয় API রিকোয়েস্ট বন্ধ
            retry: 1,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}