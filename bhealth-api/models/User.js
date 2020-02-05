const mongoose = require('mongoose');   // Require mongoose to create model schema
const { Schema, model } = mongoose;     // Destructure Schema and model from mongoose

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
    curp: {
      type: String,
      default: '',
      maxlength: 18
    },
    date_of_birth: {
      type: Date,
      default: Date.now
    },
    gender: {
      type: String,
      enum: ['F','M','N'],
      default: 'N'
    },
    profile_picture: {
      type: String,
      default: 'https://cdn2.iconfinder.com/data/icons/social-media-flat-line/70/user-512.png'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    last_login: {
      type: Date,
      default: Date.now
    },
  },
  { timestamps: true }
);

module.exports = model('User', userSchema);