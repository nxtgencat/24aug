# MediCare HMS

> Hospital Management System — React + Vite + Tailwind CSS (Tearline) — pnpm

## Features

**Core**
- [x] Auth — login / register / forgot password, protected routes
- [x] Role-based access — admin / doctor / receptionist / patient switcher
- [x] Dashboard — stats cards, charts, quick actions
- [x] Patients — search, filter, sort, pagination, add / edit / delete
- [x] Doctors — search, department filter, status badges

**Clinical workflows**
- [x] Appointments — validated booking form, complete / cancel / delete, status filters
- [x] Medical records — add / view / delete with attachments
- [x] Prescriptions — multi-medicine builder, per-prescription PDF export
- [x] Lab reports — validated upload with preview, mark ready, download
- [x] Pharmacy — inventory CRUD, low-stock alerts, restock
- [x] Billing — invoice builder with live total, mark paid, PDF / Excel export

**Production**
- [x] Reports — dataset picker + preview, PDF / Excel / CSV export
- [x] Locations map — OpenStreetMap with click-to-fly facility list
- [x] Notifications — live event feed, mark read / all, optional EmailJS digest
- [x] Error handling — global ErrorBoundary + styled 404
- [x] Performance — lazy-loaded routes, memoized filtering

## Run

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # production build
```

Login with any email + password (min 6 chars), pick a role.

Optional integrations: `cp .env.example .env` — Cloudinary / EmailJS keys.

## Structure

```
src/
  components/   UI primitives + ErrorBoundary
  context/      Auth + Notifications
  pages/        All modules
  routes/       Lazy-loaded router
  services/     api, mockData, exporters (PDF / Excel / CSV)
```
