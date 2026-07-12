"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await login(email, password);

      alert("Login Successful!");

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleLogin} className="space-y-5">

      {error && (
        <div className="rounded bg-red-100 p-3 text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="block mb-2 font-medium">
          Email
        </label>

        <input
          type="email"
          className="w-full rounded-lg border p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Password
        </label>

        <input
          type="password"
          className="w-full rounded-lg border p-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        className="w-full rounded-lg bg-blue-600 p-3 text-white"
        disabled={loading}
      >
        {loading ? "Signing In..." : "Login"}
      </button>

    </form>
  );
}