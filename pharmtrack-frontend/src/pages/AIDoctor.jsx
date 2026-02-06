import React, { useState, useRef, useEffect, useCallback } from "react";
import "./AIDoctor.css"; 

// ⚠️ IMPORTANT: Replace this with your actual backend URL when deploying
const API_ENDPOINT = "http://127.0.0.1:5000/ask"; 

// --- MOCK API FALLBACK FUNCTION ---
const mockApiCall = (question) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Use the full question for better mock analysis
      const lowerQ = question.toLowerCase();
      let answer;
      
      if (lowerQ.includes("chest pain") || lowerQ.includes("shortness of breath") || lowerQ.includes("emergency")) {
        answer = "🚨 **URGENT WARNING:** For severe chest pain or shortness of breath, **you must call emergency services (e.g., 911/112) immediately.** I am an AI and cannot replace critical in-person care.";
      } else if (lowerQ.includes("fever") && !lowerQ.includes("question")) {
        // Mocking a better response for the "i have a fever" scenario
        answer = "Fever often indicates your body is fighting an infection. You should rest, stay hydrated, and consider taking **Acetaminophen or Ibuprofen** if the fever is causing discomfort. If it persists above 103°F or lasts more than 48 hours, please consult a physician.";
      } else if (lowerQ.includes("headache") || lowerQ.includes("fever")) {
        answer = "For a persistent headache and fever, it is generally advised to take **Acetaminophen (Paracetamol)** and rest in a quiet, dark room. If symptoms worsen or last over 48 hours, please consult a physician immediately.";
      } else if (lowerQ.includes("diet") || lowerQ.includes("nutrition")) {
        answer = "Proper diet is essential for recovery. Ensure a balance of proteins, complex carbohydrates, and healthy fats. Focus heavily on hydration and fresh vegetables.";
      } else if (lowerQ.includes("consult") || lowerQ.includes("doctor")) {
        answer = "I am an AI assistant and **cannot provide a formal medical diagnosis**. Please seek in-person consultation for any serious or worsening symptoms.";
      } else {
        answer = "Thank you for sharing. I'm processing your inquiry. Please note that I provide **general health advice** and recommend seeking a professional diagnosis for specific concerns.";
      }
      resolve({ answer });
    }, 1200);
  });
};
// ------------------------------------

