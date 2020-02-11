const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const consultationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    doctor: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now,
      required: true
    },
    chief_complaint: {
      type: String,
      required: true,
    },
    systems_chief_complaint: {
      type: [String]
    },
    temperature: {
      type: Number
    },
    blood_pressure_sys: {
      type: Number
    },
    blood_pressure_dias: {
      type: Number
    },
    heart_rate: {
      type: Number
    },
    resp_rate: {
      type: Number
    },
    blood_sugar: {
      type: Number
    },
    isFasting: {
      type: Boolean
    },
    height: {
      type: Number
    },
    weight: {
      type: Number
    },
    phys_exam: {
      type: String,
      default: 'Sin observaciones en el examen físico'
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