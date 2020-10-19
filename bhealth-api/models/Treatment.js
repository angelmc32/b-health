const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const treatmentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
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
      required: true,
      unique: true
    },
    description: {
      type: String,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    drugs: [{
      name: String,
      dosage_form: String,
      duration_number: Number,
      duration_units: String,
      days: Number,
      directions: String
    }],
    extra_instructions: {
      type: [String],
      default: null
    },
  }
);

module.exports = model('Treatment', treatmentSchema);