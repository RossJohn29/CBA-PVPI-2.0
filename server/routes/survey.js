// server/routes/survey.js
// Mounts at /api/v1/survey  (registered in app.js)
// All routes are protected — require a valid JWT.

import { Router }                        from "express";
import authenticate                      from "../middleware/auth.js";
import { getActivePeriod, getRatees }    from "../controllers/surveyController.js";

const router = Router();

// All survey routes require authentication
router.use(authenticate);

// GET /api/v1/survey/period
// Returns the active evaluation_period row
router.get("/period", getActivePeriod);

// GET /api/v1/survey/ratees?relationship=subordinate|superior|peer
// Returns ratees the logged-in rater is assigned to for the active period
router.get("/ratees", getRatees);

export default router;