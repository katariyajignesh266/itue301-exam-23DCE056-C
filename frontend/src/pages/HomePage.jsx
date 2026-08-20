import React, { useState, useEffect } from 'react';
import AppointmentCard from '../components/AppointmentCard';

const HomePage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/appointments');
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        console.error(err);
        setError('Could not connect to backend server. Using in-memory fallback list.');
        // Fallback mock data in case backend isn't started yet
        setAppointments([
          {
            patientName: "Jane Smith",
            doctorName: "Dr. Sarah Connor",
            date: "2026-08-22",
            timeSlot: "10:00 AM - 10:30 AM",
            status: "confirmed"
          },
          {
            patientName: "Robert Baratheon",
            doctorName: "Dr. Alice Smith",
            date: "2026-08-23",
            timeSlot: "11:30 AM - 12:00 PM",
            status: "pending"
          },
          {
            patientName: "Ned Stark",
            doctorName: "Dr. John Doe",
            date: "2026-08-21",
            timeSlot: "09:00 AM - 09:30 AM",
            status: "cancelled"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div>
      <div className="stats-banner">
        <div className="stats-intro">
          <h1>Welcome to MedCare Plus</h1>
          <p>Manage patients, coordinate doctor schedules, and track bookings seamlessly.</p>
        </div>
        <div className="stats-figures">
          <div className="stat-box">
            <div className="stat-number">{appointments.length}</div>
            <div className="stat-label">Appointments</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">4</div>
            <div className="stat-label">Doctors</div>
          </div>
        </div>
      </div>

      <h2 className="page-title">Current Bookings</h2>
      <p className="page-subtitle">A list of all patient appointments registered in the system.</p>

      {error && <p style={{ color: '#d97706', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '500' }}>⚠️ {error}</p>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading appointments...</p>
        </div>
      ) : (
        <div className="grid-container">
          {appointments.map((appointment, index) => (
            <AppointmentCard
              key={index}
              patientName={appointment.patientName}
              doctorName={appointment.doctorName}
              date={appointment.date}
              timeSlot={appointment.timeSlot}
              status={appointment.status}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
