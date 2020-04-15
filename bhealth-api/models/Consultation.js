const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const consultationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    treatment: {
      type: Schema.Types.ObjectId,
      ref: 'Prescription'
    },
    vitals: {
      type: Schema.Types.ObjectId,
      ref: 'VitalSigns'
    },
    doctor: {
      type: String,
      required: true
    },
    doctor_specialty: {
      type: String,
      required: true
    },
    medical_facility: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now,
      required: true
    },
    time: {
      type: Date,
      default: Date.now,
      required: true
    },
    chief_complaint: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    diagnosis: {
      type: String,
    },
    prognosis: {
      type: String
    },
  },
  { timestamps: true }
);

module.exports = model('Consultation', consultationSchema)