// client/src/pages/RateNames.jsx
// Single component replacing surveyratenamespeer.html,
// surveyratenamessubordinate.html, and surveyratenamessuperior.html.
//
// All data is live from Supabase via Express:
//   • Rater name   → from surveyStore (set on login, users.full_name)
//   • Ratee list   → GET /api/v1/survey/ratees?relationship=...
//                    (ratee_rater_assignments joined to users for the active period)
//   • Date         → defaults to today, fully editable
//
// All original HTML class names, IDs, input names, and labels are preserved.

import { useState, useEffect }    from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSurveyStore             from "../store/surveyStore";
import { getRatees, getActivePeriod } from "../api/survey";
import "../assets/RateNames.css";

const pvpLogo = "/pvp.png";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

// ── Per-relationship config ───────────────────────────────────────────────────
// Preserves every original HTML ID, input name, class name, and label exactly.
const CONFIG = {
  superior: {
    formTitle:      "Superior Assessment Form",
    partCardClass:  "part-card-super",
    raterCardClass: "ratersuper_card",
    rateeCardClass: "rateesuper_card",
    dateCardClass:  "datesuper_card",
    raterInputId:   "spffrater",
    raterInputName: "ratersp",
    rateeSelectId:  "spffratee",
    dateInputId:    "spdteval",
    dateInputName:  "spdteval",
    dateInputClass: "superdateeval",
    rateeLabel:     "Ratee / Superior (Person to Evaluate)",
  },
  subordinate: {
    formTitle:      "Subordinate Assessment Form",
    partCardClass:  "part-card-subor",
    raterCardClass: "ratersubor_card",
    rateeCardClass: "rateesubor_card",
    dateCardClass:  "datesubor_card",
    raterInputId:   "sbffrater",
    raterInputName: "ratersb",
    rateeSelectId:  "sbffratee",
    dateInputId:    "sbdteval",
    dateInputName:  "sbdteval",
    dateInputClass: "subordateeval",
    rateeLabel:     "Ratee / Subordinate (Person to Evaluate)",
  },
  peer: {
    formTitle:      "Peer Assessment Form",
    partCardClass:  "part-card-peer",
    raterCardClass: "raterpeer_card",
    rateeCardClass: "rateepeer_card",
    dateCardClass:  "datepeer_card",
    raterInputId:   "prffrater",
    raterInputName: "raterpr",
    rateeSelectId:  "prffratee",
    dateInputId:    "prdteval",
    dateInputName:  "prdteval",
    dateInputClass: "peerdateeval",
    rateeLabel:     "Ratee (Person to Evaluate)",
  },
};

