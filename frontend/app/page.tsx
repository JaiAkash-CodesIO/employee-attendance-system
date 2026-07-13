import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-100">

      <h1 className="text-5xl font-bold">
        Employee Attendance System
      </h1>

      <Link
        href="/login"
        className="bg-blue-600 text-white px-8 py-3 rounded-lg"
      >
        Employee Login
      </Link>

      <Link
        href="/dashboard"
        className="bg-green-600 text-white px-8 py-3 rounded-lg"
      >
        Dashboard
      </Link>

      <Link
        href="/employees/new"
        className="bg-purple-600 text-white px-8 py-3 rounded-lg"
      >
        Register Employee
      </Link>

      <Link
        href="/employees"
        className="bg-orange-600 text-white px-8 py-3 rounded-lg"
      >
        Employee List
      </Link>

      <Link
        href="/admin"
        className="bg-red-600 text-white px-8 py-3 rounded-lg"
      >
        Admin Dashboard
      </Link>

    </main>
  );
}