const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const historySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    family_history: {
      type: [String],
    },
    health_history: {
      type: [String],
    },
    weekly_exercise_hours: {
      type: Number
    },
    addictions: {
      type: [String],
    },
    allergies: {
      type: [String],
    }
  },
  { timestamps: true }
);

module.exports = model('MedicalHistory', historySchema);