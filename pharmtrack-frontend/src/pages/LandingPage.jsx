import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { 
      icon: '🩺', 
      title: 'AI Symptom Checker', 
      description: 'Get immediate guidance on symptoms and recommended next steps for your health concerns.' 
    },
    { 
      icon: '💊', 
      title: 'Medicine Tracker', 
      description: 'Never miss a dose. Log prescriptions, set reminders, and check drug interactions easily.' 
    },
    { 
      icon: '🚨', 
      title: 'Emergency Alerts', 
      description: 'Receive critical warnings for severe symptoms and contact emergency services instantly.' 
    },
  ];

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header">
        <div className="logo">
          <span className="logo-icon">⚕️</span>
          <span className="logo-text">PharmTrack AI</span>
        </div>
        <div className="header-buttons">
          <button className="login-btn" onClick={() => navigate('/login')}>
            Login
          </button>
          <button className="signup-btn" onClick={() => navigate('/signup')}>
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="main-heading">
            Welcome to <span className="brand-name">PharmTrack AI</span>
          </h1>
          <h2 className="sub-heading">Intelligent Health Guidance</h2>
          <p className="description">
            Your friendly AI assistant for emergency health guidance, medicine tracking, 
            and personal health management. Simple, fast, and reliable healthcare support.
          </p>
          <button className="cta-button" onClick={() => navigate('/signup')}>
            Get Started Free →
          </button>
        </div>
        <div className="hero-image">
          <span className="hero-icon">🏥</span>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h3 className="features-title">Our Core Features</h3>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h4 className="feature-title">{feature.title}</h4>
              <p className="feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h3 className="cta-heading">Ready to Take Control of Your Health?</h3>
        <p className="cta-text">Join thousands of users managing their health with AI assistance</p>
        <button className="cta-button-large" onClick={() => navigate('/signup')}>
          Create Free Account
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p className="footer-text">© 2025 PharmTrack AI. Your Health, Our Priority.</p>
      </footer>
    </div>
  );
};

export default LandingPage;