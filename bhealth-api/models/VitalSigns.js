const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const vitalsSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    consultation: {
      type: Schema.Types.ObjectId,
      ref: 'Consultation'
    },
    date: {
      type: Date,
      default: Date.now,
      required: true
    },
    temperature: {
      type: Number,
      default: null
    },
    blood_pressure_sys: {
      type: Number,
      default: null
    },
    blood_pressure_dias: {
      type: Number,
      default: null
    },
    heart_rate: {
      type: Number,
      default: null
    },
    resp_rate: {
      type: Number,
      default: null
    },
    spo2: {
      type: Number,
      default: null
    },
    blood_sugar: {
      type: Number,
      default: null
    },
    isFasting: {
      type: Boolean,
      default: null
    },
    height: {
      type: Number,
      default: null
    },
    weight: {
      type: Number,
      default: null
    },
  },
  { timestamps: true }
);

module.exports = model('VitalSigns', vitalsSchema)