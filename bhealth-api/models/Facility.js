const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const facilitySchema = new Schema(
  {
    facility_name: {
      type: String
    },
    facility_address: {
      type: String
    },
    facility_coordinates: {
      type: [Number]
    }
  },
  { timestamps: true }
);

module.exports = model('Facility', facilitySchema)