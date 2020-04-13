import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';                      // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import useDrugsForm from '../../hooks/useDrugsForm';                          // Import useForm custom hook
import UIkit from 'uikit';                                          // Import UIkit for notifications
import moment from 'moment';                                        // Import momentjs for date formatting

import { getPrescriptions, createPrescription, getPrescription, editPrescription } from '../../services/prescription-services';
import { createDrug } from '../../services/drug-services';

import PrescriptionForm from './PrescriptionForm';
import PrescriptionInfo from './PrescriptionInfo';

const Prescription = () => {

  // Destructure form state variable, handleInput and handleFileInput functions for form state manipulation
  const { form, handleInput, handleFileInput } = useDrugsForm();

  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user
  const { user, route, setRoute, objectHandler, setObjectHandler } = useContext(AppContext);
  const [ prescription, setPrescription] = useState({});
  const [ prescriptions, setPrescriptions ] = useState([]);
  const [ showForm, setShowForm ] = useState(false);
  const [ showConsultation, setShowConsultation ] = useState(false);
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(false);
  let drugs = [/*{'generic_name': null, brand_name: null, dosage_form: null, dose: null, indications: null}]*/];

  useEffect( () => {

    if ( !user._id ) {    // If there is no user logged in, send a notification and "redirect" to login

      // Send UIkit warning notification: User must log in
      UIkit.notification({
        message: `<span uk-icon='close'></span> Por favor inicia sesión.`,
        pos: 'bottom-center',
        status: 'warning'
      });
      
      return push('/login');         // If not logged in, "redirect" user to login

    };

    if ( route !== 'create' && route !== 'read' ) {

      getPrescriptions()
      .then( res => {
      
        const { prescriptions } = res.data;
        setPrescriptions(prescriptions);
        setRoute('prescriptions');

      });
    }

    
    
  }, [route]);

  const handleSubmit = (event) => {

    event.preventDefault();               // Prevent page reloading after submit action
    setIsButtonDisabled(true)

    const formData = new FormData();      // Declare formData as new instance of FormData class
    const { image } = form;     // Destructure profile_picture from form

    console.log(drugs)
    form.drugsJSON = JSON.stringify(drugs);
    console.log(form)

    // LearningCenterObject.observations = myArray;
    // form.drugs = drugsArray
    // console.log

    // Iterate through every key in form object and append name:value to formData
    for (let key in form) {

      // If profile_picture, append as first item in array (currently 1 file allowed, index 0)
      if ( key === 'image' ) formData.append(key, image[0]);

      else formData.append(key, form[key]);
      
    }
    
    // Call edit service with formData as parameter, which includes form data for user profile information
    createPrescription(formData)
    .then( res => {

      const { prescription } = res.data   // Destructure updated user document from response

      // Send UIkit success notification
      UIkit.notification({
        message: `<span uk-icon='close'></span> '¡Tu receta fue creada exitosamente!'`,
        pos: 'bottom-center',
        status: 'success'
      });

      setRoute('prescriptions');
      setIsButtonDisabled(false);
      setObjectHandler({});

      // Save drug information

    })
    .catch( error => {

      console.log(error);

      // Send UIkit error notification
      UIkit.notification({
        message: `<span uk-icon='close'></span> ${error}`,
        pos: 'bottom-center',
        status: 'danger'
      });

      setIsButtonDisabled(false)

    });
    
  };

  const toggleButton = () => setIsButtonDisabled(!isButtonDisabled);
  
  const loadPrescription = (prescription) => {
    setPrescription(prescription);
    setRoute('read');
  }

  const deleteConsultationObject = () => {
    setObjectHandler(null);
    setRoute('prescriptions');
    // console.log('borrando')
  }

  return (

    <div className="content">
      
        { route === 'prescriptions' ? (
          <div className="uk-section">
            <h2>Recetas</h2>
            <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('create')} >
              + Nueva Receta
            </button>
            <div className="uk-overflow-auto">
              { prescriptions.length < 1 ? (
                  <h4 className="uk-text-danger">No has agregado recetas</h4>
                ) : null
              }
              <table className="uk-table uk-table-striped uk-table-hover uk-table-middle">
                <thead>
                  <tr>
                    <th className="uk-text-center">Fecha</th>
                    <th className="uk-text-center uk-visible">Doctor</th>
                    <th className="uk-text-center">Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  { prescriptions ? 
                      prescriptions.map( (prescription, index) => 
                        <tr key={index}>
                          <td className="uk-text-center">{moment(prescription.date).locale('es').format('LL')}</td>
                          <td className="uk-text-center uk-visible">{`Dr. ${prescription.doctor}`}</td>
                          <td className="uk-text-center">
                            <button className="uk-button uk-button-default uk-button-small uk-border-pill" onClick={event => loadPrescription({prescription})} >
                              Ver
                            </button>
                          </td>
                        </tr>
                      )
                    : <tr>
                        <td>Cargando</td>
                        <td>Cargando</td>
                        <td>Cargando</td>
                      </tr>
                }
                </tbody>
              </table>
            </div>
          </div>
          ) : (
            route === 'create' ? (
              <div className="uk-section">
                <div className="uk-container">
                  <h2>Nueva Receta</h2>
                  { objectHandler ?
                      <h4>Corresponde a consulta realizada el {moment(objectHandler.date).format('DD-MM-YY')}</h4>
                      : null
                  }
                  <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={deleteConsultationObject} >
                    Regresar
                  </button>
                  <PrescriptionForm handleSubmit={handleSubmit} handleInput={handleInput} handleFileInput={handleFileInput} form={form} isButtonDisabled={isButtonDisabled} objectHandler={objectHandler} drugs={drugs}/>
                </div>
              </div>
            ) : (
              route === 'read' ? (
                <div className="uk-section">
                  <h2>Ver Receta</h2>
                  <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('prescriptions')} >
                    Regresar
                  </button>
                  <PrescriptionInfo {...prescription} />
                </div>
              ) : (
                <div className="uk-section">
                  <h2>Cargando...</h2>
                  <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m" onClick={event => setRoute('prescriptions')} >
                    Regresar
                  </button>
                </div> 
              )
            )
          )
        }
      
    </div>
    
  )
}

export default Prescription