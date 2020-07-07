const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');                 // Import bcryptjs for password hash creation and password validation

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

router.patch('/password', verifyToken, (req, res, next) => {

  const { email, password, newPassword, confirm_password } = req.body;

  if ( password.length < 8 ) return res.status(400).json({ msg: "La contraseña debe tener al menos 8 caracteres" });
  if ( newPassword !== confirm_password ) return res.status(400).json({msg: 'Las contraseñas no coinciden. Intenta de nuevo.'})

  User.findOne({ email }).exec((error, user) => {

    if ( error || !user ) 
      return res.status(400).json({ error, msg: 'No fue posible cambiar la contraseña. Por favor intenta de nuevo.' });

    // Verify if password sent is correct, true. If password is incorrect, false and send 401 status
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    const isNewPasswordSame = bcrypt.compareSync(newPassword, user.password)

    if (!isPasswordValid) 
      return res.status(401).json({ msg: 'Contraseña actual inválida' });
    if (isNewPasswordSame)
      return res.status(400).json({ msg: 'Utiliza una contraseña diferente a la actual' });


    // Use bcryptjs methods to generate salt and hash password, for storage with an extra level of security
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);    

    return user.updateOne({password: hashedPassword}, (error, success) => {

      if ( error ) {
        return res.status(500).json({ error, msg: 'No fue posible cambiar la contraseña. Por favor intenta de nuevo más tarde.'})
      }

      return res.status(200).json({msg: 'Se ha cambiado la contraseña correctamente'})

    })

  })

})

module.exports = router;