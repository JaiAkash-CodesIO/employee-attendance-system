"use client";

import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-10">

      <h1 className="text-5xl font-bold text-white mb-10">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-8">

        {/* Employees */}

        <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-cyan-500 p-8 shadow-xl">

          <h2 className="text-2xl font-bold text-cyan-300">
            Employees
          </h2>

          <p className="text-gray-300 mt-4">
            View all registered employees.
          </p>

          <button
            onClick={() => router.push("/admin/employees")}
            className="mt-6 w-full rounded-xl bg-cyan-600 p-3 text-white hover:bg-cyan-700"
          >
            View Employees
          </button>

        </div>

        {/* Attendance */}

        <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-green-500 p-8 shadow-xl">

          <h2 className="text-2xl font-bold text-green-300">
            Attendance
          </h2>

          <p className="text-gray-300 mt-4">
            View all attendance records.
          </p>

          <button
            onClick={() => router.push("/admin/attendance")}
            className="mt-6 w-full rounded-xl bg-green-600 p-3 text-white hover:bg-green-700"
          >
            View Attendance
          </button>

        </div>

        {/* Reports */}

        <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-red-500 p-8 shadow-xl">

          <h2 className="text-2xl font-bold text-red-300">
            Reports
          </h2>

          <p className="text-gray-300 mt-4">
            Download attendance reports.
          </p>

          <button
            onClick={() =>
             window.open(
  `${process.env.NEXT_PUBLIC_API_URL}/attendance/export/csv`,
  "_blank"
)
            }
            className="mt-6 w-full rounded-xl bg-green-600 p-3 text-white hover:bg-green-700"
          >
            Export CSV
          </button>

          <button
            onClick={() =>
             window.open(
  `${process.env.NEXT_PUBLIC_API_URL}/attendance/export/pdf`,
  "_blank"
)
            }
            className="mt-4 w-full rounded-xl bg-red-600 p-3 text-white hover:bg-red-700"
          >
            Export PDF
          </button>

        </div>

      </div>

    </main>
  );
}