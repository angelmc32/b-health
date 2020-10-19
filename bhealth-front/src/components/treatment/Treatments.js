import React, { useEffect, useState, useContext, Fragment } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import useForm from '../../hooks/useForm';                          // Import useForm custom hook
import UIkit from 'uikit';                                          // Import UIkit for notifications
import moment from 'moment';                                        // Import momentjs for date formatting
import 'moment/locale/es'  // without this line it didn't work

import { getTreatments } from '../../services/treatment-services'
import { getDrugs } from '../../services/drug-services'

const Treatments = ({ push }) => {

  // Destructure form state variable, handleInput and handleFileInput functions for form state manipulation
  const { form, handleInput } = useForm();
  let { path, url } = useRouteMatch();
  const { user, route, setRoute, objectHandler, setObjectHandler, resetUserContext } = useContext(AppContext);
  let currentHour = moment().format('H');
  let today = moment().format();

  const [ treatments, setTreatments ] = useState([]);
  const [ prevTreatments, setPrevTreatments ] = useState([]);
  const [ drugs, setDrugs ] = useState([]);
  const [ state, setState ] = useState({
    isButtonDisabled: false,
    spinnerState: true,
    morningArray: [],
    afternoonArray: [],
    nightArray: [],
    anytimeArray: []
  })

  useEffect( () => {

    if ( !user._id ) {    // If there is no user logged in, send a notification and "redirect" to login

      // Send UIkit warning notification: User must log in
      UIkit.notification({
        message: '<p class="uk-text-center">Por favor inicia sesión</p>',
        pos: 'bottom-center',
        status: 'warning'
      });
      
      return push('/login');         // If not logged in, "redirect" user to login

    }

    else {

      currentHour = moment().format('H');
      let previousTreatments = [], currentTreatments = [];

      getTreatments()
      .then( res => {
        const { treatments } = res.data;
        treatments.map( treatment => {
          if ( moment(treatment.end_date).isBefore(today, 'day') )
            previousTreatments.push(treatment);
          else
            currentTreatments.push(treatment);
        });
        setPrevTreatments(previousTreatments);
        setTreatments(currentTreatments);
      })
      .catch( res => {

        console.log(res.response)

        let { msg } = res.response.data

        if (res.response.status === 401) {
          localStorage.clear();
          resetUserContext();
          UIkit.notification({
            message: '<p class="uk-text-center">Por favor inicia sesión</p>',
            pos: 'bottom-center',
            status: 'warning'
          });
          push('/login');
        } else
            UIkit.notification({
              message: `<p class="uk-text-center">${msg}</p>`,
              pos: 'bottom-center',
              status: 'danger'
            });
      });
      
      getDrugs()
      .then( res => {
        
        const { drugs } = res.data;
        setDrugs(drugs);

        drugs.map( drug => {
          if ( drug.isCurrentTreatment ) {
            if ( drug.schedule.some( scheduleElement => scheduleElement.slice(0,2) >= 4 && scheduleElement.slice(0,2) < 12 ) )
              state.morningArray.push(drug)
            if ( drug.schedule.some( scheduleElement => scheduleElement.slice(0,2) >= 12 && scheduleElement.slice(0,2) < 20 ) )
              state.afternoonArray.push(drug)
            if ( drug.schedule.some( scheduleElement => scheduleElement.slice(0,2) >= 20 || scheduleElement.slice(0,2) < 4 ) )
              state.nightArray.push(drug)
            if ( drug.frequency === 'Uso único' || drug.frequency === 'Según sea necesario' )
              state.anytimeArray.push(drug)
          }
          else return null
        })

        setState( prevState => ({...prevState, spinnerState: false}))

      })
      .catch( res => {

        console.log(res.response)

        let { msg } = res.response.data

        if (res.response.status === 401) {
          localStorage.clear();
          resetUserContext();
          UIkit.notification({
            message: '<p class="uk-text-center">Por favor inicia sesión</p>',
            pos: 'bottom-center',
            status: 'warning'
          });
          push('/login');
        } else
            UIkit.notification({
              message: `<p class="uk-text-center">${msg}</p>`,
              pos: 'bottom-center',
              status: 'danger'
            });
      });
    }
  }, [])

  const openTimeOfTheDay = (time, drugsArray) => {
    push({pathname: `${url}/${time}`, state: {drugsArray}})
  }


  
  return (
    <Fragment>
      <h2>Mis Tratamientos</h2>
      <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => push(`${url}/registrar`)} >
        + Tratamiento
      </button>
      <div className="uk-margin">
        <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin-small-top">
          <ul className="uk-flex uk-flex-center uk-width-1-1 uk-margin-remove@s" uk-tab="connect: #my-id" >
            <li><a href="#">Previos</a></li>
            <li className="uk-active"><a href="#">Actuales</a></li>
            <li><a href="#">Pastillero</a></li>
          </ul>
        </div>
        <div id="my-id" className="uk-switcher" uk-switcher="true">
        <div className="uk-overflow-auto">
            { prevTreatments.length > 0 ?
              <table className="uk-table uk-table-striped uk-table-hover uk-table-middle">
                <thead>
                  <tr>
                    <th className="uk-text-center">Nombre</th>
                    <th className="uk-text-center uk-visible@s">Inicio</th>
                    <th className="uk-text-center uk-visible@s">Fin</th>
                    <th className="uk-text-center">Detalles</th>
                    <th className="uk-text-center">Modificar</th>
                  </tr>
                </thead>
                <tbody>
                  { prevTreatments.length > 0 ? 
                      prevTreatments.map( (treatment, index) => 
                        <tr key={index} >
                          <td className="uk-text-center">{treatment.name}</td>
                          <td className="uk-text-center uk-visible@s">{moment(treatment.start_date).locale('es').format('L')}</td>
                          <td className="uk-text-center uk-visible@s">
                            { treatment.end_date ? moment(treatment.end_date).locale('es').format('L') :
                            <a className="eva-edit" onClick={event => push({pathname: `${url}/editar`, state: {treatment: treatment}}) } >
                              No registrada
                            </a>
                            }
                          </td>
                          <td className="uk-text-center">
                            <button className="uk-button uk-button-default uk-button-small uk-border-pill" onClick={event =>  push({pathname: '/tratamientos/ver', state: {treatment: treatment} }) } >
                              Ver
                            </button>
                          </td>
                          <td className="uk-width-1-6 uk-width-auto@s">
                            <a href={`#modal-sections-${index}`} uk-toggle={`target: #modal-sections-${index}`}>
                              <span className="uk-margin-small-right uk-text-primary" uk-icon="more-vertical"></span>
                            </a>
                            <div id={`modal-sections-${index}`} className="uk-flex-top" uk-modal="true">
                              <div className="uk-modal-dialog uk-margin-auto-vertical">
                                <button className="uk-modal-close-default" type="button" uk-close="true" />
                                <div className="uk-modal-header">
                                  <h3 className="uk-text-center">Datos del Tratamiento</h3>
                                  <p className="uk-text-center">Nombre: {treatment.name}</p>
                                  <p className="uk-text-center">Fecha Inicio: {moment(treatment.start_date).locale('es').format('LL')}</p>
                                  { treatment.end_date ? 
                                    <p className="uk-text-center">Fecha Fin: {moment(treatment.end_date).locale('es').format('LL')}</p>
                                    : 
                                    <Fragment>
                                      <p className="uk-text-center">Fecha Fin: <span className="uk-text-danger">No registrada</span></p>
                                      <div className="uk-flex uk-flex-center">
                                        <button className="uk-modal-close uk-button uk-button-default uk-border-pill" onClick={event => push({pathname: `${url}/editar`, state: {treatment: treatment}}) } >
                                          Completar Información
                                        </button>
                                      </div>
                                    </Fragment>
                                  }
                                  
                                </div>
                                <div className="uk-modal-body uk-padding-small uk-flex uk-flex-column uk-flex-middle">
                                  { treatment.prescription ? (
                                      <button className="uk-modal-close uk-button uk-button-default uk-border-pill uk-margin-small uk-width-4-5 uk-width-1-2@s" onClick={event => push({ pathname: '/recetas/ver', state: {prescriptionID: treatment.prescription} }) } >
                                        Ver Receta
                                      </button>
                                    ) : null
                                  }
                                </div>
                                <div className="uk-modal-footer uk-flex uk-flex-column uk-flex-middle">
                                  <button className="uk-modal-close uk-button uk-button-primary uk-border-pill uk-margin-small uk-width-4-5 uk-width-1-2@s"  onClick={event => push({pathname: `${url}/editar`, state: {treatment: treatment}}) } >
                                    Modificar
                                  </button>
                                  <button className="uk-modal-close uk-button uk-button-danger uk-border-pill uk-margin-small uk-width-4-5 uk-width-1-2@s" onClick={event => push({pathname: `${url}/eliminar`, state: {treatment: treatment}}) } >
                                    Eliminar
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : 
                      null
                  }
                </tbody>
              </table>
            : <h5>No tienes tratamientos previos registrados</h5>
          }</div>
          <div className="uk-overflow-auto">
            { treatments.length > 0 ?
              <table className="uk-table uk-table-striped uk-table-hover uk-table-middle">
                <thead>
                  <tr>
                    <th className="uk-text-center">Nombre</th>
                    <th className="uk-text-center uk-visible@s">Inicio</th>
                    <th className="uk-text-center uk-visible@s">Fin</th>
                    <th className="uk-text-center">Detalles</th>
                    <th className="uk-text-center">Modificar</th>
                  </tr>
                </thead>
                <tbody>
                  { treatments.length > 0 ? 
                      treatments.map( (treatment, index) => 
                        <tr key={index} >
                          <td className="uk-text-center">{treatment.name}</td>
                          <td className="uk-text-center uk-visible@s">{moment(treatment.start_date).locale('es').format('L')}</td>
                          <td className="uk-text-center uk-visible@s">
                            { treatment.end_date ? moment(treatment.end_date).locale('es').format('L') :
                            <a className="eva-edit" onClick={event => push({pathname: `${url}/editar`, state: {treatment: treatment}}) } >
                              No registrada
                            </a>
                            }
                          </td>
                          <td className="uk-text-center">
                            <button className="uk-button uk-button-default uk-button-small uk-border-pill" onClick={event =>  push({pathname: '/tratamientos/ver', state: {treatment: treatment} }) } >
                              Ver
                            </button>
                          </td>
                          <td className="uk-width-1-6 uk-width-auto@s">
                            <a href={`#modal-sections-${index}`} uk-toggle={`target: #modal-sections-${index}`}>
                              <span className="uk-margin-small-right uk-text-primary" uk-icon="more-vertical"></span>
                            </a>
                            <div id={`modal-sections-${index}`} className="uk-flex-top" uk-modal="true">
                              <div className="uk-modal-dialog uk-margin-auto-vertical">
                                <button className="uk-modal-close-default" type="button" uk-close="true" />
                                <div className="uk-modal-header">
                                  <h3 className="uk-text-center">Datos del Tratamiento</h3>
                                  <p className="uk-text-center">Nombre: {treatment.name}</p>
                                  <p className="uk-text-center">Fecha Inicio: {moment(treatment.start_date).locale('es').format('LL')}</p>
                                  { treatment.end_date ? 
                                    <p className="uk-text-center">Fecha Fin: {moment(treatment.end_date).locale('es').format('LL')}</p>
                                    : 
                                    <Fragment>
                                      <p className="uk-text-center">Fecha Fin: <span className="uk-text-danger">No registrada</span></p>
                                      <div className="uk-flex uk-flex-center">
                                        <button className="uk-modal-close uk-button uk-button-default uk-border-pill" onClick={event => push({pathname: `${url}/editar`, state: {treatment: treatment}}) } >
                                          Completar Información
                                        </button>
                                      </div>
                                    </Fragment>
                                  }
                                  
                                </div>
                                <div className="uk-modal-body uk-padding-small uk-flex uk-flex-column uk-flex-middle">
                                  { treatment.prescription ? (
                                      <button className="uk-modal-close uk-button uk-button-default uk-border-pill uk-margin-small uk-width-4-5 uk-width-1-2@s" onClick={event => push({ pathname: '/recetas/ver', state: {prescriptionID: treatment.prescription} }) } >
                                        Ver Receta
                                      </button>
                                    ) : null
                                  }
                                </div>
                                <div className="uk-modal-footer uk-flex uk-flex-column uk-flex-middle">
                                  <button className="uk-modal-close uk-button uk-button-primary uk-border-pill uk-margin-small uk-width-4-5 uk-width-1-2@s"  onClick={event => push({pathname: `${url}/editar`, state: {treatment: treatment}}) } >
                                    Modificar
                                  </button>
                                  <button className="uk-modal-close uk-button uk-button-danger uk-border-pill uk-margin-small uk-width-4-5 uk-width-1-2@s" onClick={event => push({pathname: `${url}/eliminar`, state: {treatment: treatment}}) } >
                                    Eliminar
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : 
                      null
                  }
                </tbody>
              </table>
            : <h5 className="uk-text-danger">No tienes tratamientos actuales</h5>
          }
          </div>
          <div className="uk-container">
            <div className="uk-child-width-1-4@m uk-child-width-1-2 uk-grid-small uk-grid-match" uk-grid="true">
              <div onClick={ (event) => { openTimeOfTheDay('manana', state.morningArray) } } >
                <div className={ currentHour < 12 ? "uk-card uk-card-secondary uk-card-hover uk-card-body uk-padding-small" : "uk-card uk-card-hover uk-card-body uk-padding-small"}>
                  <h5>Mañana</h5>
                  { !state.spinnerState ? 
                      !state.morningArray.length ?
                        <p className="uk-text-danger">Sin registros</p>
                      :
                        state.morningArray.map( (drug, index) => {
                          return <p key={index}>{drug.name}</p>
                        })
                    : <div uk-spinner="true"></div>
                  }
                </div>
              </div>
              <div onClick={ (event) => { openTimeOfTheDay('tarde', state.afternoonArray) } } >
                <div className={ currentHour >= 12 && currentHour < 20 ? "uk-card uk-card-secondary uk-card-hover uk-card-body uk-padding-small" : "uk-card uk-card-hover uk-card-body uk-padding-small"}>
                  <h5>Tarde</h5>
                  { !state.spinnerState ? 
                      !state.afternoonArray.length ?
                        <p className="uk-text-danger">Sin registros</p>
                      :
                        state.afternoonArray.map( (drug, index) => {
                          return <p key={index}>{drug.name}</p>
                        })
                    : <div uk-spinner="true"></div>
                  }
                </div>
              </div>
              <div onClick={ (event) => { openTimeOfTheDay('noche', state.nightArray) } } >
                <div className={ currentHour >= 20 ? "uk-card uk-card-secondary uk-card-hover uk-card-body uk-padding-small" : "uk-card uk-card-hover uk-card-body uk-padding-small"}>
                  <h5>Noche</h5>
                  { !state.spinnerState ? 
                      !state.nightArray.length ?
                        <p className="uk-text-danger">Sin registros</p>
                      :
                        state.nightArray.map( (drug, index) => {
                          return <p key={index}>{drug.name}</p>
                        })
                    : <div uk-spinner="true"></div>
                  }
                </div>
              </div>
              <div  onClick={ (event) => { openTimeOfTheDay('sin-horario', state.anytimeArray) } } >
                <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                  <h5>Sin horario</h5>
                  { !state.spinnerState ? 
                      !state.anytimeArray.length ?
                        <p className="uk-text-danger">Sin registros</p>
                      :
                        state.anytimeArray.map( (drug, index) => {
                          return <p key={index}>{drug.name}</p>
                        })
                    : <div uk-spinner="true"></div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Treatments