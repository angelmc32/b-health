const express = require('express');
const router = express.Router();
const MedicalHistory = require('../models/MedicalHistory');

// Import helper for token verification (jwt)
const { verifyToken } = require('../helpers/auth-helper');

router.get('/', verifyToken, (req, res, next) => {

  const { id } = req.user;    // Destructure the user id from the request

  MedicalHistory.findOne({ user: id })
  .then( medicalHistory => {

    res.status(200).json({ medicalHistory });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

router.post('/', verifyToken, (req, res, next) => {

  const { id } = req.user;

  MedicalHistory.create({ ...req.body, user: id })
  .then( medicalHistory => {

    res.status(200).json({ medicalHistory });

  })
  .catch( error => {

    console.log(error)
    console.log(req.body)
    res.status(500).json({ error, msg: 'Unable to create medicalHistory' }); // Respond 500 status, error and message

  });

})

router.patch('/', verifyToken, (req, res, next) => {

  const { id } = req.user;

  MedicalHistory.findOneAndUpdate({ user: id }, { $set: { ...req.body } }, { new: true} )
  .then( medicalHistory => {

    res.status(200).json({ medicalHistory });

  })
  .catch( error => {
    
    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

module.exports = router;