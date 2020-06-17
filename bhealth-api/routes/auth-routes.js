const express = require('express');                 // Import express for router functionality through its Router method
const router = express.Router();                    // Execute express router and store it into router const
const jwt = require('jsonwebtoken');                // Import jsonwebtoken for token creation and authentication
const bcrypt = require('bcryptjs');                 // Import bcryptjs for password hash creation and password validation
const AWS = require('aws-sdk');
const User = require('../models/User');             // Require the User model to create and find users in database

// Import send method from mailer helper to email verification through sendgrid (config in mailer-helper)
const { send } = require('../helpers/mailer-helper');
const { registerEmailParams } = require('../helpers/aws-mailer-helper')

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' })

router.post('/signup', (req, res, next) => {

  // Destructure the password in order to hash it before storing it in the database, and the usertype for model verification
  const { email, password, confirm_password } = req.body;

  // Password length validation, min length 8, if not, respond with a 500 status and error message
  if ( password.length < 8 ) return res.status(500).json({ msg: "La contraseña debe tener al menos 8 caracteres" });
  if ( password !== confirm_password ) return res.status(500).json({ msg: "Las contraseñas deben ser iguales" });

  User.findOne({ email }).exec((error, user) => {

    if (user) {
      return res.status(500).json({ error, msg: 'Ya existe una cuenta asociada al correo electrónico' });
    }

    // Use bcryptjs methods to generate salt and hash password, for storage with an extra level of security
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const token = jwt.sign({ email, password }, process.env.SECRET, {
      expiresIn: '10m'
    })

    const params = registerEmailParams(email, token);

    const sendEmailOnSignup = ses.sendEmail(params).promise()

    sendEmailOnSignup
    .then( data => {
      console.log('email submitted to SES', data);
      return res.status(200).json({ msg: 'Completa tu registro usando la liga que te enviamos a la dirección de correo electrónico proporcionada' })
    })
    .catch( error => {
      console.log('error while sending email', error);
      return res.status(500).json({ error, msg: 'No fue posible verificar su dirección de correo electrónico' })
    })

  })
  
});

// POST route for user signup. Validate password length, hash the password, create the user in the database,
// if successful, send email for verification and a response with status 200, the user, token and success message,
// if unsuccessful, send a response with status 500 (Internal Server Error), the error and a message
router.get('/activate/:activationToken', (req, res, next) => {

  const { activationToken } = req.params;

  jwt.verify(activationToken, process.env.SECRET, (error, decoded) => {


    console.log(decoded);

    // // Respond with 401 status and failed authentication message in case of an error detected by jwt.verify method
    // if ( error ) return res.status(401).json({ error, msg: 'Token authentication failed'});

    // // Search for user in database using decoded data (in our app, saved as id for user._id when creating token)
    // User.findById(decoded.id)
    // .then( user => {                // Rename the found patient document as "user"

    //   // Save data into the request as user property (req.user), execute next step with next()
    //   req.user = user;
    //   next();

    // });
    
  });

  // const params = registerEmailParams(email, token);
    
  // // Call mongoose create method, pass the request body (which includes the email, but it's possible to send any
  // // other additional data from the front-end) and the hashed password as parameters, to be saved in the database
  // User.create({ ...req.body, password: hashedPassword })
  // .then( user => {          // Rename the found user document as "user"
    
  //   // // Configure options variable to pass as parameter to the mailer send method
  //   // const options = {
  //   //   filename: 'signup',
  //   //   email: user.email,
  //   //   message: 'Please verify your email',
  //   //   subject: 'Please verify your email'
  //   // };

  //   // // Call mailer send method with options variable as parameter for e-mail verification
  //   // send(options);

  //   const sendEmailOnSignup = ses.sendEmail(params).promise()

  //   sendEmailOnSignup
  //   .then( data => {
  //     console.log('email submitted to SES', data);
  //   })
  //   .catch( error => {
  //     console.log('error while sending email', error);
  //     return res.status(500).json({ error, msg: 'No fue posible verificar su dirección de correo electrónico' })
  //   })

  //   // // Create a token with jwt: first parameter is data to be serialized into the token, second parameter
  //   // // is app secret (used as key to create a token signature), third is a callback that passes the error or token
  //   // jwt.sign({ id: user._id }, process.env.SECRET, (error, token) => {

  //   //   // Delete the password from the user document (returned by mongoose) before sending to front-end
  //   //   delete user._doc.password;

  //   //   // If there's an error creating the token, respond to the request with a 500 status, the error and a message
  //   //   if ( error ) return res.status(500).json({ error, msg: 'Error creando el token' });

  //   //   // Respond to the request with a 200 status, the user data and a success message
  //   //   res.status(200).json({ user, token, msg: 'Su usuario ha sido creado exitosamente, y ha iniciado sesión' });

  //   // });

    
    
  // })
  // .catch( error => {
    
  //   if (error.code === 11000)
  //     res.status(500).json({ error, msg: 'Ya existe una cuenta asociada al correo electrónico' });
  //   // Respond with 500 status, the error and a message
    
  //   res.status(500).json({ error, msg: 'Error durante la creación del usuario' });
  //   console.log(error);
  
  // });
  
});

