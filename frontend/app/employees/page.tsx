"use client";

import { useEffect, useState } from "react";

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
}

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  async function loadEmployees() {
    try {
      const response = await fetch("http://localhost:3001/employee");
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load employees");
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-8">
        Employees
      </h1>

      <table className="w-full bg-white shadow rounded-lg">

        <thead className="bg-blue-600 text-white">

          <tr>
            <th className="p-3">Employee ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Department</th>
          </tr>

        </thead>

        <tbody>

          {employees.map((employee) => (

            <tr
              key={employee.id}
              className="border-b hover:bg-gray-100"
            >
              <td className="p-3">{employee.employeeId}</td>
              <td className="p-3">{employee.name}</td>
              <td className="p-3">{employee.email}</td>
              <td className="p-3">{employee.department}</td>
            </tr>

          ))}

        </tbody>

      </table>

    </main>
  );
}