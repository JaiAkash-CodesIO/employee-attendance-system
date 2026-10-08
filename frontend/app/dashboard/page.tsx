"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Calendar,
  User,
  Building,
  Mail,
  MapPin,
  CheckCircle2,
  LogOut,
  ArrowLeft,
  Loader2,
  Briefcase,
  History,
} from "lucide-react";
import { useToast } from "@/components/Toast";
import { ThemeToggle } from "@/components/ThemeToggle";

interface AttendanceRecord {
  id: string;
  date: string;
  punchIn?: any;
  punchOut?: any;
  workDuration?: string;
  status: string;
  punchInLocation?: {
    latitude: number;
    longitude: number;
    locationName?: string;
  };
}

export default function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [employee, setEmployee] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loadingAction, setLoadingAction] = useState<"punchIn" | "punchOut" | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("employeeId");
    if (!id) {
      router.push("/login");
      return;
    }
    setEmployeeId(id);
  }, [router]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  async function loadAttendance() {
    if (!employeeId) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await fetch(`${apiUrl}/attendance/${employeeId}`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (err) {
      console.error("Error loading attendance:", err);
    }
  }

  async function loadEmployee() {
    if (!employeeId) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await fetch(`${apiUrl}/employee/${employeeId}`);
      if (res.ok) {
        const data = await res.json();
        setEmployee(data);
      }
    } catch (err) {
      console.error("Error loading employee profile:", err);
    }
  }

  useEffect(() => {
    if (employeeId) {
      loadAttendance();
      loadEmployee();
    }
  }, [employeeId]);

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const todayRecord = useMemo(
    () => records.find((r) => r.date === todayStr),
    [records, todayStr]
  );

  const currentStatus = useMemo(() => {
    if (!todayRecord) return "Not Punched In";
    if (todayRecord.punchOut) return "Shift Completed";
    return "Currently Working";
  }, [todayRecord]);

  function getGPSCoordinates(): Promise<{ latitude?: number; longitude?: number }> {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !navigator.geolocation) {
        return resolve({});
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => resolve({}),
        { timeout: 6000 }
      );
    });
  }

  async function handlePunchIn() {
    setLoadingAction("punchIn");
    try {
      const coords = await getGPSCoordinates();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

      const res = await fetch(`${apiUrl}/attendance/punch-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,
          latitude: coords.latitude,
          longitude: coords.longitude,
          locationName: coords.latitude ? "Office Geo-Check" : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast(
          coords.latitude
            ? "Punch In recorded with GPS coordinates!"
            : "Punch In successful! Have a great shift.",
          "success"
        );
        loadAttendance();
      } else {
        toast(data.message || "Failed to punch in.", "error");
      }
    } catch (err) {
      console.error(err);
      toast("Could not contact attendance server.", "error");
    } finally {
      setLoadingAction(null);
    }
  }

  async function handlePunchOut() {
    setLoadingAction("punchOut");
    try {
      const coords = await getGPSCoordinates();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

      const res = await fetch(`${apiUrl}/attendance/punch-out`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,
          latitude: coords.latitude,
          longitude: coords.longitude,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast(data.message || "Punch out recorded successfully!", "success");
        loadAttendance();
      } else {
        toast(data.message || "Failed to punch out.", "error");
      }
    } catch (err) {
      console.error(err);
      toast("Could not contact attendance server.", "error");
    } finally {
      setLoadingAction(null);
    }
  }

  function handleLogout() {
    localStorage.removeItem("employeeId");
    localStorage.removeItem("authToken");
    localStorage.removeItem("employeeData");
    toast("You have been signed out.", "info");
    router.push("/login");
  }

  const formatTimestamp = (ts: any) => {
    if (!ts) return "-";
    if (ts.toDate) return ts.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (ts._seconds) return new Date(ts._seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] p-6 md:p-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 rounded-xl bg-white dark:bg-slate-800/80 px-4 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </button>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl bg-rose-500/10 dark:bg-rose-600/20 px-4 py-2 text-sm font-semibold text-rose-600 dark:text-rose-300 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 transition border border-rose-500/30"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Header with Live Clock */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-2">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Welcome, {employee?.name || employeeId}
              </h1>
              <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                Active Member
              </span>
            </div>
            <p className="text-slate-500 dark:text-gray-400 mt-2 text-sm md:text-base">
              Employee Portal • Log attendance and review your shift records
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-cyan-500/40 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl px-6 py-4 shadow-md dark:shadow-xl">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{currentTime.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-mono font-bold text-slate-900 dark:text-white tracking-wider">
                {currentTime.toLocaleTimeString()}
              </span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile & Shift Control Card */}
          <div className="rounded-3xl bg-white dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-cyan-500/30 shadow-md dark:shadow-2xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-cyan-500/20">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{employee?.name || "Employee"}</h2>
                  <p className="text-sm text-cyan-600 dark:text-cyan-300 font-mono font-semibold">{employee?.employeeId || employeeId}</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-500 dark:text-gray-400">
                    <Mail className="w-4 h-4 text-cyan-500" /> Email
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white truncate max-w-[180px]">{employee?.email || "-"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-500 dark:text-gray-400">
                    <Building className="w-4 h-4 text-cyan-500" /> Department
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">{employee?.department || "-"}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-500 dark:text-gray-400">
                    <Briefcase className="w-4 h-4 text-cyan-500" /> Current Status
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      currentStatus === "Currently Working"
                        ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30"
                        : currentStatus === "Shift Completed"
                        ? "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-500/30"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-gray-300"
                    }`}
                  >
                    {currentStatus}
                  </span>
                </div>

                {todayRecord && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 mt-2 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-gray-400">Today&apos;s Punch In:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{formatTimestamp(todayRecord.punchIn)}</span>
                    </div>
                    {todayRecord.punchOut && (
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-gray-400">Today&apos;s Punch Out:</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{formatTimestamp(todayRecord.punchOut)}</span>
                      </div>
                    )}
                    {todayRecord.workDuration && (
                      <div className="flex justify-between text-cyan-600 dark:text-cyan-300 font-semibold pt-1 border-t border-slate-200 dark:border-slate-800">
                        <span>Work Duration:</span>
                        <span>{todayRecord.workDuration}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <button
                onClick={handlePunchIn}
                disabled={loadingAction !== null || (!!todayRecord && !todayRecord.punchOut)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 font-bold text-white transition hover:from-emerald-400 hover:to-teal-500 shadow-md shadow-emerald-500/20 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loadingAction === "punchIn" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Recording Location...
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5" /> Punch In (Start Shift)
                  </>
                )}
              </button>

              <button
                onClick={handlePunchOut}
                disabled={loadingAction !== null || !todayRecord || !!todayRecord.punchOut}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 py-3 font-bold text-white transition hover:from-rose-400 hover:to-pink-500 shadow-md shadow-rose-500/20 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loadingAction === "punchOut" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Calculating Duration...
                  </>
                ) : (
                  <>
                    <LogOut className="w-5 h-5" /> Punch Out (End Shift)
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Attendance History */}
          <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900/60 backdrop-blur-2xl border border-slate-200 dark:border-cyan-500/30 shadow-md dark:shadow-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <History className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Attendance Log</h2>
              </div>
              <span className="text-xs text-slate-500 dark:text-gray-400 font-mono">
                {records.length} {records.length === 1 ? "record" : "records"} logged
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-gray-400 uppercase text-xs font-semibold bg-slate-50/50 dark:bg-slate-900/40">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Punch In</th>
                    <th className="py-3 px-3">Punch Out</th>
                    <th className="py-3 px-3">Work Duration</th>
                    <th className="py-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                      <td className="py-3.5 px-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                        {record.date}
                        {record.punchInLocation && (
                          <span title="GPS Verified" className="text-cyan-500 dark:text-cyan-400">
                            <MapPin className="w-3.5 h-3.5 inline" />
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-gray-300 font-mono">
                        {formatTimestamp(record.punchIn)}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-gray-300 font-mono">
                        {formatTimestamp(record.punchOut)}
                      </td>
                      <td className="py-3.5 px-3 text-cyan-600 dark:text-cyan-300 font-semibold">
                        {record.workDuration || "-"}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            record.status === "Completed"
                              ? "bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-500/30"
                              : "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {records.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500 dark:text-gray-400">
                        No attendance history found. Punch in above to create your first record!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}