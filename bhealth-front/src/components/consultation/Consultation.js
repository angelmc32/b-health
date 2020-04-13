import React, { useEffect, useState, useContext } from 'react';
import { useHistory, NavLink } from 'react-router-dom';                      // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import useForm from '../../hooks/useForm';                          // Import useForm custom hook
import UIkit from 'uikit';                                          // Import UIkit for notifications
import moment from 'moment';                                        // Import momentjs for date formatting
import 'moment/locale/es'  // without this line it didn't work

import { getConsultations, createConsultation } from '../../services/consultation-services';
import { createVitalSigns } from '../../services/vitalsigns-services'
import ConsultationForm from './ConsultationForm';
import ConsultationFormSpecial from './ConsultationFormSpecial'
import ConsultationInfo from './ConsultationInfo';

moment.locale('es')

const Consultation = () => {

  // Destructure form state variable, handleInput and handleFileInput functions for form state manipulation
  const { form, handleInput } = useForm();

  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user
  const { user, route, setRoute, objectHandler, setObjectHandler } = useContext(AppContext);
  const [consultation, setConsultation] = useState({});
  const [ consultations, setConsultations ] = useState([]);
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(false);
  const [ vitalsFormValues, setVitalsFormValues ] = useState({temperature: null, blood_pressure_sys: null, blood_pressure_dias: null, blood_sugar: null, heart_rate: null, weight: null});

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
      setRoute('consultations');

    })
    
  }, [isButtonDisabled]);

  const handleSubmit = (event) => {

    event.preventDefault();
    setIsButtonDisabled(true);

    createConsultation(form)
    .then( res => {

      const { consultation } = res.data    // Destructure updated preferences document from response

      vitalsFormValues['consultation'] = consultation._id

      // setVitalsFormValues( currentValues => ({
      //   ...currentValues,
      //   [date]: event.target.value
      // }))

      // createVitalSigns(vitalsFormValues)
      // .then( res => {

      //   const { vitalsigns } = res.data;

      // })
      // .catch( error => {
      //   console.log('error creando signos vitales');
      //   console.log(error);
      // })

      // Send UIkit success notification
      UIkit.notification({
        message: `<span uk-icon='close'></span> '¡La consulta fue creada exitosamente!'`,
        pos: 'bottom-center',
        status: 'success'
      });

      setRoute('consultations');
      setIsButtonDisabled(false);

    })
    .catch( error => {

      console.log(error);

      // Send UIkit error notification
      UIkit.notification({
        message: `<span uk-icon='close'></span> ${error}`,
        pos: 'bottom-center',
        status: 'danger'
      });
      
      setIsButtonDisabled(false);

    });

  }

  const toggleButton = () => setIsButtonDisabled(!isButtonDisabled);
  
  const loadConsultation = (consultation) => {
    setConsultation(consultation);
    setRoute('read');
  }

  const goToPrescription = (event, consultation, newRoute) => {
    event.preventDefault();
    setConsultation(consultation);
    setObjectHandler(consultation);
    setRoute(newRoute);
    console.log(objectHandler)
  }

  const goToStudies = (event, consultation, newRoute) => {
    event.preventDefault();
    setObjectHandler(consultation);
    setRoute(newRoute);
    console.log(objectHandler);
  }

  return (

    <div className="content">
      
        { route === 'consultations' ? (
          <div className="uk-section">
            <h2>Consultas</h2>
            <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('create')} >
              + Nueva Consulta
            </button>
            <div className="uk-overflow-auto">
              { consultations.length < 1 ? (
                  <h4 className="uk-text-danger">No has agregado consultas</h4>
                ) : null
              }
              <table className="uk-table uk-table-striped uk-table-hover uk-table-middle">
                <thead>
                  <tr>
                    <th className="uk-text-center">Fecha</th>
                    <th className="uk-text-center uk-visible@s">Motivo de consulta</th>
                    <th className="uk-text-center uk-visible@s">Diagnostico</th>
                    <th className="uk-text-center uk-visible@s">Doctor</th>
                    <th className="uk-text-center">Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  { consultations ? 
                      consultations.map( (consultation, index) => 
                        <tr key={index} >
                          <td className="uk-text-center">{moment(consultation.date).locale('es').format('LL')}</td>
                          <td className="uk-text-center uk-visible@s">{consultation.chief_complaint}</td>
                          <td className="uk-text-center uk-visible@s">{consultation.diagnosis}</td>
                          <td className="uk-text-center uk-visible@s">{`Dr. ${consultation.doctor}`}</td>
                          <td className="uk-text-center">
                            <button className="uk-button uk-button-default uk-button-small uk-border-pill" onClick={event => loadConsultation({consultation})} >
                              Ver Consulta
                            </button>
                          </td>
                          <td>
                            <a href={`#modal-sections-${index}`} uk-toggle={`target: #modal-sections-${index}`}>
                              <span className="uk-margin-small-right" uk-icon="more-vertical"></span>
                            </a>
                            <div id={`modal-sections-${index}`} className="uk-flex-top" uk-modal="true">
                              <div className="uk-modal-dialog uk-margin-auto-vertical">
                                <button className="uk-modal-close-default" type="button" uk-close="true" />
                                <div className="uk-modal-header">
                                  <h3 className="uk-text-center">Datos de la Consulta</h3>
                                  <p>Fecha: {moment(consultation.date).locale('es').format('LL')}</p>
                                  <p>Doctor: {consultation.doctor}</p>
                                </div>
                                <div className="uk-modal-body uk-flex uk-flex-column">
                                  { consultation.prescription ? (
                                      <button className="uk-button uk-button-default uk-border-pill uk-margin" onClick={event => goToPrescription(event, consultation, 'read')} >
                                        <NavLink to="/recetas">Ver Receta</NavLink>
                                      </button>
                                    ) : (
                                      <button className="uk-button uk-button-default uk-border-pill uk-margin" onClick={event => goToPrescription(event, consultation, 'create')} >
                                        <NavLink to="/recetas">Agregar Receta</NavLink>
                                      </button>
                                    )
                                  }
                                  { consultation.studies ? (
                                      <button className="uk-button uk-button-default uk-border-pill uk-margin" onClick={event => goToStudies(event, consultation, 'read')} >
                                        <NavLink to="/estudios">Ver Estudios</NavLink>
                                      </button>
                                    ) : (
                                      <button className="uk-button uk-button-default uk-border-pill uk-margin" onClick={event => goToStudies(event, consultation, 'create')} >
                                        <NavLink to="/estudios">Agregar Estudios</NavLink>
                                      </button>
                                    )
                                  }
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    : <tr>
                        <td className="uk-text-center">Cargando</td>
                        <td className="uk-text-center uk-visible@s">Cargando</td>
                        <td className="uk-text-center uk-visible@s">Cargando</td>
                        <td className="uk-text-center uk-visible@s">Cargando</td>
                        <td className="uk-text-center">Cargando</td>
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
                  <h2>Nueva Consulta</h2>
                  <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('consultations')} >
                    Regresar
                  </button>
                  <ConsultationFormSpecial handleSubmit={handleSubmit} handleInput={handleInput} form={form} isButtonDisabled={isButtonDisabled} setVitalsFormValues={setVitalsFormValues}/>
                </div>
              </div>
            ) : (
              route === 'read' ? (
                <div className="uk-section">
                  <h2>Ver Consulta</h2>
                  <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('consultations')} >
                    Regresar
                  </button>
                  <ConsultationInfo {...consultation} goToPrescription={goToPrescription} />
                </div>
              ) : (
                <div className="uk-section">
                  <h2>Cargando...</h2>
                  <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('consultations')} >
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

export default Consultation