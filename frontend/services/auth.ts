export async function login(employeeId: string, password: string) {
  const response = await fetch("http://localhost:3001/employee/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      employeeId,
      password,
    }),
  });

  return await response.json();
}