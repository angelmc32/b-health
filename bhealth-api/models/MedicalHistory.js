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
      type: Object,
    },
    health_history: {
      type: Object,
    },
    weekly_exercise_hours: {
      type: Number
    },
    addictions: {
      type: Object,
    },
    allergies: {
      type: Object,
    }
  },
  { timestamps: true }
);

module.exports = model('MedicalHistory', historySchema);