const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const emergencySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    treatment: {
      type: Schema.Types.ObjectId,
      ref: 'Treatment',
      default: null
    },
    date: {
      type: Date,
      default: Date.now
    },
    chief_complaint: {
      type: String,
      required: true
    },
    diagnosis: {
      type: String,
    },
    doctor: {
      type: String,
      required: true
    },
    doctor_specialty: {
      type: String,
      required: true
    },
    facility_name: {
      type: String,
    },
    description: {
      type: String
    },
  },
  { timestamps: true }
);

module.exports = model('Emergency', emergencySchema)