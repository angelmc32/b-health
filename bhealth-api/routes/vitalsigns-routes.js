const express = require('express');
const router = express.Router();
const VitalSigns = require('../models/VitalSigns');

// Import helper for token verification (jwt)
const { verifyToken } = require('../helpers/auth-helper');

router.get('/', verifyToken, (req, res, next) => {

  const { id } = req.user;    // Destructure the user id from the request

  VitalSigns.find({ user: id })
  .sort({date: -1})
  .then( vitalsigns => {

    res.status(200).json({ vitalsigns });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

router.post('/', verifyToken, (req, res, next) => {

  const { id } = req.user;
  console.log(req.body)

  VitalSigns.create({ ...req.body, user: id })
  .then( vitalSigns => {

    console.log(vitalSigns)

    res.status(200).json({ vitalSigns });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'No fue posible registrar sus signos vitales. Intente de nuevo más tarde.' }); // Respond 500 status, error and message

  });

})

router.get('/:vitalsignsID', verifyToken, (req, res, next) => {

  const { vitalsignsID } = req.params;
  const { id } = req.user;

  VitalSigns.findById(vitalsignsID)
  .then( vitalsigns => {
    
    if ( vitalsigns.user != id )
      return res.status(401).json({ error, msg: 'You are not authorized to view this vital signs' });
    else
      res.status(200).json({ vitalsigns });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

router.get('/vitals/:consultationID', verifyToken, (req, res, next) => {

  const { consultationID } = req.params;
  const { id } = req.user;

  VitalSigns.findOne({consultation: consultationID})
  .then( vitalsigns => {
    
    if ( vitalsigns.user != id )
      return res.status(401).json({ error, msg: 'You are not authorized to view this vital signs' });
    else
      res.status(200).json({ vitalsigns });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

router.patch('/:vitalsignsID', verifyToken, (req, res, next) => {

  const { vitalsignsID } = req.params;

  VitalSigns.findByIdAndUpdate(vitalsignsID, { $set: { ...req.body } }, { new: true} )
  .then( vitalsigns => {

    res.status(200).json({ vitalsigns });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

router.delete('/:vitalsignsID', verifyToken, (req, res, next) => {

  const { vitalsignsID } = req.params;

  VitalSigns.findByIdAndDelete(vitalsignsID)
  .then( vitalsigns => {

    res.status(200).json({ vitalsigns });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to delete Vital Signs' }); // Respond 500 status, error and message

  });

});

module.exports = router;