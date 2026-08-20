import React, { useState, useEffect } from 'react';

const DoctorsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch doctor info from backend server
        const response = await fetch('http://localhost:5000/api/v1/doctors');
        
        if (!response.ok) {
          throw new Error(`Server returned error status: ${response.status}`);
        }
        
        const json = await response.json();
        setData(json);
      } catch (err) {
        console.error("Fetch doctors error:", err);
        setError(err.message || "Failed to fetch doctors list. Please check if backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div>
      <h2 className="page-title">Medical Specialists</h2>
      <p className="page-subtitle">View our panel of expert doctors and check their live booking availability status.</p>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Retrieving medical specialists directory...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <p className="error-title">Database/Server Connection Error</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid-container">
          {data.map((doctor) => (
            <div key={doctor.id || doctor._id} className="doctor-card">
              <div className="doc-info">
                <h3>{doctor.name}</h3>
                <div className="doc-spec">{doctor.specialisation}</div>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Email: {doctor.email}</p>
              </div>
              <div className="doc-availability">
                <span className={`dot ${doctor.available ? 'available' : 'unavailable'}`}></span>
                <span style={{ fontWeight: '500', color: doctor.available ? '#065f46' : '#991b1b' }}>
                  {doctor.available ? 'Available' : 'Busy / Unavailable'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;
