// client/src/api/auth.js
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000"; // ← Change this

export async function login({ email, password }) {
  let res, data;

  try {
    res = await fetch(`${API_URL}/api/v1/auth/login`, { // ← Now uses full URL
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password }),
    });
  } catch (networkErr) {
    throw new Error(
      "Cannot reach the server. Make sure the backend is running on port 5000."
    );
  }

  try {
    data = await res.json();
  } catch {
    throw new Error("Unexpected server response. Please try again.");
  }

  if (!res.ok) {
    const fallback = {
      400: "Missing email or password.",
      401: "Invalid email or password.",
      403: "Your account has been deactivated.",
      404: "Account not fully set up. Contact your administrator.",
      500: "Server error. Please try again later.",
    };
    throw new Error(data?.message ?? fallback[res.status] ?? "Login failed.");
  }

  return data; // { token, user }
}

export async function logout(token) {
  const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000"; // ← Add this
  
  try {
    await fetch(`${API_URL}/api/v1/auth/logout`, { // ← Now uses full URL
      method:  "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    console.warn("Logout request failed (network error).");
  }
}