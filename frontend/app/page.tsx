"use client";

import Link from "next/link";
import {
  Clock,
  ShieldCheck,
  BarChart3,
  MapPin,
  Sparkles,
  ArrowRight,
  Lock,
  FileSpreadsheet,
  Users,
  CheckCircle2,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  return (
    <main className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] transition-colors duration-200">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-md sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight">
              Attend<span className="text-cyan-500 dark:text-cyan-400">Sphere</span>
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 rounded border border-cyan-500/20">
              Enterprise
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition px-3 py-2"
          >
            Employee Login
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-bold text-white hover:from-cyan-400 hover:to-blue-500 transition shadow-md shadow-cyan-500/20"
          >
            <ShieldCheck className="w-4 h-4" /> Admin Portal
          </Link>

          {/* Theme Toggle Button */}
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 md:pt-24 pb-20 flex flex-col items-center text-center max-w-5xl mx-auto">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-50 dark:bg-cyan-950/40 text-xs text-cyan-700 dark:text-cyan-300 mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
          <span>Next-Gen Architecture • Next.js 16 + NestJS 11 + Firebase Firestore</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl text-slate-900 dark:text-white">
          Intelligent Workforce &amp;{" "}
          <span className="bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 dark:from-cyan-400 dark:via-teal-300 dark:to-blue-500 bg-clip-text text-transparent">
            Attendance Platform
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-gray-300 max-w-2xl font-normal leading-relaxed">
          Streamline daily punch-in/out, GPS-verified check-ins, automated shift duration calculation, and executive CSV/PDF analytics.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-base font-bold text-white hover:from-cyan-400 hover:to-blue-500 transition shadow-xl shadow-cyan-500/25 hover:scale-105 active:scale-95 duration-200"
          >
            Employee Dashboard <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/register"
            className="rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 backdrop-blur-xl px-8 py-4 text-base font-semibold text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-cyan-500/40 transition hover:scale-105 active:scale-95 duration-200 shadow-sm"
          >
            Register Account
          </Link>

          <a
            href={`${apiUrl}/api/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-cyan-500/30 bg-cyan-50 dark:bg-cyan-950/30 px-6 py-4 text-base font-semibold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition hover:scale-105 active:scale-95 duration-200"
          >
            Swagger API Docs ↗
          </a>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold">
            Built for Enterprise Scale
          </h2>
          <p className="text-3xl font-bold mt-2 text-slate-900 dark:text-white">
            Designed for Reliability, Security &amp; Speed
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-xl p-8 hover:border-cyan-500/50 transition group shadow-sm dark:shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Shift &amp; Duration Tracker</h3>
            <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
              Calculates precise shift duration in hours and minutes upon punch out, preventing double check-ins automatically.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-xl p-8 hover:border-emerald-500/50 transition group shadow-sm dark:shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">GPS Verification</h3>
            <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
              Captures geolocation coordinates at punch timestamps to provide audit-ready proof of on-site attendance.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-xl p-8 hover:border-indigo-500/50 transition group shadow-sm dark:shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Executive Reports</h3>
            <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
              Interactive departmental headcount charts, instant streaming CSV downloads, and PDF print exports with one click.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500 dark:text-gray-400">
        AttendSphere • Built with Next.js, NestJS, and Google Cloud Firestore.
      </footer>
    </main>
  );
}