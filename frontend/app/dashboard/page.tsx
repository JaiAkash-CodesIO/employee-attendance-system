"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [employee, setEmployee] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [status, setStatus] = useState("Offline");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const emp = localStorage.getItem("employee");

    if (!emp) {
      window.location.href = "/login";
      return;
    }

    const employeeData = JSON.parse(emp);

    setEmployee(employeeData);

    loadAttendance(employeeData.employeeId);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  async function loadAttendance(employeeId: string) {
  try {
    const res = await fetch(
      `http://localhost:3001/attendance/${employeeId}`
    );

    const data = await res.json();

    setAttendance(data);

    if (data.length > 0) {
      const latest = data[0];

      if (latest.punchOut == null) {
        setStatus("Working");
      } else {
        setStatus("Offline");
      }
    }
  } catch (err) {
    console.log(err);
  }
}

  async function punchIn() {
    if (!employee) return;

    const res = await fetch(
      "http://localhost:3001/attendance/punch-in",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: employee.employeeId,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      setStatus("Working");
      alert("Punch In Successful");
      loadAttendance(employee.employeeId);
    } else {
      alert(data.message);
    }
  }

  async function punchOut() {
    if (!employee) return;

    const res = await fetch(
      "http://localhost:3001/attendance/punch-out",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: employee.employeeId,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      setStatus("Offline");
      alert("Punch Out Successful");
      loadAttendance(employee.employeeId);
    } else {
      alert(data.message);
    }
  }

  function logout() {
    localStorage.removeItem("employee");
    window.location.href = "/login";
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">

      <div className="mx-auto max-w-6xl">

        <div className="rounded-xl bg-white p-8 shadow">

          <h1 className="text-4xl font-bold">
            Employee Attendance System
          </h1>

          <p className="mt-3 text-lg">
            Welcome <strong>{employee?.name}</strong>
          </p>

          <p>Employee ID : {employee?.employeeId}</p>

          <p>Department : {employee?.department}</p>

          <p className="mt-3 text-gray-500">
            {time.toLocaleString()}
          </p>

          <p
            className={`mt-3 font-bold ${
              status === "Working"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            Status : {status}
          </p>

          <div className="mt-6 flex gap-4">

            <button
              onClick={punchIn}
              className="rounded bg-green-600 px-6 py-3 text-white"
            >
              Punch In
            </button>

            <button
              onClick={punchOut}
              className="rounded bg-red-600 px-6 py-3 text-white"
            >
              Punch Out
            </button>

            <button
              onClick={logout}
              className="rounded bg-gray-800 px-6 py-3 text-white"
            >
              Logout
            </button>

          </div>

        </div>

        <div className="mt-8 rounded-xl bg-white p-8 shadow">

          <h2 className="mb-2 text-2xl font-bold">
            Attendance History
          </h2>

          <p className="mb-5">
            Total Records : {attendance.length}
          </p>

          <table className="w-full border-collapse border">

            <thead>

              <tr className="bg-gray-200">

                <th className="border p-3">Date</th>
                <th className="border p-3">Punch In</th>
                <th className="border p-3">Punch Out</th>
                <th className="border p-3">Status</th>

              </tr>

            </thead>

            <tbody>

              {attendance.length === 0 ? (

                <tr>

                  <td
                    colSpan={4}
                    className="border p-5 text-center"
                  >
                    No Attendance Found
                  </td>

                </tr>

              ) : (

                attendance.map((item: any) => (

                  <tr key={item.id}>

                    <td className="border p-3">
                      {item.date}
                    </td>

                    <td className="border p-3">
                      {item.punchIn?._seconds
                        ? new Date(
                            item.punchIn._seconds * 1000
                          ).toLocaleTimeString()
                        : "-"}
                    </td>

                    <td className="border p-3">
                      {item.punchOut?._seconds
                        ? new Date(
                            item.punchOut._seconds * 1000
                          ).toLocaleTimeString()
                        : "-"}
                    </td>

                    <td className="border p-3">
                      {item.status}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </main>
  );
}