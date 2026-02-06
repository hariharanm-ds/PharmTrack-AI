import React, { useState, useEffect } from "react"; // Added useEffect for potential local storage use later
import './HealthTrack.css';

// Utility functions (parseBP, nowString, emergencyMessage) remain the same
const parseBP = (bpStr) => {
    // Accept "120/80" or "120 / 80"
    const match = (bpStr || "").match(/^\s*(\d{2,3})\s*\/\s*(\d{2,3})\s*$/);
    if (!match) return null;
    const sys = parseInt(match[1], 10);
    const dia = parseInt(match[2], 10);
    return { sys, dia };
};

const nowString = () =>
    new Date().toLocaleString([], { dateStyle: "medium", timeStyle: "short" });

// Define a simple BP category function for alert context
const getBPCategory = (sys, dia) => {
    if (sys >= 180 || dia >= 120) return { label: "Crisis", color: "red" };
    if (sys >= 140 || dia >= 90) return { label: "Stage 2", color: "orange" };
    if (sys >= 130 || dia >= 80) return { label: "Stage 1", color: "yellow" };
    return { label: "Normal", color: "green" };
};


export default function HealthTrack() {
    const [bp, setBp] = useState("");
    const [sugar, setSugar] = useState("");
    const [weight, setWeight] = useState("");
    const [latest, setLatest] = useState(null);
    // Note: I'm temporarily using 'history' without persistence to focus on styling fix
    const [history, setHistory] = useState([]);
    const [error, setError] = useState("");

    const validate = () => {
        setError("");
        // BP required and must be valid
        const bpParsed = parseBP(bp);
        if (!bpParsed) {
            setError("Please enter BP as systolic/diastolic (e.g., 120/80).");
            return null;
        }
        // Sugar required, numeric
        const sugarNum = Number(sugar);
        if (!sugar || Number.isNaN(sugarNum) || sugarNum <= 0) {
            setError("Please enter a valid Sugar level (mg/dL).");
            return null;
        }
        // Weight optional but if present must be positive
        const weightNum = weight ? Number(weight) : null;
        if (weight && (Number.isNaN(weightNum) || weightNum <= 0)) {
            setError("Please enter a valid Weight (kg).");
            return null;
        }
        return { bpParsed, sugarNum, weightNum };
    };

    const emergencyMessage = ({ sys, dia }, sugarNum) => {
        // Simple rules (customize as needed)
        if (sys >= 180 || dia >= 120) {
            return "🚨 Hypertensive crisis (BP very high). Seek emergency care immediately.";
        }
        if (sys >= 160 || dia >= 100) {
            return "⚠️ High blood pressure detected. Consult a doctor as soon as possible.";
        }
        if (sugarNum >= 300) {
            return "🚨 Very high blood sugar detected. Seek medical care immediately.";
        }
        if (sugarNum >= 200) {
            return "⚠️ High blood sugar detected. Please consult a doctor.";
        }
        if (sugarNum < 70) {
            return "⚠️ Low blood sugar detected. Consume fast-acting carbs and consult a doctor if symptoms persist.";
        }
        return "";
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const v = validate();
        if (!v) return;
        const { bpParsed, sugarNum, weightNum } = v;

        const entry = {
            bp,
            sugar: sugarNum,
            weight: weightNum,
            time: nowString(),
            emergency: emergencyMessage(bpParsed, sugarNum),
            bpCategory: getBPCategory(bpParsed.sys, bpParsed.dia).label,
            bpColor: getBPCategory(bpParsed.sys, bpParsed.dia).color,
        };

        setLatest(entry);
        setHistory((prev) => [entry, ...prev].slice(0, 10)); // keep last 10
        setBp("");
        setSugar("");
        setWeight("");
    };

    return (
        <div className="health-container">
            {/* Form */}
            <form className="health-form" onSubmit={onSubmit}>
                <h2>📝 Add Health Record</h2>

                <label>🩺 Blood Pressure</label>
                <input
                    type="text"
                    placeholder="e.g. 120/80 mmHg"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                />

                <label>🍬 Sugar Level (mg/dL)</label>
                <input
                    type="number"
                    placeholder="e.g. 95"
                    value={sugar}
                    onChange={(e) => setSugar(e.target.value)}
                />

                <label>⚖️ Weight (kg)</label>
                <input
                    type="number"
                    placeholder="e.g. 65"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                />

                {error && (
                    // 🚨 Fixed class name
                    <div className="alert-message error-message">
                        {error}
                    </div>
                )}

                <button type="submit" className="save-button">
                    Save Record
                </button>
            </form>

            {/* Latest Entry */}
            <div className="latest-entry-card"> {/* 🚨 Fixed class name */}
                <h3>📊 Latest Entry</h3>

                {latest ? (
                    <>
                        <div className="entry-item">
                            <span className="entry-icon">🩺</span>
                            <span>
                                <strong>BP:</strong> {latest.bp}
                                {/* Display category next to BP */}
                                <span className={`bp-category bp-${latest.bpColor}`}>
                                    {latest.bpCategory}
                                </span>
                            </span>
                        </div>
                        <div className="entry-item">
                            <span className="entry-icon">🍬</span>
                            <span>
                                <strong>Sugar:</strong> {latest.sugar} mg/dL
                            </span>
                        </div>
                        <div className="entry-item">
                            <span className="entry-icon">⚖️</span>
                            <span>
                                <strong>Weight:</strong>{" "}
                                {latest.weight ? `${latest.weight} kg` : "—"}
                            </span>
                        </div>
                        <div className="entry-item">
                            <span className="entry-icon">⏱️</span>
                            <span>
                                <strong>Time:</strong> {latest.time}
                            </span>
                        </div>

                        {latest.emergency && (
                            // 🚨 Fixed class name
                            <div className="alert-message warning-message">{latest.emergency}</div>
                        )}

                        {/* Optional: mini history preview */}
                        {history.length > 1 && (
                            <div className="history-preview-section"> {/* 🚨 Fixed style to class */}
                                <h4 className="history-preview-title">Recent History</h4> {/* 🚨 Fixed style to class */}
                                <div className="history-preview-list"> {/* 🚨 Fixed style to class */}
                                    {history.slice(1).map((h, i) => (
                                        <div key={i} className="entry-item history-item">
                                            <span className="entry-icon">🗓️</span>
                                            <span>
                                                <strong>{h.time}</strong> — BP {h.bp}, Sugar {h.sugar}
                                                {h.weight ? `, Wt ${h.weight}kg` : ""}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    // 🚨 Fixed style to class
                    <p className="no-records-message">
                        No records yet. Add your first entry using the form.
                    </p>
                )}
            </div>
        </div>
    );
}