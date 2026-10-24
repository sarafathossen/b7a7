# 🚑 AmbuQuick — Emergency Ambulance Dispatch System

An enterprise-grade, real-time emergency ambulance booking and dispatch management platform built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **TanStack Query**. The system provides 3 distinct role-based workflows for Callers, Drivers, and Dispatch Administrators, complete with test-mode bKash digital payment integration.

---

## 🌐 Live URLs & Links

- **Live Frontend URL:** [https://ambulance-dispatch-frontend.vercel.app](https://ambulance-dispatch-frontend.vercel.app)
- **Live Backend API URL:** [https://ambulance-dispatch-backend-azure.vercel.app/api/v1](https://ambulance-dispatch-backend-azure.vercel.app/api/v1)
- **Walkthrough Video Demonstration:** [Google Drive / Loom Video Link](#)

---

## 🔐 1-Click Quick Demo Credentials

The login page features a dedicated **One-Click Demo Login** section to seamlessly switch and evaluate different roles without manual typing:

| Role | Email | Password | Assigned Dashboard |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `Admin@password123` | `/admin` |
| **Caller (User)** | `caller@example.com` | `Caller@password123` | `/caller` |
| **Driver (Provider)** | `driver@example.com` | `Driver@password123` | `/driver` |

---

## ✨ Key Features & Domain Workflows

### 1. 👤 Caller (Patient / Family) Workflow
- **Multi-step Booking Form:** 3-step interactive booking wizard built with `React Hook Form` and `Zod` validation (Pickup & Destination selection, Priority level, and ICU/AC ambulance type selection).
- **Request Tracking:** Real-time visibility of emergency requests, driver assignments, and live status badges (`PENDING`, `ASSIGNED`, `EN_ROUTE`, `COMPLETED`).
- **bKash Payment Gateway Integration:** Seamless payment initiation and transaction verification callback handling.
- **Profile Management:** View and edit personal contact information.

### 2. 🚑 Driver (Provider) Workflow
- **Trip Dashboard:** Real-time trip status lifecycle transitions (`ASSIGNED` ➔ `EN_ROUTE` ➔ `PICKED_UP` ➔ `COMPLETED`).
- **Duty Availability Toggle:** One-click online/offline status switch to manage dispatch readiness.
- **Driver Profile:** View license status, registered credentials, and verification badges.

### 3. 👨‍💼 Dispatch Administrator Workflow
- **Interactive Analytics:** Weekly call volume and dispatch success rates rendered via responsive **Recharts** bar charts.
- **Dispatcher Assignment Modal:** Match pending emergency requests with available active ambulances and certified drivers.
- **Ambulance Fleet CRUD:** Register new ambulances with plate numbers, base pricing, and category filters.
- **User & Access Control:** Real-time role reassignment (`CALLER`, `DRIVER`, `ADMIN`).
- **Audit & Performance Reports:** Printable system dispatch audit logs, revenue calculation, and cancellation tracking.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 16 (App Router with justified Server & Client component split)
- **Language:** TypeScript
- **Styling & UI:** Tailwind CSS, shadcn/ui, Lucide React
- **State & Data Fetching:** TanStack Query (React Query v5) + Axios Interceptors (with JWT refresh handling)
- **Form Handling:** React Hook Form + Zod Schema Validation
- **Charts:** Recharts
- **Notifications:** Sonner Toast Notifications
- **Deployment:** Vercel Edge Network

---

## 📂 Page Route Directory (18+ Mandatory Pages)

### Public Pages
- `/` — Modern landing page with live response metrics and hero call-to-action
- `/services` — Detailed breakdown of ambulance tiers (ICU, AC, Non-AC, Freezer)
- `/pricing` — Transparent fee structure and interactive FAQ section
- `/hospitals` — Public directory of partnered hospitals with emergency unit counts
- `/about` — Platform mission, vision, and safety standards
- `/contact` — 24/7 hotline information and feedback form

### Authentication
- `/login` — Login page featuring **One-Click Quick Demo Login** buttons
- `/register` — Account registration with role selection (Caller / Driver)

### Caller Dashboard
- `/caller` — Emergency requests overview and payment trigger
- `/caller/request-ambulance` — Multi-step emergency booking wizard
- `/caller/profile` — Profile edit and contact updater

### Driver Dashboard
- `/driver` — Assigned emergency trips and status progression actions
- `/driver/availability` — Duty toggle (Go Online / Go Offline)
- `/driver/profile` — Verified driver profile and credentials

### Admin Dashboard
- `/admin` — High-level KPI analytics cards and Recharts visualization
- `/admin/requests` — Dispatch control table with Driver/Ambulance assignment modal
- `/admin/ambulances` — Fleet management and vehicle creation
- `/admin/users` — User listing and role modification controls
- `/admin/reports` — Audit logs, completion ratios, and exportable reports

### Payment & Utility
- `/payment/success` — bKash verification callback and digital receipt
- `/payment/cancel` — Payment cancellation screen
- `not-found.tsx` — Custom 404 page
- `error.tsx` — Global React error boundary

---

## 🚀 Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/ambulance-dispatch-frontend.git](https://github.com/your-username/ambulance-dispatch-frontend.git)
   cd ambulance-dispatch-frontend