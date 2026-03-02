// client/src/api/survey.js

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

// ── Error types so the UI can show specific messages ─────────────────────────
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name  = "ApiError";
    this.status = status;
  }
}

// ── Helper ────────────────────────────────────────────────────────────────────
async function apiFetch(path, token) {
  let res;

  // 1. Network-level error (server not running, no internet)
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
  } catch (networkErr) {
    throw new ApiError(
      "Cannot reach the server. Make sure the backend is running on port 5000.",
      0
    );
  }

  // 2. Non-JSON response (e.g. HTML error page)
  let data;
  try {
    data = await res.json();
  } catch {
    throw new ApiError(`Server returned an unexpected response (${res.status}).`, res.status);
  }

  // 3. HTTP error with a message from Express
  if (!res.ok) {
    throw new ApiError(data.message || `Request failed (${res.status}).`, res.status);
  }

  return data;
}

// ── GET /api/v1/survey/period ─────────────────────────────────────────────────
export function getActivePeriod(token) {
  return apiFetch("/api/v1/survey/period", token);
}

// ── GET /api/v1/survey/ratees?relationship=... ────────────────────────────────
// Returns all active users (except self) with is_submitted flag per relationship
export function getRatees(token, relationship) {
  return apiFetch(`/api/v1/survey/ratees?relationship=${relationship}`, token);
}