import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] bg-[radial-gradient(circle_at_top,#1e3a8a_0%,#0a0a0a_55%)] px-4">
      <div className="w-full max-w-md rounded-2xl border border-cyan-500/30 bg-white/5 p-8 shadow-[0_0_35px_rgba(6,182,212,0.35)] backdrop-blur-xl">
        <h1 className="text-center text-4xl font-bold text-cyan-400">
          Employee Portal
        </h1>

        <p className="mt-2 mb-8 text-center text-gray-400">
          Attendance Management System
        </p>

        <LoginForm />
      </div>
    </main>
  );
}