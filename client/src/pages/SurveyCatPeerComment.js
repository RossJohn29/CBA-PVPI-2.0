// client/src/pages/SurveyCatPeerComment.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Consolidates: surveycat8_9peer.html
// CSS rename  : peersurveycat8_9.css  →  SurveyCatPeerComment.css
// Route       : /survey-cat-peer-comment
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useNavigate }         from "react-router-dom";
import useSurveyStore          from "../store/surveyStore";
import "../assets/SurveyCatPeerComment.css";   // ← same content as peersurveycat8_9.css

export default function SurveyCatPeerComment() {
  const navigate      = useNavigate();
  const rater         = useSurveyStore((s) => s.rater);
  const token         = useSurveyStore((s) => s.token);
  const selectedRatee = useSurveyStore((s) => s.selectedRatee);
  const logout        = useSurveyStore((s) => s.logout);

  useEffect(() => {
    if (!rater || !token) navigate("/login",           { replace: true });
    if (!selectedRatee)   navigate("/rate-names/peer", { replace: true });
  }, [rater, token, selectedRatee, navigate]);

  // ── State — ids / names match original HTML exactly ───────────────────────
  // id="prc8freeform"  name="peercat8"
  const [prc8freeform, setPrc8freeform] = useState("");
  // id="prc9freeform"  name="peercat9"
  const [prc9freeform, setPrc9freeform] = useState("");
  const [formError,    setFormError]    = useState("");

  function submitSurvey() {
    if (!prc8freeform.trim() || !prc9freeform.trim()) {
      setFormError("Please fill in both Strengths and Areas of Improvements.");
      return;
    }
    setFormError("");
    // TODO: POST /api/v1/survey/submit  with all store answers + these comments
    navigate("/survey-ty");
  }

  function handleLogout() { logout(); navigate("/login", { replace: true }); }

  const displayName = rater?.full_name         ?? "User";
  const rateeName   = selectedRatee?.full_name ?? "Lname, Fname MI";

  return (
    <body className="body-for-sticky">

      {/* ── HEADER ── */}
      <header>
        <nav className="navbar">
          <a href="#" className="logo">
            <img src="images/pvp.png" alt="logo" />
          </a>
          <ul className="links">
            <li><a href="#">Welcome {displayName}</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Log out</a></li>
          </ul>
        </nav>
      </header>

      {/* ── CONTENTS ── */}
      <div className="container-fliud">

        {/* Person card */}
        <div className="container">
          <div className="row">
            <div className="col-md">
              <div className="card-content">
                <img src="images/icon3.png" alt="peer" />
                <a>
                  <h5>You are rating Peer,</h5>
                  <h6>{rateeName}</h6>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Part instruction */}
        <div className="part-card">
          <h5>PART 3. Please write your qualitative responses based on the items below:</h5>
        </div>

        <div className="container-card">
          <div className="container-card-inside">

            {/* Strengths — id="prc8freeform" name="peercat8" */}
            <div className="c8_card">
              <label htmlFor="prc8freeform">Strengths</label>
              <textarea
                id="prc8freeform"
                name="peercat8"
                placeholder="Enter text here..."
                required
                value={prc8freeform}
                onChange={(e) => setPrc8freeform(e.target.value)}
              />
            </div>

            {/* Areas of Improvements — id="prc9freeform" name="peercat9" */}
            <div className="c9_card">
              <label htmlFor="prc9freeform">Areas of Improvements</label>
              <textarea
                id="prc9freeform"
                name="peercat9"
                placeholder="Enter text here..."
                required
                value={prc9freeform}
                onChange={(e) => setPrc9freeform(e.target.value)}
              />
            </div>

            {formError && (
              <p style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>{formError}</p>
            )}

            <div className="c8c9reminder">
              <a><b>Reminder:</b> Click <b style={{ color: "red" }}>DONE</b> once you have completed the evaluation.</a>
            </div>

            <div className="buttons">
              <button className="prev" onClick={() => navigate("/survey-cat-peer/7")}>&laquo; Prev</button>
              <button className="done" onClick={submitSurvey}>Done &#10004;</button>
            </div>

          </div>
        </div>

      </div>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-col">
          <h4>Premier Value Provider Inc.</h4>
          <p>Boost productivity and well-being in your <br /> workplace with Premier Value Provider! Join us <br />in building a thriving workplace culture.</p>
          <div className="icon-links">
            <a href="https://www.linkedin.com/company/pvpi/mycompany/?viewAsMember=true" className="fa fa-linkedin"></a>
            <a href="https://www.facebook.com/pvpiph"    className="fa fa-facebook"></a>
            <a href="https://www.instagram.com/pvpi.ph/" className="fa fa-instagram"></a>
            <a href="https://www.youtube.com/@pvptv636"  className="fa fa-youtube"></a>
            <p>©2024 Premier Value Provider, Inc. <br /> All Rights reserved.</p>
          </div>
        </div>
      </footer>

    </body>
  );
}