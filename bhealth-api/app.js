require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

// cors package to allow cross-origin resource sharing (CORS) between front-end and back-end
const cors         = require('cors');

const localDB      = 'mongodb://localhost/bhealth-api';
const cloudDB      = process.env.DB;


mongoose
  .connect(cloudDB, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// cors package config to allow requests from the url's in the origin array
app.use(
  cors({
    origin: ['https://nubiomed-iron.herokuapp.com', 'http://localhost:3001', 'http://nubiomed-iron.herokuapp.com']
  })
);

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'B-health API by Mel';

// Routes declaration
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const consultationRoutes = require('./routes/consultation-routes');
const emergencyRoutes = require('./routes/emergency-routes');
const hospitalizationRoutes = require('./routes/hospitalization-routes');
const medicalHistoryRoutes = require('./routes/medhistory-routes');
const prescriptionRoutes = require('./routes/prescription-routes');

app.use('/api', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/emergencies', emergencyRoutes);
app.use('/api/hospitalizations', hospitalizationRoutes);
app.use('/api/medicalhistory', medicalHistoryRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

module.exports = app;
