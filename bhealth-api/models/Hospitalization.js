const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const hospitalizationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    },
    facility_name: {
      type: String
    },
    facility_address: {
      type: String
    },
    facility_coordinates: {
      type: [Number]
    },
    chief_complaint: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    is_emergency: {
      type: Boolean,
      required: true
    },
    
  },
  { timestamps: true }
);

module.exports = model('Hospitalization', hospitalizationSchema)