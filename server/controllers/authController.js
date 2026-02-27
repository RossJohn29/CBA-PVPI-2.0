// server/controllers/authController.js
import jwt                        from "jsonwebtoken";
import supabase, { supabaseAdmin } from "../config/supabase.js";

// ── LOGIN ─────────────────────────────────────────────────────────────────────
export async function login(req, res) {
  const { email, password } = req.body;

  // 1. Validate input
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

  console.log(`\n🔐 Login attempt: ${email}`);

  // 2. Authenticate with Supabase Auth
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (authError) {
    console.error("❌ Supabase Auth error:", authError.message);

    // User-friendly auth error messages
    const authErrorMap = {
      "Invalid login credentials": "Invalid email or password.",
      "Email not confirmed":       "Please verify your email before logging in.",
      "User not found":            "No account found with this email.",
      "Too many requests":         "Too many login attempts. Please wait and try again.",
    };

    const friendlyMessage =
      authErrorMap[authError.message] ??
      authError.message ??
      "Login failed. Please try again.";

    return res.status(401).json({ message: friendlyMessage });
  }

  if (!authData?.user) {
    console.error("❌ No user returned from Supabase Auth.");
    return res.status(401).json({ message: "Login failed. Please try again." });
  }

  console.log("✅ Supabase Auth OK — uid:", authData.user.id);

  const supabaseUid = authData.user.id;

  // 3. Choose the right client
  //    - supabaseAdmin bypasses RLS (preferred if service role key is set)
  //    - falls back to anon client (requires RLS policy allowing reads)
  const dbClient = supabaseAdmin ?? supabase;

  if (!supabaseAdmin) {
    console.warn(
      "⚠️  SUPABASE_SERVICE_ROLE_KEY not set — " +
      "falling back to anon client. RLS may block the users query."
    );
  }

  // 4. Fetch user row from public.users
  const { data: userRow, error: userError } = await dbClient
    .from("users")
    .select("id, full_name, email, role, department_id, is_active")
    .eq("id", supabaseUid)
    .single();

  // Detailed DB error handling
  if (userError) {
    console.error(
      "❌ users table error:",
      userError.message,
      "| code:", userError.code,
      "| details:", userError.details,
      "| hint:", userError.hint
    );

    const dbErrorMap = {
      PGRST116: `No user record found for uid=${supabaseUid}. ` +
                `Ask an admin to add you to the users table.`,
      "42501":  "Permission denied — check Supabase RLS policies or add the service role key.",
      "42P01":  "The 'users' table does not exist. Check your database schema.",
    };

    const friendlyMessage =
      dbErrorMap[userError.code] ??
      `Database error (${userError.code}): ${userError.message}`;

    return res.status(
      userError.code === "PGRST116" ? 404 : 500
    ).json({ message: friendlyMessage });
  }

  if (!userRow) {
    console.error("❌ Empty result from users table for uid:", supabaseUid);
    return res.status(404).json({
      message: "User record not found. Contact your administrator.",
    });
  }

  // 5. Check account is active
  if (!userRow.is_active) {
    console.warn("⚠️  Deactivated account:", email);
    return res.status(403).json({
      message: "Your account has been deactivated. Contact your administrator.",
    });
  }

  console.log(`✅ users table OK — role: ${userRow.role}, name: ${userRow.full_name}`);

  // 6. Sign JWT
  const token = jwt.sign(
    {
      sub:           userRow.id,
      email:         userRow.email,
      full_name:     userRow.full_name,
      role:          userRow.role,
      department_id: userRow.department_id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  console.log("✅ JWT signed — login successful\n");

  return res.status(200).json({
    token,
    user: {
      id:            userRow.id,
      full_name:     userRow.full_name,
      email:         userRow.email,
      role:          userRow.role,
      department_id: userRow.department_id,
    },
  });
}

// ── LOGOUT ────────────────────────────────────────────────────────────────────
export async function logout(req, res) {
  try {
    await supabase.auth.signOut();
    return res.status(200).json({ message: "Logged out successfully." });
  } catch (err) {
    console.error("❌ Logout error:", err.message);
    return res.status(500).json({ message: "Logout failed." });
  }
}