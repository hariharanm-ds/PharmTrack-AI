import React, { useState } from "react";
import './ProfileSettings.css';

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    // General Profile
    name: "Hariharan M",
    email: "hariharan@example.com",
    age: "21",
    gender: "Male",
    location: "Kovilpatti, Tamil Nadu",
    
    // Medical Profile (NEW)
    bloodGroup: "O+",
    allergies: "Penicillin, Dust",
    medications: "Lisinopril (5mg), Vitamin D",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send profile and image data to a server here.
    alert("✅ Profile and Medical ID updated successfully!");
    console.log("Updated Profile:", profile, "Image File:", image);
  };

  return (
    <div className="profile-settings-container">
      <div className="profile-card">
        <div className="card-header">
          <h2>👤 My Profile & Medical ID</h2>
        </div>

        {/* Profile Picture Section */}
        <div className="profile-pic-section">
          <label htmlFor="profile-pic">
            <div className="profile-pic-wrapper">
              <img
                src={preview || "https://via.placeholder.com/120"} // Use a generic placeholder
                alt="Profile Preview"
                className="profile-img"
              />
              <div className="upload-overlay">📷 Change</div>
            </div>
          </label>
          <input
            type="file"
            id="profile-pic"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
            
            {/* --- SECTION 1: GENERAL INFORMATION --- */}
            <div className="form-section">
                <h3>General Information</h3>
                <div className="form-group-grid">
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            required
                            disabled // Email usually can't be changed here
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Age</label>
                        <input
                            type="number"
                            name="age"
                            value={profile.age}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Gender</label>
                        <select
                            name="gender"
                            value={profile.gender}
                            onChange={handleChange}
                        >
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div className="form-group full-width">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={profile.location}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
            
            {/* --- SECTION 2: MEDICAL ID (NEW) --- */}
            <div className="form-section medical-section">
                <h3>Medical ID (Emergency Data)</h3>
                <div className="form-group-grid">
                    
                    <div className="form-group">
                        <label>🩸 Blood Group</label>
                        <select
                            name="bloodGroup"
                            value={profile.bloodGroup}
                            onChange={handleChange}
                        >
                            <option>A+</option><option>A-</option>
                            <option>B+</option><option>B-</option>
                            <option>AB+</option><option>AB-</option>
                            <option>O+</option><option>O-</option>
                            <option>Unknown</option>
                        </select>
                    </div>
                    
                    <div className="form-group full-width">
                        <label>⚠️ Known Allergies</label>
                        <textarea
                            name="allergies"
                            placeholder="e.g., Penicillin, Peanuts, Dust (separate by comma)"
                            value={profile.allergies}
                            onChange={handleChange}
                            rows="2"
                        ></textarea>
                    </div>

                    <div className="form-group full-width">
                        <label>💊 Current Medications</label>
                        <textarea
                            name="medications"
                            placeholder="e.g., Lisinopril (5mg), Metformin (500mg) - include dosage"
                            value={profile.medications}
                            onChange={handleChange}
                            rows="3"
                        ></textarea>
                    </div>
                </div>
            </div>

          <button type="submit" className="save-btn">
            💾 Save Profile & Medical ID
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;