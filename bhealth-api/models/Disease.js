const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const diseaseSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    consultations: {
      type: [Schema.Types.ObjectId], 
      ref: 'Consultation'
    },
    treatment: {
      type: Schema.Types.ObjectId, 
      ref: 'Treatment'
    },
    isCurrent: {
      type: Boolean,
      required: true,
      default: false
    },
    date_diagnosed: {
      type: Date,
      required: true
    },
    date_ended: {
      type: Date
    },
    isChronic: {
      type: Boolean,
      default: false
    },
  },
  { timestamps: true }
);

module.exports = model('Disease', diseaseSchema);