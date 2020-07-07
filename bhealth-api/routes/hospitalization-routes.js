const express = require('express');
const router = express.Router();
const Hospitalization = require('../models/Hospitalization');

// Import helper for token verification (jwt)
const { verifyToken } = require('../helpers/auth-helper');

router.get('/', verifyToken, (req, res, next) => {

  const { id } = req.user;    // Destructure the user id from the request

  Hospitalization.find({ user: id })
  .sort({date: -1})
  .then( hospitalizations => {

    res.status(200).json({ hospitalizations });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

router.post('/', verifyToken, (req, res, next) => {

  const { id } = req.user;

  Hospitalization.create({ ...req.body, user: id })
  .then( hospitalization => {

    res.status(200).json({ hospitalization });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to create hospitalization' }); // Respond 500 status, error and message

  });

})

router.get('/:hospitalizationID', verifyToken, (req, res, next) => {

  const { hospitalizationID } = req.params;
  const { id } = req.user;

  Hospitalization.findById(hospitalizationID)
  .then( hospitalization => {
    
    if ( hospitalization.user != id )
      return res.status(401).json({ error, msg: 'You are not authorized to view this hospitalization' });
    else
      res.status(200).json({ hospitalization });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

router.patch('/:hospitalizationID', verifyToken, (req, res, next) => {

  const { hospitalizationID } = req.params;

  Hospitalization.findByIdAndUpdate(hospitalizationID, { $set: { ...req.body } }, { new: true} )
  .then( hospitalization => {

    res.status(200).json({ hospitalization });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

router.delete('/:hospitalizationID', verifyToken, (req, res, next) => {

  const { hospitalizationID } = req.params;

  Hospitalization.findByIdAndDelete(hospitalizationID)
  .then( hospitalization => {

    res.status(200).json({ hospitalization });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to delete hospitalization' }); // Respond 500 status, error and message

  });

});

module.exports = router;