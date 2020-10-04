const express = require('express');
const router = express.Router();
const pdfKit = require('pdfkit');
const path = require('path');

const fs = require('fs');
const moment = require('moment')
moment.locale('es')

const pdfMake = require('pdfmake');
const fonts = {
  Roboto: {
    normal: path.join(__dirname, '..', 'routes', '/fonts/Roboto-Regular.ttf'),
    bold: path.join(__dirname, '..', 'examples', '/fonts/Roboto-Medium.ttf'),
    italics: path.join(__dirname, '..', 'examples', '/fonts/Roboto-Italic.ttf'),
    bolditalics: path.join(__dirname, '..', 'examples', '/fonts/Roboto-MediumItalic.ttf')
  }
};
// var printer = new pdfMake(fonts)

const MedicalHistory = require('../models/MedicalHistory');
const Consultation = require('../models/Consultation')
const Drug = require('../models/Drug')
const Study = require('../models/Study') 

const { createPDF } = require('../helpers/pdf-summary-helper')

// Import helper for token verification (jwt)
const { verifyToken } = require('../helpers/auth-helper');
// const { document } = require('pdfkit/js/reference');

router.get('/all', verifyToken, async (req, res, next) => {

  const { id } = req.user;
  const { user } = req;
  let date_of_birth = moment(user.date_of_birth);
  let age = moment(Date.now()).diff(date_of_birth, 'years')
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

  const AllPromises = async () => Promise.allSettled([promise1, promise2, promise3, promise4])
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
          // console.log(consultations_array)
          break;
        }
        case 2: {
          drugs_array = Object.values(object.value);
          // console.log(drugs_array)
          break;
        }
        case 3: {
          studies_array = Object.values(object.value);
          // console.log(studies_array)
          break;
        }
      }

    });

  });

  const filename = await createPDF(id, user);
  res.contentType("application/pdf");
  console.log(filename)
  res.sendFile(path.join(__dirname, `../${filename}`));
  
});

