import React, { useEffect, useRef, useState, useCallback } from "react";
import './MedicineTracker.css';

const LANG_TEXT = {
  en: {
    reminderTitle: "Medicine Reminder",
    reminderBody: (m) => `Time to take ${m.name} (${m.dosage}) — ${m.frequency}`,
    snooze: "Snooze",
    dismiss: "Dismiss",
    takenVoice: "taken",
  },
};

function nowHM() {
  const d = new Date();
  return d.toTimeString().slice(0, 5);
}

function timeBucket(hhmm) {
  if (!hhmm) return "other";
  const h = parseInt(hhmm.slice(0, 2), 10);
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 22) return "evening";
  return "night";
}

const BUCKET_COLOR = {
  morning: "bucket-morning",
  afternoon: "bucket-afternoon",
  evening: "bucket-evening",
  night: "bucket-night",
  other: "bucket-other",
};

export default function MedicineTracker() {
  const [lang, setLang] = useState("en");
  const [form, setForm] = useState({ name: "", dosage: "", frequency: "", time: "", critical: false });
  const [meds, setMeds] = useState([]);
  const [reminder, setReminder] = useState(null);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ taken: 0, missed: 0, total: 0 });
  const audioRef = useRef(null);
  const medsRef = useRef(meds);

  useEffect(() => {
    medsRef.current = meds;
  }, [meds]);

  // ✅ FIXED: useCallback to avoid missing dependency warning
  const checkReminders = useCallback(() => {
    const now = new Date();
    const curHM = now.toTimeString().slice(0, 5);
    const current = medsRef.current || [];

    let changed = false;
    current.forEach((m) => {
      if (m.snoozedUntil && new Date(m.snoozedUntil) > now) return;
      if (m.lastTriggered && m.lastTriggered === curHM) return;

      if (m.time === curHM) {
        triggerReminder(m);
        m.lastTriggered = curHM;
        changed = true;
      } else if (m.snoozedUntil && new Date(m.snoozedUntil) <= now) {
        triggerReminder(m);
        m.snoozedUntil = null;
        changed = true;
      }
    });
    if (changed) setMeds([...current]);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }

    try {
      const saved = localStorage.getItem("pharm_meds_v1");
      if (saved) setMeds(JSON.parse(saved));
    } catch (e) {
      console.warn("Failed to parse saved meds", e);
    }

    const interval = setInterval(checkReminders, 15000);
    checkReminders();
    return () => clearInterval(interval);
  }, [checkReminders]); // ✅ Added dependency

  useEffect(() => {
    try {
      localStorage.setItem("pharm_meds_v1", JSON.stringify(meds));
    } catch {}

    const total = meds.length;
    const taken = meds.reduce((acc, m) => acc + (m.takenCount || 0), 0);
    const missed = meds.reduce((acc, m) => acc + (m.missedCount || 0), 0);
    setStats({ total, taken, missed });
  }, [meds]);

  function playToneFor(med) {
    if (med.customTone) {
      try {
        const a = new Audio(med.customTone);
        a.play().catch(() => {});
      } catch {}
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }

  function triggerReminder(med) {
    setReminder({ med, createdAt: new Date(), snoozeCount: 0 });
    playToneFor(med);

    if ("Notification" in window && Notification.permission === "granted") {
      try {
        const body = (LANG_TEXT[lang]?.reminderBody || LANG_TEXT.en.reminderBody)(med);
        const n = new Notification(LANG_TEXT[lang]?.reminderTitle || LANG_TEXT.en.reminderTitle, {
          body,
          icon: "/pill-icon.png",
          tag: `pharm-${med.id}-${med.time}`,
        });
        n.onclick = () => window.focus();
      } catch (err) {
        console.warn("Notification failed", err);
      }
    }
  }

  function handleChange(e) {
    const { name, type, checked, value } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function addMedicine() {
    setError("");
    const { name, dosage, frequency, time, critical } = form;
    if (!name || !dosage || !frequency || !time) {
      setError("Please fill all fields (name, dosage, frequency, time).");
      return;
    }
    const id = Date.now().toString(36);
    const item = {
      id,
      name: name.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      time,
      timestamp: new Date().toISOString(),
      takenCount: 0,
      missedCount: 0,
      color: BUCKET_COLOR[timeBucket(time)],
      critical: !!critical,
      customTone: null,
    };
    setMeds((prev) => [item, ...prev]);
    setForm({ name: "", dosage: "", frequency: "", time: "", critical: false });
  }

  function markTaken(item) {
    item.takenCount = (item.takenCount || 0) + 1;
    item.lastTaken = new Date().toISOString();
    setMeds((prev) => prev.map((m) => (m.id === item.id ? { ...item } : m)));
    setReminder(null);
    if (audioRef.current) audioRef.current.pause();
  }

  function markMissed(item) {
    item.missedCount = (item.missedCount || 0) + 1;
    setMeds((prev) => prev.map((m) => (m.id === item.id ? { ...item } : m)));
    setReminder(null);
    if (audioRef.current) audioRef.current.pause();
    if (item.critical && item.missedCount >= 1) {
      alert("CRITICAL: important medicine missed — consider emergency action.");
    }
  }

  function snoozeMinutes(mins = 5) {
    if (!reminder) return;
    const med = reminder.med;
    const until = new Date(Date.now() + mins * 60000);
    med.snoozedUntil = until.toISOString();
    setMeds((prev) => prev.map((m) => (m.id === med.id ? { ...med } : m)));
    setReminder(null);
    if (audioRef.current) audioRef.current.pause();
  }

  function dismissReminder() {
    if (!reminder) return;
    const med = { ...reminder.med, lastTriggered: nowHM() };
    setMeds((prev) => prev.map((m) => (m.id === med.id ? med : m)));
    setReminder(null);
    if (audioRef.current) audioRef.current.pause();
  }

  function startVoiceConfirm() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Voice recognition not supported in this browser.");
      return;
    }
    const rec = new SR();
    rec.lang = lang === "en" ? "en-US" : lang === "ta" ? "ta-IN" : "hi-IN";
    rec.start();
    rec.onresult = (e) => {
      const text = e.results?.[0]?.[0]?.transcript?.toLowerCase?.() || "";
      const target = (LANG_TEXT[lang]?.takenVoice || "taken").toLowerCase();
      if (text.includes(target)) {
        if (reminder) markTaken(reminder.med);
        else alert("No active reminder to mark as taken.");
      } else {
        alert(`Heard: "${text}". Say "${target}" to confirm taken.`);
      }
      rec.stop();
    };
    rec.onerror = () => {
      try { rec.stop(); } catch {}
      alert("Voice recognition error.");
    };
  }

  const grouped = meds.reduce((acc, m) => {
    const key = timeBucket(m.time);
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  return (
    <div className="med-tracker-page">
      <audio ref={audioRef} src="/alarm.mp3" preload="auto" />
      
      <div className="max-w-container">
        <div className="header-card">
          <div className="header-content-wrapper">
            <div className="header-content-left">
              <div className="header-icon-wrapper">
                <span className="icon-bell">🔔</span> 
              </div>
              <div>
                <h1 className="header-title">Medicine Tracker</h1>
                <p className="header-subtitle">Smart reminders & health analytics</p>
              </div>
            </div>
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              className="lang-select"
            >
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>
        </div>

        <div className="grid-layout">
          <div className="main-content-area">
            <div className="card">
              <h2 className="card-title">
                <span className="icon-plus">+</span> Add Medicine
              </h2>
              <div className="space-y-4">
                <div className="form-grid">
                  <div>
                    <label className="form-label">Medicine Name</label>
                    <input 
                      name="name" 
                      value={form.name} 
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g., Aspirin"
                    />
                  </div>
                  <div>
                    <label className="form-label">Dosage</label>
                    <input 
                      name="dosage" 
                      value={form.dosage} 
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g., 500mg"
                    />
                  </div>
                  <div>
                    <label className="form-label">Frequency</label>
                    <input 
                      name="frequency" 
                      value={form.frequency} 
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g., Once daily"
                    />
                  </div>
                  <div>
                    <label className="form-label">Time</label>
                    <input 
                      name="time" 
                      type="time" 
                      value={form.time} 
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>
                
                <label className="checkbox-label">
                  <input 
                    name="critical" 
                    type="checkbox" 
                    checked={!!form.critical} 
                    onChange={handleChange}
                    className="critical-checkbox"
                  />
                  <span className="checkbox-text">Mark as critical medicine</span>
                </label>

                {error && <div className="error-message">{error}</div>}
                
                <button 
                  onClick={addMedicine}
                  className="btn-primary"
                >
                  <span className="icon-plus-btn">+</span>
                  Add Medicine
                </button>
              </div>
            </div>

            <div className="card">
              <h2 className="card-title">
                <span className="icon-clock">🕒</span> Today's Schedule
              </h2>
              <div className="schedule-list">
                {["morning","afternoon","evening","night"].map((bk) => (
                  <div key={bk} className="schedule-time-bucket">
                    <h4 className="bucket-title">
                      <div className={`bucket-color-dot ${BUCKET_COLOR[bk]}`}></div>
                      {bk}
                    </h4>
                    <div className="bucket-items">
                      {(grouped[bk] || []).map(m => (
                        <div key={m.id} className={`med-item ${m.color}`}>
                          <div className="med-details">
                            <div className="med-name-time">{m.time} — {m.name}</div>
                            <div className="med-dosage-freq">{m.dosage} • {m.frequency}</div>
                          </div>
                          <button 
                            onClick={() => { setReminder({ med:m, createdAt:new Date() }); playToneFor(m); }}
                            className="btn-remind-trigger"
                          >
                            <span className="icon-bell-small">🔔</span>
                          </button>
                        </div>
                      ))}
                      {!(grouped[bk] || []).length && (
                        <div className="no-meds-placeholder">No medicines</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sidebar-area">
            <div className="card">
              <h2 className="card-title">
                <span className="icon-bell-red">🚨</span> Active Reminder
              </h2>
              {reminder ? (
                <div className="reminder-box">
                  <div className="reminder-details">
                    <h3 className="reminder-name">{reminder.med.name}</h3>
                    <p className="reminder-dosage">{reminder.med.dosage} • {reminder.med.frequency}</p>
                    <p className="reminder-time">{reminder.med.time}</p>
                  </div>
                  
                  <button 
                    onClick={() => markTaken(reminder.med)}
                    className="btn-taken"
                  >
                    <span className="icon-check">✓</span>
                    Taken
                  </button>
                  
                  <div className="snooze-group">
                    <button 
                      onClick={() => snoozeMinutes(5)}
                      className="btn-snooze"
                    >
                      {LANG_TEXT[lang]?.snooze || LANG_TEXT.en.snooze} 5m
                    </button>
                    <button 
                      onClick={() => snoozeMinutes(10)}
                      className="btn-snooze"
                    >
                      {LANG_TEXT[lang]?.snooze || LANG_TEXT.en.snooze} 10m
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => { markMissed(reminder.med); }}
                    className="btn-missed"
                  >
                    <span className="icon-x">✕</span>
                    Missed
                  </button>
                  
                  <div className="action-group">
                    <button 
                      onClick={startVoiceConfirm}
                      className="btn-voice"
                    >
                      <span className="icon-mic">🎤</span>
                      Voice
                    </button>
                    <button 
                      onClick={() => dismissReminder()}
                      className="btn-dismiss"
                    >
                      {LANG_TEXT[lang]?.dismiss || LANG_TEXT.en.dismiss}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="no-reminder-placeholder">
                  <span className="icon-bell-large">🔔</span>
                  <p>No active reminders</p>
                </div>
              )}
            </div>

            <div className="card">
              <h2 className="card-title">Analytics</h2>
              <div className="analytics-list">
                <div className="analytics-item analytics-total">
                  <span className="analytics-label">Total</span>
                  <span className="analytics-value">{stats.total}</span>
                </div>
                <div className="analytics-item analytics-taken">
                  <span className="analytics-label">Taken</span>
                  <span className="analytics-value">{stats.taken}</span>
                </div>
                <div className="analytics-item analytics-missed">
                  <span className="analytics-label">Missed</span>
                  <span className="analytics-value">{stats.missed}</span>
                </div>
              </div>
              <button 
                onClick={() => { setMeds([]); localStorage.removeItem("pharm_meds_v1"); }}
                className="btn-reset-all"
              >
                <span className="icon-reset">⟲</span>
                Reset All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