router.post('/activate/:activationToken', (req, res, next) => {

  const { activationToken } = req.params;

  jwt.verify(activationToken, process.env.SECRET, (error, decoded) => {

    if (error) {
      console.log('expirado')
      return res.status(401).json({ error, msg: 'La liga ha expirado. Por favor intenta de nuevo.'})
    }

    const { email, password } = jwt.decode(activationToken);

    // Use bcryptjs methods to generate salt and hash password, for storage with an extra level of security
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    User.findOne({email}).exec( (error, user) => {

      if (user) {
        return res.status(401).json({ error, msg: 'Ya existe una cuenta asociada al correo electrónico' });
      }

      User.create({email, password: hashedPassword})
      .then( user => {

        jwt.sign({ id: user._id }, process.env.SECRET, (error, token) => {

          // Delete the password from the user document (returned by mongoose) before sending to front-end
          delete user._doc.password;

          // If there's an error creating the token, respond to the request with a 500 status, the error and a message
          if ( error ) return res.status(500).json({ error, msg: 'Error creando el token' });

          // Respond to the request with a 200 status, the user data and a success message
          res.status(200).json({ user, token, msg: 'Su usuario ha sido creado exitosamente, y ha iniciado sesión' });

        })
  
      })
      .catch( error => {
      
        if (error.code === 11000)
          res.status(500).json({ error, msg: 'Ya existe una cuenta asociada al correo electrónico' });
        // Respond with 500 status, the error and a message
        
        res.status(500).json({ error, msg: 'Error durante la creación del usuario' });
        console.log(error);
      
      });

    })

  })
  
});

// POST route for user login. Validate password length, hash the password, create the user in the database,
// if successful, validate password, and send a response with 200 status, the user, token and success message,
// if unsuccessful, send a response with status 404 (Not found), the error and a message
router.post('/login', (req, res, next) => {

  const { email, password } = req.body; // Destructure email, password and usertype from request body

  // Call mongoose findOne method, pass the email as query, if email exists, validate password and create token
  User.findOne({ email })
  .then( user => {      

    // Verify if password sent is correct, true. If password is incorrect, false and send 401 status
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) return res.status(401).json({ msg: 'Contraseña incorrecta' });

    // Create a token with jwt: first parameter is data to be serialized into the token, second parameter
    // is app secret (used as key to create a token signature), third is a callback that passes the error or token
    jwt.sign({ id: user._id }, process.env.SECRET, {expiresIn: '10m'}, (error, token) => {

      // Delete the password from the user document (returned by mongoose) before sending to front-end
      delete user._doc.password;

      // If there's an error creating the token, respond to the request with a 500 status, the error and a message
      if ( error ) return res.status(500).json({ error, msg: 'Error creando el token' });

      // Respond to the request with a 200 status, the user data and a success message
      res.status(200).json({ user, token, msg: 'Inicio de sesión exitoso' });

    });

  })
  .catch( error => {

    // Respond with 404 status, the error and a message
    res.status(404).json({ error, msg: 'Email o contraseña incorrecta' });

  });
  
});

module.exports = router;