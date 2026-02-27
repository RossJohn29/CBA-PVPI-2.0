// client/src/api/auth.js
const API_URL = ""; // Empty — Vite proxy handles /api/* → localhost:5000

export async function login({ email, password }) {
  let res, data;

  try {
    res = await fetch(`${API_URL}/api/v1/auth/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password }),
    });
  } catch (networkErr) {
    // Server is completely unreachable
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
    // Use the server's message, or a status-based fallback
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
  try {
    await fetch(`${API_URL}/api/v1/auth/logout`, {
      method:  "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    // Silently fail — local state is cleared regardless
    console.warn("Logout request failed (network error).");
  }
}