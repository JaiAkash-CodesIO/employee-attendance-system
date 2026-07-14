"use client";

import { useEffect, useMemo, useState } from "react";

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
}

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");

  async function loadEmployees() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee`);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load employees");
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const value = search.toLowerCase();

      return (
        employee.employeeId.toLowerCase().includes(value) ||
        employee.name.toLowerCase().includes(value) ||
        employee.email.toLowerCase().includes(value) ||
        employee.department.toLowerCase().includes(value)
      );
    });
  }, [employees, search]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-8">

      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <h1 className="text-5xl font-bold text-white">
              👥 Employee Directory
            </h1>

            <p className="mt-2 text-gray-300">
              View and manage all registered employees.
            </p>

          </div>

          <div className="rounded-2xl bg-cyan-500 px-6 py-4 text-center shadow-xl">

            <p className="text-sm font-semibold text-black">
              Total Employees
            </p>

            <h2 className="text-3xl font-bold text-black">
              {employees.length}
            </h2>

          </div>

        </div>

        {/* Search */}

        <div className="mb-8">

          <input
            type="text"
            placeholder="🔍 Search Employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-cyan-400 bg-white p-4 text-black outline-none transition focus:ring-4 focus:ring-cyan-400"
          />

        </div>

        {/* Table */}

        <div className="overflow-hidden rounded-3xl border border-cyan-500 bg-white/10 backdrop-blur-xl shadow-2xl">

          <table className="w-full">

            <thead className="bg-cyan-500 text-black">

              <tr>

                <th className="p-4 text-left">Employee</th>

                <th className="p-4 text-left">Employee ID</th>

                <th className="p-4 text-left">Email</th>

                <th className="p-4 text-left">Department</th>

              </tr>

            </thead>

            <tbody>

              {filteredEmployees.map((employee) => (

                <tr
                  key={employee.id}
                  className="border-b border-gray-700 text-white transition hover:bg-cyan-500/20"
                >

                  <td className="p-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-xl">
                        
                      </div>

                      <div>

                        <p className="font-semibold">
                          {employee.name}
                        </p>

                        <p className="text-sm text-gray-300">
                          Registered Employee
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="p-4 font-semibold text-cyan-300">
                    {employee.employeeId}
                  </td>

                  <td className="p-4">
                    {employee.email}
                  </td>

                  <td className="p-4">

                    <span className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-black">

                      {employee.department}

                    </span>

                  </td>

                </tr>

              ))}

              {filteredEmployees.length === 0 && (

                <tr>

                  <td
                    colSpan={4}
                    className="p-10 text-center text-gray-300"
                  >

                    No employees found.

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </main>
  );
}