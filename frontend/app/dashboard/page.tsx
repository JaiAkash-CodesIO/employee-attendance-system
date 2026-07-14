"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {  
  const [status, setStatus] = useState("Not Punched In");
  const [records, setRecords] = useState<any[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [employee, setEmployee] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const id = localStorage.getItem("employeeId");

    if (id) {
      setEmployeeId(id);
    }
  }, []);
  useEffect(() => {
  const timer = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return () => clearInterval(timer);
}, []);

  async function loadAttendance() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/attendance/${employeeId}`
  );

  const data = await res.json();

  setRecords(data);
}
  async function loadEmployee() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/employee/${employeeId}`
  );

  const data = await res.json();

  setEmployee(data);
}

  async function punchIn() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/attendance/punch-in`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      setStatus("Working");
      loadAttendance();
    }
  }

  async function punchOut() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/attendance/punch-out`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      setStatus("Punched Out");
      loadAttendance();
    } else {
      alert(data.message);
    }
  }

  useEffect(() => {
    if (employeeId) {
      loadAttendance();
      loadEmployee();
    }
  }, [employeeId]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-10">

      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">

  <div>

    <h1 className="text-5xl font-bold text-white">
      Employee Attendance
    </h1>

    <p className="text-gray-400 mt-2">
      Attendance Management Dashboard
    </p>

  </div>

  <div className="mt-6 md:mt-0 rounded-2xl border border-cyan-500 bg-white/10 backdrop-blur-xl px-8 py-5 text-right shadow-lg">

    <p className="text-gray-400 text-sm">
      Today
    </p>

    <h2 className="text-2xl font-bold text-cyan-400">
      {currentTime.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </h2>

    <p className="mt-2 text-4xl font-bold text-white">
      {currentTime.toLocaleTimeString()}
    </p>

  </div>

</div>
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Employee Card */}

          <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-cyan-500 shadow-xl p-8">

            <div className="flex justify-center mb-6">

              <div className="w-24 h-24 rounded-full bg-cyan-500 flex items-center justify-center text-5xl">

                👤

              </div>

            </div>

            <h2 className="text-2xl font-bold text-center mb-8">
              Employee Profile
            </h2>

            <div className="space-y-5">

              <div>

                <p className="text-gray-400 text-sm">
                  Employee ID
                </p>

                <h3 className="text-xl font-bold text-cyan-400">
                  {employee?.employeeId || employeeId}
                </h3>

              </div>

              <div>

                <p className="text-gray-400 text-sm">
                  Name
                </p>

                <h3 className="text-lg">
                  {employee?.name || "-"}
                </h3>

              </div>

              <div>

                <p className="text-gray-400 text-sm">
                  Email
                </p>

                <h3>
                  {employee?.email || "-"}
                </h3>

              </div>

              <div>

                <p className="text-gray-400 text-sm">
                  Department
                </p>

                <h3>
                  {employee?.department || "-"}
                </h3>

              </div>

              <div>

                <p className="text-gray-400 text-sm">
                  Current Status
                </p>

                <h3 className="text-2xl font-bold text-green-400">
                  🟢 {status}
                </h3>

              </div>

            </div>

            <button
              onClick={punchIn}
              className="mt-8 w-full rounded-xl bg-cyan-500 py-3 font-bold hover:bg-cyan-600 transition"
            >
              Punch In
            </button>

            <button
              onClick={punchOut}
              className="mt-4 w-full rounded-xl bg-red-500 py-3 font-bold hover:bg-red-600 transition"
            >
              Punch Out
            </button>

          </div>

          {/* Attendance History */}

          <div className="lg:col-span-2 rounded-3xl bg-white/10 backdrop-blur-xl border border-cyan-500 shadow-xl p-8">

            <h2 className="text-3xl font-bold mb-8">
              Attendance History
            </h2>

            <div className="overflow-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-gray-600 text-left">

                    <th className="py-4">Date</th>

                    <th>Punch In</th>

                    <th>Punch Out</th>

                    <th>Status</th>

                  </tr>

                </thead>

                <tbody>

                  {records.map((record) => (

                    <tr
                      key={record.id}
                      className="border-b border-gray-700 hover:bg-white/5"
                    >

                      <td className="py-4">
                        {record.date}
                      </td>

                      <td>

                        {record.punchIn
                          ? new Date(
                              record.punchIn._seconds * 1000
                            ).toLocaleTimeString()
                          : "-"}

                      </td>

                      <td>

                        {record.punchOut
                          ? new Date(
                              record.punchOut._seconds * 1000
                            ).toLocaleTimeString()
                          : "-"}

                      </td>

                      <td>

                        <span className="rounded-full bg-green-600 px-3 py-1 text-sm">

                          {record.status}

                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}