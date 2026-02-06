import React, { useEffect, useState } from 'react';
import './LiveHospitals.css';

const LiveHospitals = () => {
  const [location, setLocation] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setLocation(coords);
          fetchHospitals(coords.lat, coords.lon);
        },
        () => setError('❌ Location permission denied'),
        { enableHighAccuracy: true }
      );
    } else {
      setError('❌ Geolocation not supported');
    }
  }, []);

  const fetchHospitals = async (lat, lon) => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=hospital&limit=10&lat=${lat}&lon=${lon}`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'PharmTrack/1.0 (your-email@example.com)', // required for some APIs
        },
      });
      const data = await response.json();
      setHospitals(data);
    } catch (err) {
      setError('❌ Error fetching hospitals');
    }
  };

  return (
    <div className="live-hospitals">
      <h2>🏥 Live Nearby Hospitals</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!error && hospitals.length === 0 && <p>Loading hospitals near you...</p>}
      <ul>
        {hospitals.map((hospital, index) => (
          <li key={index}>
            <strong>{hospital.display_name}</strong>
            <br />
            🌍 Lat: {hospital.lat}, Lon: {hospital.lon}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LiveHospitals;
