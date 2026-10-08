"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Building, Lock, ArrowLeft, ArrowRight, Loader2, UserPlus } from "lucide-react";
import { useToast } from "@/components/Toast";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Register() {
  const router = useRouter();
  const { toast } = useToast();

  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function register(e?: React.FormEvent) {
    if (e) e.preventDefault();

    if (!employeeId.trim() || !name.trim() || !email.trim() || !password) {
      toast("Please fill in all required fields.", "error");
      return;
    }

    if (password.length < 6) {
      toast("Password must be at least 6 characters.", "error");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/employee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: employeeId.trim(),
          name: name.trim(),
          email: email.trim(),
          department,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast("Employee registered successfully! Please sign in.", "success");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        toast(data.message || "Registration failed.", "error");
      }
    } catch (error) {
      console.error(error);
      toast("Could not connect to backend server.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] flex items-center justify-center px-6 py-12 transition-colors duration-200">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-cyan-500/30 bg-white/80 dark:bg-slate-900/60 p-8 md:p-10 shadow-xl dark:shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/20">
            <UserPlus className="h-10 w-10 text-white" />
          </div>
        </div>

        <div className="mt-6 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Register Employee
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
            Create an official account with encrypted credentials
          </p>
        </div>

        <form onSubmit={register} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-cyan-300">
              Employee ID
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
              <input
                placeholder="e.g. EMP102"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 pl-11 pr-4 py-3 text-slate-900 dark:text-white placeholder-gray-400 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-cyan-300">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
              <input
                placeholder="e.g. Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 pl-11 pr-4 py-3 text-slate-900 dark:text-white placeholder-gray-400 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-cyan-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="jane.smith@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 pl-11 pr-4 py-3 text-slate-900 dark:text-white placeholder-gray-400 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-cyan-300">
              Department
            </label>
            <div className="relative">
              <Building className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 pl-11 pr-4 py-3 text-slate-900 dark:text-white outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-sm"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product & Design">Product & Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance & Operations">Finance & Operations</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-cyan-300">
              Password (min. 6 chars)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/80 pl-11 pr-4 py-3 text-slate-900 dark:text-white placeholder-gray-400 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 shadow-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 text-base font-bold text-white transition hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Registering...
              </>
            ) : (
              <>
                Complete Registration <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500 dark:text-gray-400">
          Already registered?{" "}
          <Link href="/login" className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold underline-offset-4">
            Sign In here
          </Link>
        </div>
      </div>
    </main>
  );
}