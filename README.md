# 🛍️ SmartBuy — Multi-Vendor E-Commerce Platform

A full-stack e-commerce web app inspired by **Flipkart** and **Amazon** — built with React 19, TypeScript, Express, and Redux Toolkit. Supports three roles (customer, seller, admin), a complete shopping flow, seller storefronts, and an admin dashboard with live analytics.

> Built as a portfolio project to demonstrate full-stack architecture, auth, state management, and production-minded engineering practices.

<!-- 📸 Add screenshots/GIFs here before sharing — this is the first thing recruiters look at.
![Home page](./assets/screenshots/home.png)
![Product detail](./assets/screenshots/product.png)
![Admin dashboard](./assets/screenshots/admin.png)
-->

---

## ✨ Features

**Customer**
- Browse, search, filter & sort products by price / rating
- Product detail page with image gallery, reviews & ratings
- Cart, wishlist, and side-by-side product comparison
- Multi-step checkout with saved addresses & coupons
- Order history and order tracking

**Seller**
- Apply for a store (goes through admin approval)
- Manage own product catalog
- View & update order status (Processing → Shipped → Delivered)
- Store-level sales dashboard

**Admin**
- Platform-wide stats (revenue, orders, products, stores) with charts
- Approve / reject / suspend seller stores
- Create & manage discount coupons

**Engineering**
- JWT-based authentication (custom-signed, PBKDF2-hashed passwords)
- Role-based route protection (`user` / `seller` / `admin`)
- Global error boundary + skeleton loading states
- Micro-interactions & page transitions (Framer Motion)
- Fully typed with TypeScript end-to-end (shared types between client & server)

---

## 🧱 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4 |
| State | Redux Toolkit (cart, products, ratings, addresses) |
| Animation | Framer Motion (`motion`) |
| Backend | Node.js, Express |
| Auth | Custom HMAC-SHA256 JWT + PBKDF2 password hashing |
| Data | JSON file store (`data/db.json`) — see [Roadmap](#-roadmap) for the Postgres migration plan |
| Charts | Recharts |

---

## 🚀 Getting Started

**Prerequisites:** Node.js 18+

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
```

Edit `.env` and set:
- `JWT_SECRET` — a long random string (generate one with the command below)
- `GEMINI_API_KEY` — only needed if you use the AI-powered features

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

```bash
# 3. Run the app
npm run dev
```

The app runs at `http://localhost:3000`.

### Demo accounts
Seeded automatically in development (`NODE_ENV !== production`):

| Role | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | `admin123` |
| Seller | `seller@example.com` | `seller123` |
| Customer | `user@example.com` | `user123` |

> These are seeded for local demos only — the seeding step is skipped entirely when `NODE_ENV=production`, so a real deployment never ships with default credentials.

### Production build

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
├── server.ts              # Express API routes (auth, products, orders, admin…)
├── server/
│   ├── auth.ts             # JWT signing/verification, password hashing, middleware
│   └── db.ts                # JSON-file data layer + models (User, Product, Order…)
├── src/
│   ├── components/         # Reusable UI (Navbar, ProductCard, ErrorBoundary…)
│   ├── views/                # Route-level pages (Home, ProductDetail, Checkout…)
│   ├── context/              # App-wide context (auth/session, cart helpers)
│   ├── lib/features/        # Redux slices (cart, product, rating, address)
│   └── types.ts              # Shared TypeScript interfaces
└── data/db.json             # Local JSON "database" (auto-created on first run)
```

---

## 🔒 Security Notes

This started life as an AI Studio prototype and has since been hardened for a portfolio-quality codebase:

- **Dedicated JWT secret** — the signing secret is a required, standalone `JWT_SECRET` env var. It no longer reuses `GEMINI_API_KEY`, and the server refuses to start without it (no insecure hardcoded fallback).
- **Password hashes are never returned** — `/api/auth/profile` and related endpoints now strip `passwordHash` before the response leaves the server.
- **Basic brute-force protection** — the login route rate-limits repeated failed attempts per IP/email.
- **Input validation** — registration validates email format and enforces a minimum password length server-side.
- **Demo credentials are dev-only** — the default admin/seller/customer accounts are only seeded when `NODE_ENV !== production`.

## 🐞 Known Limitations

- Data persists to a flat JSON file, not a real database — fine for a demo, but not for concurrent production traffic (see Roadmap).
- No automated test suite yet.
- No payment gateway integration (checkout supports COD / a stubbed "Stripe" flag only).

## 🗺️ Roadmap

- [ ] Migrate `data/db.json` → PostgreSQL + Prisma/Drizzle
- [ ] Add Vitest/Jest unit tests for auth & cart logic
- [ ] Add Zod schema validation on all API routes
- [ ] Integrate a real payment gateway (Razorpay/Stripe)
- [ ] Deploy live demo (Vercel/Render) + add link here

---

## 📄 License

This project is for educational/portfolio purposes.
