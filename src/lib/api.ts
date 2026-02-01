const BASE_URL = "https://heighers-backend.onrender.com";

export async function registerUser(data: any) {
  const res = await fetch(`${BASE_URL}/register_user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw error;
  }

  return res.json();
}