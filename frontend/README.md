# Ink & Iron — Tattoo Studio Frontend

Next.js 14 frontend for the Ink & Iron tattoo studio.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env

# 3. Start dev server
npm run dev
```

Open http://localhost:3000

## Requirements

- Node.js 18+
- Backend API running at http://localhost:8000

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** React Query + Zustand
- **Forms:** React Hook Form + Zod
- **Auth:** NextAuth.js (JWT)
- **Payments:** Stripe (optional)
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Pages

### Public
- `/` — Homepage
- `/portfolio` — Filterable gallery
- `/portfolio/[id]` — Piece detail
- `/artists` — Artist profiles
- `/artists/[id]` — Artist detail + portfolio
- `/booking` — Multi-step booking form
- `/flash` — Flash design store
- `/flash/[id]` — Flash detail
- `/blog` — Blog posts
- `/blog/[slug]` — Blog post detail
- `/aftercare` — Aftercare guide
- `/contact` — Contact form + map
- `/login` — Sign in
- `/register` — Create account

### Dashboard (auth required)
- `/dashboard/appointments` — View / manage appointments
- `/dashboard/appointments/[id]` — Appointment detail
- `/dashboard/portfolio` — Upload / manage portfolio
- `/dashboard/clients` — Client list
- `/dashboard/analytics` — Stats overview
- `/dashboard/blog` — Manage blog posts
- `/dashboard/blog/new` — Create new post
- `/dashboard/settings` — Profile & password
