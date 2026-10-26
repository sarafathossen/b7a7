
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, HelpCircle, ShieldAlert } from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      name: "নন-এসি অ্যাম্বুলেন্স",
      price: "১৫০০",
      desc: "নিকটবর্তী দূরত্বে সাধারণ রোগীদের নিরাপদ স্থানান্তরের জন্য।",
      features: [
        "জরুরি অক্সিজেন সুবিধা",
        "স্ট্রেচার ও প্রাথমিক ফার্স্ট এইড",
        "দক্ষ চালক ও সহকারী",
        "২৪/৭ ডিসপ্যাচ ট্র্যাকিং",
      ],
      popular: false,
    },
    {
      name: "এসি (AC) অ্যাম্বুলেন্স",
      price: "২৫০০",
      desc: "মাঝারি থেকে দূরপাল্লার যাত্রায় রোগীর আরামদায়ক ও নিরাপদ পরিবহন।",
      features: [
        "সম্পূর্ণ শীতাতপ নিয়ন্ত্রিত কেবিন",
        "অক্সিজেন ও নেবুলাইজার সাপোর্ট",
        "স্মুথ সাসপেনশন ও উন্নত স্ট্রেচার",
        "রিয়েল-টাইম জিপিএস ট্র্যাকিং",
      ],
      popular: true,
    },
    {
      name: "আইসিইউ (ICU) লাইফ সাপোর্ট",
      price: "৩৫০০",
      desc: "সংকটাপন্ন ও লাইফ সাপোর্ট প্রয়োজন এমন রোগীদের জন্য পূর্ণাঙ্গ আইসিইউ সুবিধা।",
      features: [
        "পোর্টেবল ভেন্টিলেটর ও ডিফিব্রিলেটর",
        "মাল্টিপ্যারা পেশেন্ট মনিটর",
        "প্রশিক্ষিত প্যারামেডিক / মেডিকেল অ্যাসিস্ট্যান্ট",
        "সার্বক্ষণিক ইমার্জেন্সি ব্যাকআপ",
      ],
      popular: false,
    },
  ];

  const faqs = [
    {
      q: "জরুরি অ্যাম্বুলেন্স পেতে গড়ে কত সময় লাগে?",
      a: "আমাদের স্বয়ংক্রিয় ডিসপ্যাচ সিস্টেম কল পাওয়ার সাথে সাথে নিকটবর্তী সক্রিয় চালককে পাঠিয়ে দেয়। ঢাকা মেট্রো এলাকায় সাধারণত ১০-১৫ মিনিটের মধ্যে অ্যাম্বুলেন্স পৌঁছে যায়।",
    },
    {
      q: "ভাড়া পরিশোধের নিয়ম কী?",
      a: "আমাদের প্ল্যাটফর্ম থেকে সরাসরি বিকাশ (bKash) ও ডিজিটাল পেমেন্টের মাধ্যমে নির্ধারিত ভাড়া পরিশোধ করা যায়। চালককে কোনো অতিরিক্ত বা লুকানো ফি দিতে হয় না।",
    },
    {
      q: "প্রয়োজনে কি বুকিং বাতিল করা সম্ভব?",
      a: "হ্যাঁ, অ্যাম্বুলেন্স রওনা দেওয়ার পূর্বে কলার ড্যাশবোর্ড থেকে তাৎক্ষণিকভাবে রিকোয়েস্ট বাতিল করার সুযোগ রয়েছে।",
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-8 py-12 space-y-16 max-w-5xl">
     
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl font-extrabold text-slate-900">স্বচ্ছ ও নির্ধারিত অ্যাম্বুলেন্স ভাড়া</h1>
        <p className="text-sm text-slate-500">
          জরুরি অবস্থায় কোনো লুকানো চার্জ ছাড়া সরকারি নীতিমালা ও আধুনিক সুবিধার ভিত্তিতে নির্ধারিত ফি।
        </p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p, idx) => (
          <Card
            key={idx}
            className={`border relative flex flex-col justify-between ${
              p.popular ? "border-red-600 shadow-md ring-1 ring-red-600" : "border-slate-200"
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs px-3 py-0.5 rounded-full font-bold">
                সর্বাধিক ব্যবহৃত
              </span>
            )}
            <CardHeader className="text-center pt-6">
              <CardTitle className="text-xl font-bold">{p.name}</CardTitle>
              <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{p.desc}</p>
              <div className="pt-4">
                <span className="text-3xl font-black text-slate-900">৳{p.price}</span>
                <span className="text-xs text-slate-500"> / বেস রেট</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="border-t pt-4 space-y-2 text-xs">
                {p.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      
      <div className="space-y-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <HelpCircle className="w-6 h-6 text-red-600" /> সচরাচর জিজ্ঞাসিত প্রশ্ন (FAQ)
        </h2>
        <div className="grid gap-4">
          {faqs.map((faq, i) => (
            <Card key={i} className="border-slate-200">
              <CardContent className="p-5 space-y-1">
                <h3 className="font-semibold text-sm text-slate-900">{faq.q}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}