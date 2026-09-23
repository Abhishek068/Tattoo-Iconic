# Tattoo Iconic — Solo Master Tattoo Artist Web Platform

An ultra-luxury editorial web application, booking management system, and portfolio for solo master tattoo artist **Jainik Patel** ([@tatoo.iconic](https://www.instagram.com/tatoo.iconic)) based in Bhadam, Rajpipla, Narmada, Gujarat.

---

## 🎨 Architecture: Frontend-First Next.js

- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS, Vanilla CSS animations, Glassmorphism
- **Interactivity & 3D**: Framer Motion, Lusion-style magnetic elements, kinetic typography
- **Data Architecture**: Strongly-typed frontend data & service abstraction layer (`/data`, `/services`, `/types`)
- **Artist Authentication**: Server-side security key validation (`ARTIST_DASHBOARD_SECRET`) via Next.js route handlers with cryptographically signed HMAC-SHA256 session tokens stored in HTTP-only cookies protected with Next.js Middleware.
- **Future Django Compatibility**: Services are designed with clean asynchronous signatures (`portfolioService.getAll()`, `bookingService.create()`, etc.) ready for future drop-in Django REST API integration without frontend rebuilds.

---

## 🚀 Getting Started

### 1. Installation & Environment Setup
```bash
cd frontend
npm install
```

Ensure `.env.local` exists (copied from `.env.example`):
```env

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_INSTAGRAM_HANDLE=tatoo.iconic
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Artist Dashboard Access

- **Public Site**: [http://localhost:3000](http://localhost:3000)
- **Artist Access Portal**: [http://localhost:3000/artist-access](http://localhost:3000/artist-access)

- **Protected Dashboard**: [http://localhost:3000/artist-dashboard](http://localhost:3000/artist-dashboard)

All `/artist-dashboard/*` routes are protected server-side with Next.js Middleware. Unauthenticated requests are automatically redirected to `/artist-access`.
