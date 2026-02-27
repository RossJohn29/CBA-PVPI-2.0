// server/controllers/surveyController.js
// Handles all survey-related queries against Supabase.

import supabase from "../config/supabase.js";

// ── GET /api/v1/survey/period ─────────────────────────────────────────────────
// Returns the currently active evaluation_period.
export async function getActivePeriod(req, res) {
  const { data, error } = await supabase
    .from("evaluation_periods")
    .select("id, label, start_date, end_date")
    .eq("is_active", true)
    .single();

  if (error) {
    // PGRST116 = no rows — no active period configured yet
    if (error.code === "PGRST116") {
      return res.status(404).json({ message: "No active evaluation period found." });
    }
    console.error("❌ getActivePeriod error:", error.message);
    return res.status(500).json({ message: "Database error." });
  }

  return res.status(200).json(data);
}

// ── GET /api/v1/survey/ratees?relationship=subordinate|superior|peer ──────────
// Returns the list of ratees the logged-in rater is assigned to for the
// active period and the given relationship.
// Joins ratee_rater_assignments → users (ratee) to get full_name.
export async function getRatees(req, res) {
  const raterId       = req.user.sub;                          // from JWT
  const { relationship } = req.query;                         // 'subordinate' | 'superior' | 'peer'

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

  // 2. Get assignments for this rater + relationship + period
  //    Join to users table to get the ratee's full_name
  const { data: assignments, error: assignError } = await supabase
    .from("ratee_rater_assignments")
    .select(`
      id,
      relationship,
      ratee_id,
      users!ratee_rater_assignments_ratee_id_fkey (
        id,
        full_name,
        department_id
      )
    `)
    .eq("rater_id", raterId)
    .eq("period_id", period.id)
    .eq("relationship", relationship);

  if (assignError) {
    console.error("❌ getRatees error:", assignError.message);
    return res.status(500).json({ message: "Database error." });
  }

  // 3. Check if rater already submitted for each assignment
  //    so the frontend can disable already-completed ratees
  const assignmentIds = assignments.map((a) => a.id);

  let submittedIds = [];
  if (assignmentIds.length > 0) {
    const { data: submissions } = await supabase
      .from("submissions")
      .select("assignment_id")
      .in("assignment_id", assignmentIds)
      .eq("is_complete", true);

    submittedIds = (submissions ?? []).map((s) => s.assignment_id);
  }

  // 4. Shape the response
  const ratees = assignments.map((a) => ({
    assignment_id: a.id,
    ratee_id:      a.users.id,
    full_name:     a.users.full_name,
    department_id: a.users.department_id,
    is_submitted:  submittedIds.includes(a.id),
  }));

  return res.status(200).json({ period_id: period.id, ratees });
}