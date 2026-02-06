import React, { useState } from 'react';
import './Medicine.css';

const Medicine = () => {
  const [medicineData, setMedicineData] = useState({
    name: '',
    dosage: '',
    frequency: ''
  });

  const [submitted, setSubmitted] = useState(null);

  const handleChange = (e) => {
    setMedicineData({
      ...medicineData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(medicineData);
    setMedicineData({ name: '', dosage: '', frequency: '' });
  };

  return (
    <div className="medicine-container">
      <h1>💊 Medicine Tracker</h1>
      <form className="medicine-form" onSubmit={handleSubmit}>
        <label>
          Medicine Name
          <input
            type="text"
            name="name"
            value={medicineData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Dosage (e.g., 500mg)
          <input
            type="text"
            name="dosage"
            value={medicineData.dosage}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Frequency (e.g., Twice a day)
          <input
            type="text"
            name="frequency"
            value={medicineData.frequency}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Add Medicine</button>
      </form>

      {submitted && (
        <div className="medicine-output">
          <h3>🧾 Latest Medicine Entry</h3>
          <p><strong>Name:</strong> {submitted.name}</p>
          <p><strong>Dosage:</strong> {submitted.dosage}</p>
          <p><strong>Frequency:</strong> {submitted.frequency}</p>
        </div>
      )}
    </div>
  );
};

export default Medicine;
