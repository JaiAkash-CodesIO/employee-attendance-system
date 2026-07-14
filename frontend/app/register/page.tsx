"use client";

import { useState } from "react";

export default function Register() {
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");

  async function register() {
    if (
      !employeeId ||
      !name ||
      !email ||
      !department ||
      !password
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
          name,
          email,
          department,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Employee Registered Successfully!");

        setEmployeeId("");
        setName("");
        setEmail("");
        setDepartment("");
        setPassword("");
      } else {
        alert("Registration Failed");
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend.");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center px-6">

      <div className="w-full max-w-md rounded-3xl border border-cyan-500 bg-white/10 p-10 shadow-2xl backdrop-blur-xl">

        <div className="flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500 shadow-xl">
            <span className="text-5xl">📝</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <h1 className="text-4xl font-bold text-white">
            Register Employee
          </h1>

          <p className="mt-2 text-gray-300">
            Create a new employee account
          </p>
        </div>

        <div className="mt-8 space-y-5">

          <input
            placeholder="Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-300"
          />

          <input
            placeholder="Employee Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-300"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-300"
          />

          <input
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
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
          onClick={register}
          className="mt-8 w-full rounded-xl bg-cyan-500 py-3 text-lg font-bold text-black transition hover:scale-105 hover:bg-cyan-400"
        >
          Register Employee
        </button>

      </div>

    </main>
  );
}