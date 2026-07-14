"use client";

import { useEffect, useState } from "react";

interface Attendance {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  date: string;
  status: string;
  punchIn: any;
  punchOut: any;
}

export default function AttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadAttendance();
  }, []);

  async function loadAttendance() {
    const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/attendance/all");
    const data = await res.json();
    setRecords(data);
  }

  const filtered = records.filter((r) =>
    r.employeeId.toLowerCase().includes(search.toLowerCase()) ||
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-10 text-white">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-2">
          Attendance Records
        </h1>

        <p className="text-gray-400 mb-8">
          View all employee attendance
        </p>

        <input
          placeholder="Search Employee ID, Name or Department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-8 w-full rounded-xl bg-white/10 border border-cyan-500 p-4 outline-none"
        />

        <div className="rounded-3xl overflow-hidden border border-cyan-500 bg-white/10 backdrop-blur-xl shadow-2xl">

          <table className="w-full">

            <thead className="bg-cyan-600 text-white">

              <tr>
                <th className="p-4">Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Email</th>
                <th>Date</th>
                <th>Punch In</th>
                <th>Punch Out</th>
                <th>Status</th>
              </tr>

            </thead>

            <tbody>

              {filtered.map((r) => (

                <tr
                  key={r.id}
                  className="border-b border-slate-700 hover:bg-white/5"
                >

                  <td className="p-4 font-semibold text-cyan-300">
                    {r.employeeId}
                  </td>

                  <td>{r.name}</td>

                  <td>{r.department}</td>

                  <td>{r.email}</td>

                  <td>{r.date}</td>

                  <td>
                    {r.punchIn
                      ? new Date(
                          r.punchIn._seconds * 1000
                        ).toLocaleTimeString()
                      : "-"}
                  </td>

                  <td>
                    {r.punchOut
                      ? new Date(
                          r.punchOut._seconds * 1000
                        ).toLocaleTimeString()
                      : "-"}
                  </td>

                  <td>
                    <span className="rounded-full bg-green-600 px-3 py-1 text-sm">
                      {r.status}
                    </span>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </main>
  );
}