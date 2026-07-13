"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">

      {/* Navigation */}
      <nav className="flex items-center justify-between px-10 py-6">
        <h1 className="text-3xl font-extrabold text-cyan-400">
          Employee Attendance
        </h1>

        <div className="space-x-4">
          <Link
            href="/login"
            className="rounded-xl border border-cyan-400 px-5 py-2 hover:bg-cyan-500 transition"
          >
            Employee Login
          </Link>

          <Link
            href="/admin"
            className="rounded-xl bg-cyan-500 px-5 py-2 text-black font-semibold hover:bg-cyan-400 transition"
          >
            Admin Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 mt-20">

        <div className="bg-white/10 backdrop-blur-xl border border-cyan-500 rounded-3xl p-12 max-w-4xl shadow-2xl">

          <h1 className="text-6xl font-extrabold leading-tight">
            Employee Attendance
            <span className="block text-cyan-400">
              Management System
            </span>
          </h1>

          <p className="mt-8 text-xl text-gray-300">
            Secure cloud-based attendance system powered by
            Firebase and NestJS.
          </p>

          <div className="mt-10 flex justify-center gap-6">

            <Link
              href="/login"
              className="rounded-xl bg-cyan-500 px-8 py-4 text-lg font-bold text-black hover:scale-105 hover:bg-cyan-400 transition"
            >
              Employee Login
            </Link>

            <Link
              href="/register"
              className="rounded-xl border border-cyan-400 px-8 py-4 text-lg hover:bg-cyan-600 transition"
            >
              Register Employee
            </Link>

          </div>

        </div>

      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 mt-24 px-12 pb-20">

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500 hover:scale-105 transition">
          <div className="text-5xl">🕒</div>
          <h2 className="text-2xl font-bold mt-5">
            Attendance Tracking
          </h2>
          <p className="mt-4 text-gray-300">
            Employees can punch in and punch out with one click.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500 hover:scale-105 transition">
          <div className="text-5xl">☁️</div>
          <h2 className="text-2xl font-bold mt-5">
            Firebase Cloud
          </h2>
          <p className="mt-4 text-gray-300">
            Attendance records are stored securely in Firestore.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500 hover:scale-105 transition">
          <div className="text-5xl">📊</div>
          <h2 className="text-2xl font-bold mt-5">
            Admin Reports
          </h2>
          <p className="mt-4 text-gray-300">
            Export attendance reports in CSV and PDF formats.
          </p>
        </div>

      </section>

    </main>
  );
}