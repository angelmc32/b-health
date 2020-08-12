const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');

// Import helper for token verification (jwt)
const { verifyToken } = require('../helpers/auth-helper');

router.get('/', verifyToken, (req, res, next) => {

  const { id } = req.user;    // Destructure the user id from the request

  Consultation.find({ user: id, isEmergency: { $ne: true } })
  .sort({date: -1})
  .then( consultations => {

    res.status(200).json({ consultations });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

router.post('/', verifyToken, (req, res, next) => {

  const { id } = req.user;

  Consultation.create({ ...req.body, user: id })
  .then( consultation => {

    res.status(200).json({ consultation });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'No fue posible crear la consulta' }); // Respond 500 status, error and message

  });

})

router.get('/:consultationID', verifyToken, (req, res, next) => {

  const { consultationID } = req.params;
  const { id } = req.user;

  Consultation.findById(consultationID)
  .then( consultation => {
    
    if ( consultation.user != id )
      return res.status(403).json({ error, msg: 'No estás autorizado para ver esta consulta' });
    else
      res.status(200).json({ consultation });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to retrieve data' }); // Respond 500 status, error and message

  });

});

router.patch('/:consultationID', verifyToken, (req, res, next) => {

  const { consultationID } = req.params;
  

  Consultation.findByIdAndUpdate(consultationID, { $set: { ...req.body } }, { new: true} )
  .then( consultation => {

    res.status(200).json({ consultation });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'No fue posible actualizar la consulta. Intente de nuevo más tarde.' }); // Respond 500 status, error and message

  });

});

router.delete('/:consultationID', verifyToken, (req, res, next) => {

  const { consultationID } = req.params;

  Consultation.findByIdAndDelete(consultationID)
  .then( consultation => {

    res.status(200).json({ consultation });

  })
  .catch( error => {

    res.status(500).json({ error, msg: 'Unable to delete consultation' }); // Respond 500 status, error and message

  });

});

module.exports = router;