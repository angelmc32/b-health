const express = require('express');
const router = express.Router();
const Drug = require('../models/Drug');

// Import helper for token verification (jwt)
const { verifyToken } = require('../helpers/auth-helper');

router.get('/', verifyToken, (req, res, next) => {

  const { id } = req.user;    // Destructure the user id from the request

  Drug.find({ user: id })
  .sort({createdAt: -1})
  .then( drugs => {

    res.status(200).json({ drugs });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

router.post('/', verifyToken, (req, res, next) => {

  const { id } = req.user;

  Drug.create({ ...req.body, user: id })
  .then( drug => {

    res.status(200).json({ drug });

  })
  .catch( error => {
    console.log(error)
    res.status(500).json({ error, msg: 'Unable to register drug information' }); // Respond 500 status, error and message
    

  });

})

router.get('/:drugID', verifyToken, (req, res, next) => {

  const { drugID } = req.params;
  const { id } = req.user;

  Drug.findById(drugID)
  .then( drug => {
    
    if ( drug.user != id )
      return res.status(401).json({ error, msg: 'You are not authorized to view this vital signs' });
    else
      res.status(200).json({ drug });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

router.patch('/:drugID', verifyToken, (req, res, next) => {

  const { drugID } = req.params;

  Drug.findByIdAndUpdate(drugID, { $set: { ...req.body } }, { new: true} )
  .then( drug => {

    res.status(200).json({ drug });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

router.delete('/:drugID', verifyToken, (req, res, next) => {

  const { drugID } = req.params;

  Drug.findByIdAndDelete(drugID)
  .then( drug => {

    res.status(200).json({ drug });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to delete drug' }); // Respond 500 status, error and message

  });

});

module.exports = router;