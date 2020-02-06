const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const prescriptionSchema = new Schema (
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    },
    brand_name: {
      type: [String]
    },
    generic_name: {
      type: [String]
    },
    dose: {
      type: [String]
    },
    dosage_form: {
      type: [String]
    },
    directions: {
      type: [String]
    }
  },
  { timestamps: true }
);

module.exports = model('Prescription', prescriptionSchema);