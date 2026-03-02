// client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login                        from "./pages/Login";
import SelectRole                   from "./pages/SelectRole";
import SurveyLetter                 from "./pages/SurveyLetter";
import RateNames                    from "./pages/RateNames";
import SurveyCatPeer                from "./pages/SurveyCatPeer";
import SurveyCatPeerComment         from "./pages/SurveyCatPeerComment";
import SurveyCatSubordinate         from "./pages/SurveyCatSubordinate";
import SurveyCatSubordinateComment  from "./pages/SurveyCatSubordinateComment";

// Future pages (uncomment when ready):
// import SurveyCatSuperior           from "./pages/SurveyCatSuperior";
// import SurveyCatSuperiorComment    from "./pages/SurveyCatSuperiorComment";
// import AdminDashboard              from "./pages/AdminDashboard";

// Simple thank-you page inline — replace with a proper component later
function SurveyTY() {
  return (
    <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
      <h2>Thank you for completing the survey!</h2>
      <p>Your responses have been submitted successfully.</p>
      <a href="/select-role" style={{ marginTop: "1.5rem", display: "inline-block" }}>
        ← Back to Dashboard
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public ─────────────────────────────────────────────── */}
        <Route path="/login" element={<Login />} />

        {/* ── Default redirect (root → login) ────────────────────── */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ── Protected: role selection & survey letter ───────────── */}
        <Route path="/select-role"                 element={<SelectRole />}   />
        <Route path="/survey-letter/:relationship" element={<SurveyLetter />} />
        <Route path="/rate-names/:relationship"    element={<RateNames />}    />

        {/* ── Protected: Peer survey (7 categories + comments) ────── */}
        <Route path="/survey-cat-peer/:catNumber"  element={<SurveyCatPeer />}        />
        <Route path="/survey-cat-peer-comment"     element={<SurveyCatPeerComment />} />

        {/* ── Protected: Subordinate survey (7 categories + comments) */}
        <Route path="/survey-cat-subordinate/:catNumber" element={<SurveyCatSubordinate />}        />
        <Route path="/survey-cat-subordinate-comment"    element={<SurveyCatSubordinateComment />} />

        {/* ── Protected: Thank-you page ────────────────────────────── */}
        <Route path="/survey-ty" element={<SurveyTY />} />

        {/* ── Future: Superior survey ──────────────────────────────── */}
        {/* <Route path="/survey-cat-superior/:catNumber"  element={<SurveyCatSuperior />}        /> */}
        {/* <Route path="/survey-cat-superior-comment"     element={<SurveyCatSuperiorComment />} /> */}

        {/* ── Future: Admin ────────────────────────────────────────── */}
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}

        {/* ── Catch-all: any unmatched URL → login ─────────────────── */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}