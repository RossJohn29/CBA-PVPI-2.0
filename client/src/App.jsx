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
import SurveyCatSuperior            from "./pages/SurveyCatSuperior";
import SurveyCatSuperiorComment     from "./pages/SurveyCatSuperiorComment";
import SurveyTY                     from "./pages/SurveyTY";

// import AdminDashboard              from "./pages/AdminDashboard";

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

        {/* ── Protected: Superior survey (7 categories + comments) ── */}
        <Route path="/survey-cat-superior/:catNumber"  element={<SurveyCatSuperior />}        />
        <Route path="/survey-cat-superior-comment"     element={<SurveyCatSuperiorComment />} />

        {/* ── Protected: Thank-you page ────────────────────────────── */}
        <Route path="/survey-ty" element={<SurveyTY />} />

        {/* ── Future: Admin ────────────────────────────────────────── */}
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}

        {/* ── Catch-all: any unmatched URL → login ─────────────────── */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}