function AIDoctor() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Welcome to **PharmTrack AI**. I am your Health Triage Assistant. How can I assist you with your health query today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [severityAlert, setSeverityAlert] = useState(null);
  const chatEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Logic to check AI response for critical keywords and set alert
  const checkSeverity = (response) => {
    const criticalWords = ["emergency", "call 911", "call 112", "immediate medical", "urgent warning", "must consult", "critical"];
    // Ensure response is a string before calling toLowerCase
    const text = String(response || "").toLowerCase(); 
    
    if (criticalWords.some(word => text.includes(word))) {
      // Set a persistent critical alert
      setSeverityAlert("🚨 CRITICAL WARNING: Immediate medical attention required. Please read the AI's advice carefully.");
      
      // Auto-speak the warning for accessibility
      if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance("Critical Warning: Immediate medical attention required.");
        synth.speak(utterance);
      }
    } else {
      // Set a transient info alert
      setSeverityAlert("✅ Response received. Remember to consult a medical professional for diagnosis.");
      setTimeout(() => setSeverityAlert(null), 8000); // Clear after 8 seconds
    }
  };


  // =======================================================
  // 💡 FIX: handleSend MUST be defined FIRST
  // =======================================================
  // Handle the API call logic
  const handleSend = useCallback(async (voiceInput = null) => {
    const userMessageText = voiceInput !== null ? voiceInput : input.trim();
    if (!userMessageText || isTyping) return;

    const userMessage = { sender: "user", text: userMessageText };
    
    // 1. Update UI with user message and enable typing indicator
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setSeverityAlert(null); // Clear previous alert

    // 💡 FIX: PROMPT ENGINEERING for quality improvement (BioGPT fix)
    const engineeredQuestion = 
        `Question: ${userMessageText}. Provide a concise medical summary or recommendation. Answer:`;
    
    let aiResponse;
    
    try {
      // 2. Try the actual backend API call
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send the engineered question to the backend
        body: JSON.stringify({ 
            question: engineeredQuestion,
            // 💡 Recommended parameters for factual chat responses (overriding Flask defaults)
            max_new_tokens: 128,         
            temperature: 0.5,            
            top_p: 0.85
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Access the answer correctly from the Flask API structure { answers: ["..."] }
      aiResponse = data.answers && data.answers.length > 0 
                   ? data.answers[0] 
                   : "I couldn't generate a specific answer. Please try rephrasing your question.";

    } catch (error) {
      console.error("Backend Error:", error);
      
      // 3. Fallback to Mock API if backend fails
      // Pass the ORIGINAL question (userMessageText) for the mock to analyze
      aiResponse = "🔄 **Fallback Mode Activated**: The primary API is unreachable. Using simulated response.\n\n"
                  + (await mockApiCall(userMessageText)).answer;
    }
    
    // 4. Update UI with AI response and disable typing indicator
    const aiMessage = { sender: "ai", text: aiResponse };
    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
    
    // --- FEATURE 2: Severity Check ---
    setTimeout(() => checkSeverity(aiResponse), 100); 

  }, [input, isTyping]); 

  // =======================================================
  // --- FEATURE 1: Speech-to-Text Input --- (Now defined second)
  // =======================================================
  const handleVoiceInput = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    setIsListening(true);
    setInput('');

    recognition.start();

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setInput(spokenText);
      setIsListening(false);
      
      // Calls the now-initialized handleSend
      setTimeout(() => {
        if (spokenText.trim()) handleSend(spokenText);
      }, 50);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      alert("Could not recognize voice. Please try again.");
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
  }, [handleSend]); // This dependency is now correctly initialized
  
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // --- FEATURE 3: Chat Clearing Functionality ---
  const handleClearChat = () => {
      setMessages([
          {
            sender: "ai",
            text: "👋 Welcome to **PharmTrack AI**. I am your Health Triage Assistant. How can I assist you with your health query today?",
          },
      ]);
      setSeverityAlert(null);
      setInput('');
  };


  return (
    <div className="chat-container professional">
      {/* Header (Top Bar) */}
      <div className="chat-header">
        <span className="header-icon">🩺</span> 
        <span className="brand-name">PharmTrack</span> AI Triage
        <button 
            onClick={handleClearChat} 
            className="clear-chat-button" 
            title="Start New Conversation"
            disabled={messages.length <= 1}
        >
            <span role="img" aria-label="restart">🔄</span> New Chat
        </button>
      </div>

      {/* --- FEATURE 2: Severity Alert Display --- */}
      {severityAlert && (
          <div className={`severity-alert-bar ${severityAlert.includes("CRITICAL") ? 'critical' : 'info'}`}>
              {severityAlert}
          </div>
      )}

      {/* Chat Window */}
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message-row ${msg.sender === "user" ? "user-row" : "ai-row"}`}
          >
            <div className={`chat-bubble ${msg.sender === "user" ? "user" : "ai"}`}>
              {/* Simple inline markdown for bold text */}
              {msg.text.split('**').map((part, i) => (
                  i % 2 === 1 ? <strong key={i}>{part}</strong> : part
              ))}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="chat-message-row ai-row">
            <div className="chat-bubble ai typing">
              <span className="dot"></span><span className="dot"></span><span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Section (Bottom Bar) */}
      <div className="chat-input-bar">
        {/* Voice Input Button */}
        <button 
            onClick={handleVoiceInput} 
            disabled={isTyping} 
            className={`voice-input-button ${isListening ? 'listening' : ''}`}
            title={isListening ? "Listening..." : "Speak your question"}
        >
            {isListening ? "🔴" : "🎙️"}
        </button>
        
        <input
          type="text"
          value={input}
          placeholder={isListening ? "Listening now..." : isTyping ? "Awaiting response..." : "Type your health query here..."}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping || isListening}
        />
        <button 
            onClick={() => handleSend()} 
            disabled={isTyping || !input.trim() || isListening}
            className="send-button"
        >
          {isTyping ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default AIDoctor;