const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const studySchema = new Schema (
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    consultation: {
      type: Schema.Types.ObjectId,
      ref: 'Consultation'
    },
    date: {
      type: Date,
      default: Date.now
    },
    doctor: {
      type: String,
    },
    image: {
      type: String,
    },
    study_name: {
      type: String
    },
    facility_name: {
      type: String
    },
  },
  { timestamps: true }
);

module.exports = model('Study', studySchema);