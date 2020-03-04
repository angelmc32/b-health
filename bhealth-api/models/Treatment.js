const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const treatmentSchema = new Schema(
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
    study: {
      type: Schema.Types.ObjectId,
      ref: 'Prescription'
    }
  }
);

module.exports = model('Treatment', treatmentSchema);