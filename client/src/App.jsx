// client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login        from "./pages/Login";
import SelectRole   from "./pages/SelectRole";
import SurveyLetter from "./pages/SurveyLetter";
import RateNames    from "./pages/RateNames";

// Future pages:
// import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />

        {/* Protected routes */}
        <Route path="/select-role"                     element={<SelectRole />}   />
        <Route path="/survey-letter/:relationship"     element={<SurveyLetter />} />
        <Route path="/rate-names/:relationship"        element={<RateNames />}    />

        {/* <Route path="/survey-cat1/:relationship"   element={<SurveyCat1 />} /> */}
        {/* <Route path="/admin"                       element={<AdminDashboard />} /> */}
      </Routes>
    </BrowserRouter>
  );
} 