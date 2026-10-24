// src/components/shared/footer.tsx
import Link from "next/link";
import { Ambulance, PhoneCall, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white">
            <Ambulance className="w-6 h-6 text-red-500" />
            <span className="font-bold text-lg">AmbuQuick</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            ২৪/৭ দ্রুততম জরুরি অ্যাম্বুলেন্স ডিসপ্যাচ ও পেশাদার লাইফ-সাপোর্ট নেটওয়ার্ক।
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">জরুরি লিংক</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/caller/request-ambulance" className="hover:text-white">অ্যাম্বুলেন্স বুকিং</Link></li>
            <li><Link href="/hospitals" className="hover:text-white">নিকটস্থ হাসপাতাল</Link></li>
            <li><Link href="/services" className="hover:text-white">সার্ভিস ক্যাটাগরি</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">ব্যবহারকারী</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/login" className="hover:text-white">লগইন / ডেমো অ্যাক্সেস</Link></li>
            <li><Link href="/register" className="hover:text-white">ড্রাইভার হিসেবে যুক্ত হোন</Link></li>
          </ul>
        </div>

        <div className="space-y-2 text-xs">
          <h4 className="text-sm font-semibold text-white mb-3">জরুরি হটলাইন</h4>
          <p className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <PhoneCall className="w-4 h-4" /> ১৬২৬৩ / ৯৯৯
          </p>
          <p className="flex items-center gap-2 text-slate-400">
            <Mail className="w-4 h-4" /> support@ambuquick.com
          </p>
          <p className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-4 h-4" /> ঢাকা, বাংলাদেশ
          </p>
        </div>
      </div>
      <div className="border-t border-slate-800 text-center py-4 text-xs text-slate-500">
        © 2026 AmbuQuick Dispatch Platform. All rights reserved.
      </div>
    </footer>
  );
}