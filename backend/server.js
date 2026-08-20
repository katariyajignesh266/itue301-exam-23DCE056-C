const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

// Import Mongoose Models
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// ==========================================
// TASK 3: In-Memory Arrays Data Store
// ==========================================
const mockDoctors = [
  { id: 1, name: "Dr. Sarah Connor", email: "sarah.c@medcare.com", specialisation: "Cardiology", available: true },
  { id: 2, name: "Dr. John Doe", email: "john.doe@medcare.com", specialisation: "Neurology", available: false },
  { id: 3, name: "Dr. Alice Smith", email: "alice.s@medcare.com", specialisation: "Pediatrics", available: true },
  { id: 4, name: "Dr. Robert Bruce", email: "robert.b@medcare.com", specialisation: "Orthopedics", available: true }
];

const mockAppointments = [
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
];

// ==========================================
// TASK 3: Express REST Endpoints (In-Memory)
// ==========================================

// GET /api/v1/appointments - Return all appointments
app.get('/api/v1/appointments', (req, res) => {
  res.status(200).json(mockAppointments);
});

// POST /api/v1/appointments - Create a new appointment
app.post('/api/v1/appointments', (req, res, next) => {
  try {
    const { patientName, doctorName, date, timeSlot, status, reason } = req.body;

    if (!patientName || !doctorName || !date || !timeSlot) {
      const err = new Error("Patient name, doctor name, date, and time slot are required.");
      err.statusCode = 400;
      throw err;
    }

    const newAppointment = {
      patientName,
      doctorName,
      date,
      timeSlot,
      status: status || 'pending',
      reason: reason || ''
    };

    mockAppointments.push(newAppointment);
    res.status(201).json({
      success: true,
      message: "Appointment created successfully (in-memory).",
      appointment: newAppointment
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/doctors - Return all doctors
app.get('/api/v1/doctors', (req, res) => {
  res.status(200).json(mockDoctors);
});

// ==========================================
// TASK 5: MongoDB + Mongoose Schema Operations
// ==========================================

// Express route to perform sample database insertions & verify schema
app.post('/api/v1/mongodb/seed', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database not connected. Please check MONGO_URI in your .env");
    }

    // Clear existing data for demonstration safety
    await Patient.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});

    // 1. Create a Patient
    const patientObj = new Patient({
      name: "Harry Potter",
      email: "harry.potter@hogwarts.edu",
      phone: "+123456789",
      bloodGroup: "O+",
      age: 17
    });
    const patient = await patientObj.save();

    // 2. Create a Doctor
    const doctorObj = new Doctor({
      name: "Dr. Stephen Strange",
      email: "strange@santum.com",
      specialisation: "Neurosurgeon",
      available: true
    });
    const doctor = await doctorObj.save();

    // 3. Create an Appointment referencing Patient & Doctor
    const appointmentObj = new Appointment({
      patientId: patient._id,
      doctorId: doctor._id,
      date: new Date('2026-08-25'),
      timeSlot: "02:00 PM - 02:30 PM",
      status: "confirmed",
      reason: "Needs checkup after temporal anomalies."
    });
    const appointment = await appointmentObj.save();

    res.status(201).json({
      success: true,
      message: "Successfully seeded and demonstrated Mongoose Schema relationships!",
      data: { patient, doctor, appointment }
    });
  } catch (error) {
    next(error);
  }
});

// Route that deliberately triggers a validation failure to demonstrate handling
app.get('/api/v1/mongodb/test-validation', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database not connected. Please check MONGO_URI in your .env");
    }

    // Trigger schema validation failure by sending incorrect/missing values
    const invalidPatient = new Patient({
      name: "John Doe",
      email: "invalid-email", // triggers regex match validation
      bloodGroup: "Z-", // triggers bloodGroup enum validation
      age: -5 // triggers age min validation
    });

    await invalidPatient.save();
    res.json({ message: "Should not reach here if validation works" });
  } catch (error) {
    // Check if it's a Mongoose validation error
    if (error.name === 'ValidationError') {
      const formattedErrors = Object.keys(error.errors).reduce((acc, key) => {
        acc[key] = error.errors[key].message;
        return acc;
      }, {});

      return res.status(400).json({
        success: false,
        message: "Mongoose schema validation failed",
        errors: formattedErrors
      });
    }
    next(error);
  }
});

// Connect to MongoDB if MONGO_URI is set
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB Database.'))
    .catch(err => console.error('MongoDB database connection error:', err));
} else {
  console.log('No MONGO_URI provided in .env. Running Express in-memory mode only.');
}

// Global Error Handler Middleware (placed as the last middleware)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
