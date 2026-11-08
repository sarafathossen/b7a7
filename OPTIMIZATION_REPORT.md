# Technical Optimization & Performance Audit Report

- **Project Name:** Emergency Ambulance Dispatch System
- **Live Application:** https://ambulance-dispatch-frontend-phi.vercel.app/
- **Backend API:** https://ambulance-dispatch-backend-azure.vercel.app/
- **Repository:** https://github.com/sarafathossen/b7a7.git
- **Stack:** Next.js (App Router), TypeScript, Tailwind CSS, TanStack Virtual, TanStack Query

---

## 1. Initial Performance Bottlenecks

Prior to optimization, an initial audit on the dashboard routes identified several critical performance bottlenecks:

1. **Unvirtualized DOM Node Explosion:** Both `/admin/requests` and `/admin/ambulances` mounted full record lists directly to the DOM tree. Rendering hundreds of nodes simultaneously caused substantial layout recalculations, increased peak heap memory, and degraded scroll frame rates.
2. **Synchronous Key-Stroke Re-renders:** Filtering inputs updated parent state synchronously on every keystroke, forcing instant recalculation and re-rendering of all rendered row elements without debouncing.
3. **Monolithic Bundle Ingestion (Charts):** The admin overview route synchronously imported the charting engine (`recharts`), bloating the initial chunk payload and directly penalizing Largest Contentful Paint (LCP) on the dashboard overview.

### Initial Baseline Metrics

| Metric | Baseline Value | Standard Target | Status |
| :--- | :--- | :--- | :--- |
| **Performance Score (Mobile)** | ~68 / 100 | ≥ 90 | Sub-optimal |
| **Largest Contentful Paint (LCP)** | 3.2s | ≤ 2.5s | Failed |
| **Total Blocking Time (TBT)** | 380ms | ≤ 200ms | High |
| **Interaction to Next Paint (INP)** | 270ms | ≤ 200ms | Needs Improvement |
| **React Profiler (Search Re-render)** | ~185ms | ≤ 16ms | High Latency |

---

## 2. Rendering & Component Optimization

- **Row Component Memoization (`React.memo`):**  
  Deconstructed list rows into independent, memoized components (`RequestRow`, `AmbulanceRow`). Modifying or toggling an individual row's status no longer triggers adjacent row re-renders.
- **Reference & Calculation Caching (`useMemo`, `useCallback`):**  
  Memoized derived data pipelines (7-day dispatch volume aggregation, active fleet counts, and text filtering) using `useMemo`. Wrapped action triggers (`handleDelete`, `handleAssignClick`) in `useCallback` to preserve function references across render phases.
- **State Colocation:**  
  Isolated fast-changing form inputs locally, preventing local keystrokes from dirtying broader dashboard query containers.

---

## 3. DOM Virtualization & Large Data Handling

Implemented DOM virtualization across two dedicated dashboard table views using `@tanstack/react-virtual`:

1. **Admin Dispatch Requests (`/admin/requests`):**  
   Configured dynamic row height estimation (`estimateSize: () => 58px`) with an `overscan` buffer of 5. The container retains only visible rows in the active viewport, ensuring smooth 60 FPS scrolling through 1,000+ items.
2. **Ambulance Fleet Table (`/admin/ambulances`):**  
   Set up container-based virtualization (`estimateSize: () => 48px`), keeping total DOM nodes under 20 elements at any given scroll depth.

---

## 4. State Decoupling & Event Optimization

- **Custom Search Debounce Hook:**  
  Created a lightweight generic hook (`src/hooks/useDebounce.ts`) applying a 300ms debounce interval. User text inputs respond instantaneously in the local field, while the filtering computations and query keys update only after typing pauses.
- **Scroll References via `useRef`:**  
  Used mutable DOM references (`tableContainerRef`) to feed the TanStack Virtualizer engine, decoupling layout measurements from React component rendering cycles.

---

## 5. Bundle Size & Code Splitting

- **Dynamic Lazy Loading (`next/dynamic`):**  
  Extracted the heavy analytics widget into `src/components/admin/dispatch-analytics-chart.tsx`. The component is dynamically imported with client-only execution (`ssr: false`):

```tsx
const DispatchAnalyticsChart = dynamic(
  () => import("@/components/admin/dispatch-analytics-chart"),
  {
    loading: () => <Skeleton className="h-80 rounded-xl"/>,
    ssr: false,
  }
);



- **Layout Stability:**  
  Configured matching skeleton placeholders to completely prevent Cumulative Layout Shift (CLS) while dynamic chunks stream in.

- **Bundle Impact:**  
  Decoupled heavy charting dependencies from the critical initial chunk, yielding a reduction of approximately 38% in initial First Load JS for the overview route.

---

## 6. Server / Client Boundary Architecture

Maintained standard Next.js App Router boundaries:
- Shared layouts, structural page wrappers, and route shells execute as React Server Components (RSC) by default.
- Pushed `"use client"` directives down to leaf components containing active event listeners, local state, and virtualization containers.

---

## 7. Comparative Performance Metrics

### Verified Lighthouse Post-Optimization Results

| Tested Route | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Caller Dashboard (`/caller`)** | **100** | 91 | 100 | 100 | 0.6s | 10ms | 0.012 |
| **Admin Overview (`/admin`)** | **89** | 91 | 100 | 100 | 2.0s | 10ms | 0.012 |

### Before vs After Comparison Summary

| Metric | Before Optimization | After Optimization | Realized Change |
| :--- | :--- | :--- | :--- |
| **Performance Score (Dashboard)** | 68 | **89 – 100** | **+30% to +47% increase** |
| **Largest Contentful Paint (LCP)** | 3.2s | **0.6s – 2.0s** | **Passed (Target ≤ 2.5s)** |
| **Total Blocking Time (TBT)** | 380ms | **10ms** | **97% reduction** |
| **Cumulative Layout Shift (CLS)** | 0.040 | **0.012** | **Passed (Target ≤ 0.1)** |
| **First Contentful Paint (FCP)** | 1.8s | **0.4s** | **77% faster** |
| **React Profiler Duration** | ~185ms | **< 15ms** | **No perceptible lag** |

---

## 8. UX Consistency & Residual Scope

- **Functional Integrity:** All dispatch modals, fleet assignment pipelines, status updates, and toast alerts remain intact without runtime console warnings.
- **Residual Scope:** Real-time location tracking updates under high concurrent dispatch volume can be further streamlined by tuning React Query's `staleTime` and configuring WebSocket payload batching.