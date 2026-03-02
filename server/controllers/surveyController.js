// server/controllers/surveyController.js
// No assignments table — every user can evaluate every other active user.

import supabase from "../config/supabase.js";

// ── GET /api/v1/survey/period ─────────────────────────────────────────────────
export async function getActivePeriod(req, res) {
  const { data, error } = await supabase
    .from("evaluation_periods")
    .select("id, label, start_date, end_date")
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return res.status(404).json({ message: "No active evaluation period found." });
    }
    console.error("❌ getActivePeriod error:", error.message);
    return res.status(500).json({ message: "Database error." });
  }

  return res.status(200).json(data);
}

// ── GET /api/v1/survey/ratees?relationship=subordinate|superior|peer ──────────
// Returns ALL active users except the logged-in rater.
// Marks each user as already submitted if rater completed this
// rater+ratee+period+relationship combination.
export async function getRatees(req, res) {
  const raterId          = req.user.sub;
  const { relationship } = req.query;

  if (!relationship) {
    return res.status(400).json({ message: "relationship query param is required." });
  }

  // 1. Get active period
  const { data: period, error: periodError } = await supabase
    .from("evaluation_periods")
    .select("id")
    .eq("is_active", true)
    .single();

  if (periodError || !period) {
    return res.status(404).json({ message: "No active evaluation period found." });
  }

  // 2. Get ALL active users except the logged-in rater
  const { data: allUsers, error: usersError } = await supabase
    .from("users")
    .select("id, full_name, department_id")
    .eq("is_active", true)
    .neq("id", raterId)
    .order("full_name", { ascending: true });

  if (usersError) {
    console.error("❌ getRatees users error:", usersError.message);
    return res.status(500).json({ message: "Database error fetching users." });
  }

  // 3. Check which ratees the rater already submitted for
  //    (same period + same relationship type)
  const { data: submitted, error: subError } = await supabase
    .from("submissions")
    .select("ratee_id")
    .eq("rater_id", raterId)
    .eq("period_id", period.id)
    .eq("relationship", relationship)
    .eq("is_complete", true);

  if (subError) {
    console.error("❌ getRatees submissions error:", subError.message);
    return res.status(500).json({ message: "Database error fetching submissions." });
  }

  const submittedRateeIds = new Set((submitted ?? []).map((s) => s.ratee_id));

  // 4. Shape response
  const ratees = allUsers.map((u) => ({
    ratee_id:      u.id,
    full_name:     u.full_name,
    department_id: u.department_id,
    is_submitted:  submittedRateeIds.has(u.id),
  }));

  return res.status(200).json({ period_id: period.id, ratees });
}