// setup.js
const fs = require("fs");
const path = require("path");

const dirs = [
  "src/app/(auth)/login",
  "src/app/(auth)/register",
  "src/app/(public)/about",
  "src/app/(public)/services",
  "src/app/(public)/contact",
  "src/app/(public)/hospitals",
  "src/app/(dashboard)/admin/requests",
  "src/app/(dashboard)/admin/ambulances",
  "src/app/(dashboard)/admin/users",
  "src/app/(dashboard)/caller/request-ambulance",
  "src/app/(dashboard)/caller/profile",
  "src/app/(dashboard)/driver/availability",
  "src/app/(dashboard)/driver/profile",
  "src/app/payment/success",
  "src/app/payment/cancel",
  "src/components/ui",
  "src/components/shared",
  "src/components/forms",
  "src/hooks",
  "src/lib",
  "src/services",
  "src/types",
];

const files = [
  "src/app/(auth)/login/page.tsx",
  "src/app/(auth)/register/page.tsx",
  "src/app/(public)/layout.tsx",
  "src/app/(public)/about/page.tsx",
  "src/app/(public)/services/page.tsx",
  "src/app/(public)/contact/page.tsx",
  "src/app/(public)/hospitals/page.tsx",
  "src/app/(dashboard)/admin/page.tsx",
  "src/app/(dashboard)/admin/requests/page.tsx",
  "src/app/(dashboard)/admin/ambulances/page.tsx",
  "src/app/(dashboard)/admin/users/page.tsx",
  "src/app/(dashboard)/caller/page.tsx",
  "src/app/(dashboard)/caller/request-ambulance/page.tsx",
  "src/app/(dashboard)/caller/profile/page.tsx",
  "src/app/(dashboard)/driver/page.tsx",
  "src/app/(dashboard)/driver/availability/page.tsx",
  "src/app/(dashboard)/driver/profile/page.tsx",
  "src/app/payment/success/page.tsx",
  "src/app/payment/cancel/page.tsx",
  "src/app/not-found.tsx",
  "src/app/error.tsx",
  "src/app/loading.tsx",
  "src/middleware.ts",
  "src/lib/axios.ts",
];

const defaultPageCode = `export default function Page() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Page Ready</h1>
    </div>
  );
}
`;

// ফোল্ডার তৈরি
dirs.forEach((dir) => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// ফাইল তৈরি
files.forEach((file) => {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, defaultPageCode, "utf8");
  }
});

console.log("✅ সফলভাবে সব ১৮+ পেজ এবং ফোল্ডার স্ট্রাকচার তৈরি হয়েছে!");