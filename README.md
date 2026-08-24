# MediCare HMS

> Hospital Management System — React + Vite + Tailwind CSS (Tearline) — pnpm

A responsive, production-ready HMS for managing patients, doctors, appointments, prescriptions, lab reports, billing, pharmacy, and role-based access.

---

### What was built

**Phase 1 — Ready to demo (you can show this now):**
- Auth: Login / Register / Forgot Password — validation, protected routes, auto-logout after 30 min
- Dashboard: stats cards, charts, recent appointments, quick actions
- Patients: search, filter, sort, pagination, view / edit / delete
- Doctors: search, filter by department, status badges
- UI Preview: all reusable components in one place (`/ui-preview`)
- Role switcher: change between Admin / Doctor / Receptionist / Patient and see menu update instantly

**Phase 2 — In progress (clickable stubs):**
- Appointments, Medical Records, Prescriptions (PDF export)
- Lab Reports (upload with preview + validation), Pharmacy (low-stock alerts), Billing (invoice + export)

**Phase 3 — Next:**
- Reports (PDF / Excel / CSV), Map (OpenStreetMap), performance + error pages

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
  - Example: `pages/Login.tsx`
- **Other helpers:**
  - Day.js — dates, Recharts — charts, React Toastify — popups
  - File upload (Cloudinary mock) — `components/ui/FileUpload.tsx`
  - Map + email — ready for Phase 3 (Leaflet, EmailJS)

**How data moves:**
- `mockData.ts` (or real API) → `services/api.ts` → page (filter / sort / paginate) → UI components → Context updates the screen

---

### Project structure

```
design/tearline/index.html  — design system (colors, fonts, components)
src/
  components/ui/            — Button, Input, Modal, Table, Pagination, SearchBar, Badge, FileUpload, Loader
  components/PhaseBanner.tsx — shows current phase at top (for demos)
  context/                  — Auth + Notifications
  hooks/                    — useAuth, usePermission
  layouts/                  — MainLayout (sidebar), AuthLayout (login pages)
  pages/                    — Login, Dashboard, Patients, Doctors, etc.
  routes/                   — AppRouter
  services/                 — api.ts, mockData.ts
  utils/                    — small helpers (date format, pagination)
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

**For Phase 2/3 features (optional):**
- Copy env file: `cp .env.example .env`
- Add `VITE_CLOUDINARY_URL` and `VITE_EMAILJS_SERVICE`

---

### How to show to your team

- **Phase 1 now:** Look for the black banner `Phase 1 — Foundation` at top
  - Login → Dashboard → Patients (try search/filter) → Doctors → `/ui-preview`
  - Resize browser to phone size to show it works on mobile
- **Phase 2 later:** Banner changes to Phase 2, shows new flows (book → prescribe → bill)
- **Phase 3 later:** Banner removed, final polish + exports + map

---

### Notes

- Uses dummy data so screens are never empty
- Handles errors: shows friendly messages for 400, 401, 404, 500
- Ready for performance tweaks: `React.memo`, `useMemo`, `lazy`, skeletons
