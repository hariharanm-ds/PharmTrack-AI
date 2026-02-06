import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import Medicine from "./pages/Medicine";
import MedicineTracker from "./pages/MedicineTracker";
import AIDoctor from "./pages/AIDoctor";
import HealthTrack from "./pages/HealthTrack";
import EmergencyHelp from "./pages/EmergencyHelp";
import LiveHospitals from "./pages/LiveHospitals";
import ProfileSettings from "./pages/ProfileSettings";
import SymptomChecker from "./pages/SymptomChecker";

// Protect private routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("pharmtrack_token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/medicine" element={<PrivateRoute><Medicine /></PrivateRoute>} />
        <Route path="/medicinetracker" element={<PrivateRoute><MedicineTracker /></PrivateRoute>} />
        <Route path="/aidoctor" element={<PrivateRoute><AIDoctor /></PrivateRoute>} />
        <Route path="/healthtrack" element={<PrivateRoute><HealthTrack /></PrivateRoute>} />
        <Route path="/emergencyhelp" element={<PrivateRoute><EmergencyHelp /></PrivateRoute>} />
        <Route path="/livehospitals" element={<PrivateRoute><LiveHospitals /></PrivateRoute>} />
        <Route path="/profilesettings" element={<PrivateRoute><ProfileSettings /></PrivateRoute>} />
        <Route path="/symptomchecker" element={<PrivateRoute><SymptomChecker /></PrivateRoute>} />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
