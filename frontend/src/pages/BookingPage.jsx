import React, { useState, useEffect } from 'react';

const BookingPage = () => {
  // State 1: Form Inputs
  const [formData, setFormData] = useState({
    patientName: '',
    date: '',
    timeSlot: '09:00 AM - 09:30 AM',
    reason: ''
  });

  // State 2: Selected Doctor
  const [selectedDoctor, setSelectedDoctor] = useState('');

  // Auxiliary States for UX and Server lists
  const [doctorsList, setDoctorsList] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Fetch doctors dynamically from the backend for selection dropdown
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/doctors');
        if (response.ok) {
          const data = await response.json();
          setDoctorsList(data);
          if (data.length > 0) {
            setSelectedDoctor(data[0].name);
          }
        } else {
          throw new Error('Failed to load doctors list');
        }
      } catch (err) {
        console.error(err);
        // Fallback doctors list if backend offline
        const fallbacks = [
          { name: "Dr. Sarah Connor" },
          { name: "Dr. John Doe" },
          { name: "Dr. Alice Smith" },
          { name: "Dr. Robert Bruce" }
        ];
        setDoctorsList(fallbacks);
        setSelectedDoctor(fallbacks[0].name);
      }
    };
    fetchDoctors();
  }, []);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitSuccess(false);
    setSubmitError(null);

    const payload = {
      patientName: formData.patientName,
      doctorName: selectedDoctor,
      date: formData.date,
      timeSlot: formData.timeSlot,
      status: 'pending',
      reason: formData.reason
    };

    try {
      const response = await fetch('http://localhost:5000/api/v1/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to save appointment on server.');
      }

      setSubmitSuccess(true);
      // Reset form fields
      setFormData({
        patientName: '',
        date: '',
        timeSlot: '09:00 AM - 09:30 AM',
        reason: ''
      });
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || 'Error occurred while saving booking.');
    }
  };

  return (
    <div>
      <h2 className="page-title">Book an Appointment</h2>
      <p className="page-subtitle">Schedule a consultation with our qualified medical practitioners.</p>

      {submitSuccess && (
        <div className="booking-status-success">
          🎉 Appointment booked successfully! Visit the Home page to view it.
        </div>
      )}

      {submitError && (
        <div className="error-container" style={{ margin: '0 0 1.5rem 0' }}>
          <p className="error-title">Booking Failed</p>
          <p>{submitError}</p>
        </div>
      )}

      <div className="booking-container">
        {/* Booking Form Card */}
        <div className="booking-card">
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label className="form-label" htmlFor="patientName">Patient Full Name</label>
              <input
                id="patientName"
                name="patientName"
                type="text"
                className="form-input"
                placeholder="Enter patient's name"
                value={formData.patientName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="selectedDoctor">Select Doctor</label>
              <select
                id="selectedDoctor"
                className="form-select"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                required
              >
                {doctorsList.map((doc, idx) => (
                  <option key={idx} value={doc.name}>
                    {doc.name} {doc.specialisation ? `(${doc.specialisation})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="date">Consultation Date</label>
              <input
                id="date"
                name="date"
                type="date"
                className="form-input"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="timeSlot">Select Time Slot</label>
              <select
                id="timeSlot"
                name="timeSlot"
                className="form-select"
                value={formData.timeSlot}
                onChange={handleInputChange}
                required
              >
                <option value="09:00 AM - 09:30 AM">09:00 AM - 09:30 AM</option>
                <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                <option value="11:00 AM - 11:30 AM">11:00 AM - 11:30 AM</option>
                <option value="02:00 PM - 02:30 PM">02:00 PM - 02:30 PM</option>
                <option value="03:00 PM - 03:30 PM">03:00 PM - 03:30 PM</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reason">Reason for Visit (Optional)</label>
              <input
                id="reason"
                name="reason"
                type="text"
                className="form-input"
                placeholder="e.g. Annual physical exam"
                value={formData.reason}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" className="submit-btn">
              Confirm Appointment
            </button>
          </form>
        </div>

        {/* Real-time State Feedback Sidebar */}
        <div className="feedback-card">
          <h3>Form State Live Feedback</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
            Demonstrates real-time state tracking using React <code>useState</code> hooks.
          </p>
          
          <div className="feedback-item">
            <span className="feedback-label">Patient Name State:</span>
            <span style={{ marginLeft: '5px', fontWeight: 'bold', color: formData.patientName ? '#0f172a' : '#ef4444' }}>
              {formData.patientName || '(Waiting for input...)'}
            </span>
          </div>

          <div className="feedback-item">
            <span className="feedback-label">Selected Doctor State:</span>
            <span style={{ marginLeft: '5px', fontWeight: 'bold', color: '#0d9488' }}>
              {selectedDoctor || 'None'}
            </span>
          </div>

          <div className="feedback-item">
            <span className="feedback-label">Date Selected:</span>
            <span style={{ marginLeft: '5px', fontWeight: '500' }}>
              {formData.date || '(Not chosen)'}
            </span>
          </div>

          <div className="feedback-item">
            <span className="feedback-label">Time Slot:</span>
            <span style={{ marginLeft: '5px', fontWeight: '500' }}>
              {formData.timeSlot}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
