# YogaLife — Your Personal Yoga & Wellness Companion
> A full-stack, responsive, modern yoga awareness and daily practice platform.

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-blue.svg)](https://www.postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-6.4-indigo.svg)](https://www.prisma.io)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-teal.svg)](https://tailwindcss.com)

---

## 1. Project Overview

**YogaLife** is a complete, full-stack web application designed to promote authentic yoga awareness, provide rich educational resources, offer interactive guided yoga practice studio sessions with real-time countdown timers, generate personalized routines through a deterministic recommendation engine, and track personal practice habits with interactive charts and milestones.

Designed with a serene **nature-inspired visual aesthetic** (sage green, warm cream, earth tones, and Playfair Display typography), YogaLife is tailored for college project demonstrations, hackathon presentations, and production portfolios.

---

## 2. Technology Stack

### Frontend
- **Framework**: React.js (v18) with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom sage & earth color palettes
- **Routing**: React Router DOM (v6)
- **Icons**: Lucide React
- **Analytics & Charts**: Recharts (Weekly practice tracking & target comparison)
- **Forms & Validation**: React Hook Form with Zod
- **Delight & Micro-interactions**: Canvas Confetti for practice completion celebrations

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (`ts-node-dev` for development, `tsc` for production)
- **Database ORM**: Prisma ORM with PostgreSQL
- **Authentication**: JWT-based session tokens with HTTP-only cookies and Bearer headers
- **Password Security**: bcryptjs password hashing (10 rounds)
- **Security & Reliability**: Express rate limiting, strict CORS policies, centralized error handling

### Testing & Tooling
- **Testing**: Vitest with Supertest integration suite
- **Seed Scripts**: Database seeding with 22 poses, 6 curated programs, 8 educational articles, and 4 community workshops

---

## 3. Project Structure

```
YogaVerse/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema & entity models
│   │   └── seed.ts             # Comprehensive seed script (22 poses, 6 programs, etc.)
│   ├── src/
│   │   ├── middleware/
│   │   │   ├── auth.ts         # JWT authentication & admin authorization checks
│   │   │   └── errorHandler.ts # Centralized safe error handler
│   │   ├── routes/
│   │   │   ├── auth.ts         # Register, Login, Logout, Me, Profile, Password recovery
│   │   │   ├── poses.ts        # Poses library & filtering
│   │   │   ├── programs.ts     # Curated programs & pose sequences
│   │   │   ├── enrollments.ts  # User program enrollments & progress
│   │   │   ├── articles.ts     # Yoga Awareness Hub articles
│   │   │   ├── events.ts       # Community workshops & registration
│   │   │   ├── sessions.ts     # Practice session tracking & streak calculation
│   │   │   ├── dashboard.ts    # Analytics, weekly activity, and milestones
│   │   │   ├── goals.ts        # Practice goals (daily minutes & weekly days)
│   │   │   ├── planner.ts      # Rule-based sequence recommendation engine
│   │   │   └── admin.ts        # Admin stats, user role management & audit logs
│   │   ├── utils/
│   │   │   ├── token.ts        # JWT token sign and verify
│   │   │   └── audit.ts        # Administrative action logger
│   │   ├── app.ts              # Express application configuration
│   │   ├── index.ts            # Server entrypoint
│   │   └── prisma.ts           # Singleton Prisma client
│   ├── tests/
│   │   └── api.test.ts         # Automated Vitest test suite
│   ├── .env                    # Local environment variables
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx      # Responsive navigation with logo & auth menus
│   │   │   ├── Footer.tsx      # Serene brand footer with quick links
│   │   │   ├── Badge.tsx       # Reusable colored badge tokens
│   │   │   ├── Modal.tsx       # Accessible modal dialog
│   │   │   ├── BreathingGuide.tsx # Interactive Sama Vritti box breathing guide
│   │   │   ├── PoseCard.tsx    # Asana card with difficulty & duration badges
│   │   │   ├── PoseDetailModal.tsx # Complete pose instructions & precautions
│   │   │   └── ProtectedRoute.tsx # Route guard for authentication and roles
│   │   ├── context/
│   │   │   └── AuthContext.tsx # Global authentication provider & user state
│   │   ├── pages/
│   │   │   ├── HomePage.tsx    # Landing page with hero, tip, programs, poses, FAQ
│   │   │   ├── AboutPage.tsx   # History, 8 Limbs of Patanjali, benefits & safety
│   │   │   ├── PosesPage.tsx   # Searchable asana library (22 poses, filters)
│   │   │   ├── GuidedPracticePage.tsx # Active countdown studio timer & playlist
│   │   │   ├── ProgramsPage.tsx # Curated 7-Day & themed yoga pathways
│   │   │   ├── ProgramDetailPage.tsx # Sequence breakdown (Warm-up, Main, Cool-down)
│   │   │   ├── ArticlesPage.tsx # Yoga Awareness Hub educational articles
│   │   │   ├── ArticleDetailPage.tsx # Typography-optimized reading view
│   │   │   ├── EventsPage.tsx  # Community workshops & seat reservations
│   │   │   ├── PlannerPage.tsx # Interactive rule-based recommendation advisor
│   │   │   ├── DashboardPage.tsx # Personal analytics, Recharts, milestones & streak
│   │   │   ├── LoginPage.tsx   # Sign-in with demo preset buttons
│   │   │   ├── RegisterPage.tsx # Sign-up form
│   │   │   ├── ForgotPasswordPage.tsx # Password reset request
│   │   │   ├── ResetPasswordPage.tsx # Secure token password update
│   │   │   ├── AdminPage.tsx   # Full administrator management console
│   │   │   └── NotFoundPage.tsx
│   │   ├── services/
│   │   │   └── api.ts          # Typed fetch API client
│   │   ├── types/
│   │   │   └── index.ts        # Shared TypeScript interfaces
│   │   ├── App.tsx             # Route definitions
│   │   ├── index.css           # Tailwind styling & serene design system
│   │   └── main.tsx            # Vite root entry
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── .env.example                # Template environment variables
├── .gitignore
├── package.json                # Root workspace convenience scripts
└── README.md
```

---

## 4. Default Demonstration Accounts

For quick college project evaluations, hackathon presentations, and portfolio reviews, pre-seeded accounts are provided:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@yogalife.com` | `Admin@123` | Full access to Admin Console, Pose CRUD, User Roles, and Audit Trail |
| **Practitioner (User)** | `demo@yogalife.com` | `User@123` | Personal Dashboard, Guided Practice logging, Program progress, and Event registration |

> **Tip**: The Login page includes one-click **"⚡ Quick Demo Accounts"** autofill buttons for instant sign-in.

---

## 5. Local Setup & Execution Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: Running locally on port `5432`

### Step 1: Clone or Navigate to the Project Directory
```bash
cd YogaVerse
```

### Step 2: Configure Environment Variables

**Backend (`backend/.env`)**:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:admin@localhost:5432/yogalife?schema=public"
JWT_SECRET="yogalife_super_secret_jwt_key_2026_wellness_mindfulness_flow"
JWT_EXPIRES_IN="7d"
CLIENT_ORIGIN="http://localhost:5173"
COOKIE_DOMAIN=""
```

**Frontend (`frontend/.env`)**:
```env
VITE_API_URL="http://localhost:5000/api"
```

### Step 3: Install Dependencies
Install dependencies across the workspace:
```bash
# Install root, backend, and frontend packages
npm install
npm --prefix backend install
npm --prefix frontend install
```

### Step 4: Synchronize Database & Seed Sample Records
Create the database tables and populate sample poses, programs, articles, and default accounts:
```bash
# Generate Prisma Client
npm --prefix backend run prisma:generate

# Push database schema to PostgreSQL
npm --prefix backend run prisma:push

# Seed database with 22 poses, 6 programs, 8 articles, 4 events, and demo accounts
npm --prefix backend run prisma:seed
```

### Step 5: Start Development Servers
Run both backend and frontend concurrently with a single command from root:
```bash
npm run dev
```

Or run them individually in separate terminals:
```bash
# Terminal 1: Backend API (http://localhost:5000)
npm run dev:backend

# Terminal 2: Frontend Client (http://localhost:5173)
npm run dev:frontend
```

Now open **http://localhost:5173** in your web browser.

---

## 6. Running Automated Tests

Run the backend integration test suite:
```bash
npm test
```

This tests:
- Server health (`GET /api/health`)
- Pose library retrieval and count validation (`GET /api/poses`)
- Programs and articles endpoints
- Password authentication, token signing, and invalid credential rejection
- Protected route security (`GET /api/auth/me`)
- Practice session duration recording and achievement triggers (`POST /api/sessions`)
- User wellness goal adjustments (`PUT /api/goals`)
- Rule-based planner recommendation engine and medical disclaimers (`POST /api/planner/recommend`)
- Role-based authorization denial for non-admins (`GET /api/admin/stats`)

---

## 7. Production Build

To compile both backend and frontend for production deployment:
```bash
npm run build
```

The compiled frontend artifacts will reside in `frontend/dist/` and backend files in `backend/dist/`.

---

## 8. RESTful API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Create a new user account | No |
| `POST` | `/api/auth/login` | Authenticate with email & password | No |
| `POST` | `/api/auth/logout` | Clear session cookie | No |
| `GET` | `/api/auth/me` | Fetch current authenticated user & goal | Yes (User/Admin) |
| `PUT` | `/api/auth/profile` | Update user name, bio, or avatar | Yes (User/Admin) |
| `POST` | `/api/auth/forgot-password`| Generate password recovery token | No |
| `POST` | `/api/auth/reset-password` | Reset password using verified token | No |
| `GET` | `/api/poses` | Search and filter poses library | No |
| `GET` | `/api/poses/:id` | Fetch pose details and related poses | No |
| `POST` | `/api/poses` | Create new yoga asana | **Yes (Admin)** |
| `PUT` | `/api/poses/:id` | Update yoga asana | **Yes (Admin)** |
| `DELETE`| `/api/poses/:id` | Remove yoga asana | **Yes (Admin)** |
| `GET` | `/api/programs` | List curated yoga programs | No |
| `GET` | `/api/programs/:id` | Get program sequence by ID or slug | No |
| `POST` | `/api/programs/:id/enroll`| Enroll user into a program | Yes (User/Admin) |
| `GET` | `/api/enrollments/my` | View user's enrolled programs | Yes (User/Admin) |
| `POST` | `/api/sessions` | Record a completed guided practice session | Yes (User/Admin) |
| `GET` | `/api/sessions/my` | Fetch user practice history | Yes (User/Admin) |
| `GET` | `/api/dashboard/stats` | Dashboard statistics, chart data, milestones | Yes (User/Admin) |
| `GET` | `/api/goals` | Get user wellness targets | Yes (User/Admin) |
| `PUT` | `/api/goals` | Update daily minutes & weekly practice goal | Yes (User/Admin) |
| `POST` | `/api/planner/recommend`| Generate rule-based personalized sequence | No |
| `GET` | `/api/articles` | List educational articles & search | No |
| `GET` | `/api/articles/:id` | View full article reading layout | No |
| `GET` | `/api/events` | List upcoming community workshops | No |
| `POST` | `/api/events/:id/register`| Register for a workshop seat | Yes (User/Admin) |
| `DELETE`| `/api/events/:id/register`| Cancel workshop registration | Yes (User/Admin) |
| `GET` | `/api/admin/stats` | Platform aggregate metrics | **Yes (Admin)** |
| `GET` | `/api/admin/users` | List registered users & manage roles | **Yes (Admin)** |
| `GET` | `/api/admin/audit-logs` | View administrative audit trail | **Yes (Admin)** |

---

## 9. Security & Privacy

- **Password Hashing**: Secure salted hashes using `bcryptjs` with 10 salt rounds. Plaintext passwords are never stored.
- **Protection Against Brute Force**: Express rate limiters protect `/api/auth/login`, `/api/auth/register`, and `/api/auth/forgot-password`.
- **Authorization**: Endpoints check role membership on the backend. Client-side navigation guards reflect server-enforced permissions.
- **Audit Logging**: Important administrative modifications (creating poses, updating programs, altering user roles) are tracked in the database `AuditLog` table.
- **Medical Disclaimers**: Prominently displayed across the platform and recommendation planner to clearly designate content as general wellness education rather than clinical advice.

---

## 10. License & Credits

Developed with traditional mindfulness principles and modern software craftsmanship for educational demonstrations and portfolio presentation.
