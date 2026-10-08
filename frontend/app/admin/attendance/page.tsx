"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, Search, ArrowLeft, Loader2, MapPin, Clock } from "lucide-react";
import { useToast } from "@/components/Toast";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Attendance {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  date: string;
  status: string;
  workDuration?: string;
  punchIn?: any;
  punchOut?: any;
  punchInLocation?: {
    latitude: number;
    longitude: number;
    locationName?: string;
  };
}

export default function AttendancePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [records, setRecords] = useState<Attendance[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendance();
  }, []);

  async function loadAttendance() {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await fetch(`${apiUrl}/attendance/all`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      } else {
        toast("Unable to load attendance records.", "error");
      }
    } catch (err) {
      console.error(err);
      toast("Could not connect to backend server.", "error");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const val = search.trim().toLowerCase();
    if (!val) return records;
    return records.filter(
      (r) =>
        r.employeeId?.toLowerCase().includes(val) ||
        r.name?.toLowerCase().includes(val) ||
        r.department?.toLowerCase().includes(val) ||
        r.date?.includes(val)
    );
  }, [records, search]);

  const formatTime = (ts: any) => {
    if (!ts) return "-";
    if (ts.toDate) return ts.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (ts._seconds) return new Date(ts._seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] p-6 md:p-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-800/80 px-4 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Admin Dashboard
          </button>

          <ThemeToggle />
        </div>

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Attendance Records
              </h1>
            </div>
            <p className="mt-2 text-sm md:text-base text-slate-500 dark:text-gray-400">
              Audit company-wide check-in logs, work hours, and location timestamps
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-emerald-500/40 bg-white dark:bg-slate-900/60 backdrop-blur-xl px-6 py-4 shadow-sm dark:shadow-xl text-center md:text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Total Log Entries
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {records.length}
            </h2>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
          <input
            placeholder="Search by Employee ID, Name, Department, or Date (YYYY-MM-DD)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 pl-12 pr-4 py-3.5 text-slate-900 dark:text-white placeholder-gray-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm md:text-base shadow-sm"
          />
        </div>

        {/* Table */}
        <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-emerald-500/30 bg-white dark:bg-slate-900/60 backdrop-blur-2xl shadow-sm dark:shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/90 text-slate-600 dark:text-gray-300 border-b border-slate-200 dark:border-slate-800 uppercase text-xs font-semibold">
                <tr>
                  <th className="p-4">Employee ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Punch In</th>
                  <th className="p-4">Punch Out</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                    <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-300">
                      {r.employeeId}
                    </td>

                    <td className="p-4 font-medium text-slate-900 dark:text-white">
                      {r.name || "-"}
                    </td>

                    <td className="p-4 text-slate-600 dark:text-gray-300">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                        {r.department || "-"}
                      </span>
                    </td>

                    <td className="p-4 text-slate-600 dark:text-gray-300 font-mono text-xs">
                      {r.date}
                    </td>

                    <td className="p-4 font-mono text-xs text-slate-700 dark:text-gray-200">
                      <div className="flex items-center gap-1.5">
                        <span>{formatTime(r.punchIn)}</span>
                        {r.punchInLocation && (
                          <span title="GPS Verified" className="text-emerald-500 dark:text-emerald-400">
                            <MapPin className="w-3.5 h-3.5 inline" />
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 font-mono text-xs text-slate-700 dark:text-gray-200">
                      {formatTime(r.punchOut)}
                    </td>

                    <td className="p-4 text-xs font-semibold text-cyan-600 dark:text-cyan-300">
                      {r.workDuration || "-"}
                    </td>

                    <td className="p-4 text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          r.status === "Completed"
                            ? "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-500/30"
                            : "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {loading && (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
                      Loading attendance records...
                    </td>
                  </tr>
                )}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-500 dark:text-gray-400">
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}