# Invoicely — MERN Invoice Generator

A full-stack, animated invoice generator built with MongoDB, Express, React (Vite), and Node.js.

## Features
- JWT auth (HTTP-only cookies), register/login/logout
- Animated dashboard with revenue chart and live stats
- Invoice CRUD with dynamic line items, tax, discount, auto-numbering (INV-0001...)
- PDF generation & download for any invoice
- Client directory with per-client invoice history
- Company settings (logo/tax ID/currency/default terms)
- Responsive, mobile-first UI with Tailwind CSS + Framer Motion animations

## Project structure
```
invoice-generator/
├── client/   # React + Vite frontend
└── server/   # Express + MongoDB backend
```

## Getting started

### 1. Backend
```bash
cd server
cp .env.example .env      # then fill in MONGO_URI and JWT_SECRET
npm install
npm run dev                # starts on http://localhost:5000
```

You need a MongoDB instance — either local (`mongodb://127.0.0.1:27017/invoice_generator`)
or a free MongoDB Atlas cluster (recommended, paste the connection string into `MONGO_URI`).

### 2. Frontend
```bash
cd client
npm install
npm run dev                # starts on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`, so just open
`http://localhost:5173` and register an account to get started.

### 3. Production build
```bash
cd client && npm run build   # outputs client/dist
```
Serve `client/dist` with any static host, and deploy `server/` (e.g. Render, Railway, Fly.io)
with your production `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` env vars set.

## Notes
- Tax/discount/total are always recalculated server-side on save — the client never dictates totals.
- Invoice numbers are generated atomically per-user (`INV-0001`, `INV-0002`, ...).
- PDF generation runs server-side with `pdfkit`, streamed directly to the download response.
