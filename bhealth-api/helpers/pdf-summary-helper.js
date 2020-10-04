const puppeteer = require('puppeteer')
const pdfKit = require('pdfkit');
const fs = require('fs');
const Handlebars = require('handlebars')
const path = require('path');
const moment = require('moment')
moment.locale('es')

const MedicalHistory = require('../models/MedicalHistory');
const Consultation = require('../models/Consultation')
const Drug = require('../models/Drug')
const Study = require('../models/Study') 

exports.createPDF = async (id, user) => {
  let date_of_birth = moment(user.date_of_birth);
  let age = moment(Date.now()).diff(date_of_birth, 'years')
  let medhistory_var = {};
  let consultations_array = {};
  let drugs_array = {};
  let studies_array = {};

  try {

    const promise1 =
      MedicalHistory.find({ user: id })
      .then( medicalHistory => medhistory_var = {...medicalHistory})
      .catch( error => console.log(error))
    ;

    const promise2 =
      Consultation.find({ user: id })
      .sort({date: -1})
      .populate('treatment studies')
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
            // console.log('MEDICAL HISTORY', medhistory_var)
            // console.log('END END')
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

      return clinical_summary_object = {
        medhistory_var,
        consultations_array,
        drugs_array,
        studies_array,
        user
      }

    })
    .catch(error => console.log(error));
    
    const filename = 'public/temp/mypdf.pdf';
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    const clinicalSummary = await AllPromises();
    console.log('CONSULTATIONS', clinicalSummary.consultations_array)
    const content = await compile('summary', clinicalSummary)

    await page.setContent(content);
    await page.emulateMediaType('screen');
    await page.pdf({
      path: filename,
      format: 'A4',
      printBackground: true
    });

    console.log('pdf generated');
    await browser.close();
    return filename

  } catch (error) {
    console.log(error)
  }
}

const compile = async (templateName, data) => {

  const templateFilePath = path.join(__dirname, '..', 'views/templates', `${templateName}.hbs`);
  // console.log(templateFilePath)
  const html = await fs.readFileSync(templateFilePath, 'utf-8');
  return Handlebars.compile(html)(data);

}

Handlebars.registerHelper('ifEquals', (arg1, arg2, options) => {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
})

Handlebars.registerHelper('dateFormat', (value, format) => {
  return moment(value).format(format);
})