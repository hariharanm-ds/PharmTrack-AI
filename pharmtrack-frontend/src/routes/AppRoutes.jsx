import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import all your pages

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import Dashboard from '../pages/Dashboard';
import AIDoctor from '../pages/AIDoctor';
import ChartsDashboard from '../pages/ChartsDashboard';
import HealthTrack from '../pages/HealthTrack';
import Medicine from '../pages/Medicine';
import MedicineTracker from '../pages/MedicineTracker';
import ProfileSettings from '../pages/ProfileSettings';
import SymptomChecker from '../pages/SymptomChecker';
import LiveHospitals from '../pages/LiveHospitals';
import EmergencyHelp from '../pages/EmergencyHelp';





const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/charts" element={<ChartsDashboard />} />
      <Route path="/health" element={<HealthTrack />} />
      <Route path="/medicine" element={<Medicine />} />
      <Route path="/medicine-tracker" element={<MedicineTracker />} />
      <Route path="/profile" element={<ProfileSettings />} />
      <Route path="/symptom-checker" element={<SymptomChecker />} />
      <Route path="/live-hospitals" element={<LiveHospitals />} />
      <Route path="/emergency" element={<EmergencyHelp />} />
      <Route path="/aidoc" element={<AIDoctor />} />
    </Routes>
  );
};

export default AppRoutes;
