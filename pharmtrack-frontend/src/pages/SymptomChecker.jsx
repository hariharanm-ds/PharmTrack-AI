import React, { useState, useCallback } from 'react';
import './SymptomChecker.css';


const medicalData = {
  // Respiratory Symptoms
  "fever": {
    condition: "Fever (Pyrexia)",
    medicine: "Paracetamol 500mg every 6 hours",
    advice: "Drink plenty of fluids, rest well, and monitor temperature. If fever persists beyond 3 days or exceeds 103°F, consult a doctor immediately.",
    prevention: "Maintain hygiene, avoid contact with sick people",
    whenToWorry: "Fever above 103°F, lasting more than 3 days, with severe headache or rash",
    severity: "🟡 Moderate",
    category: "Respiratory"
  },
  "cough": {
    condition: "Persistent Cough",
    medicine: "Honey with warm water, Cough syrup (Dextromethorphan)",
    advice: "Stay hydrated, avoid cold drinks, use steam inhalation. If cough persists for more than 2 weeks or has blood, see a doctor.",
    prevention: "Avoid smoke, dust, and pollution. Wear masks in polluted areas",
    whenToWorry: "Coughing up blood, difficulty breathing, chest pain, fever with cough",
    severity: "🟢 Low",
    category: "Respiratory"
  },
  "cold": {
    condition: "Common Cold (Viral Rhinitis)",
    medicine: "Rest, warm fluids, Cetirizine 10mg for runny nose",
    advice: "Drink warm water with honey and ginger. Get adequate rest. Usually resolves in 7-10 days.",
    prevention: "Wash hands frequently, avoid touching face, maintain distance from sick people",
    whenToWorry: "Symptoms lasting more than 10 days, high fever, severe sore throat",
    severity: "🟢 Low",
    category: "Respiratory"
  },
  "sore throat": {
    condition: "Pharyngitis (Throat Infection)",
    medicine: "Gargle with warm salt water, Throat lozenges, Paracetamol for pain",
    advice: "Drink warm liquids, avoid spicy food, rest your voice. If severe or lasting more than 5 days, consult doctor.",
    prevention: "Avoid sharing utensils, wash hands regularly",
    whenToWorry: "Difficulty swallowing, breathing problems, high fever, white patches in throat",
    severity: "🟢 Low",
    category: "Respiratory"
  },
  "shortness of breath": {
    condition: "Dyspnea - MEDICAL EMERGENCY",
    medicine: "CALL EMERGENCY (108/102) IMMEDIATELY",
    advice: "🚨 Sit upright, stay calm, loosen tight clothing. This could be asthma, heart attack, or COVID-19. SEEK IMMEDIATE MEDICAL HELP.",
    prevention: "Manage asthma properly, avoid allergens, maintain heart health",
    whenToWorry: "ANY shortness of breath is serious - seek immediate medical attention",
    severity: "🔴 Critical",
    category: "Respiratory"
  },
  "chest pain": {
    condition: "Chest Pain - POTENTIAL EMERGENCY",
    medicine: "CALL EMERGENCY (108/102) IF SEVERE",
    advice: "🚨 If pain is crushing, spreading to arm/jaw, with sweating - CALL AMBULANCE. Could be heart attack. Sit down and stay calm.",
    prevention: "Maintain healthy weight, exercise regularly, avoid smoking, manage stress",
    whenToWorry: "Pain spreading to arm/jaw, sweating, nausea, difficulty breathing",
    severity: "🔴 Critical",
    category: "Cardiovascular"
  },

  // Digestive Symptoms
  "stomach pain": {
    condition: "Abdominal Pain",
    medicine: "Antacid (Omeprazole), avoid spicy food",
    advice: "Eat bland food (rice, banana), drink plenty of water. If pain is severe or persistent, consult doctor.",
    prevention: "Eat regular meals, avoid overeating, reduce spicy/oily food",
    whenToWorry: "Severe pain, vomiting blood, black stools, fever with pain",
    severity: "🟡 Moderate",
    category: "Digestive"
  },
  "nausea": {
    condition: "Nausea (Feeling of Vomiting)",
    medicine: "Domperidone 10mg, Ginger tea, ORS",
    advice: "Eat small frequent meals, avoid strong smells, rest. If persistent beyond 24 hours, see doctor.",
    prevention: "Avoid overeating, eat slowly, avoid trigger foods",
    whenToWorry: "Severe vomiting, unable to keep fluids down, signs of dehydration",
    severity: "🟢 Low",
    category: "Digestive"
  },
  "vomiting": {
    condition: "Emesis (Vomiting)",
    medicine: "ORS (Oral Rehydration Solution), Ondansetron 4mg if severe",
    advice: "Stop eating for 2 hours, then try small sips of water. Gradually introduce bland foods. Watch for dehydration.",
    prevention: "Maintain food hygiene, wash hands before eating, drink clean water",
    whenToWorry: "Vomiting blood, severe dehydration, high fever, vomiting for more than 24 hours",
    severity: "🟡 Moderate",
    category: "Digestive"
  },
  "diarrhea": {
    condition: "Acute Diarrhea",
    medicine: "ORS (crucial), Zinc tablets, Loperamide if needed",
    advice: "Drink plenty of ORS, eat boiled rice, banana. Avoid milk, spicy food. If diarrhea persists beyond 3 days, see doctor.",
    prevention: "Drink clean/boiled water, wash hands, eat freshly cooked food",
    whenToWorry: "Blood in stool, severe dehydration, high fever, diarrhea lasting more than 3 days",
    severity: "🟡 Moderate",
    category: "Digestive"
  },
  "constipation": {
    condition: "Constipation",
    medicine: "Drink more water, Eat fiber-rich food, Mild laxative if needed",
    advice: "Eat fruits, vegetables, drink 8-10 glasses water daily. Exercise regularly. Avoid holding stool.",
    prevention: "High fiber diet, adequate water intake, regular exercise, don't delay toilet",
    whenToWorry: "Severe pain, bleeding, constipation for more than a week, vomiting",
    severity: "🟢 Low",
    category: "Digestive"
  },
  "acidity": {
    condition: "Acid Reflux/Heartburn",
    medicine: "Antacid (Omeprazole 20mg), avoid spicy food",
    advice: "Eat small meals, avoid lying down after eating, elevate head while sleeping. Reduce coffee, tea, spicy food.",
    prevention: "Avoid spicy/oily food, don't overeat, eat dinner 2-3 hours before sleep",
    whenToWorry: "Severe chest pain, difficulty swallowing, vomiting blood, weight loss",
    severity: "🟢 Low",
    category: "Digestive"
  },

  // Pain & Body Aches
  "headache": {
    condition: "Headache (Tension/Migraine)",
    medicine: "Paracetamol 500mg or Ibuprofen 400mg, Rest in dark room",
    advice: "Rest, reduce screen time, stay hydrated. If severe or with other symptoms, consult doctor.",
    prevention: "Adequate sleep, reduce stress, stay hydrated, avoid excessive screen time",
    whenToWorry: "Sudden severe headache (thunderclap), with fever/stiff neck, vision changes, weakness",
    severity: "🟢 Low",
    category: "Pain"
  },
  "body pain": {
    condition: "Myalgia (Body Aches)",
    medicine: "Paracetamol 650mg, Rest, Warm compress",
    advice: "Rest adequately, stay hydrated, gentle stretching. Common with viral infections. If persistent, see doctor.",
    prevention: "Regular exercise, adequate sleep, maintain good posture",
    whenToWorry: "Severe weakness, high fever, difficulty moving, pain in chest",
    severity: "🟡 Moderate",
    category: "Pain"
  },
  "back pain": {
    condition: "Lower Back Pain",
    medicine: "Ibuprofen 400mg, Hot/cold compress, Gentle exercises",
    advice: "Maintain good posture, avoid heavy lifting, do stretching exercises. If pain radiates to legs, see doctor.",
    prevention: "Good posture, regular exercise, proper lifting techniques, maintain healthy weight",
    whenToWorry: "Pain radiating to legs, loss of bladder control, numbness, severe pain lasting weeks",
    severity: "🟡 Moderate",
    category: "Pain"
  },
  "joint pain": {
    condition: "Arthralgia (Joint Pain)",
    medicine: "Ibuprofen 400mg, Warm compress, Gentle movement",
    advice: "Rest the joint, apply warm compress, gentle exercises. If swelling or persistent pain, consult doctor.",
    prevention: "Maintain healthy weight, regular low-impact exercise, proper nutrition",
    whenToWorry: "Severe swelling, redness, fever, unable to move joint, persistent pain",
    severity: "🟡 Moderate",
    category: "Pain"
  },

  // General Symptoms
  "fatigue": {
    condition: "Extreme Tiredness/Fatigue",
    medicine: "Multivitamin, B-complex, Adequate rest",
    advice: "Ensure 7-8 hours sleep, eat nutritious food, stay hydrated. If persistent, check for anemia or other conditions.",
    prevention: "Regular sleep schedule, balanced diet, regular exercise, stress management",
    whenToWorry: "Extreme weakness, fainting, chest pain, unexplained weight loss",
    severity: "🟢 Low",
    category: "General"
  },
  "dizziness": {
    condition: "Vertigo/Dizziness",
    medicine: "Rest, Betahistine if prescribed, Stay hydrated",
    advice: "Sit or lie down immediately, avoid sudden movements. If frequent or severe, consult doctor to rule out ear/BP issues.",
    prevention: "Stay hydrated, avoid sudden position changes, manage blood pressure",
    whenToWorry: "Frequent episodes, with chest pain, severe headache, loss of consciousness",
    severity: "🟡 Moderate",
    category: "Neurological"
  },
  "weakness": {
    condition: "General Weakness",
    medicine: "ORS, Nutritious food, Iron/B12 supplements if deficient",
    advice: "Rest, eat balanced meals, check for anemia. If sudden weakness on one side, call emergency (could be stroke).",
    prevention: "Balanced diet, regular exercise, adequate sleep, manage chronic conditions",
    whenToWorry: "Sudden weakness on one side, difficulty speaking, vision changes, chest pain",
    severity: "🟡 Moderate",
    category: "General"
  },
  "loss of appetite": {
    condition: "Anorexia (Loss of Appetite)",
    medicine: "Eat small frequent meals, Multivitamin",
    advice: "Try favorite foods, eat with family, light exercise before meals. If prolonged with weight loss, see doctor.",
    prevention: "Regular meal times, pleasant eating environment, manage stress",
    whenToWorry: "Significant weight loss, vomiting, severe pain, fever, weakness",
    severity: "🟢 Low",
    category: "General"
  },
  "insomnia": {
    condition: "Sleep Disorder/Insomnia",
    medicine: "Avoid caffeine, Warm milk before bed, Melatonin if prescribed",
    advice: "Fixed sleep schedule, avoid screens before bed, relaxation techniques. If chronic, consult doctor.",
    prevention: "Regular sleep schedule, avoid caffeine/screens at night, relaxing bedtime routine",
    whenToWorry: "Affecting daily life, depression, extreme anxiety, sleep apnea symptoms",
    severity: "🟢 Low",
    category: "Mental Health"
  },

  // Skin Conditions
  "rash": {
    condition: "Skin Rash/Dermatitis",
    medicine: "Antihistamine (Cetirizine), Calamine lotion, Avoid scratching",
    advice: "Keep area clean and dry, avoid irritants. If spreading rapidly or with fever, see doctor immediately.",
    prevention: "Identify and avoid allergens, maintain skin hygiene, use mild soaps",
    whenToWorry: "Spreading rapidly, with fever, difficulty breathing, severe itching/pain",
    severity: "🟡 Moderate",
    category: "Skin"
  },
  "itching": {
    condition: "Pruritus (Itching)",
    medicine: "Antihistamine (Cetirizine 10mg), Calamine lotion",
    advice: "Avoid scratching, keep skin moisturized, wear loose cotton clothes. If persistent or severe, consult doctor.",
    prevention: "Moisturize skin, avoid harsh soaps, identify allergens",
    whenToWorry: "Severe itching affecting sleep, with rash/swelling, jaundice (yellow skin)",
    severity: "🟢 Low",
    category: "Skin"
  },
  "swelling": {
    condition: "Edema (Swelling)",
    medicine: "Elevate affected area, Reduce salt intake",
    advice: "Rest with limb elevated, avoid prolonged standing. If sudden or severe, especially face/throat, seek immediate help.",
    prevention: "Reduce salt, stay active, maintain healthy weight, avoid prolonged sitting/standing",
    whenToWorry: "Face/throat swelling, difficulty breathing, chest pain, sudden leg swelling with pain",
    severity: "🟡 Moderate",
    category: "General"
  },

  // Eye & Ear Conditions
  "eye pain": {
    condition: "Eye Pain/Irritation",
    medicine: "Artificial tears, Rest eyes, Avoid screens",
    advice: "Rest eyes, avoid rubbing, use eye drops. If with vision changes or severe pain, see doctor urgently.",
    prevention: "Limit screen time, good lighting, eye exercises, wear protective eyewear",
    whenToWorry: "Vision loss, severe pain, eye injury, foreign body, light sensitivity",
    severity: "🟡 Moderate",
    category: "Eye/Ear"
  },
  "ear pain": {
    condition: "Otalgia (Ear Pain)",
    medicine: "Paracetamol, Warm compress, Ear drops if prescribed",
    advice: "Avoid inserting objects in ear, keep dry. If with discharge or hearing loss, consult doctor.",
    prevention: "Keep ears dry, avoid cotton swabs in ear canal, treat colds promptly",
    whenToWorry: "Severe pain, discharge, hearing loss, fever, dizziness",
    severity: "🟡 Moderate",
    category: "Eye/Ear"
  },

  // Urinary Symptoms
  "burning urination": {
    condition: "Urinary Tract Infection (UTI)",
    medicine: "Drink plenty of water, Cranberry juice, Antibiotics (see doctor)",
    advice: "Drink 8-10 glasses water, urinate frequently, maintain hygiene. See doctor for antibiotic prescription.",
    prevention: "Stay hydrated, urinate after intercourse, wipe front to back, cotton underwear",
    whenToWorry: "Blood in urine, fever, back pain, severe burning, unable to urinate",
    severity: "🟡 Moderate",
    category: "Urinary"
  },
  "frequent urination": {
    condition: "Polyuria (Frequent Urination)",
    medicine: "Check blood sugar, Reduce caffeine, See doctor",
    advice: "Could indicate diabetes or UTI. Monitor frequency, check for other symptoms. Consult doctor for proper diagnosis.",
    prevention: "Limit caffeine/alcohol, manage diabetes if present, maintain bladder health",
    whenToWorry: "With excessive thirst, weight loss, burning, blood in urine",
    severity: "🟡 Moderate",
    category: "Urinary"
  },

  // Women's Health
  "menstrual cramps": {
    condition: "Dysmenorrhea (Period Pain)",
    medicine: "Ibuprofen 400mg, Hot water bottle, Rest",
    advice: "Apply heat to abdomen, gentle exercise, adequate rest. If severe or disabling, consult gynecologist.",
    prevention: "Regular exercise, healthy diet, stress management, adequate sleep",
    whenToWorry: "Severe debilitating pain, heavy bleeding, fever, pain between periods",
    severity: "🟢 Low",
    category: "Women's Health"
  },

  // Mental Health
  "anxiety": {
    condition: "Anxiety/Stress",
    medicine: "Deep breathing, Relaxation techniques, Counseling",
    advice: "Practice relaxation techniques, regular exercise, good sleep. If affecting daily life, consult mental health professional.",
    prevention: "Stress management, regular exercise, adequate sleep, social support",
    whenToWorry: "Panic attacks, suicidal thoughts, affecting daily functioning, physical symptoms",
    severity: "🟡 Moderate",
    category: "Mental Health"
  },
  "depression": {
    condition: "Depression",
    medicine: "Talk to mental health professional, Support groups",
    advice: "Seek professional help, stay connected with loved ones, regular exercise. Depression is treatable - don't hesitate to seek help.",
    prevention: "Social connections, regular exercise, stress management, adequate sleep",
    whenToWorry: "Suicidal thoughts, self-harm, unable to function, hopelessness",
    severity: "🔴 Critical",
    category: "Mental Health"
  },

  // Allergic Reactions
  "allergic reaction": {
    condition: "Allergic Reaction",
    medicine: "Antihistamine (Cetirizine 10mg), Remove allergen",
    advice: "Identify and avoid trigger, take antihistamine. If severe (difficulty breathing, face swelling), call emergency.",
    prevention: "Identify allergens, carry antihistamines, avoid known triggers",
    whenToWorry: "Difficulty breathing, face/throat swelling, rapid pulse, dizziness - CALL EMERGENCY",
    severity: "🔴 Critical",
    category: "Allergic"
  },

  // Dental
  "toothache": {
    condition: "Dental Pain",
    medicine: "Paracetamol, Clove oil, Salt water rinse",
    advice: "Rinse with warm salt water, avoid very hot/cold food, see dentist soon. Dental infections can spread.",
    prevention: "Brush twice daily, floss, regular dental checkups, avoid excessive sweets",
    whenToWorry: "Severe pain, swelling, fever, difficulty swallowing, pus",
    severity: "🟡 Moderate",
    category: "Dental"
  }
};

