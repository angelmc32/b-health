const express = require('express');
const router = express.Router();
const Treatment = require('../models/Treatment');

// Import helper for token verification (jwt)
const { verifyToken } = require('../helpers/auth-helper');

router.get('/', verifyToken, (req, res, next) => {

  const { id } = req.user;    // Destructure the user id from the request

  Treatment.find({ user: id })
  .sort({date: -1})
  .then( treatments => {

    res.status(200).json({ treatments });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

router.post('/', verifyToken, (req, res, next) => {

  const { id } = req.user;
  const body  = req.body;               // Extract body from request
  console.log(body)
  const { drugsJSON, instructionsJSON } = req.body
  // Agregar el código de abajo si tienes problemas para hacer el parse del JSON que se envía desde el front-end
  // Treatment.create({ drugs: JSON.parse(drugsJSON), extra_instructions: JSON.parse(extraInstructionsJSON), ...req.body, user: id })

  Treatment.create({ ...req.body, user: id })
  .then( treatment => {

    res.status(200).json({ treatment });

  })
  .catch( error => {

    console.log(error)
    res.status(500).json({ error, msg: 'Unable to create treatment' }); // Respond 500 status, error and message

  });

})

router.get('/:treatmentID', verifyToken, (req, res, next) => {

  const { treatmentID } = req.params;
  const { id } = req.user;

  Treatment.findById(treatmentID)
  .then( treatment => {
    
    if ( treatment.user != id )
      return res.status(401).json({ error, msg: 'You are not authorized to view this treatment' });
    else
      res.status(200).json({ treatment });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

router.patch('/:treatmentID', verifyToken, (req, res, next) => {

  const { treatmentID } = req.params;
  const { drugsJSON } = req.body

  const body  = req.body;               // Extract body from request
  // Agregar el código de abajo si tienes problemas para hacer el parse del JSON que se envía desde el front-end
  // Treatment.findByIdAndUpdate(treatmentID, { $set: {drugs: JSON.parse(drugsJSON), ...req.body } }, { new: true} )

  Treatment.findByIdAndUpdate(treatmentID, { $set: { ...req.body } }, { new: true} )
  .then( treatment => {

    res.status(200).json({ treatment });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'No fue posible actualizar la receta' }); // Respond 500 status, error and message

  });

});

router.delete('/:treatmentID', verifyToken, (req, res, next) => {

  const { treatmentID } = req.params;

  Treatment.findByIdAndDelete(treatmentID)
  .then( treatment => {

    res.status(200).json({ treatment });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to delete treatment' }); // Respond 500 status, error and message

  });

});

module.exports = router;