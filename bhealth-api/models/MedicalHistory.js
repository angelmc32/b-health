const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const historySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    family_diabetes: {
      type: [Boolean],
      default: [false, false, false, false, false, false, false]
    },
    family_asthma: {
      type: [Boolean],
      default: [false, false, false, false, false, false, false]
    },
    family_hypertension: {
      type: [Boolean],
      default: [false, false, false, false, false, false, false]
    },
    family_allergies: {
      type: [Boolean],
      default: [false, false, false, false, false, false, false]
    },
    family_heart_disease: {
      type: [Boolean],
      default: [false, false, false, false, false, false, false]
    },
    family_liver_disease: {
      type: [Boolean],
      default: [false, false, false, false, false, false, false]
    },
    family_digestive_disease: {
      type: [Boolean],
      default: [false, false, false, false, false, false, false]
    },
    family_kidney_disease: {
      type: [Boolean],
      default: [false, false, false, false, false, false, false]
    },
    family_endocrin_disease: {
      type: [Boolean],
      default: [false, false, false, false, false, false, false]
    },
    family_mental_disease: {
      type: [Boolean],
      default: [false, false, false, false, false, false, false]
    },
    family_cancer: {
      type: [Boolean],
      default: [false, false, false, false, false, false, false]
    },
    family_other_disease: {
      type: [Boolean],
      default: [false, false, false, false, false, false, false]
    },
    health_history: {
      type: Object,
    },
    procedures: {
      type: [Object]
    },
    traumatisms: {
      type: [Object]
    },
    hospitalizations: {
      type: [Object]
    },
    others: {
      type: [String]
    },
    weekly_exercise_hours: {
      type: Number
    },
    addictions: {
      type: [String],
    },
    allergies: {
      type: [String],
    },
    alcoholism: {
      type: String,
    },
    smoking_status: {
      type: String,
    },
    nutritional_status: {
      type: String
    },
    sleep_status: {
      type: String
    },
    oral_hygiene: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = model('MedicalHistory', historySchema);