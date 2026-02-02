const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function registerUser(data: any) {
  const res = await fetch(`${BASE_URL}/register`, {
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

  

  export async function checkUserExists(firebaseUid: string) {

    const res = await fetch(`${BASE_URL}/check_user/${firebaseUid}`);

    if (!res.ok) {

      throw new Error("Failed to check user status");

    }

    return res.json();

  }

  