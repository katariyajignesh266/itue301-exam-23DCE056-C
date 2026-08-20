import React from 'react';

const AppointmentCard = ({ patientName, doctorName, date, timeSlot, status }) => {
  // Normalize status for class styling
  const statusClass = status ? status.toLowerCase() : 'pending';

  return (
    <div className={`appointment-card ${statusClass}`}>
      <div className="card-header">
        <div>
          <h3 className="patient-name">{patientName}</h3>
          <p className="doctor-name">with {doctorName}</p>
        </div>
        <span className={`status-badge ${statusClass}`}>
          {status}
        </span>
      </div>
      <div className="card-details">
        <div className="detail-item">
          <span className="detail-label">Date:</span>
          <span>{date}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Time Slot:</span>
          <span>{timeSlot}</span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
