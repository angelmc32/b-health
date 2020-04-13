const express = require('express');
const router = express.Router();
const pdfKit = require('pdfkit');
const fs = require('fs')
const MedicalHistory = require('../models/MedicalHistory');
const Consultation = require('../models/Consultation')
const Drug = require('../models/Drug')
const Study = require('../models/Study')

// Import helper for token verification (jwt)
const { verifyToken } = require('../helpers/auth-helper');

router.get('/all', verifyToken, (req, res, next) => {

  const { id } = req.user;
  let medhistory_var = {};
  let consultations_array = {};
  let drugs_array = {};
  let studies_array = {};

  const promise1 =
    MedicalHistory.find({ user: id })
    .then( medicalHistory => medhistory_var = {...medicalHistory})
    .catch( error => console.log(error))
  ;

  const promise2 =
    Consultation.find({ user: id })
    .then( consultations => consultations_var = {...consultations})
    .catch( error => console.log(error))
  ;

  const promise3 =
    Drug.find({ user: id })
    .then( drugs => drugs_var = {...drugs})
    .catch( error => console.log(error))
  ;

  const promise4 =
    Study.find({ user: id })
    .then( studies => studies_var = {...studies})
    .catch( error => console.log(error))
  ;

  Promise.allSettled([promise1, promise2, promise3, promise4])
  .then( res => {

    res.map( (object, index) => {
      // console.log(index)
      // console.log(object.value)
      switch (index) {
        case 0: {
          medhistory_var = Object.values(object.value)[0];
          console.log(medhistory_var)
          break;
        }
        case 1: {
          consultations_array = Object.values(object.value);
          console.log(consultations_array)
          break;
        }
        case 2: {
          drugs_array = Object.values(object.value);
          console.log(drugs_array)
          break;
        }
        case 3: {
          studies_array = Object.values(object.value);
          console.log(studies_array)
          break;
        }
      }

    });

  })

  console.log(req.user)

  let doc = new pdfKit(
    { 
      layout : 'portrait',
      margins: { top: 50, bottom: 50, left: 72, right: 72 },
      info: {
        Title 	: 'Mi Historia Clínica',
        Author 	: req.user.email,
        Subject 	: 'Historia Clínica del Paciente',
        ModDate   : new Date(Date.now()).toLocaleString()
      }
    }
  );
  
  doc.pipe( fs.createWriteStream('out.pdf') );
  // const src = fs.createReadStream('sample.pdf');

  /* Embed image within the document as follows:
      image(image to be embedded, x axis position, y axis position, fit image to specified dimensions) */
  // doc.image(thumbnail, 25, 25, {
  //   fit 		: [320, 240]
  //   }
  // );

  /* Embed specific font, define font size and add text as follows:
      text(value to be displayed, x axis position, y axis position) */
  doc.font('Helvetica')
    .fontSize(18)
    .text("Prueba número 1", 25, 285);

  res.writeHead(200, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename=sample.pdf',
    'Content-Transfer-Encoding': 'Binary'
  });

  doc.pipe( res );
  doc.end();

});

module.exports = router;