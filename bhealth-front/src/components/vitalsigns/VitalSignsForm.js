import React, { useEffect, useState } from 'react';
import UIkit from 'uikit';                                          // Import UIkit for notifications
import moment from 'moment';                                        // Import momentjs for date formatting

import VitalSignsCard from '../vitalsigns/VitalSignsCard'

import happy_img from '../../images/icons/happy-face.svg'
import sad_img from '../../images/icons/sad-face.svg'
import add_vitals_icon from '../../images/icons/add-vitals.svg'
import blood_pressure_icon from '../../images/icons/blood-pressure.svg'
import blood_sugar_icon from '../../images/icons/blood-sugar.svg'
import heart_rate_icon from '../../images/icons/heart-rate.svg'
import temperature_icon from '../../images/icons/temperature.svg'
import weight_icon from '../../images/icons/weight.svg'

import { getVitalSigns, getOneVitalSigns, createVitalSigns } from '../../services/vitalsigns-services'

const VitalSignsForm = ({ type, setShowVitalsForm, setVitalsFormValues, setRoute, vitalsFormValues = null }) => {

  // const [ formValues, setFormValues ] = useState({temperature: null, blood_pressure_sys: null, blood_pressure_dias: null, blood_sugar: null, heart_rate: null, weight: null});
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(false);

  const saveVitalSigns = (event) => {

    event.preventDefault();

    if ( type === 'consultation' )
      setShowVitalsForm(false);
    else {

      createVitalSigns(vitalsFormValues)
      .then( res => {

        const { vitalsigns } = res.data;
        console.log(vitalsigns)

        // Send UIkit success notification
        UIkit.notification({
          message: `<span uk-icon='close'></span> '¡Los signos vitales fueron registrados exitosamente!'`,
          pos: 'bottom-center',
          status: 'success'
        });

      })
      .catch( error => {
        console.log('error creando signos vitales');
        console.log(error);

        // Send UIkit error notification
        UIkit.notification({
          message: `<span uk-icon='close'></span> ${error}`,
          pos: 'bottom-center',
          status: 'danger'
        });

      })

    }
      setRoute(null);

  }

  // const handleSubmit = (event) => {

  //   event.preventDefault();
  //   console.log(formValues);
  //   setIsButtonDisabled(true);

  //   createVitalSigns(formValues)
  //   .then( res => {

  //     const { vitalSigns } = res.data    // Destructure updated preferences document from response
  //     console.log(vitalSigns)

  //     // Send UIkit success notification
  //     UIkit.notification({
  //       message: `<span uk-icon='close'></span> '¡El registro de signos vitales fue creado exitosamente!'`,
  //       pos: 'bottom-center',
  //       status: 'success'
  //     });

  //     if ( type === 'consultation' )
  //       setShowVitalsForm(false)
  //     else setRoute('vitalSigns')

  //     // setRoute('consultations');
  //     setIsButtonDisabled(false);

  //   })
  //   .catch( error => {

  //     console.log(error);

  //     // Send UIkit error notification
  //     UIkit.notification({
  //       message: `<span uk-icon='close'></span> ${error}`,
  //       pos: 'bottom-center',
  //       status: 'danger'
  //     });
      
  //     setIsButtonDisabled(false);

  //   });

  // }

  const handleInputChange = (event) => {
    event.persist();

    if(event.target.type === 'number') event.target.value = parseFloat(event.target.value);
    setVitalsFormValues( currentValues => ({
      ...currentValues,
      [event.target.name]: event.target.value
    }))
  }

  return (
    <form className="uk-form-stacked uk-text-left">
      <div className="uk-margin">
        <div className="uk-width-1-1 uk-width-1-4@s uk-child-width-1-3 uk-grid uk-grid-collapse uk-grid-match">
          
            <VitalSignsCard vitalsign_name="Temperatura Corporal" vitalsign_icon={temperature_icon} handleInputChange={handleInputChange} form_name="temperature" />
            <VitalSignsCard vitalsign_name="Presión Sistólica" vitalsign_icon={blood_pressure_icon} handleInputChange={handleInputChange} form_name="blood_pressure_sys" />
            <VitalSignsCard vitalsign_name="Glucosa" vitalsign_icon={blood_sugar_icon} handleInputChange={handleInputChange} form_name="blood_sugar" />

            <VitalSignsCard vitalsign_name="Frecuencia Cardiaca" vitalsign_icon={heart_rate_icon} handleInputChange={handleInputChange} form_name="heart_rate" />
            <VitalSignsCard vitalsign_name="Presión Diastólica" vitalsign_icon={blood_pressure_icon} handleInputChange={handleInputChange} form_name="blood_pressure_dias" />
            <VitalSignsCard vitalsign_name="Peso" vitalsign_icon={weight_icon} handleInputChange={handleInputChange} form_name="weight" />

        </div>
      </div>
      <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin">
        <button onClick={saveVitalSigns} className="uk-button uk-button-primary uk-border-pill" disabled={isButtonDisabled} >
          Agregar Signos Vitales
        </button>
      </div>     
    </form>
  )
}

export default VitalSignsForm