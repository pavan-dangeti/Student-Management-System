# Student Management System

A responsive, role-based student management system built with React, TypeScript, Tailwind CSS, and a small custom component library in the shadcn/ui style.

## Features

- **Role-based sign-in** with a dedicated interface for Admin, Teacher, and Student accounts
- **Distinct dashboards per role** — school-wide stats for admins, class-focused views for teachers, personal attendance for students
- **Student directory** with search, grade/status filtering, and full add/edit/delete workflows (delete is admin-only)
- **Attendance tracking** with per-student present/absent/late marking, class filtering, and a bulk "mark all present" action
- **Profile page** available to every account, with role-specific editable fields
- Data persists across navigation and page reloads (backed by `localStorage`), including a running activity feed on the admin dashboard
- Reusable, accessible UI components: Button, Card, Dialog, Select, Input, Badge, Avatar, Sidebar
- Fully responsive layout with a collapsible sidebar

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + Vite | Frontend framework and build tool |
| TypeScript | Type-safe development |
| Tailwind CSS | Styling and design tokens |
| Custom UI library | Reusable components (Button, Card, Dialog, Select, etc.) |
| React Router | Client-side routing |
| Vitest + Testing Library | Unit and integration tests |
| Playwright | End-to-end browser tests |

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` and sign in using one of the demo accounts below (any password of 4+ characters):

| Role | Email |
|---|---|
| Admin | `admin@school.edu` |
| Teacher | `teacher@school.edu` |
| Student | `student@school.edu` |

## Scripts

```bash
npm run dev        # start the dev server
npm run build      # type-check and build for production
npm run preview    # preview the production build locally
npm run test       # run unit/integration tests (Vitest)
npm run test:e2e   # run end-to-end tests (Playwright)
```

## Deployment

This is a static Vite build and deploys as-is to Vercel, Netlify, or any static host:

```bash
npm run build
```

Deploy the generated `dist/` folder. On Vercel: framework preset "Vite", build command `npm run build`, output directory `dist`.

## License

MIT
