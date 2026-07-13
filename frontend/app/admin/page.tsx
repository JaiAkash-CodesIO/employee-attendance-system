"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function login() {
    if (username === "admin" && password === "admin123") {
      router.push("/admin/dashboard");
    } else {
      alert("Invalid Username or Password");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6">

      <div className="w-full max-w-md rounded-3xl border border-cyan-500 bg-white/10 p-10 shadow-2xl backdrop-blur-xl">

        {/* Admin Icon */}

        <div className="flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500 shadow-xl">
            <span className="text-5xl">👨‍💼</span>
          </div>
        </div>

        {/* Title */}

        <div className="mt-6 text-center">

          <h1 className="text-4xl font-bold text-white">
            Admin Portal
          </h1>

          <p className="mt-2 text-gray-300">
            Attendance Management System
          </p>

        </div>

        {/* Username */}

        <div className="mt-8">

          <label className="mb-2 block font-semibold text-cyan-300">
            Username
          </label>

          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-300"
          />

        </div>

        {/* Password */}

        <div className="mt-6">

          <label className="mb-2 block font-semibold text-cyan-300">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-300"
          />

        </div>

        {/* Login Button */}

        <button
          onClick={login}
          className="mt-8 w-full rounded-xl bg-cyan-500 py-3 text-lg font-bold text-black transition-all duration-300 hover:scale-105 hover:bg-cyan-400 active:scale-95"
        >
          Login to Dashboard
        </button>

        {/* Demo Credentials */}

        <div className="mt-8 rounded-2xl border border-cyan-400 bg-cyan-500/10 p-4">

          <h2 className="mb-2 text-lg font-semibold text-cyan-300">
            Demo Credentials
          </h2>

          <div className="space-y-1 text-gray-300">
            <p>
              Username:
              <span className="ml-2 font-semibold text-white">
                admin
              </span>
            </p>

            <p>
              Password:
              <span className="ml-2 font-semibold text-white">
                admin123
              </span>
            </p>
          </div>

        </div>

        {/* Footer */}

        <div className="mt-8 text-center text-sm text-gray-400">
          Secure access for authorized administrators only.
        </div>

      </div>

    </main>
  );
}