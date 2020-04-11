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
      type: Boolean,
      default: false
    },
    family_diabetes_patient: {
      type: String,
      default: "Ninguno"
    },
    family_asthma: {
      type: Boolean,
      default: false
    },
    family_asthma_patient: {
      type: String,
      default: "Ninguno"
    },
    family_hypertension: {
      type: Boolean,
      default: false
    },
    family_hypertension_patient: {
      type: String,
      default: "Ninguno"
    },
    family_allergies: {
      type: Boolean,
      default: false
    },
    family_allergies_patient: {
      type: String,
      default: "Ninguno"
    },
    family_heart_disease: {
      type: Boolean,
      default: false
    },
    family_heart_disease_patient: {
      type: String,
      default: "Ninguno"
    },
    family_liver_disease: {
      type: Boolean,
      default: false
    },
    family_liver_disease_patient: {
      type: String,
      default: "Ninguno"
    },
    family_digestive_disease: {
      type: Boolean,
      default: false
    },
    family_digestive_disease_patient: {
      type: String,
      default: "Ninguno"
    },
    family_kidney_disease: {
      type: Boolean,
      default: false
    },
    family_kidney_disease_patient: {
      type: String,
      default: "Ninguno"
    },
    family_endocrin_disease: {
      type: Boolean,
      default: false
    },
    family_endocrin_disease_patient: {
      type: String,
      default: "Ninguno"
    },
    family_mental_disease: {
      type: Boolean,
      default: false
    },
    family_mental_disease_patient: {
      type: String,
      default: "Ninguno"
    },
    family_cancer: {
      type: Boolean,
      default: false
    },
    family_cancer_patient: {
      type: String,
      default: "Ninguno"
    },
    family_other_disease: {
      type: Boolean,
      default: false
    },
    family_other_disease_patient: {
      type: String,
      default: "Ninguno"
    },
    health_history: {
      type: Object,
    },
    procedure: {
      type: String
    },
    traumatisms: {
      type: String
    },
    hospitalizations: {
      type: String
    },
    others: {
      type: String
    },
    weekly_exercise_hours: {
      type: Number
    },
    addictions: {
      type: String,
    },
    allergies: {
      type: String,
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