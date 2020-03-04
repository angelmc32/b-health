const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const hospitalizationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    treatment: {
      type: Schema.Types.ObjectId,
      ref: 'Treatment'
    },
    admission_date: {
      type: Date,
      default: Date.now
    },
    discharge_date: {
      type: Date,
    },
    length_of_stay: {
      type: Number,
    },
    chief_complaint: {
      type: String,
      required: true
    },
    diagnosis: {
      type: String,
    },
    facility_name: {
      type: String,
    },
    description: {
      type: String
    },
    isSurgery: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = model('Hospitalization', hospitalizationSchema)