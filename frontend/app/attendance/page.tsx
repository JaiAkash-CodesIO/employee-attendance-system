"use client";

import { useEffect, useState } from "react";

export default function AttendancePage() {
  const [records, setRecords] = useState([]);

  async function loadAttendance() {
    const res = await fetch(
      "${process.env.NEXT_PUBLIC_API_URL}/attendance/all"
    );

    const data = await res.json();

    setRecords(data);
  }

  useEffect(() => {
    loadAttendance();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold mb-8">
        Attendance History
      </h1>

      <table className="w-full bg-white shadow rounded">

        <thead className="bg-blue-600 text-white">

          <tr>
            <th className="p-3">Date</th>
            <th className="p-3">Punch In</th>
            <th className="p-3">Punch Out</th>
            <th className="p-3">Status</th>
          </tr>

        </thead>

        <tbody>

          {records.map((item: any) => (
            <tr
              key={item.id}
              className="border-b text-center"
            >

              <td className="p-3">{item.date}</td>

              <td className="p-3">
                {item.punchIn
                  ? new Date(
                      item.punchIn._seconds * 1000
                    ).toLocaleString()
                  : "-"}
              </td>

              <td className="p-3">
                {item.punchOut
                  ? new Date(
                      item.punchOut._seconds * 1000
                    ).toLocaleString()
                  : "-"}
              </td>

              <td className="p-3">{item.status}</td>

            </tr>
          ))}

        </tbody>

      </table>

    </main>
  );
}