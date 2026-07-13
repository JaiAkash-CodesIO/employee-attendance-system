"use client";

import { useState } from "react";

export default function EmployeeRegistration() {
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");

  async function registerEmployee() {
    const response = await fetch("http://localhost:3001/employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employeeId,
        name,
        email,
        department,
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert("Employee Registered Successfully");

      setEmployeeId("");
      setName("");
      setEmail("");
      setDepartment("");
    } else {
      alert("Registration Failed");
    }
  }

  return (
    <main className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white p-10 rounded-xl shadow-xl w-[450px]">

        <h1 className="text-3xl font-bold mb-8">
          Register Employee
        </h1>

        <input
          className="border p-3 w-full mb-4 rounded"
          placeholder="Employee ID"
          value={employeeId}
          onChange={(e)=>setEmployeeId(e.target.value)}
        />

        <input
          className="border p-3 w-full mb-4 rounded"
          placeholder="Employee Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          className="border p-3 w-full mb-4 rounded"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          className="border p-3 w-full mb-6 rounded"
          placeholder="Department"
          value={department}
          onChange={(e)=>setDepartment(e.target.value)}
        />

        <button
          onClick={registerEmployee}
          className="bg-green-600 text-white w-full py-3 rounded-lg"
        >
          Register Employee
        </button>

      </div>

    </main>
  );
}