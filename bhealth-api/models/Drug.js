const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const drugSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    prescription: {
      type: Schema.Types.ObjectId,
      ref: 'Prescription'
    },
    brand_name: {
      type: String
    },
    generic_name: {
      type: String
    },
    dose: {
      type: String
    },
    dosage_form: {
      type: String
    },
  }
);

module.exports = model('Treatment', drugSchema);