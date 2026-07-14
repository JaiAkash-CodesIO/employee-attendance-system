"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    if (!employeeId || !password) {
      alert("Please enter Employee ID and Password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("employeeId", employeeId);
        router.push("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6">

      <div className="w-full max-w-md rounded-3xl border border-cyan-500 bg-white/10 p-10 shadow-2xl backdrop-blur-xl">

        <div className="flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500 shadow-xl">
            <span className="text-5xl">👨‍💼</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <h1 className="text-4xl font-bold text-white">
            Employee Login
          </h1>

          <p className="mt-2 text-gray-300">
            Sign in to access your attendance dashboard
          </p>
        </div>

        <div className="mt-8 space-y-5">

          <input
            type="text"
            placeholder="Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-300"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-300"
          />

        </div>

        <button
          onClick={login}
          disabled={loading}
          className="mt-8 w-full rounded-xl bg-cyan-500 py-3 text-lg font-bold text-black transition hover:scale-105 hover:bg-cyan-400 disabled:opacity-60"
        >
          {loading ? "Signing In..." : "Login"}
        </button>

      </div>

    </main>
  );
}