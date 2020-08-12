const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['Paciente', 'Médico', 'Enfermería'],
      default: 'Paciente'
    },
    first_name: {
      type: String,
      default: 'Nombres'
    },
    last_name1: {
      type: String,
      default: 'Apellido Paterno'
    },
    last_name2: {
      type: String,
      default: 'Apellido Materno'
    },
    phone_number: {
      type: String,
    },
    zip_code: {
      type: String
    },
    curp: {
      type: String,
      default: '',
      maxlength: 18
    },
    date_of_birth: {
      type: String,
      default: Date.now
    },
    gender: {
      type: String,
      default: 'No especificado'
    },
    profile_picture: {
      type: String,
      default: 'https://cdn2.iconfinder.com/data/icons/social-media-flat-line/70/user-512.png'
    },
    marital_status: {
      type: String,
      default: ''
    },
    education_level: {
      type: String,
      default: ''
    },
    isProfileComplete: {
      type: Boolean,
      default: false
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    gaveConsent: {
      type: Boolean,
      default: false
    },
    last_login: {
      type: Date,
      default: Date.now
    },
    resetPasswordLink: {
      type: String,
      default: ''
    },
  },
  { timestamps: true }
);

module.exports = model('User', userSchema);