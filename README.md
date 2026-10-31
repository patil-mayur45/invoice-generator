<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,18&height=220&section=header&text=Invoicely&fontSize=72&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Full-Stack%20Invoice%20Generator&descAlignY=58&descSize=20" alt="Invoicely banner" />

<a href="https://invoice-generator-sage-theta.vercel.app">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=20&pause=1200&color=4F46E5&center=true&vCenter=true&width=640&lines=Create+invoices+in+seconds;Download+professional+PDFs;Track+revenue+on+a+live+dashboard;Built+with+the+MERN+stack" alt="Typing animation" />
</a>

<br/>

<a href="https://invoice-generator-sage-theta.vercel.app">
  <img src="https://img.shields.io/badge/🚀_Live_Demo-Visit_Now-4F46E5?style=for-the-badge" alt="Live Demo" />
</a>
<a href="https://github.com/patil-mayur45/invoice-generator">
  <img src="https://img.shields.io/github/stars/patil-mayur45/invoice-generator?style=for-the-badge&logo=github&color=F59E0B" alt="Stars" />
</a>
<img src="https://img.shields.io/github/last-commit/patil-mayur45/invoice-generator?style=for-the-badge&color=10B981" alt="Last commit" />
<img src="https://img.shields.io/badge/Status-Live-10B981?style=for-the-badge" alt="Status" />

<br/><br/>

<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" />
<br/>
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
<br/>
<img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
<img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black" />
<img src="https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />

</div>

---

> ⏳ **Note:** The backend runs on Render's free plan. If nobody used the app for a while, the first request can take **up to 50 seconds**. Please wait a little on the first load.

## 📸 Screenshots

| Dashboard | Invoice Details |
| :---: | :---: |
| ![Dashboard](screenshots/dashboard.png) | ![Invoice](screenshots/invoice.png) |

| Create Invoice | Mobile View |
| :---: | :---: |
| ![Create Invoice](screenshots/create-invoice.png) | ![Mobile](screenshots/mobile.png) |

## ✨ Features

| | Feature | What it does |
| :-: | --- | --- |
| 🔐 | **Secure login** | Register and login with JWT. Passwords are hashed with bcrypt. |
| 📊 | **Live dashboard** | Animated counters, monthly revenue chart, and recent invoices. |
| 🧾 | **Invoice management** | Create, edit, view and delete invoices with auto numbers like `INV-0001`. |
| ➕ | **Dynamic line items** | Add or remove items. Subtotal, tax, discount and total are calculated automatically. |
| 🏷️ | **Status tracking** | Draft, sent, paid, overdue and cancelled. |
| 📄 | **PDF download** | One click to get a clean, professional invoice PDF. |
| 👥 | **Client directory** | Add, edit, search and delete clients. |
| 🔎 | **Smart search** | Debounced search and status filters. |
| ⚙️ | **Settings** | Company name, address, tax ID, currency, default tax and due days. |
| 📱 | **Fully responsive** | Works on mobile, tablet and desktop. |
| 🎞️ | **Smooth animations** | Page transitions, modals, hover effects and skeleton loading. |
| 🛡️ | **Security** | Helmet, CORS, rate limiting and Zod validation. |

## 🧰 Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 18, Vite, React Router, Tailwind CSS, Framer Motion, Recharts, Axios, React Hook Form, Zod |
| **Backend** | Node.js, Express.js, JWT, bcryptjs, PDFKit, Helmet, express-rate-limit |
| **Database** | MongoDB, Mongoose |
| **Deployment** | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

## 🧠 Challenges I Solved

**1. Login not working on the live site**
Frontend (Vercel) and backend (Render) are on two different websites, and browsers block cookies shared between them. I fixed it by saving the JWT in the browser and sending it in the `Authorization: Bearer` header on every request.

**2. 404 error when refreshing a page**
React Router pages like `/login` showed a 404 on Vercel. I fixed it with a `vercel.json` rewrite that sends all routes to `index.html`.

