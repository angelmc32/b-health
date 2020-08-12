const express = require('express');
const router = express.Router();
const Emergency = require('../models/Emergency');
const Consultation = require('../models/Consultation');

// Import helper for token verification (jwt)
const { verifyToken } = require('../helpers/auth-helper');

router.get('/', verifyToken, (req, res, next) => {

  const { id } = req.user;    // Destructure the user id from the request

  Consultation.find({ user: id, isEmergency: true })
  .sort({date: -1})
  .then( emergencies => {

    res.status(200).json({ emergencies });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

router.post('/', verifyToken, (req, res, next) => {

  const { id } = req.user;

  Consultation.create({ ...req.body, user: id })
  .then( emergency => {

    res.status(200).json({ emergency });

  })
  .catch( error => {
    console.log(error)
    res.status(500).json({ error, msg: 'Unable to create emergency' }); // Respond 500 status, error and message

  });

})

router.get('/:emergencyID', verifyToken, (req, res, next) => {

  const { emergencyID } = req.params;
  const { id } = req.user;

  Consultation.findById(emergencyID)
  .then( emergency => {
    
    if ( emergency.user != id )
      return res.status(401).json({ error, msg: 'You are not authorized to view this emergency' });
    else
      res.status(200).json({ emergency });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

router.patch('/:emergencyID', verifyToken, (req, res, next) => {

  const { emergencyID } = req.params;

  Consultation.findByIdAndUpdate(emergencyID, { $set: { ...req.body } }, { new: true} )
  .then( emergency => {

    res.status(200).json({ emergency });

  })
  .catch( error => {

    console.log(error)
    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

router.delete('/:emergencyID', verifyToken, (req, res, next) => {

  const { emergencyID } = req.params;

  Consultation.findByIdAndDelete(emergencyID)
  .then( emergency => {

    res.status(200).json({ emergency });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to delete emergency' }); // Respond 500 status, error and message

  });

});

module.exports = router;