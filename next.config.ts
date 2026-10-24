import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ক্যাশ ও প্রিফেচিং অপশন
  experimental: {
    // প্রয়োজন অনুযায়ী এক্সপেরিমেন্টাল ফ্ল্যাগ এখানে রাখতে পারেন
  },
  
  // এক্সটার্নাল ইমেজ লোড করার জন্য অনুমতি
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // টার্বোপ্যাক রুলস কনফিগারেশন
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;