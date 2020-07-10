import React, { useEffect, useState, useContext } from 'react';
import { useHistory, NavLink } from 'react-router-dom';                      // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import useForm from '../../hooks/useForm';                          // Import useForm custom hook
import UIkit from 'uikit';                                          // Import UIkit for notifications
import moment from 'moment';                                        // Import momentjs for date formatting
import 'moment/locale/es'  // without this line it didn't work

import { getConsultations, getConsultation, createConsultation, deleteConsultation, editConsultation } from '../../services/consultation-services';

// import { createVitalSigns } from '../../services/vitalsigns-services'
// import ConsultationForm from './ConsultationForm';
import ConsultationFormSpecial from './ConsultationFormSpecial'
import ConsultationInfo from './ConsultationInfo';
import { reset } from '../../services/auth-services';

moment.locale('es')

const Consultation = () => {

  // Destructure form state variable, handleInput and handleFileInput functions for form state manipulation
  const { form, setForm, resetForm, handleInput } = useForm();

  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user
  const { user, route, setRoute, objectHandler, setObjectHandler, resetUserContext } = useContext(AppContext);
  const [consultation, setConsultation] = useState({});
  const [ consultations, setConsultations ] = useState([]);
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(false);
  const [ vitalsFormValues, setVitalsFormValues ] = useState({temperature: null, blood_pressure_sys: null, blood_pressure_dias: null, blood_sugar: null, heart_rate: null, weight: null});

  useEffect( () => {

    if ( !user._id ) {    // If there is no user logged in, send a notification and "redirect" to login

      // Send UIkit warning notification: User must log in
      UIkit.notification({
        message: `<p class="uk-text-center">Por favor inicia sesión.`,
        pos: 'bottom-center',
        status: 'warning'
      });
      
      return push('/login');         // If not logged in, "redirect" user to login

    };

    if ( route === 'consultations' || route === 'none' ) {
      
      getConsultations()
      .then( res => {
        
        const { consultations } = res.data;
        setConsultations(consultations);
        setRoute('consultations');

      })
      .catch( error => {
        if (error.response.status === 401) {
          localStorage.clear();
          resetUserContext();
          push('/login');
        }
      })

    }

    if ( route === 'special' ) {
      
      getConsultation(objectHandler)
      .then( res => {
        
        const { consultation } = res.data;
        loadConsultation({consultation}, 'read')
        // setConsultation(consultation);
        // setRoute('consultations');

      })
      .catch( error => {
        if (error.response.status === 401) {
          localStorage.clear();
          resetUserContext();
          push('/login');
        }
      })

    }
    
  }, [isButtonDisabled, route]);

  const handleSubmit = (event) => {

    event.preventDefault();
    setIsButtonDisabled(true);

    let datetime;

    if ( form['time-period'] === 'AM' ) {
      if ( form['time-hours'] === '12' )
        datetime = `${form['only-date']}T00:${form['time-minutes']}:00`;
      else if ( form['time-hours'] === '11' || form['time-hours'] === '10' )
        datetime = `${form['only-date']}T${form['time-hours']}:${form['time-minutes']}:00`;
      else
        datetime = `${form['only-date']}T0${form['time-hours']}:${form['time-minutes']}:00`;
    }
    else {
      if ( form['time-hours'] === '12' )
      datetime = `${form['only-date']}T12:${form['time-minutes']}:00`;
      else {
        switch (form['time-hours']) {
          case '1': datetime = `${form['only-date']}T13:${form['time-minutes']}:00`; break;
          case '2': datetime = `${form['only-date']}T14:${form['time-minutes']}:00`; break;
          case '3': datetime = `${form['only-date']}T15:${form['time-minutes']}:00`; break;
          case '4': datetime = `${form['only-date']}T16:${form['time-minutes']}:00`; break;
          case '5': datetime = `${form['only-date']}T17:${form['time-minutes']}:00`; break;
          case '6': datetime = `${form['only-date']}T18:${form['time-minutes']}:00`; break;
          case '7': datetime = `${form['only-date']}T19:${form['time-minutes']}:00`; break;
          case '8': datetime = `${form['only-date']}T20:${form['time-minutes']}:00`; break;
          case '9': datetime = `${form['only-date']}T21:${form['time-minutes']}:00`; break;
          case '10': datetime = `${form['only-date']}T22:${form['time-minutes']}:00`; break;
          case '11': datetime = `${form['only-date']}T23:${form['time-minutes']}:00`; break;
          default: datetime = `${form['only-date']}T12:${form['time-minutes']}:00`; break;
        }
      }
    }

    if ( route === 'create' || route === 'update' && form.isNewDate )
      form['date'] = datetime;

    if ( route === 'create') {
      createConsultation(form)
      .then( res => {

        const { consultation } = res.data    // Destructure updated preferences document from response

        vitalsFormValues['consultation'] = consultation._id

        // Send UIkit success notification
        UIkit.notification({
          message: '<p class="uk-text-center">La consulta fue creada exitosamente</p>',
          pos: 'bottom-center',
          status: 'success'
        });
        resetForm();
        setIsButtonDisabled(false);
        loadConsultation({consultation}, 'read')

      })
      .catch( res => {

        const { msg } = res.response.data;

        // Send UIkit error notification
        UIkit.notification({
          message: `<p class="uk-text-center">${msg}</p>`,
          pos: 'bottom-center',
          status: 'danger'
        });
        
        setIsButtonDisabled(false);

      });
    }
    else if ( route === 'update' ) {
      editConsultation(consultation.consultation._id, form)
      .then( res => {

        const { consultation } = res.data    // Destructure updated preferences document from response

        // Send UIkit success notification
        UIkit.notification({
          message: '<p class="uk-text-center">La consulta fue actualizada exitosamente</p>',
          pos: 'bottom-center',
          status: 'success'
        });
        setIsButtonDisabled(false);
        resetForm();
        loadConsultation({consultation}, 'read')

      })
      .catch( res => {

        const { msg } = res.response.data;

        // Send UIkit error notification
        UIkit.notification({
          message: `<p class="uk-text-center">${msg}</p>`,
          pos: 'bottom-center',
          status: 'danger'
        });
        
        setIsButtonDisabled(false);

      });
    }
  }

  const toggleButton = () => setIsButtonDisabled(!isButtonDisabled);
  
  const loadConsultation = (consultationData, newRoute) => {
    setConsultation(consultationData);
    setRoute(newRoute);
  }

  const deleteConsultationBtn = (consultationID) => {

    setIsButtonDisabled(true)

    deleteConsultation(consultationID)
    .then( consultation => {
      setIsButtonDisabled(false)
      // Send UIkit success notification
      UIkit.notification({
        message: `<span uk-icon='close'></span> Se ha eliminado la consulta exitosamente`,
        pos: 'bottom-center',
        status: 'success'
      });
      setRoute('consultations');
    })
    .catch( res => {
      // Send UIkit error notification
      UIkit.notification({
        message: `<span uk-icon='close'></span> No se ha podido eliminar la consulta`,
        pos: 'bottom-center',
        status: 'danger'
      });
      setRoute('consultations');
    });

  }

  const goToPrescription = (event, consultationData, newRoute) => {
    event.preventDefault();
    setConsultation(consultationData);
    setObjectHandler(consultationData);
    setRoute(newRoute);
    push('/recetas')
  }

  const goToStudies = (event, consultationData, newRoute) => {
    event.preventDefault();
    setConsultation(consultationData);
    setObjectHandler(consultationData);
    setRoute(newRoute);
    push('/estudios')
    console.log(objectHandler);
  }

  return (

    <div className="content">
      
        { route === 'consultations' || route === 'none' ? (
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
                    <th className="uk-text-center">Hora</th>
                    <th className="uk-text-center uk-visible@s">Motivo de consulta</th>
                    <th className="uk-text-center uk-visible@s">Diagnostico</th>
                    <th className="uk-text-center uk-visible@s">Médico</th>
                    <th className="uk-text-center">Detalles</th>
                    <th className="uk-text-center uk-visible@s">Modificar</th>
                  </tr>
                </thead>
                <tbody>
                  { consultations ? 
                      consultations.map( (consultation, index) => 
                        <tr key={index} >
                          <td className="uk-text-center">{moment(consultation.date).locale('es').format('LL')}</td>
                          <td className="uk-text-center">{moment(consultation.date).locale('es').format('LT')}</td>
                          <td className="uk-text-center uk-visible@s">{consultation.chief_complaint}</td>
                          <td className="uk-text-center uk-visible@s">{consultation.diagnosis}</td>
                          <td className="uk-text-center uk-visible@s">{`${consultation.doctor}`}</td>
                          <td className="uk-text-center">
                            <button className="uk-button uk-button-default uk-button-small uk-border-pill" onClick={event => loadConsultation({consultation}, 'read')} >
                              Ver
                            </button>
                          </td>
                          <td className="uk-width-1-6">
                            <a href={`#modal-sections-${index}`} uk-toggle={`target: #modal-sections-${index}`}>
                              <span className="uk-margin-small-right" uk-icon="more-vertical"></span>
                            </a>
                            <div id={`modal-sections-${index}`} className="uk-flex-top" uk-modal="true">
                              <div className="uk-modal-dialog uk-margin-auto-vertical">
                                <button className="uk-modal-close-default" type="button" uk-close="true" />
                                <div className="uk-modal-header">
                                  <h3 className="uk-text-center">Datos de la Consulta</h3>
                                  <p className="uk-text-center">Fecha: {moment(consultation.date).locale('es').format('LL')}</p>
                                  <p className="uk-text-center">Doctor: {consultation.doctor}</p>
                                </div>
                                <div className="uk-modal-body uk-flex uk-flex-column uk-flex-middle">
                                  { consultation.treatment ? (
                                      <button className="uk-modal-close uk-button uk-button-default uk-border-pill uk-margin-small uk-width-1-2@s" onClick={event => goToPrescription(event, consultation, 'special')} >
                                        <NavLink to="/recetas">Ver Receta</NavLink>
                                      </button>
                                    ) : (
                                      <button className="uk-modal-close uk-button uk-button-default uk-border-pill uk-margin-small uk-width-1-2@s" onClick={event => goToPrescription(event, consultation, 'create')} >
                                        <NavLink to="/recetas">Agregar Receta</NavLink>
                                      </button>
                                    )
                                  }
                                  { consultation.studies ? (
                                      <button className="uk-modal-close uk-button uk-button-default uk-border-pill uk-margin-small uk-width-1-2@s" onClick={event => goToStudies(event, consultation, 'read')} >
                                        <NavLink to="/estudios">Ver Estudios</NavLink>
                                      </button>
                                    ) : (
                                      <button className="uk-modal-close uk-button uk-button-default uk-border-pill uk-margin-small uk-width-1-2@s" onClick={event => goToStudies(event, consultation, 'create')} >
                                        <NavLink to="/estudios">Agregar Estudios</NavLink>
                                      </button>
                                    )
                                  }
                                  <button className="uk-modal-close uk-button uk-button-primary uk-border-pill uk-margin-small uk-width-1-2@s"  onClick={event => loadConsultation({consultation}, 'update')} >
                                    Modificar Consulta
                                  </button>
                                  <button className="uk-modal-close uk-button uk-button-danger uk-border-pill uk-margin-small uk-width-1-2@s" onClick={event => loadConsultation({consultation}, 'delete')} >
                                    Eliminar Consulta
                                  </button>
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
                  <ConsultationFormSpecial handleSubmit={handleSubmit} handleInput={handleInput} form={form} setForm={setForm} isButtonDisabled={isButtonDisabled} setVitalsFormValues={setVitalsFormValues}/>
                </div>
              </div>
            ) : (
              route === 'read' || route === 'delete' ? (
                <div className="uk-section">
                  <h2>{route === 'read' ? 'Ver Consulta' : 'Eliminar Consulta'}</h2>
                  { route === 'read' ? 
                      <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('consultations')} >
                        Regresar
                      </button>
                    : 
                    <div className="uk-width-1-1 uk-flex uk-flex-column uk-flex-middle uk-margin-large-bottom">
                      <div className="uk-width-1-1">
                        <p>¿Estás seguro que deseas eliminar la siguiente consulta?</p>
                      </div>
                      <div className="uk-width-4-5 uk-flex uk-flex-around">
                        <button className="uk-button uk-button-danger uk-border-pill uk-width-1-3" onClick={event=> deleteConsultationBtn(consultation.consultation._id)} disabled={isButtonDisabled}>
                          Sí
                        </button>
                        <button className="uk-button uk-button-default uk-border-pill uk-width-1-3" onClick={event => setRoute('consultations')} >
                          No
                        </button>
                      </div>
                    </div>
                  }
                  <ConsultationInfo {...consultation} goToPrescription={goToPrescription} />
                </div>
              ) : ( route === 'update' ? (
                <div className="uk-section">
                  <div className="uk-container">
                    <h2>Editar Consulta</h2>
                    <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('consultations')} >
                      Regresar
                    </button>
                    <ConsultationFormSpecial handleSubmit={handleSubmit} handleInput={handleInput} form={form} setForm={setForm} isButtonDisabled={isButtonDisabled} setVitalsFormValues={setVitalsFormValues} {...consultation}/>
                  </div>
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
          )
        }
      
    </div>
    
  )
}

export default Consultation