"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [attendance, setAttendance] = useState<any[]>([]);

  useEffect(() => {
    loadAttendance();
  }, []);

  async function loadAttendance() {
    const res = await fetch("http://localhost:3001/attendance/all");
    const data = await res.json();
    setAttendance(data);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-8 text-3xl font-bold">
        Employer Dashboard
      </h1>

      <table className="w-full border bg-white">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="border p-3">Employee</th>
            <th className="border p-3">Date</th>
            <th className="border p-3">Punch In</th>
            <th className="border p-3">Punch Out</th>
            <th className="border p-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {attendance.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">{item.employeeId}</td>
              <td className="border p-2">{item.date}</td>
              <td className="border p-2">
                {item.punchIn?._seconds
                  ? new Date(item.punchIn._seconds * 1000).toLocaleTimeString()
                  : "-"}
              </td>

              <td className="border p-2">
                {item.punchOut?._seconds
                  ? new Date(item.punchOut._seconds * 1000).toLocaleTimeString()
                  : "-"}
              </td>

              <td className="border p-2">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}