**3. Wrong totals risk**
The frontend shows a live preview, but the backend calculates the final subtotal, tax and total again, so nobody can send a wrong amount.

**4. Environment variables in production**
Vite reads environment variables at build time, so `VITE_API_URL` must be set before the build. I debugged this using the browser console and network tab.

## 🚀 Run It Locally

**You need:** Node.js (LTS) and a MongoDB database (a free MongoDB Atlas cluster works).

```bash
# 1. Clone
git clone https://github.com/patil-mayur45/invoice-generator.git
cd invoice-generator
```

**Backend**

```bash
cd Backend
npm install
```

Create `Backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

**Frontend** (open a second terminal)

```bash
cd Frontend
npm install
npm run dev
```

Open **http://localhost:5173** and create an account. 🎉

## 🔑 Environment Variables

| Where | Variable | Description |
| --- | --- | --- |
| Backend | `PORT` | Server port |
| Backend | `NODE_ENV` | `development` locally, `production` when deployed |
| Backend | `MONGO_URI` | MongoDB connection string |
| Backend | `JWT_SECRET` | Long random text for signing tokens |
| Backend | `JWT_EXPIRES_IN` | Token life, for example `7d` |
| Backend | `CLIENT_URL` | Frontend URL allowed by CORS |
| Frontend (Vercel) | `VITE_API_URL` | Backend API address, ending with `/api` |

## 🔗 API Endpoints

<details>
<summary><b>Click to see all endpoints</b></summary>

<br/>

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/auth/me` | Current user |
| GET | `/api/invoices` | List invoices (status, search, page, limit) |
| GET | `/api/invoices/:id` | Get one invoice |
| POST | `/api/invoices` | Create invoice |
| PUT | `/api/invoices/:id` | Update invoice |
| DELETE | `/api/invoices/:id` | Delete invoice |
| PATCH | `/api/invoices/:id/status` | Update status |
| GET | `/api/invoices/:id/pdf` | Download PDF |
| GET | `/api/clients` | List clients |
| POST | `/api/clients` | Create client |
| PUT | `/api/clients/:id` | Update client |
| DELETE | `/api/clients/:id` | Delete client |
| GET | `/api/dashboard/stats` | Dashboard data |
| PUT | `/api/settings` | Update settings |

All routes except register and login need a valid token.

</details>

## 📁 Project Structure

<details>
<summary><b>Click to see folders</b></summary>

```
invoice-generator/
├── Backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Auth, invoice, client, dashboard, settings
│   ├── middleware/      # Auth check, error handler
│   ├── models/          # User, Client, Invoice
│   ├── routes/          # API routes
│   ├── utils/           # Token, invoice number, PDF generator
│   └── server.js
└── Frontend/
    ├── src/
    │   ├── components/  # Reusable UI
    │   ├── pages/       # Dashboard, Invoices, Clients, Settings, Auth
    │   ├── context/     # Auth context
    │   ├── hooks/       # useDebounce
    │   └── lib/         # Axios setup
    └── vercel.json      # Routing fix for Vercel
```

</details>

## 🔮 Future Improvements

- [ ] Send invoices to clients by email
- [ ] Online payments
- [ ] Admin screens and roles
- [ ] Recurring invoices
- [ ] Company logo upload

## 👨‍💻 Author

**Mayur Patil** — Full Stack Web Developer

<a href="https://github.com/patil-mayur45"><img src="https://img.shields.io/badge/GitHub-patil--mayur45-181717?style=for-the-badge&logo=github" /></a>
<a href="https://www.linkedin.com/in/mayur-patil-0a14a541b"><img src="https://img.shields.io/badge/LinkedIn-Mayur_Patil-0A66C2?style=for-the-badge&logo=linkedin" /></a>

<div align="center">

⭐ **If you like this project, please give it a star!** ⭐

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,14,18&height=120&section=footer" alt="footer" />

</div>
