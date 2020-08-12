const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const drugSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    prescription: {
      type: Schema.Types.ObjectId,
      ref: 'Prescription'
    },
    date_added: {
      type: Date,
    },
    start_date: {
      type: Date,
      default: null
    },
    end_date: {
      type: Date,
      default: null
    },
    name: {
      type: String,
      required: true
    },
    brand_name: {
      type: String,
      default: null
    },
    generic_name: {
      type: String,
      default: null
    },
    dosage: {
      type: String,
      default: null
    },
    dosage_units: {
      type: String,
      default: null
    },
    dosage_form: {
      type: String,
      default: null
    },
    shape: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: null
    },
    frequency: {
      type: String,
      default: null
    },
    times_per_day: {
      type: Number,
      default: null
    },
    schedule: {
      type: [String],
      default: null
    },
    quantity: {
      type: [Number],
      default: null
    },
    isCurrentTreatment: {
      type: Boolean,
      default: true
    },
    isSelfMedicated: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = model('Drug', drugSchema);