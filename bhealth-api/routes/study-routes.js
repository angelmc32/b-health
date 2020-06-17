const express = require('express');
const router = express.Router();
const Study = require('../models/Study');

// Import helper for token verification (jwt)
const { verifyToken } = require('../helpers/auth-helper');
const uploader = require('../helpers/multer-helper');

router.get('/:study_type', verifyToken, (req, res, next) => {

  const { study_type } = req.params;
  const { id } = req.user;    // Destructure the user id from the request

  Study.find({ $and: [{user: id}, {study_type: study_type}] })
  .then( studies => {

    res.status(200).json({ studies });

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

  Study.create({ ...req.body, user: id })
  .then( study => {

    res.status(200).json({ study });

  })
  .catch( error => {
    console.log(error)
    res.status(500).json({ error, msg: 'Unable to create study' }); // Respond 500 status, error and message

  });

})

router.get('/:studyID', verifyToken, (req, res, next) => {

  const { studyID } = req.params;
  const { id } = req.user;

  Study.findById(studyID)
  .then( study => {
    
    if ( study.user != id )
      return res.status(401).json({ error, msg: 'You are not authorized to view this prescription' });
    else
      res.status(200).json({ study });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

router.patch('/:studyID', verifyToken, (req, res, next) => {

  const { studyID } = req.params;

  Study.findByIdAndUpdate(studyID, { $set: { ...req.body } }, { new: true} )
  .then( study => {

    res.status(200).json({ study });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

router.delete('/:studyID', verifyToken, (req, res, next) => {

  const { studyID } = req.params;

  Study.findByIdAndDelete(studyID)
  .then( study => {

    res.status(200).json({ study });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to delete study' }); // Respond 500 status, error and message

  });

});

module.exports = router;