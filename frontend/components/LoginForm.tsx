"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../services/auth";

export default function LoginForm() {
  const router = useRouter();

  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const result = await login(employeeId, password);

    if (result.success) {
      localStorage.setItem("employee", JSON.stringify(result.employee));
      router.push("/dashboard");
    } else {
      alert(result.message);
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="space-y-4 rounded-xl bg-white p-8 shadow-lg w-96"
    >
      <h1 className="text-3xl font-bold text-center">
        Employee Login
      </h1>

      <input
        type="text"
        placeholder="Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
        className="w-full rounded border p-3"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded border p-3"
      />

      <button
        className="w-full rounded bg-blue-600 p-3 text-white"
        type="submit"
      >
        Login
      </button>
    </form>
  );
}