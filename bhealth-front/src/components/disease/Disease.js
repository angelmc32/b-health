import React, { useEffect, useState, useContext } from 'react';
import { useHistory, NavLink } from 'react-router-dom';                      // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import useForm from '../../hooks/useForm';                          // Import useForm custom hook
import UIkit from 'uikit';                                          // Import UIkit for notifications
import moment from 'moment';                                        // Import momentjs for date formatting

import { getConsultations } from '../../services/consultation-services';
import { getEmergencies } from '../../services/emergency-services';
import { getHospitalizations } from '../../services/hospitalization-services';

const Disease = () => {

  // Destructure form state variable, handleInput and handleFileInput functions for form state manipulation
  const { form, handleInput } = useForm();

  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user
  const { user, route, setRoute, objectHandler, setObjectHandler } = useContext(AppContext);
  const [ disease, setDisease] = useState({});
  const [ diseases, setDiseases ] = useState([]);
  const [ consultations, setConsultations ] = useState([]);
  const [ emergencies, setEmergencies ] = useState([]);
  const [ hospitalizations, setHospitalizations ] = useState([]);
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(false);

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

    getConsultations()
    .then( res => {
      
      const { consultations } = res.data;
      setConsultations(consultations);

      for ( let i = 0 ; i < consultations.length ; i++ ) {
        disease.push(consultations.diagnosis)
      }

    })

    getEmergencies()
    .then( res => {
      
      const { emergencies } = res.data;
      setEmergencies(emergencies);

      for ( let i = 0 ; i < emergencies.length ; i++ ) {
        disease.push(emergencies.diagnosis)
      }

    })

    getHospitalizations()
    .then( res => {
      
      const { hospitalizations } = res.data;
      setHospitalizations(hospitalizations);

      for ( let i = 0 ; i < hospitalizations.length ; i++ ) {
        disease.push(hospitalizations.diagnosis)
      }

    })
    
  }, [isButtonDisabled]);

  // const handleSubmit = (event) => {

  //   event.preventDefault();
  //   console.log(form);
  //   setIsButtonDisabled(true);

  //   createConsultation(form)
  //   .then( res => {

  //     const { consultation } = res.data    // Destructure updated preferences document from response
  //     console.log(consultation)

  //     // Send UIkit success notification
  //     UIkit.notification({
  //       message: `<span uk-icon='close'></span> '¡La consulta fue creada exitosamente!'`,
  //       pos: 'bottom-center',
  //       status: 'success'
  //     });

  //     setRoute('consultations');
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

  // const toggleButton = () => setIsButtonDisabled(!isButtonDisabled);
  
  const loadDisease = (disease) => {
    setDisease(disease);
    setRoute('read');
  }

  // const goToPrescription = (event, consultation, newRoute) => {
  //   event.preventDefault();
  //   setConsultation(consultation);
  //   setObjectHandler(consultation);
  //   setRoute(newRoute);
  //   console.log(objectHandler)
  // }

  // const goToStudies = (event, consultation, newRoute) => {
  //   event.preventDefault();
  //   setObjectHandler(consultation);
  //   setRoute(newRoute);
  //   console.log(objectHandler);
  // }

  return (

    <div className="content">
      
        <h2>Padecimientos</h2>
      
    </div>
    
  )
}

export default Disease