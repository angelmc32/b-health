const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Import helper for token verification (jwt)
const { verifyToken } = require('../helpers/auth-helper');
const uploader = require('../helpers/multer-helper');

// PATCH route for edit profile. verifyToken for authentication, uploader for file storage (cloudinary)
// if successful, respond with 200 status and the updated user document
// if unsuccessful, send a response with status 500 (Internal Server Error), the error and a message
router.patch('/edit', verifyToken, uploader.single('profile_picture'), (req, res, next) => {

  const { id } = req.user;    // Destructure the user id from the request
  const body  = req.body;               // Extract body from request

  // If a file is being uploaded, set the secure_url property in the secure_url variable
  if ( req.file ) {
    const secure_url = req.file.secure_url;
    body['profile_picture'] = secure_url;
  }

  // Find patient by id and update fields sent by the front-end in the request body and from multer helper
  User.findByIdAndUpdate( id, {$set: {...body}}, { new: true } )
  .then( user => {                    // Rename the found patient document as "user"

    delete user._doc.password;        // Delete password from user document before sending it

    res.status(200).json({ user });   // Respond with 200 status and updated user document

  })
  .catch( error => {

    console.log(error)
    res.status(500).json({ error, msg: 'Unable to update profile' }); // Respond 500 status, error and message

  });

});

module.exports = router;