router.get('/pdfkit', verifyToken, (req, res, next) => {

  const { id } = req.user;
  const { user } = req;
  let date_of_birth = moment(user.date_of_birth);
  let age = moment(Date.now()).diff(date_of_birth, 'years')
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

  const AllPromises = () => Promise.allSettled([promise1, promise2, promise3, promise4])
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
          // console.log(consultations_array)
          break;
        }
        case 2: {
          drugs_array = Object.values(object.value);
          // console.log(drugs_array)
          break;
        }
        case 3: {
          studies_array = Object.values(object.value);
          // console.log(studies_array)
          break;
        }
      }

    });

      // HEADER FUNCTION
      doc
        .image('public/images/icon.png', 40, 30, { width: 70 })
        .fillColor("#444444")
        .fontSize(20)
        .text("B-Health", 110, 57)
        .fontSize(10)
        .text("La salud de tu familia,", 200, 50, { align: "right" })
        .text("en tus manos", 200, 65, { align: "right" })
        .text("b-health.com", 200, 80, { align: "right" })
        .moveDown();

      doc.font('Helvetica')
        .fontSize(24)
        .text('Registro Personal de Datos de Salud', 55, 130, { align: "center", width: 500 });

      generateHR(doc, 155)

      // PATIENT INFORMATION
      doc.font('Helvetica')
        .fontSize(16)
        .text(`Ficha de Identificación del Paciente`, 55, 180);

      doc.font('Helvetica')
        .fontSize(12)
        .text(`Nombre:  ${user.first_name} ${user.last_name1} ${user.last_name2}`, 55, 210)
        .text(`Género: ${user.gender === 'F' ? 'Femenino' : user.gender === 'M' ? 'Masculino' : 'No definido'}`, 55, 210, {align: "right"})

      doc.font('Helvetica')
        .fontSize(12)
        .text(`Fecha de Nacimiento:  ${moment(user.date_of_birth).locale('es').format('LL')}`, 55, 230)
        .text(`Edad: ${age} años`, 55, 230, {align: "right"})

      generateHR(doc, 260)

      // MEDICAL HISTORY
      doc.font('Helvetica')
        .fontSize(16)
        .text(`Antecedentes Personales Patológicos`, 55, 280);

      doc.font('Helvetica')
        .fontSize(14)
        .text('Enfermedades Actuales', 55, 310);

      doc.font('Helvetica')
        .fontSize(12)
        .text(`Diabetes:  ${medhistory_var.health_history['Diabetes'] ? '      Sí' : '      Negada'}`, 100, 330)
        .text(`Enfermedades del Corazón: ${medhistory_var.health_history['Enfermedades del Corazón'] ? '           Sí' : '           Negada'}`, 290, 330)
        .text(`Hipertensión:  ${medhistory_var.health_history['Hipertensión'] ? 'Sí' : 'Negada'}`, 100, 350)
        .text(`Enfermedades del Hígado: ${medhistory_var.health_history['Enfermedades del Hígado'] ? '             Sí' : '             Negada'}`, 290, 350)
        .text(`Asma:  ${medhistory_var.health_history['Asma'] ? '           Sí' : '           Negada'}`, 100, 370)
        .text(`Enfermedades del Riñón: ${medhistory_var.health_history['Enfermedades del Riñón'] ? '               Sí' : '               Negada'}`, 290, 370)
        .text(`Alergias:  ${medhistory_var.health_history['Alergias'] ? '       Sí' : '       Negada'}`, 100, 390)
        .text(`Enfermedades del Endócrinas: ${medhistory_var.health_history['Enfermedades Endócrinas'] ? '        Sí' : '       Negada'}`, 290, 390)
        .text(`Cáncer:  ${medhistory_var.health_history['Cáncer'] ? '        Sí' : '        Negada'}`, 100, 410)
        .text(`Enfermedades del Sist. Digestivo: ${medhistory_var.health_history['Enfermedades del Sist. Digestivo'] ? '  Sí' : '  Negada'}`, 290, 410)
        .text(`Otras:  ${medhistory_var.health_history['Otras'] ? '           Sí' : '             Negada'}`, 100, 430)
        .text(`Enfermedades Mentales: ${medhistory_var.health_history['Enfermedades Mentales'] ? '               Sí' : '                Negada'}`, 290, 430)

      doc.font('Helvetica')
        .fontSize(14)
        .text('Otros Antecedentes Personales Patológicos', 55, 460);

      doc.font('Helvetica')
        .fontSize(12)
        .text(`Intervenciones Quirúrgicas:  ${medhistory_var.procedure ? medhistory_var.procedure : 'Sin registro'}`, 100, 490)
        .text(`Alergias: ${medhistory_var.allergies ? medhistory_var.allergies : 'Sin registro'}`, 100, 510)
        .text(`Traumatismos: ${medhistory_var.traumatisms ? medhistory_var.traumatisms : 'Sin registro'}`, 100, 530)
        .text(`Hospitalizaciones Previas: ${medhistory_var.hospitalizations ? medhistory_var.hospitalizations : 'Sin registro'}`, 100, 550)
        .text(`Adicciones: ${medhistory_var.addictions ? medhistory_var.addictions : 'Sin registro'}`, 100, 570)
        .text(`Otras: ${medhistory_var.others ? medhistory_var.others : 'Sin registro'}`, 100, 590)

      generateHR(doc, 620)

      doc.font('Helvetica')
        .fontSize(16)
        .text(`Antecedentes Personales No Patológicos`, 55, 630);

      doc.font('Helvetica')
        .fontSize(12)
        .text(`Actividad Física Semanal:  ${medhistory_var.weekly_exercise_hours ? `${medhistory_var.weekly_exercise_hours} horas` : '0 horas'}`, 100, 660)
        .text(`Tabaquismo: ${medhistory_var.smoking_status ? medhistory_var.smoking_status : 'Sin registro'}`, 290, 660)
        .text(`Hábitos Alimenticios:  ${medhistory_var.nutritional_status ? medhistory_var.nutritional_status : 'Sin registro'}`, 100, 680)
        .text(`Alcoholismo: ${medhistory_var.alcoholism ? medhistory_var.alcoholism : 'Sin registro'}`, 290, 680)
        .text(`Higiene Bucal:  ${medhistory_var.oral_hygiene ? medhistory_var.oral_hygiene : 'Sin registro'}`, 100, 700)
        .text(`Sueño: ${medhistory_var.sleep_status ? medhistory_var.sleep_status : 'Sin registro'}`, 290, 700)
      // FOOTER FUNCTION

      generateHR(doc, 725);
      doc
        .fontSize(10)
        .text(
          "Toda la información contenida en este documento es confidencial y para uso exclusivo del paciente propietario.",
          50,
          730,
          { align: "center", width: 500 }
        );

  });

  endPDF();

  async function endPDF() {
    await AllPromises();
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=sample.pdf',
      'Content-Transfer-Encoding': 'Binary'
    });
    doc.pipe( fs.createWriteStream('out.pdf') );
    doc.pipe( res );
    doc.end();
  }

});

const generateHR = (doc, yPosition) => doc
  .strokeColor("#aaaaaa")
  .lineWidth(1)
  .moveTo(50, yPosition)
  .lineTo(550, yPosition)
  .stroke();

const createPdfBinary = (documentDefinition) => {
  const pdf = pdfMake.createPdfKitDocument(documentDefinition)
  return pdf.getDataUrl();
}

module.exports = router;