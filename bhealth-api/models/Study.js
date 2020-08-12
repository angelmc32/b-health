const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const studySchema = new Schema (
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
      required: true,
      default: Date.now
    },
    doctor: {
      type: String,
    },
    study_type: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: 'Sin imagen registrada'
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