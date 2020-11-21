import React, { Fragment, useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';                      // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import UIkit from 'uikit';                                          // Import UIkit for notifications
import moment from 'moment';                                        // Import momentjs for date formatting
import 'moment/locale/es'  // without this line it didn't work

import { getStudies } from '../../services/study-services';

moment.locale('es')

const Study = ({ studyType, url }) => {

  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user
  const { user, resetUserContext } = useContext(AppContext);
  const [ studies, setStudies ] = useState([]);
  const [ state, setState ] = useState({
    loadingMsg: 'Cargando',
    isLoading: true,
    isError: false,
    errorMsg: 'Ha ocurrido un error, intenta de nuevo',
  });

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

    getStudies(studyType)
    .then( res => {
      const { studies } = res.data;
      setStudies(studies);
    })
    .catch( res => {

      let status;
      if ( res.response ) {
        setState( prevState => ({...prevState, errorMsg: res.response.data.msg}))
        status = res.response.status;
      }
      if (status === 401) {
        localStorage.clear();
        resetUserContext();
        UIkit.notification({
          message: `<p class="uk-text-center">${state.errorMsg}</p>`,
          pos: 'bottom-center',
          status: 'warning'
        });
        return push('/login');
      }
      else
        UIkit.notification({
          message: `<p class="uk-text-center">${state.errorMsg}</p>`,
          pos: 'bottom-center',
          status: 'danger'
        });
      
      setState( prevState => ({...prevState, isLoading: false, isError: true}))

    });
  }, [studyType]);

  return (
    <Fragment>
      <h2>{studyType === 'lab' ? "Laboratorio" : "Rayos X e Imagen"}</h2>
      <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={ event => push(`${url}/crear`) } >
        + Nuevo Estudio
      </button>
      <div className="uk-overflow-auto">
        { state.isLoading ?
            <h4>Cargando <div uk-spinner="true"></div></h4>
          :
          studies.length < 1 ? (
            <h4 className="uk-text-danger">{ state.isError ? state.errorMsg : "No has agregado estudios"}</h4>
          ) : null
        }
        <table className="uk-table uk-table-striped uk-table-hover uk-table-middle">
          <thead>
            <tr>
              <th className="uk-text-center">Fecha</th>
              <th className="uk-text-center uk-visible">Estudio</th>
              <th className="uk-text-center uk-visible@s">Consulta</th>
                <th className="uk-text-center">Detalles</th>
                <th className="uk-text-center uk-visible@s">Modificar</th>
            </tr>
          </thead>
          <tbody>
            { studies ? 
                studies.map( (study, index) => 
                  <tr key={index}>
                    <td className="uk-text-center">{moment(study.date).locale('es').format('LL')}</td>
                    <td className="uk-text-center uk-visible">{study.study_name}</td>
                    <td className="uk-text-center uk-visible@s">{study.consultation ? 
                      <button className="uk-button uk-button-default uk-button-small uk-border-pill" onClick={event => push({pathname: '/consultas/ver', state: {consultationID: study.consultation} }) } >
                        Ver Consulta
                      </button> 
                      : '-'}
                    </td>
                    <td className="uk-text-center">
                      <button className="uk-button uk-button-default uk-button-small uk-border-pill" onClick={event => push({pathname: `${url}/ver`, state: {study: study} }) } >
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
                              <h3 className="uk-text-center">Datos del Estudio</h3>
                              <p className="uk-text-center">Fecha: {moment(study.date).locale('es').format('LL')}</p>
                              <p className="uk-text-center">Doctor: {study.doctor}</p>
                            </div>
                            <div className="uk-modal-body uk-flex uk-flex-column uk-flex-middle">
                              { study.image === 'Sin imagen registrada' ? (
                                  <p className="uk-margin-small uk-text-center">Puedes agregar una imagen modificando el estudio</p>
                                ) : (
                                  <div className="uk-margin-small uk-width-1-1 uk-flex uk-flex-center" uk-lightbox="true">
                                    <a className="uk-button uk-button-default uk-border-pill uk-width-3-4 uk-width-1-2@s" href={study.image} data-alt="Image">Ver Imagen<span className="uk-margin-small-left" uk-icon="image"></span></a>
                                  </div>
                                )
                              }
                              <button className="uk-modal-close uk-button uk-button-primary uk-border-pill uk-margin-small uk-width-3-4 uk-width-1-2@s"  onClick={event => push({ pathname: `${url}/editar`,  state: {study: study} }) } >
                                Modificar
                              </button>
                              <button className="uk-modal-close uk-button uk-button-danger uk-border-pill uk-margin-small uk-width-3-4 uk-width-1-2@s" onClick={event => push({pathname: `${url}/eliminar`, state: {study: study} }) } >
                                Eliminar
                              </button>
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
                </tr>
          }
          </tbody>
        </table>
      </div>
    </Fragment>
  )
}

export default Study