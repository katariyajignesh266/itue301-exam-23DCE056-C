const mongoose = require('mongoose');
require('dotenv').config();

const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hospital_appointment_system';

async function runDemo() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully!');

    // Clean collection database before seed
    await Patient.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});
    console.log('\n--- Database Cleaned ---');

    // =============================================================
    // DEMO 1: Successful Operations demonstrating Schema & Reference
    // =============================================================
    console.log('\n--- DEMO 1: Successful Document Creation & Reference ---');
    
    // Create Patient
    const patientObj = new Patient({
      name: "Harry Potter",
      email: "harry.potter@hogwarts.edu",
      phone: "+1-555-987-6543",
      bloodGroup: "O+",
      age: 17
    });
    const patient = await patientObj.save();
    console.log('Patient created successfully:', {
      id: patient._id,
      name: patient.name,
      email: patient.email,
      bloodGroup: patient.bloodGroup
    });

    // Create Doctor
    const doctorObj = new Doctor({
      name: "Dr. Stephen Strange",
      email: "strange@santum.com",
      specialisation: "Neurosurgeon",
      available: true
    });
    const doctor = await doctorObj.save();
    console.log('Doctor created successfully:', {
      id: doctor._id,
      name: doctor.name,
      specialisation: doctor.specialisation
    });

    // Create Appointment (Referencing patientId and doctorId)
    const appointmentObj = new Appointment({
      patientId: patient._id,
      doctorId: doctor._id,
      date: new Date('2026-08-25'),
      timeSlot: "02:00 PM - 02:30 PM",
      status: "confirmed",
      reason: "Needs checkup after temporal anomalies."
    });
    const appointment = await appointmentObj.save();
    console.log('Appointment created successfully:', {
      id: appointment._id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      status: appointment.status,
      reason: appointment.reason
    });

    // Fetch and populate references to verify working relationships
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId')
      .populate('doctorId');

    console.log('\nPopulated Appointment Details from DB:');
    console.log(`- Patient Name: ${populatedAppointment.patientId.name}`);
    console.log(`- Doctor Name: ${populatedAppointment.doctorId.name}`);
    console.log(`- Specialisation: ${populatedAppointment.doctorId.specialisation}`);
    console.log(`- Date & Time: ${populatedAppointment.date.toDateString()} at ${populatedAppointment.timeSlot}`);

    // =============================================================
    // DEMO 2: Validation Failures
    // =============================================================
    console.log('\n--- DEMO 2: Validation Failure Tests ---');

    // Test 1: Invalid Patient (missing required field, invalid blood group, invalid email format, negative age)
    try {
      console.log('1. Attempting to create an invalid Patient...');
      const invalidPatient = new Patient({
        // missing 'name'
        email: "not-a-valid-email",
        bloodGroup: "Z-", // invalid enum value
        age: -10 // invalid minimum value
      });
      await invalidPatient.save();
    } catch (err) {
      if (err.name === 'ValidationError') {
        const formattedErrors = Object.keys(err.errors).reduce((acc, key) => {
          acc[key] = err.errors[key].message;
          return acc;
        }, {});
        console.log('❌ Patient Validation Failed as Expected:');
        console.log(JSON.stringify(formattedErrors, null, 2));
      } else {
        console.error('Unexpected error:', err);
      }
    }

    // Test 2: Invalid Appointment (missing date, status enum error, too long reason)
    try {
      console.log('\n2. Attempting to create an invalid Appointment...');
      const longReason = "a".repeat(301); // 301 chars (exceeds 300)
      const invalidAppointment = new Appointment({
        patientId: patient._id,
        doctorId: doctor._id,
        // missing 'date'
        timeSlot: "10:00 AM",
        status: "super-confirmed", // invalid enum value
        reason: longReason // too long reason
      });
      await invalidAppointment.save();
    } catch (err) {
      if (err.name === 'ValidationError') {
        const formattedErrors = Object.keys(err.errors).reduce((acc, key) => {
          acc[key] = err.errors[key].message;
          return acc;
        }, {});
        console.log('❌ Appointment Validation Failed as Expected:');
        console.log(JSON.stringify(formattedErrors, null, 2));
      } else {
        console.error('Unexpected error:', err);
      }
    }

  } catch (err) {
    console.error('Fatal execution error in script:', err);
  } finally {
    console.log('\nDisconnecting from database...');
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

runDemo();
