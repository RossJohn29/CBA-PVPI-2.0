// client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ── Shared ────────────────────────────────────────────────────────────────────
import Login                        from "./pages/Login";

// ── Employee (folder: pages/company/) ────────────────────────────────────────
import SelectRole                   from "./pages/company/SelectRole";
import SurveyLetter                 from "./pages/company/SurveyLetter";
import RateNames                    from "./pages/company/RateNames";
import SurveyCatPeer                from "./pages/company/SurveyCatPeer";
import SurveyCatPeerComment         from "./pages/company/SurveyCatPeerComment";
import SurveyCatSubordinate         from "./pages/company/SurveyCatSubordinate";
import SurveyCatSubordinateComment  from "./pages/company/SurveyCatSubordinateComment";
import SurveyCatSuperior            from "./pages/company/SurveyCatSuperior";
import SurveyCatSuperiorComment     from "./pages/company/SurveyCatSuperiorComment";
import SurveyTY                     from "./pages/company/SurveyTY";

// ── Admin ─────────────────────────────────────────────────────────────────────
// import AdminDashboard               from "./pages/admin/AdminDashboard";
// import AdminUsers                   from "./pages/admin/AdminUsers";
// import AdminPeriods                 from "./pages/admin/AdminPeriods";
// import AdminAssignments             from "./pages/admin/AdminAssignments";
// import AdminReports                 from "./pages/admin/AdminReports";
// import AdminQuestions               from "./pages/admin/AdminQuestions";
// import AdminSubmissionLog           from "./pages/admin/AdminSubmissionLog";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public ─────────────────────────────────────────────────────── */}
        <Route path="/login" element={<Login />} />

        {/* ── Default redirect (root → login) ────────────────────────────── */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ── Employee: role selection & survey letter ────────────────────── */}
        <Route path="/select-role"                 element={<SelectRole />}   />
        <Route path="/survey-letter/:relationship" element={<SurveyLetter />} />
        <Route path="/rate-names/:relationship"    element={<RateNames />}    />

        {/* ── Employee: Peer survey (categories + comments) ───────────────── */}
        <Route path="/survey-cat-peer/:catNumber"  element={<SurveyCatPeer />}        />
        <Route path="/survey-cat-peer-comment"     element={<SurveyCatPeerComment />} />

        {/* ── Employee: Subordinate survey (categories + comments) ────────── */}
        <Route path="/survey-cat-subordinate/:catNumber" element={<SurveyCatSubordinate />}        />
        <Route path="/survey-cat-subordinate-comment"    element={<SurveyCatSubordinateComment />} />

        {/* ── Employee: Superior survey (categories + comments) ───────────── */}
        <Route path="/survey-cat-superior/:catNumber" element={<SurveyCatSuperior />}        />
        <Route path="/survey-cat-superior-comment"    element={<SurveyCatSuperiorComment />} />

        {/* ── Employee: Thank-you page ─────────────────────────────────────── */}
        <Route path="/survey-ty" element={<SurveyTY />} />

        {/* ── Admin ────────────────────────────────────────────────────────── */}
        {/* <Route path="/admin"                  element={<AdminDashboard />}    /> */}
        {/* <Route path="/admin/users"            element={<AdminUsers />}        /> */}
        {/* <Route path="/admin/periods"          element={<AdminPeriods />}      /> */}
        {/* <Route path="/admin/assignments"      element={<AdminAssignments />}  /> */}
        {/* <Route path="/admin/reports"          element={<AdminReports />}      /> */}
        {/* <Route path="/admin/questions"        element={<AdminQuestions />}    /> */}
        {/* <Route path="/admin/submission-log"   element={<AdminSubmissionLog />}/> */}

        {/* ── Catch-all: any unmatched URL → login ─────────────────────────── */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}