export default function RateNames() {
  const navigate         = useNavigate();
  const { relationship } = useParams(); // 'subordinate' | 'superior' | 'peer'

  const rater            = useSurveyStore((s) => s.rater);
  const token            = useSurveyStore((s) => s.token);
  const logout           = useSurveyStore((s) => s.logout);
  const setSelectedRatee = useSurveyStore((s) => s.setSelectedRatee);
  const setSelectedPeriod = useSurveyStore((s) => s.setSelectedPeriod);

  // Redirect if not authenticated
  useEffect(() => {
    if (!rater || !token) navigate("/login", { replace: true });
  }, [rater, token, navigate]);

  const cfg = CONFIG[relationship] ?? CONFIG.peer;

  // ── Form state ──────────────────────────────────────────────────────────────
  const [raterName,    setRaterName]    = useState(rater?.full_name ?? "");
  const [rateeValue,   setRateeValue]   = useState("");  // assignment_id of selected ratee
  const [dateEval,     setDateEval]     = useState(getTodayDate());
  const [formError,    setFormError]    = useState("");

  // ── Supabase data state ─────────────────────────────────────────────────────
  const [ratees,       setRatees]       = useState([]);   // [{ assignment_id, ratee_id, full_name, is_submitted }]
  const [loading,      setLoading]      = useState(true);
  const [fetchError,   setFetchError]   = useState("");

  // ── Fetch ratees + active period from Express → Supabase ───────────────────
  useEffect(() => {
    if (!token || !relationship) return;

    async function fetchData() {
      setLoading(true);
      setFetchError("");
      try {
        // Fetch ratees for this rater + relationship (from ratee_rater_assignments)
        const { period_id, ratees: rateeList } = await getRatees(token, relationship);

        // Fetch full period details for the store
        const period = await getActivePeriod(token);
        setSelectedPeriod(period);

        setRatees(rateeList);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token, relationship]);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function handlePrev() {
    navigate(`/survey-letter/${relationship}`);
  }

  function handleNext() {
    if (!rateeValue) {
      setFormError("Please select a Ratee before proceeding.");
      return;
    }
    if (!dateEval) {
      setFormError("Please select a Date Evaluated before proceeding.");
      return;
    }
    setFormError("");

    // Save selected ratee into Zustand store
    // value = assignment_id; find the matching ratee object for full_name + ratee_id
    const selected = ratees.find((r) => r.assignment_id === rateeValue);
    setSelectedRatee({
      assignment_id: selected.assignment_id,
      id:            selected.ratee_id,
      full_name:     selected.full_name,
    });
    useSurveyStore.setState({ dateEvaluated: dateEval });

    navigate(`/survey-cat1/${relationship}`);
  }

  const displayName = rater?.full_name ?? "User";

  return (
    <>
      {/* HEADER */}
      <header>
        <nav className="navbar">
          <a href="#" className="logo">
            <img src={pvpLogo} alt="PVP logo" />
          </a>
          <ul className="links">
            <li><a href="#">Welcome {displayName}</a></li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                Log out
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* CONTENT */}
      <div className="container-fliud">
        <div className="container" />

        {/* Assessment form title banner */}
        <div className={cfg.partCardClass}>
          <h5>{cfg.formTitle}</h5>
        </div>

        {/* Ratee-Rater list hint */}
        <div className="container_whorate">
          <div className="whorate_card">
            <a>Unsure who to rate? Click this to know the</a>
            <a href="#"> List of Ratee-Rater</a>
          </div>
        </div>

        {/* Rater name — pre-filled from users.full_name, editable */}
        <div className={cfg.raterCardClass}>
          <label htmlFor={cfg.raterInputId}>Rater (Your Name)</label>
          <input
            type="text"
            id={cfg.raterInputId}
            name={cfg.raterInputName}
            placeholder="Enter your name here..."
            value={raterName}
            onChange={(e) => setRaterName(e.target.value)}
            required
          />
        </div>

        {/* Ratee dropdown — populated from Supabase ratee_rater_assignments */}
        <div className={cfg.rateeCardClass}>
          <label htmlFor={cfg.rateeSelectId}>{cfg.rateeLabel}</label>

          {fetchError ? (
            <p style={{ color: "red", fontSize: "14px" }}>{fetchError}</p>
          ) : (
            <select
              id={cfg.rateeSelectId}
              value={rateeValue}
              onChange={(e) => setRateeValue(e.target.value)}
              required
              disabled={loading}
            >
              <option value="">
                {loading ? "Loading ratees..." : "--Select Ratee--"}
              </option>
              {ratees.map((r) => (
                <option
                  key={r.assignment_id}
                  value={r.assignment_id}
                  disabled={r.is_submitted}
                >
                  {r.full_name}{r.is_submitted ? " (Already Submitted)" : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Date Evaluated — defaults to today, still editable */}
        <div className={cfg.dateCardClass}>
          <label htmlFor={cfg.dateInputId}>Date Evaluated</label>
          <input
            type="date"
            id={cfg.dateInputId}
            name={cfg.dateInputName}
            className={cfg.dateInputClass}
            value={dateEval}
            onChange={(e) => setDateEval(e.target.value)}
            required
          />
        </div>

        {/* Validation error */}
        {formError && (
          <p style={{ color: "red", textAlign: "center", marginBottom: "1rem" }}>
            {formError}
          </p>
        )}

        {/* Prev / Next buttons */}
        <div className="buttons">
          <button className="prev" onClick={handlePrev}>« Prev</button>
          <button className="next" onClick={handleNext} disabled={loading}>
            Next »
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-col">
          <h4>Premier Value Provider Inc.</h4>
          <p>
            Boost productivity and well-being in your
            <br /> workplace with Premier Value Provider! Join us
            <br />in building a thriving workplace culture.
          </p>
          <div className="icon-links">
            <a href="https://www.linkedin.com/company/pvpi/mycompany/?viewAsMember=true" className="fa fa-linkedin" />
            <a href="https://www.facebook.com/pvpiph"    className="fa fa-facebook"  />
            <a href="https://www.instagram.com/pvpi.ph/" className="fa fa-instagram" />
            <a href="https://www.youtube.com/@pvptv636"  className="fa fa-youtube"   />
            <p>©2024 Premier Value Provider, Inc. <br /> All Rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}