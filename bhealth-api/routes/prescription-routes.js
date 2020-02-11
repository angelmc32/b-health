const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');

// Import helper for token verification (jwt)
const { verifyToken } = require('../helpers/auth-helper');
const uploader = require('../helpers/multer-helper');

router.get('/', verifyToken, (req, res, next) => {

  const { id } = req.user;    // Destructure the user id from the request

  Prescription.find({ user: id })
  .then( prescriptions => {

    res.status(200).json({ prescriptions });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

router.post('/', verifyToken, uploader.single('image'), (req, res, next) => {

  const { id } = req.user;
  const body  = req.body;               // Extract body from request

  // If a file is being uploaded, set the secure_url property in the secure_url variable
  if ( req.file ) {
    const secure_url = req.file.secure_url;
    body['image'] = secure_url;
  }

  Prescription.create({ ...req.body, user: id })
  .then( prescription => {

    res.status(200).json({ prescription });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to create prescription' }); // Respond 500 status, error and message

  });

})

router.get('/:prescriptionID', verifyToken, (req, res, next) => {

  const { prescriptionID } = req.params;
  const { id } = req.user;

  Prescription.findById(prescriptionID)
  .then( prescription => {
    
    if ( prescription.user != id )
      return res.status(401).json({ error, msg: 'You are not authorized to view this prescription' });
    else
      res.status(200).json({ prescription });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

router.patch('/:prescriptionID', verifyToken, (req, res, next) => {

  const { prescriptionID } = req.params;

  Prescription.findByIdAndUpdate(prescriptionID, { $set: { ...req.body } }, { new: true} )
  .then( prescription => {

    res.status(200).json({ prescription });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

module.exports = router;