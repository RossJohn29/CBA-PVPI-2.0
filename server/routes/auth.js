// server/routes/auth.js
// Mounts at /api/v1/auth  (registered in app.js)

import { Router }         from "express";
import { login, logout }  from "../controllers/authController.js";
import authenticate       from "../middleware/auth.js";

const router = Router();

// POST /api/v1/auth/login   — public
router.post("/login", login);

// POST /api/v1/auth/logout  — protected (must send a valid JWT)
router.post("/logout", authenticate, logout);

export default router;