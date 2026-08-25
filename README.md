# MediCare HMS

> Hospital Management System — React + Vite + Tailwind CSS (Tearline) — pnpm

A responsive, production-ready HMS for managing patients, doctors, appointments, prescriptions, lab reports, billing, pharmacy, and role-based access.

---

### What was built

**Phase 1 — Foundation (done):**
- Auth: Login / Register / Forgot Password — validation, protected routes, auto-logout after 30 min
- Dashboard: stats cards, charts, recent appointments, quick actions
- Patients: search, filter, sort, pagination, add / edit / delete (validated forms)
- Doctors: search, filter by department, status badges
- UI Preview: all reusable components in one place (`/ui-preview`)
- Role switcher: change between Admin / Doctor / Receptionist / Patient and see menu update instantly

**Phase 2 — Clinical Workflows (done):**
- Appointments: book with validated form (React Hook Form + Yup), complete / cancel / delete, status filters + stats
- Medical Records: add / view / delete records with attachment upload
- Prescriptions: multi-medicine builder (`useFieldArray`), per-prescription PDF export (jsPDF letterhead)
- Lab Reports: upload with type/size validation + live preview, mark Ready, download
- Pharmacy: inventory CRUD, low-stock alert banner, restock +20 quick action, inventory value
- Billing: invoice builder with line items and live total, mark paid, PDF + Excel export
- Notifications: live event feed — bookings, invoices, lab results and low-stock alerts push into the bell; mark read / mark all, optional EmailJS digest

**Phase 3 — Production Ready (done):**
- Reports: pick a dataset → preview → export PDF / Excel / CSV (`services/exporters.ts`)
- Locations Map: OpenStreetMap via react-leaflet, colored markers per facility type, click-to-fly sidebar
- Error hardening: global `ErrorBoundary` + styled 404 page
- Performance: route-level `lazy()` + `Suspense`, `useMemo` filtering everywhere
- Demo banner removed — app reads as the final product

---

### Why these tools

- **React + Vite** — fast, modern starter for React apps
  - Flow: `src/main.tsx` → `App.tsx` → `routes/AppRouter.tsx`
- **Tailwind CSS 3 + Tearline** — design tokens from `design/tearline/index.html`
  - Config: `tailwind.config.js`, styles: `src/index.css` (`.btn-primary`, `.field`, `.card`)
  - Colors: paper `#F6F5F1`, ink `#1B1D22`, cobalt `#2A4CDB`, amber, mint, rose
- **Context API (no Redux)** — simple global state as required
  - `context/AuthContext.tsx` handles login + token, `context/NotificationContext.tsx` handles alerts
  - `hooks/usePermission.ts` checks who can see what
- **React Router + lazy loading** — each page loads only when needed
  - `routes/AppRouter.tsx` uses `lazy()` + `Suspense`
- **Axios + DummyJSON** — shows real API calls (GET, POST, PUT, PATCH, DELETE)
  - `services/api.ts` handles requests, errors, and timeouts — falls back to `services/mockData.ts` if offline
- **React Hook Form + Yup** — easy form validation
  - Booking, records, prescriptions, invoices, medicine forms; `useFieldArray` for dynamic rows
- **Exports:** jsPDF (prescriptions / invoices / report tables), SheetJS `xlsx` (Excel), native Blob CSV
  - All in `src/services/exporters.ts`
- **Map:** Leaflet + react-leaflet v5 (CircleMarker icons — no broken marker assets)
- **Other helpers:**
  - Day.js — dates, Recharts — charts, React Toastify — popups
  - File upload (Cloudinary mock) — `components/ui/FileUpload.tsx`

**How data moves:**
- `mockData.ts` (or real API) → page state (filter / sort / paginate via `useMemo`) → UI components → Context updates the screen

---

### Project structure

```
design/tearline/index.html  — design system (colors, fonts, components)
src/
  components/ui/            — Button, Input, Modal, Table, Pagination, SearchBar, Badge, FileUpload, Loader, EmptyState
  components/ErrorBoundary.tsx — global crash guard with friendly fallback
  context/                  — Auth + Notifications
  hooks/                    — useAuth, usePermission
  layouts/                  — MainLayout (sidebar), AuthLayout (login pages)
  pages/                    — Login, Dashboard, Patients, Doctors, Appointments,
                              MedicalRecords, Prescriptions, LabReports, Pharmacy,
                              Billing, Reports, ClinicMap, Notifications, NotFound, UIPreview
  routes/                   — AppRouter (all lazy-loaded)
  services/                 — api.ts, mockData.ts, exporters.ts (PDF/Excel/CSV)
  utils/                    — small helpers (date format, currency, pagination)
  constants/                — roles, permissions, departments
  types/                    — TypeScript types
  index.css                 — Tailwind setup
```

---

### How to run

```bash
# 1. Install pnpm (need Node 20+)
npm install -g pnpm@9

# 2. Install dependencies
pnpm install

# 3. Start dev server
pnpm dev
# → http://localhost:5173

# 4. Build for production
pnpm build
pnpm preview
```

**To log in:**
- Use any email + password (min 6 characters)
- Pick a role: Admin (sees everything), Doctor, Receptionist, Patient
- Or change role anytime with the dropdown in the top bar

**For integrations (optional):**
- Copy env file: `cp .env.example .env`
- Add Cloudinary / EmailJS keys — everything else works offline

---

### Demo script (all phases)

1. Login as Admin → Dashboard → use **Quick Actions** (they deep-link into flows)
2. Appointments → Book Appointment (try submitting empty to see validation) → Complete it
3. Prescriptions → New Prescription → add two medicines → Export PDF
4. Lab Reports → attach any PDF/image → Upload → Mark Ready → Download
5. Pharmacy → notice the low-stock banner → Restock +20
6. Billing → New Invoice → add line items (watch live total) → Mark Paid → Export PDF
7. Reports → switch dataset → Export Excel
8. Locations Map → click "MediCare Whitefield Clinic" → map flies there
9. Resize browser to phone size — sidebar collapses, tables stay usable

---

### Notes

- Uses dummy data so screens are never empty
- Handles errors: friendly messages for 400, 401, 404, 500 + global ErrorBoundary
- Performance-ready: lazy routes, memoized filtering, skeleton loaders
