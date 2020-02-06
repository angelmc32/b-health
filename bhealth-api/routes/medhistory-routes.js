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

    res.status(500).json({ error, msg: 'Unable to create medicalHistory' }); // Respond 500 status, error and message

  });

})

router.get('/:medicalHistoryID', verifyToken, (req, res, next) => {

  const { medicalHistoryID } = req.params;
  const { id } = req.user;

  MedicalHistory.findById(medicalHistoryID)
  .then( medicalHistory => {
    
    if ( medicalHistory.user != id )
      return res.status(401).json({ error, msg: 'You are not authorized to view this medicalHistory' });
    else
      res.status(200).json({ medicalHistory });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

router.patch('/:medicalHistoryID', verifyToken, (req, res, next) => {

  const { medicalHistoryID } = req.params;

  MedicalHistory.findByIdAndUpdate(medicalHistoryID, { $set: { ...req.body } }, { new: true} )
  .then( medicalHistory => {

    res.status(200).json({ medicalHistory });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

module.exports = router;