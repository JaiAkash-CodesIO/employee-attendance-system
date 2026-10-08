# AttendSphere • Enterprise Employee Attendance & Workforce Management System

An enterprise-ready, full-stack Employee Attendance Management System built with **Next.js 16 (App Router & Turbopack)**, **NestJS 11**, and **Google Cloud Firestore**. 

Featuring **Bcrypt password encryption**, **JWT-based authentication**, **interactive Swagger OpenAPI documentation**, **GPS geolocation verification**, **automatic work duration tracking**, and **executive analytics with Recharts**.

---

## 🌟 Key Highlights & Features

### 🔐 Security & Architecture
- **Bcrypt Password Encryption**: Industry-standard salt hashing prevents plaintext credential leaks.
- **JWT Authentication & Roles**: Signed JWT tokens distinguish between `EMPLOYEE` and `ADMIN` roles.
- **Backend-Authenticated Admin**: Admin login secured through NestJS API endpoints with custom environment credentials.
- **Runtime Validation Pipes**: Strict DTO validation with `class-validator` & `class-transformer`.
- **Render & Vercel Optimized**: Configured with dynamic CORS, host binding (`0.0.0.0`), and environment variable templates.

### ⏱️ Attendance & Workforce Tracking
- **Automated Work Duration**: Calculates exact shift hours and minutes upon punch-out.
- **Duplicate Prevention**: Prevents double check-ins on the same calendar day.
- **GPS-Verified Check-In**: Captures and audits browser geolocation coordinates (`latitude`, `longitude`) during punch events.
- **Interactive Analytics Dashboard**: Live KPI cards (Active Shifts, Today's Attendance) and Recharts department distribution.
- **Export Reports**: Stream attendance records to **CSV** or print-ready **PDF**.

### 🎨 Modern UI & UX
- **Custom Toast Notifications**: Smooth, auto-dismissing animated feedback replacing raw browser alerts.
- **Live Pulsing Clock**: Real-time second-by-second shift counter.
- **Dark Glassmorphic Theme**: Tailwind CSS v4 styling with Lucide iconography.
- **Interactive Swagger Documentation**: Accessible at `/api/docs`.

---

## 🛠️ Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16 (Turbopack, App Router), React 19, Tailwind CSS v4, Recharts, Lucide Icons |
| **Backend** | NestJS 11, TypeScript, Express, Passport, JWT, BcryptJS, Swagger / OpenAPI |
| **Database** | Google Cloud Firestore (Firebase Admin SDK) |
| **Reports** | `json2csv`, `pdfkit` |
| **Hosting** | Vercel (Frontend) & Render (Backend Web Service) |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** >= 18 (Tested on Node v24)
- **Firebase Project** with Cloud Firestore enabled

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (refer to `.env.example`):
```env
PORT=3001
JWT_SECRET=your-secure-jwt-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Firebase Service Account Credentials
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Start the backend:
```bash
npm run start:dev
```
- API Server: `http://localhost:3001`
- **Swagger Documentation**: `http://localhost:3001/api/docs`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` in `frontend/` (refer to `.env.example`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start the frontend:
```bash
npm run dev
```
- Web Application: `http://localhost:3000`

---

## 📖 Interactive API Documentation

Visit `/api/docs` while the backend is running to test all endpoints:

- `POST /employee` - Register employee with Bcrypt password hashing
- `POST /employee/login` - Employee authentication & JWT issuance
- `POST /employee/admin-login` - Admin authentication & JWT issuance
- `GET /employee` - List all employees
- `GET /employee/:employeeId` - Retrieve single employee profile
- `POST /attendance/punch-in` - Record punch in with optional GPS coordinates
- `POST /attendance/punch-out` - Record punch out & calculate total work duration
- `GET /attendance/stats/overview` - KPI metrics & department distribution for charts
- `GET /attendance/all` - Company-wide attendance log
- `GET /attendance/export/csv` - Stream CSV file download
- `GET /attendance/export/pdf` - Stream PDF report download

---

## 🚢 Deployment Guidelines

### Vercel (Frontend)
- Set environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
- Redeploy to apply environment variables.

### Render (Backend)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start:prod`
- Environment Variables:
  - `PORT=10000`
  - `FIREBASE_PROJECT_ID=...`
  - `FIREBASE_CLIENT_EMAIL=...`
  - `FIREBASE_PRIVATE_KEY=...`
  - `FRONTEND_URL=https://your-app.vercel.app`
