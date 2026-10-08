"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  CalendarCheck,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  LogOut,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  BarChart3,
  Briefcase,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useToast } from "@/components/Toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeContext";

interface StatsData {
  totalEmployees: number;
  totalAttendanceRecords: number;
  presentToday: number;
  activeWorking: number;
  completedToday: number;
  todayDate: string;
  departmentStats: { name: string; employees: number }[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { theme } = useTheme();

  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await fetch(`${apiUrl}/attendance/stats/overview`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    toast("Admin logged out successfully.", "info");
    router.push("/admin");
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  return (
    <main className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] p-6 md:p-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-800/80 px-4 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </button>

          <div className="flex items-center gap-3">
            <a
              href={`${apiUrl}/api/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/20 dark:hover:bg-cyan-500/30 transition border border-cyan-500/30"
            >
              <ExternalLink className="w-4 h-4" /> Swagger Docs
            </a>

            <ThemeToggle />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl bg-rose-500/10 dark:bg-rose-600/20 px-4 py-2 text-sm font-semibold text-rose-600 dark:text-rose-300 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 transition border border-rose-500/30"
            >
              <LogOut className="w-4 h-4" /> Admin Logout
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Executive Admin Dashboard
            </h1>
          </div>
          <p className="text-slate-500 dark:text-gray-400 mt-2 text-sm md:text-base">
            Live workforce analytics, shift overview, and official report generation
          </p>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-cyan-500/30 bg-white dark:bg-slate-900/60 backdrop-blur-xl p-5 shadow-sm dark:shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold tracking-wider text-cyan-600 dark:text-cyan-400">Total Employees</span>
              <Users className="w-5 h-5 text-cyan-500" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {loading ? "..." : stats?.totalEmployees ?? 0}
            </p>
            <span className="text-xs text-slate-500 dark:text-gray-400">Registered staff</span>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-emerald-500/30 bg-white dark:bg-slate-900/60 backdrop-blur-xl p-5 shadow-sm dark:shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold tracking-wider text-emerald-600 dark:text-emerald-400">Punched In Today</span>
              <CalendarCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {loading ? "..." : stats?.presentToday ?? 0}
            </p>
            <span className="text-xs text-slate-500 dark:text-gray-400">Present on {stats?.todayDate || "today"}</span>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-amber-500/30 bg-white dark:bg-slate-900/60 backdrop-blur-xl p-5 shadow-sm dark:shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold tracking-wider text-amber-600 dark:text-amber-400">Active Shifts</span>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {loading ? "..." : stats?.activeWorking ?? 0}
            </p>
            <span className="text-xs text-slate-500 dark:text-gray-400">Currently on duty</span>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-indigo-500/30 bg-white dark:bg-slate-900/60 backdrop-blur-xl p-5 shadow-sm dark:shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold tracking-wider text-indigo-600 dark:text-indigo-400">Total Check-Ins</span>
              <TrendingUp className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-300">
              {loading ? "..." : stats?.totalAttendanceRecords ?? 0}
            </p>
            <span className="text-xs text-slate-500 dark:text-gray-400">All-time database logs</span>
          </div>
        </div>

        {/* Analytics Charts Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Department Breakdown Bar Chart */}
          <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-cyan-500/30 shadow-sm dark:shadow-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-500" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Department Headcount Distribution</h2>
              </div>
              <span className="text-xs text-cyan-600 dark:text-cyan-300 uppercase tracking-wider font-semibold">Live Metric</span>
            </div>

            <div className="h-64 w-full">
              {stats?.departmentStats && stats.departmentStats.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.departmentStats}>
                    <XAxis
                      dataKey="name"
                      stroke={theme === "dark" ? "#94a3b8" : "#64748b"}
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis
                      stroke={theme === "dark" ? "#94a3b8" : "#64748b"}
                      fontSize={12}
                      allowDecimals={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff",
                        borderColor: theme === "dark" ? "#06b6d4" : "#cbd5e1",
                        borderRadius: "12px",
                        color: theme === "dark" ? "#fff" : "#0f172a",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar dataKey="employees" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                  Register employees to populate department analytics
                </div>
              )}
            </div>
          </div>

          {/* Quick Management Actions */}
          <div className="rounded-3xl bg-white dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-cyan-500/30 shadow-sm dark:shadow-2xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-5 h-5 text-cyan-500" />
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quick Portals</h2>
              </div>

              <div className="space-y-4">
                <Link
                  href="/admin/employees"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 transition group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-cyan-500" />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition">
                        Employee Directory
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-gray-400">Search and review registered staff</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-cyan-500">→</span>
                </Link>

                <Link
                  href="/admin/attendance"
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <CalendarCheck className="w-5 h-5 text-emerald-500" />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition">
                        Full Attendance Logs
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-gray-400">Monitor daily punch timestamps & status</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-500">→</span>
                </Link>
              </div>
            </div>

            {/* Export Section */}
            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400">
                Official Report Exports
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => window.open(`${apiUrl}/attendance/export/csv`, "_blank")}
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-600/30 border border-emerald-500/40 p-3 text-xs font-bold text-emerald-700 dark:text-emerald-200 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 transition"
                >
                  <FileSpreadsheet className="w-4 h-4" /> Export CSV
                </button>

                <button
                  onClick={() => window.open(`${apiUrl}/attendance/export/pdf`, "_blank")}
                  className="flex items-center justify-center gap-2 rounded-xl bg-rose-500/10 dark:bg-rose-600/30 border border-rose-500/40 p-3 text-xs font-bold text-rose-700 dark:text-rose-200 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 transition"
                >
                  <FileText className="w-4 h-4" /> Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}