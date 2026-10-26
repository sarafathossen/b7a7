
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Ambulance, HeartPulse, Snowflake, Wind, ShieldAlert } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      title: "আইসিইউ (ICU) অ্যাম্বুলেন্স",
      desc: "ভেন্টিলেটর, মনিটর, ডিফিব্রিলেটর এবং অভিজ্ঞ প্যারামেডিক সংবলিত সংকটাপন্ন রোগীদের লাইফ সাপোর্ট অ্যাম্বুলেন্স।",
      price: "৳৩,৫০০ থেকে শুরু",
      icon: HeartPulse,
      badge: "জরুরি সেবা",
    },
    {
      title: "শীতাতপ নিয়ন্ত্রিত (AC) অ্যাম্বুলেন্স",
      desc: "অসুস্থ বা দীর্ঘ দূরত্বের রোগীদের আরামদায়ক এবং দ্রুত পরিবহনের জন্য সম্পূর্ণ শীতাতপ নিয়ন্ত্রিত সেবা।",
      price: "৳২,৫০০ থেকে শুরু",
      icon: Wind,
      badge: "জনপ্রিয়",
    },
    {
      title: "নন-এসি অ্যাম্বুলেন্স",
      desc: "নিকটবর্তী ক্লিনিকে স্থানান্তর বা সাধারণ রোগীদের সাশ্রয়ী ভাড়ায় নির্ভরযোগ্য পরিবহন সুবিধা।",
      price: "৳১,৫০০ থেকে শুরু",
      icon: Ambulance,
      badge: "সাশ্রয়ী",
    },
    {
      title: "ফ্রিজার অ্যাম্বুলেন্স",
      desc: "মৃতদেহ দূরবর্তী জেলায় স্থানান্তর বা সংরক্ষণের জন্য আধুনিক মাইনাস টেম্পারেচার কুলিং সিস্টেম।",
      price: "৳৪,০০০ থেকে শুরু",
      icon: Snowflake,
      badge: "বিশেষায়িত",
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-8 py-12 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900">আমাদের অ্যাম্বুলেন্স সার্ভিস ক্যাটাগরি</h1>
        <p className="text-sm text-slate-500">রোগীর শারীরিক অবস্থার ওপর ভিত্তি করে সঠিক লাইফ সাপোর্ট অ্যাম্বুলেন্স বেছে নিন।</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} className="border-slate-200">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-600">{item.badge}</span>
                  <CardTitle className="text-lg mt-1">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                <div className="border-t pt-3 flex justify-between items-center text-sm font-semibold">
                  <span className="text-slate-500 text-xs">ভিত্তি ফি:</span>
                  <span className="text-red-600">{item.price}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}