import React, { useState, useEffect } from 'react';
import './EmergencyHelp.css';

const EmergencyHelp = () => {
    const [emergencyContact, setEmergencyContact] = useState({
        name: '',
        phone: '',
        relation: '',
    });

    const [saved, setSaved] = useState(false);
    const [locationURL, setLocationURL] = useState('');

    // --- Utility Function: Cleans up phone number (removes spaces, dashes) ---
    const cleanPhoneNumber = (number) => {
        return number ? number.replace(/[^0-9+]/g, '') : '';
    };

    useEffect(() => {
        // Load saved emergency contact
        const savedContact = JSON.parse(localStorage.getItem('emergencyContact'));
        if (savedContact) {
            setEmergencyContact(savedContact);
            setSaved(true);
        }

        // --- FEATURE 4: Fix Malformed Location URL & Get Location ---
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lon = pos.coords.longitude;
                    // Correct Google Maps URL format
                    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
                    setLocationURL(mapsLink);
                },
                () => {
                    console.error("Geolocation access denied or unavailable.");
                    alert("❌ Please enable location access for emergency support.");
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 } // High accuracy settings
            );
        }
    }, []);

    const handleSaveContact = () => {
        // --- FEATURE 1: Safety Check/Data Scrubbing ---
        const cleanPhone = cleanPhoneNumber(emergencyContact.phone);
        
        if (emergencyContact.name && cleanPhone && emergencyContact.relation) {
            const contactToSave = { ...emergencyContact, phone: cleanPhone };
            localStorage.setItem('emergencyContact', JSON.stringify(contactToSave));
            setEmergencyContact(contactToSave);
            setSaved(true);
            alert('✅ Emergency contact saved!');
        } else {
            alert('❌ Please fill all fields with a valid phone number.');
        }
    };
    
    // --- FEATURE 3: Dedicated National Hotline Call ---
    const NATIONAL_EMERGENCY_NUMBER = "108"; // Ambulance/Police/Fire in India

    const handleCallNationalEmergency = () => {
        window.location.href = `tel:${NATIONAL_EMERGENCY_NUMBER}`;
    };

    const hospitals = [
        { name: "Govt Hospital, Kovilpatti", phone: "04632220033", address: "Main Rd, Kovilpatti" },
        { name: "Apollo Hospital, Madurai", phone: "04522580890", address: "KK Nagar, Madurai" },
        { name: "Private Clinic - Dr. Arjun", phone: "98943XXXXX", address: "South Street, Kovilpatti" },
    ];

    const emergencyNumbers = [
        { label: "🚑 Ambulance", number: "108" },
        { label: "👮 Police", number: "100" },
        { label: "🔥 Fire", number: "101" },
        { label: "📞 General Emergency", number: "112" },
    ];

    // --- FEATURE 2: Triage Data SMS Template ---
    const smsMessage = locationURL 
        ? `🚨 EMERGENCY! I am ${emergencyContact.name} (${emergencyContact.relation}). I need help immediately. My location: ${locationURL}`
        : `🚨 EMERGENCY! I am ${emergencyContact.name} (${emergencyContact.relation}). I need help immediately. Location is currently unavailable.`;


    return (
        <div className="emergency-container">
            <h2>🚨 Emergency Help</h2>

            {/* --- NEW: NATIONAL HOTLINE BUTTON --- */}
            <section className="national-hotline-section">
                <h3>🇮🇳 National Emergency Hotline</h3>
                <button 
                    className="national-hotline-button" 
                    onClick={handleCallNationalEmergency}
                >
                    📞 Call {NATIONAL_EMERGENCY_NUMBER} (Ambulance/Fire/Police)
                </button>
            </section>
            
            {/* 🔴 Panic Button Section */}
            <section className="panic-section">
                <h3>🔴 Call Trusted Contact</h3>
                {saved ? (
                    <a className="panic-button" href={`tel:${emergencyContact.phone}`}>
                        🚨 Call {emergencyContact.name}
                    </a>
                ) : (
                    <button className="panic-button disabled-button" onClick={() => alert('❗ Set an emergency contact first.')}>
                        🚨 Call Trusted Contact
                    </button>
                )}
                {saved && (
                    <p className="contact-info">
                        Will call: <strong>{emergencyContact.name}</strong> ({emergencyContact.relation}) – 📞 {emergencyContact.phone}
                        <button className="clear-button" onClick={() => {
                            localStorage.removeItem('emergencyContact');
                            setSaved(false);
                            setEmergencyContact({ name: '', phone: '', relation: '' });
                        }}>
                            Clear Contact
                        </button>
                    </p>
                )}
            </section>

            {/* 📍 Share Location Section */}
            {saved && (
                <section className="location-share">
                    <h3>📍 Share Location via Text</h3>
                    
                    {locationURL ? (
                        <div className="share-buttons">
                            <a
                                className="share-button whatsapp-button"
                                href={`https://wa.me/${emergencyContact.phone}?text=${encodeURIComponent(smsMessage)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                🟢 Send on WhatsApp
                            </a>
                            <a
                                className="share-button sms-button"
                                href={`sms:${emergencyContact.phone}?body=${encodeURIComponent(smsMessage)}`}
                            >
                                📩 Send via SMS
                            </a>
                        </div>
                    ) : (
                        <p className="location-unavailable">
                            🌍 **Location unavailable.** Check your device settings.
                        </p>
                    )}
                    
                    {locationURL && (
                        <p className="map-link-text">
                            🌍 Current Location: <a href={locationURL} target="_blank" rel="noopener noreferrer">View on Map</a>
                        </p>
                    )}
                </section>
            )}

            {/* 👤 Set Emergency Contact */}
            <section className="contact-setup">
                <h3>👤 Setup Trusted Contact</h3>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Name (e.g., Mom)"
                        value={emergencyContact.name}
                        onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value })}
                    />
                    <input
                        type="tel"
                        placeholder="Phone (e.g., 9876543210)"
                        value={emergencyContact.phone}
                        onChange={(e) => setEmergencyContact({ ...emergencyContact, phone: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Relation (e.g., Brother, Spouse)"
                        value={emergencyContact.relation}
                        onChange={(e) => setEmergencyContact({ ...emergencyContact, relation: e.target.value })}
                    />
                </div>
                <button onClick={handleSaveContact} className="save-button">
                    💾 {saved ? 'Update Contact' : 'Save Contact'}
                </button>
            </section>

            {/* 🏥 Hospitals and Quick Numbers remain the same, but with new styles */}
            <section className="hospital-section">
                <h3>🏥 Nearby Hospitals</h3>
                <ul className="hospital-list">
                    {hospitals.map((hosp, i) => (
                        <li key={i}>
                            <strong>{hosp.name}</strong><br />
                            📍 {hosp.address}<br />
                            📞 <a href={`tel:${hosp.phone}`}>{hosp.phone}</a>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="quick-numbers-section">
                <h3>📞 Quick Emergency Numbers</h3>
                <div className="emergency-grid">
                    {emergencyNumbers.map((e, i) => (
                        <a key={i} href={`tel:${e.number}`} className="number-card">
                            <span>{e.label}</span>
                            <strong>{e.number}</strong>
                        </a>
                    ))}
                </div>
            </section>

            {/* 📍 Map Button (Fixed URL) */}
            <section className="map-link">
                <a
                    className="map-button"
                    href="https://www.google.com/maps/search/hospitals+near+me"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    📍 Open Hospitals in Google Maps
                </a>
            </section>
        </div>
    );
};

export default EmergencyHelp;