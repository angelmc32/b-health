const jwt = require('jsonwebtoken');          // Require jwt for verify method (token verification)
const User = require('../models/User');       // Require User model to obtain user data if authentication is successful

exports.verifyToken = require = (req, res, next) => {

  // Destructure authorization from headers and rename it as token
  const { authorization: token } = req.headers;

  // Call jwt verify method, send token and secret as parameters fir token validation,
  // if successful, obtain decoded data from token (in our app, user id), find user in database and execute next step
  // if unsuccessful, respond with 401 status and failed authentication message
  jwt.verify(token, process.env.SECRET, (error, decoded) => {

    // Respond with 401 status and failed authentication message in case of an error detected by jwt.verify method
    if ( error ) {
      if (error.message && error.message === 'jwt expired')
        return res.status(401).json({ error, msg: 'Sesión expirada. Reinicia sesión por favor.'});
      else
        return res.status(401).json({ error, msg: 'Debes iniciar sesión'});
      }

    // Search for user in database using decoded data (in our app, saved as id for user._id when creating token)
    User.findById(decoded.id)
    .then( user => {                // Rename the found patient document as "user"

      // Save data into the request as user property (req.user), execute next step with next()
      req.user = user;
      next();

    });
    
  });
  
};