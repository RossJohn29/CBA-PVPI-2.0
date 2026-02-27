// client/src/api/survey.js
// All calls to /api/v1/survey/* on the Express backend.

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

// ── Helper ────────────────────────────────────────────────────────────────────
async function apiFetch(path, token) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed.");
  return data;
}

// ── GET /api/v1/survey/period ─────────────────────────────────────────────────
// Returns: { id, label, start_date, end_date }
export function getActivePeriod(token) {
  return apiFetch("/api/v1/survey/period", token);
}

// ── GET /api/v1/survey/ratees?relationship=... ────────────────────────────────
// Returns: { period_id, ratees: [{ assignment_id, ratee_id, full_name, department_id, is_submitted }] }
export function getRatees(token, relationship) {
  return apiFetch(`/api/v1/survey/ratees?relationship=${relationship}`, token);
}