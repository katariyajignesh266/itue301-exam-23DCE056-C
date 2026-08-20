const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Patient name is required']
  },
  email: {
    type: String,
    required: [true, 'Patient email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  phone: {
    type: String,
    default: ''
  },
  bloodGroup: {
    type: String,
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: 'Invalid blood group. Allowed: A+, A-, B+, B-, AB+, AB-, O+, O-'
    }
  },
  age: {
    type: Number,
    min: [0, 'Age cannot be negative']
  }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
