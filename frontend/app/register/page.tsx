"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Building, Lock, ArrowLeft, ArrowRight, Loader2, UserPlus } from "lucide-react";
import { useToast } from "@/components/Toast";

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
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-cyan-500/40 bg-white/5 p-8 md:p-10 shadow-2xl backdrop-blur-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-xl shadow-cyan-500/20">
            <UserPlus className="h-10 w-10 text-slate-950" />
          </div>
        </div>

        <div className="mt-6 text-center">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Register Employee
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Create an official account with encrypted credentials
          </p>
        </div>

        <form onSubmit={register} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-cyan-300">
              Employee ID
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
              <input
                placeholder="e.g. EMP102"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 pl-11 pr-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-cyan-300">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
              <input
                placeholder="e.g. Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 pl-11 pr-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-cyan-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="jane.smith@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 pl-11 pr-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-cyan-300">
              Department
            </label>
            <div className="relative">
              <Building className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 pl-11 pr-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              >
                <option value="Engineering" className="bg-slate-900">Engineering</option>
                <option value="Product & Design" className="bg-slate-900">Product & Design</option>
                <option value="Marketing" className="bg-slate-900">Marketing</option>
                <option value="Human Resources" className="bg-slate-900">Human Resources</option>
                <option value="Finance & Operations" className="bg-slate-900">Finance & Operations</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-cyan-300">
              Password (min. 6 chars)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 pl-11 pr-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3.5 text-base font-bold text-slate-950 transition hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/25 disabled:opacity-60"
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

        <div className="mt-8 text-center text-sm text-gray-400">
          Already registered?{" "}
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4">
            Sign In here
          </Link>
        </div>
      </div>
    </main>
  );
}