// Common symptoms for quick selection
const commonSymptoms = [
  "fever", "cough", "cold", "headache", "stomach pain", 
  "body pain", "sore throat", "diarrhea", "vomiting", "fatigue"
];

const SymptomChecker = () => {
  const [inputSymptom, setInputSymptom] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [symptomDuration, setSymptomDuration] = useState('');
  const [additionalSymptoms, setAdditionalSymptoms] = useState('');
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [historyLog, setHistoryLog] = useState([]);
  const [validationError, setValidationError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const speakAdvice = useCallback((text) => {
    if (!('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    synth.speak(utterance);
  }, []);

  const handleVoiceInput = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("🎤 Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    
    setValidationError('🎤 Listening... Please speak your symptom');

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setInputSymptom(spokenText);
      setValidationError('');
      handleSymptomInput(spokenText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setValidationError("❌ Failed to recognize voice. Please type the symptom manually.");
    };

    recognition.onend = () => {
      setValidationError('');
    };
  }, []);

  const handleSymptomInput = (value) => {
    setInputSymptom(value);
    
    if (value.length > 1) {
      const filtered = Object.keys(medicalData).filter(key =>
        key.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSymptom = (symptom) => {
    setInputSymptom(symptom);
    setShowSuggestions(false);
  };

  const performAssessment = () => {
    setValidationError('');
    
    if (!inputSymptom || !patientAge || !symptomDuration) {
      setValidationError("⚠️ Please fill all required fields (Symptom, Age, Duration)");
      setAssessmentResult(null);
      return;
    }

    const age = Number(patientAge);
    const duration = Number(symptomDuration);
    
    if (age < 0 || age > 120) {
      setValidationError("⚠️ Please enter a valid age (0-120 years)");
      return;
    }

    if (duration < 0) {
      setValidationError("⚠️ Please enter a valid duration (0 or more days)");
      return;
    }

    const key = inputSymptom.toLowerCase().trim();
    let data = medicalData[key];

    if (!data) {
      // Try partial match
      const partialMatch = Object.keys(medicalData).find(k => 
        k.includes(key) || key.includes(k)
      );
      
      if (partialMatch) {
        data = medicalData[partialMatch];
      } else {
        data = {
          condition: "⚠️ Symptom Not Recognized",
          medicine: "Please consult a doctor for proper diagnosis",
          advice: "This symptom is not in our database. We recommend consulting a healthcare professional for accurate diagnosis and treatment. Don't delay medical care for unexplained symptoms.",
          prevention: "Maintain overall health with balanced diet, exercise, and regular checkups",
          whenToWorry: "Any persistent or worsening symptoms should be evaluated by a doctor",
          severity: "❓ Unknown",
          category: "Unknown"
        };
      }
    }

    let calculatedSeverity = data.severity;
    let riskFactors = [];

    // Enhanced risk assessment
    if (age < 5) {
      riskFactors.push("Infant/Child - Higher risk");
      if (duration > 2 && !calculatedSeverity.includes("🔴")) {
        calculatedSeverity = "🔴 High Risk - Young age";
      }
    }

    if (age > 65) {
      riskFactors.push("Senior citizen - Requires monitoring");
      if (duration > 2 && !calculatedSeverity.includes("🔴")) {
        calculatedSeverity = "🔴 High Risk - Elderly";
      }
    }

    if (duration > 7) {
      riskFactors.push("Prolonged symptoms");
      if (calculatedSeverity === "🟢 Low") {
        calculatedSeverity = "🟡 Moderate - Duration concern";
      }
    }

    const resultData = {
      inputSymptom: inputSymptom.trim(),
      age,
      duration,
      additionalSymptoms: additionalSymptoms || "None reported",
      riskFactors: riskFactors.length > 0 ? riskFactors.join(", ") : "None identified",
      ...data,
      severity: calculatedSeverity,
      timestamp: new Date().toLocaleString()
    };

    setAssessmentResult(resultData);
    setHistoryLog([resultData, ...historyLog].slice(0, 10));

    // Voice feedback
    const speechText = `Assessment complete. Condition: ${resultData.condition}. Severity: ${resultData.severity}. Recommended action: ${resultData.medicine}`;
    speakAdvice(speechText);

    // Critical alert
    if (calculatedSeverity.includes("🔴")) {
      setTimeout(() => {
        alert("🚨 URGENT MEDICAL ATTENTION REQUIRED\n\n" + resultData.advice + "\n\nCall emergency services: 108 or 102");
      }, 500);
    }

    // Log to backend
    fetch("http://localhost:5000/log-symptom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resultData)
    })
    .then(res => res.json())
    .then(data => console.log("✅ Logged to backend", data))
    .catch(err => console.error("❌ Backend logging failed", err));
  };

  const clearForm = () => {
    setInputSymptom('');
    setPatientAge('');
    setSymptomDuration('');
    setAdditionalSymptoms('');
    setAssessmentResult(null);
    setValidationError('');
    setShowSuggestions(false);
  };

  return (
    <div className="symptom-checker-container">
      <header className="checker-header">
        <h1>🩺 PharmTrack AI Symptom Checker</h1>
        <p className="disclaimer">
          ⚠️ <strong>Medical Disclaimer:</strong> This is an informational tool only and does NOT replace professional medical advice. 
          Always consult a qualified healthcare provider for proper diagnosis and treatment.
        </p>
      </header>

      <div className="checker-layout">
        {/* Input Section */}
        <div className="input-section">
          <div className="card input-card">
            <h2>📋 Patient Information</h2>
            
            <div className="form-group">
              <label>Main Symptom *</label>
              <div className="input-with-voice">
                <input
                  type="text"
                  placeholder="e.g., headache, fever, cough..."
                  value={inputSymptom}
                  onChange={(e) => handleSymptomInput(e.target.value)}
                  onFocus={() => setShowSuggestions(suggestions.length > 0)}
                  className="text-input"
                />
                <button className="voice-btn" onClick={handleVoiceInput} title="Voice Input">
                  🎙️
                </button>
              </div>
              
              {showSuggestions && (
                <div className="suggestions-dropdown">
                  {suggestions.map((symptom, idx) => (
                    <div key={idx} className="suggestion-item" onClick={() => selectSymptom(symptom)}>
                      {symptom}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="quick-select">
              <label>Quick Select:</label>
              <div className="symptom-tags">
                {commonSymptoms.map((symptom, idx) => (
                  <button key={idx} className="symptom-tag" onClick={() => selectSymptom(symptom)}>
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Age (years) *</label>
                <input
                  type="number"
                  placeholder="Age"
                  min="0"
                  max="120"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  className="text-input"
                />
              </div>

              <div className="form-group">
                <label>Duration (days) *</label>
                <input
                  type="number"
                  placeholder="Days"
                  min="0"
                  value={symptomDuration}
                  onChange={(e) => setSymptomDuration(e.target.value)}
                  className="text-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Additional Symptoms (Optional)</label>
              <textarea
                placeholder="e.g., also feeling weak, have slight fever..."
                value={additionalSymptoms}
                onChange={(e) => setAdditionalSymptoms(e.target.value)}
                className="text-input"
                rows="3"
              />
            </div>

            {validationError && (
              <div className="error-message">{validationError}</div>
            )}

            <div className="button-group">
              <button className="btn-primary" onClick={performAssessment}>
                🔍 Check Symptoms
              </button>
              <button className="btn-secondary" onClick={clearForm}>
                🔄 Clear
              </button>
            </div>
          </div>
        </div>

        {/* Result Section */}
        <div className="result-section">
          {assessmentResult ? (
            <div className={`card result-card severity-${assessmentResult.severity.split(' ')[0].toLowerCase()}`}>
              <div className="result-header">
                <h2>📊 Assessment Result</h2>
                <span className={`severity-badge ${assessmentResult.severity.split(' ')[0].toLowerCase()}`}>
                  {assessmentResult.severity}
                </span>
              </div>

              <div className="patient-info">
                <p><strong>Symptom:</strong> {assessmentResult.inputSymptom}</p>
                <p><strong>Age:</strong> {assessmentResult.age} years | <strong>Duration:</strong> {assessmentResult.duration} day(s)</p>
                {assessmentResult.riskFactors !== "None identified" && (
                  <p className="risk-factors"><strong>⚠️ Risk Factors:</strong> {assessmentResult.riskFactors}</p>
                )}
              </div>

              <div className="diagnosis-section">
                <div className="info-box">
                  <h3>🏥 Likely Condition</h3>
                  <p className="highlight">{assessmentResult.condition}</p>
                </div>

                <div className="info-box">
                  <h3>💊 Recommended Action</h3>
                  <p>{assessmentResult.medicine}</p>
                </div>

                <div className="info-box">
                  <h3>📝 Medical Advice</h3>
                  <p>{assessmentResult.advice}</p>
                </div>

                <div className="info-box">
                  <h3>🛡️ Prevention Tips</h3>
                  <p>{assessmentResult.prevention}</p>
                </div>

                <div className="info-box warning-box">
                  <h3>⚠️ When to Seek Urgent Care</h3>
                  <p>{assessmentResult.whenToWorry}</p>
                </div>
              </div>

              <div className="action-buttons">
                <button className="btn-speak" onClick={() => speakAdvice(assessmentResult.advice)}>
                  🔊 Read Advice Aloud
                </button>
                <button className="btn-emergency" onClick={() => window.open('tel:108')}>
                  🚨 Call Emergency (108)
                </button>
              </div>
            </div>
          ) : (
            <div className="card placeholder-card">
              <div className="placeholder-content">
                <span className="placeholder-icon">🩺</span>
                <h3>Awaiting Input</h3>
                <p>Fill in the patient information on the left and click "Check Symptoms" to receive AI-powered health guidance.</p>
                <div className="info-grid">
                  <div className="info-item">
                    <strong>50+</strong>
                    <span>Symptoms Covered</span>
                  </div>
                  <div className="info-item">
                    <strong>24/7</strong>
                    <span>Available</span>
                  </div>
                  <div className="info-item">
                    <strong>Free</strong>
                    <span>Service</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History Log */}
      {historyLog.length > 0 && (
        <div className="history-section">
          <div className="card history-card">
            <h3>📜 Recent Assessments ({historyLog.length})</h3>
            <div className="history-list">
              {historyLog.map((item, idx) => (
                <div key={idx} className={`history-item severity-${item.severity.split(' ')[0].toLowerCase()}`}>
                  <div className="history-header">
                    <span className="history-time">{item.timestamp}</span>
                    <span className={`history-severity ${item.severity.split(' ')[0].toLowerCase()}`}>
                      {item.severity}
                    </span>
                  </div>
                  <div className="history-details">
                    <strong>{item.inputSymptom}</strong> → {item.condition}
                    <br />
                    <small>Age: {item.age} | Duration: {item.duration} day(s)</small>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-clear-history" onClick={() => setHistoryLog([])}>
              🗑️ Clear History
            </button>
          </div>
        </div>
      )}

      {/* Emergency Contact Card */}
      <div className="emergency-contacts">
        <div className="card emergency-card">
          <h3>🚨 Emergency Contacts</h3>
          <div className="contact-grid">
            <a href="tel:108" className="contact-item">
              <strong>108</strong>
              <span>Ambulance</span>
            </a>
            <a href="tel:102" className="contact-item">
              <strong>102</strong>
              <span>Medical Emergency</span>
            </a>
            <a href="tel:1075" className="contact-item">
              <strong>1075</strong>
              <span>COVID Helpline</span>
            </a>
            <a href="tel:104" className="contact-item">
              <strong>104</strong>
              <span>Health Helpline</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="footer-info">
        <div className="card info-card">
          <h3>ℹ️ Important Information</h3>
          <ul className="info-list">
            <li>✅ This tool provides general health information based on common symptoms</li>
            <li>✅ It is NOT a substitute for professional medical diagnosis or treatment</li>
            <li>✅ Always consult a qualified healthcare provider for medical concerns</li>
            <li>✅ In emergencies, call 108 or visit the nearest hospital immediately</li>
            <li>✅ Keep your vaccination records up to date</li>
            <li>✅ Maintain regular health checkups, especially if you have chronic conditions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;