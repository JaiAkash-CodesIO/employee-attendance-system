"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Search, Mail, Building, ArrowLeft, Loader2, UserCheck } from "lucide-react";
import { useToast } from "@/components/Toast";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  createdAt?: any;
}

export default function EmployeeList() {
  const router = useRouter();
  const { toast } = useToast();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadEmployees() {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/employee`);
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      } else {
        toast("Unable to load employees list.", "error");
      }
    } catch (error) {
      console.error(error);
      toast("Could not connect to backend server.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return employees;
    return employees.filter(
      (employee) =>
        employee.employeeId?.toLowerCase().includes(value) ||
        employee.name?.toLowerCase().includes(value) ||
        employee.email?.toLowerCase().includes(value) ||
        employee.department?.toLowerCase().includes(value)
    );
  }, [employees, search]);

  return (
    <main className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] p-6 md:p-10 transition-colors duration-200">
      <div className="mx-auto max-w-7xl space-y-6">
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
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Employee Directory
              </h1>
            </div>
            <p className="mt-2 text-sm md:text-base text-slate-500 dark:text-gray-400">
              Manage and search across all company personnel
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-cyan-500/40 bg-white dark:bg-slate-900/60 backdrop-blur-xl px-6 py-4 shadow-sm dark:shadow-xl text-center md:text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Total Employees
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {employees.length}
            </h2>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Employee ID, name, email, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 pl-12 pr-4 py-3.5 text-slate-900 dark:text-white placeholder-gray-400 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-sm md:text-base shadow-sm"
          />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-cyan-500/30 bg-white dark:bg-slate-900/60 backdrop-blur-2xl shadow-sm dark:shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/90 text-slate-600 dark:text-gray-300 border-b border-slate-200 dark:border-slate-800 uppercase text-xs font-semibold">
                <tr>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Employee ID</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Department</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold text-sm shadow">
                          {employee.name ? employee.name.charAt(0).toUpperCase() : "E"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{employee.name}</p>
                          <p className="text-xs text-slate-500 dark:text-gray-400">Registered Employee</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-bold text-cyan-600 dark:text-cyan-300">
                      {employee.employeeId}
                    </td>

                    <td className="p-4 text-slate-600 dark:text-gray-300">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>{employee.email}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                        <Building className="w-3 h-3" />
                        {employee.department}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        <UserCheck className="w-3 h-3" /> Active
                      </span>
                    </td>
                  </tr>
                ))}

                {loading && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-500" />
                      Loading employees directory...
                    </td>
                  </tr>
                )}

                {!loading && filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500 dark:text-gray-400">
                      No employees match your search criteria.
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