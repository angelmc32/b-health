import React, { useEffect, useState, useContext } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import useForm from '../../hooks/useForm';
import UIkit from 'uikit';
import moment from 'moment';

import { getEmergencies, getEmergency, createEmergency } from '../../services/emergency-services';
import EmergencyForm from './EmergencyForm';
import EmergencyInfo from './EmergencyInfo';

const Emergency = () => {

  // Destructure form state variable, handleInput and handleFileInput functions for form state manipulation
  const { form, handleInput } = useForm();

  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user
  const { user, route, setRoute, objectHandler, setObjectHandler } = useContext(AppContext);
  const [ emergency, setEmergency ] = useState({});
  const [ emergencies, setEmergencies ] = useState([]);
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

    getEmergencies()
    .then( res => {
      
      const { emergencies } = res.data;
      setEmergencies(emergencies);
      setRoute('emergencies');

    })
    
  }, [isButtonDisabled]);

  const handleSubmit = (event) => {

    event.preventDefault();
    setIsButtonDisabled(true);
    
    let datetime;

    if ( form.timeperiod === 'AM' ) {
      if ( form['time-hours'] === '12' )
        datetime = form['only-date']+'T00'+':'+form['time-minutes']+':00';
      else
        datetime = form['only-date']+'T'+form['time-hours']+':'+form['time-minutes']+':00';
    }
    else {
      if ( form['time-hours'] === '12' )
        datetime = form['only-date']+'T12'+':'+form['time-minutes']+':00';
      else {
        switch (form['time-hours']) {
          case '1': datetime = form['only-date']+'T13'+':'+form['time-minutes']+':00'; break;
          case '2': datetime = form['only-date']+'T14'+':'+form['time-minutes']+':00'; break;
          case '3': datetime = form['only-date']+'T15'+':'+form['time-minutes']+':00'; break;
          case '4': datetime = form['only-date']+'T16'+':'+form['time-minutes']+':00'; break;
          case '5': datetime = form['only-date']+'T17'+':'+form['time-minutes']+':00'; break;
          case '6': datetime = form['only-date']+'T18'+':'+form['time-minutes']+':00'; break;
          case '7': datetime = form['only-date']+'T19'+':'+form['time-minutes']+':00'; break;
          case '8': datetime = form['only-date']+'T20'+':'+form['time-minutes']+':00'; break;
          case '9': datetime = form['only-date']+'T21'+':'+form['time-minutes']+':00'; break;
          case '10': datetime = form['only-date']+'T22'+':'+form['time-minutes']+':00'; break;
          case '11': datetime = form['only-date']+'T23'+':'+form['time-minutes']+':00'; break;
          default: datetime = form['only-date']+'T12'+':'+form['time-minutes']+':00';
        }
      }
    }

    form['date'] = datetime;
    console.log(datetime)

    createEmergency(form)
    .then( res => {

      const { emergency } = res.data    // Destructure updated preferences document from response

      // Send UIkit success notification
      UIkit.notification({
        message: `<span uk-icon='close'></span> '¡La urgencia fue creada exitosamente!'`,
        pos: 'bottom-center',
        status: 'success'
      });

      setRoute('emergencies');
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

  // const toggleButton = () => setIsButtonDisabled(!isButtonDisabled);
  
  const loadEmergency = (emergency) => {
    setEmergency(emergency);
    setRoute('read');
  }

  const goToPrescription = (event, emergency, newRoute) => {
    event.preventDefault();
    setEmergency(emergency);
    setObjectHandler(emergency);
    setRoute(newRoute);
    console.log(objectHandler)
  }

  const goToStudies = (event, emergency, newRoute) => {
    event.preventDefault();
    setObjectHandler(emergency);
    setRoute(newRoute);
    console.log(objectHandler);
  }

  return (
    <div className="content">
      
        { route === 'emergencies' ? (
          <div className="uk-section">
            <h2>Urgencias</h2>
            <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('create')} >
              + Nueva Urgencia
            </button>
            <div className="uk-overflow-auto">
              { emergencies.length < 1 ? (
                  <h4 className="uk-text-danger">No has agregado urgencias</h4>
                ) : null
              }
              <table className="uk-table uk-table-striped uk-table-hover uk-table-middle">
                <thead>
                  <tr>
                    <th className="uk-text-center">Fecha</th>
                    <th className="uk-text-center">Hora</th>
                    <th className="uk-text-center uk-visible@s">Motivo de visita</th>
                    <th className="uk-text-center uk-visible@s">Diagnóstico</th>
                    <th className="uk-text-center uk-visible@s">Doctor</th>
                    <th className="uk-text-center">Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  { emergencies ? 
                      emergencies.map( (emergency, index) => 
                        <tr key={index} >
                          <td className="uk-text-center">{moment(emergency.date).locale('es').format('l')}</td>
                          <td className="uk-text-center">{moment(emergency.date).locale('es').format('LT')}</td>
                          <td className="uk-text-center uk-visible@s">{emergency.chief_complaint}</td>
                          <td className="uk-text-center uk-visible@s">{emergency.diagnosis}</td>
                          <td className="uk-text-center uk-visible@s">{`Dr. ${emergency.doctor}`}</td>
                          <td className="uk-text-center">
                            <button className="uk-button uk-button-default uk-button-small uk-border-pill" onClick={event => loadEmergency({emergency})} >
                              Ver
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
                                  <h3 className="uk-text-center">Datos de la Urgencia</h3>
                                  <p>Fecha: {moment(emergency.date).locale('es').format('LL')}</p>
                                  <p>Clínica: {emergency.facility_name}</p>
                                </div>
                                <div className="uk-modal-body uk-flex uk-flex-column">
                                  { emergency.treatment ? (
                                      <button className="uk-button uk-button-default uk-border-pill uk-margin" onClick={event => goToPrescription(event, emergency, 'read')} >
                                        <NavLink to="/recetas">Ver Receta</NavLink>
                                      </button>
                                    ) : (
                                      <button className="uk-button uk-button-default uk-border-pill uk-margin" onClick={event => goToPrescription(event, emergency, 'create')} >
                                        <NavLink to="/recetas">Agregar Receta</NavLink>
                                      </button>
                                    )
                                  }
                                  { emergency.treatment ? (
                                      <button className="uk-button uk-button-default uk-border-pill uk-margin" onClick={event => goToStudies(event, emergency, 'read')} >
                                        <NavLink to="/estudios">Ver Estudios</NavLink>
                                      </button>
                                    ) : (
                                      <button className="uk-button uk-button-default uk-border-pill uk-margin" onClick={event => goToStudies(event, emergency, 'create')} >
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
                        <td>Cargando</td>
                        <td>Cargando</td>
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
                  <h2>Nueva Urgencia</h2>
                  <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('emergencies')} >
                    Regresar
                  </button>
                  <EmergencyForm handleSubmit={handleSubmit} handleInput={handleInput} form={form} isButtonDisabled={isButtonDisabled} />
                </div>
              </div>
            ) : (
              route === 'read' ? (
                <div className="uk-section">
                  <h2>Ver Urgencia</h2>
                  <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('emergencies')} >
                    Regresar
                  </button>
                  <EmergencyInfo {...emergency} />
                </div>
              ) : (
                <div className="uk-section">
                  <h2>Cargando...</h2>
                  <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('emergencies')} >
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

export default Emergency