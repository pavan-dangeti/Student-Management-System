<div align="center">

# 🏫 Student Management System

**A fully functional, role-based student management system built with React, TypeScript, Tailwind CSS, and a Shadcn/UI-style component library.**

[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)

A responsive, modern student management system featuring role-based mock authentication, student data handling, attendance tracking, and grade management — all wrapped in a clean, accessible UI.

</div>

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Demo Accounts](#-demo-accounts)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [Developed By](#-developed-by)
- [License](#-license)

---

## ✨ Features

- 🔐 **Role-based sign-in** with dedicated interfaces for Admin, Teacher, and Student accounts
- 📊 **Distinct dashboards per role** — school-wide stats for admins, class-focused views for teachers, personal attendance for students
- 👨‍🎓 **Student directory** with search, grade/status filtering, and full add/edit/delete workflows (delete restricted to Admin)
- 📅 **Attendance tracking** with per-student present/absent/late marking, class filtering, and a bulk "mark all present" action
- 📝 **Grade management** to track and manage student performance
- 🧑‍💼 **Profile pages** available to every account, with role-specific editable fields
- 💾 **Persistent data** across navigation and page reloads (backed by `localStorage`), including a live activity feed on the admin dashboard
- 🧩 **Reusable, accessible UI components** — Button, Card, Dialog, Select, Input, Badge, Avatar, Sidebar
- 📱 **Fully responsive layout** with a collapsible sidebar for mobile and desktop

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 18 + Vite** | Frontend framework and build tool |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Styling and design tokens |
| **Shadcn/UI + Radix UI** | Accessible, reusable component library |
| **React Router** | Client-side routing |
| **React Hook Form + Zod** | Form handling and validation |
| **Lucide Icons** | Icon library |
| **Context API** | Mock authentication and global state |
| **Vitest + Testing Library** | Unit and integration tests |
| **Playwright** | End-to-end browser tests |

---

## 🚀 Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/pavan-dangeti/Student-Management-System.git
cd Student-Management-System

npm install
npm run dev
```

Then visit **http://localhost:5173** and sign in with one of the demo accounts below (any password of 4+ characters works).

---

## 👥 Demo Accounts

| Role | Email |
|---|---|
| **Admin** | `admin@school.edu` |
| **Teacher** | `teacher@school.edu` |
| **Student** | `student@school.edu` |

---

## 📜 Available Scripts

```bash
npm run dev         # Start the dev server
npm run build        # Type-check and build for production
npm run preview      # Preview the production build locally
npm run test         # Run unit/integration tests (Vitest)
npm run test:e2e     # Run end-to-end tests (Playwright)
```

---

## ☁️ Deployment

This project builds to a static bundle via Vite and deploys as-is to **Vercel**, **Netlify**, or any static host.

```bash
npm run build
```

Deploy the generated `dist/` folder. On Vercel: framework preset **"Vite"**, build command `npm run build`, output directory `dist`.

---

## 👨‍💻 Developed By

**Pavan Subramanyam Sai Kumar Dangeti**

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">

🏫 **Student Management System — Clean, modern, and fully functional.**

</div>
