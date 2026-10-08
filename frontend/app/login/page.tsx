"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, ArrowLeft, ArrowRight, Loader2, Clock } from "lucide-react";
import { useToast } from "@/components/Toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e?: React.FormEvent) {
    if (e) e.preventDefault();

    if (!employeeId || !password) {
      toast("Please enter your Employee ID and password.", "error");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/employee/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId: employeeId.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("employeeId", employeeId.trim());
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }
        if (data.employee) {
          localStorage.setItem("employeeData", JSON.stringify(data.employee));
        }
        toast("Welcome back! Redirecting to your dashboard...", "success");
        router.push("/dashboard");
      } else {
        toast(data.message || "Invalid Employee ID or password.", "error");
      }
    } catch (error) {
      console.error(error);
      toast("Unable to connect to backend server. Please check your network.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-cyan-500/40 bg-white/5 p-8 md:p-10 shadow-2xl backdrop-blur-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-500 shadow-xl shadow-cyan-500/20">
            <Clock className="h-10 w-10 text-slate-950" />
          </div>
        </div>

        <div className="mt-6 text-center">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Employee Login
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Access your attendance dashboard & punch records
          </p>
        </div>

        <form onSubmit={login} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-cyan-300">
              Employee ID
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. EMP101"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/80 pl-11 pr-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-cyan-300">
              Password
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
                <Loader2 className="w-5 h-5 animate-spin" /> Signing In...
              </>
            ) : (
              <>
                Sign In to Dashboard <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4">
            Register here
          </Link>
        </div>
      </div>
    </main>
  );
}