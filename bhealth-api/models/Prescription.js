const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const prescriptionSchema = new Schema (
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
      default: 'Sin imagen registrada'
    },
    drugs: [{
      name: String,
      dosage_form: String,
      start_date: Date,
      end_date: Date,
      periodicity: String,
      directions: String
    }],
    // brand_name: {
    //   type: [String]
    // },
    // generic_name: {
    //   type: [String]
    // },
    // dose: {
    //   type: [String]
    // },
    // dosage_form: {
    //   type: [String]
    // },
    // directions: {
    //   type: [String]
    // }
  },
  { timestamps: true }
);

module.exports = model('Prescription', prescriptionSchema);