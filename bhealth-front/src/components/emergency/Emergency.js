import React, { Fragment, useEffect, useState, useContext } from 'react';
import { useHistory, NavLink, useRouteMatch } from 'react-router-dom';                      // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import UIkit from 'uikit';                                          // Import UIkit for notifications
import moment from 'moment';                                        // Import momentjs for date formatting
import 'moment/locale/es'  // without this line it didn't work

import { getEmergencies } from '../../services/emergency-services';

moment.locale('es')

const Emergency = ({ url }) => {

  const { user, resetUserContext } = useContext(AppContext);
  const { push } = useHistory();
  const [ consultations, setConsultations ] = useState([]);

  useEffect( () => {

    if ( !user._id ) {    // If there is no user logged in, send a notification and "redirect" to login
      UIkit.notification({
        message: `<p class="uk-text-center">Por favor inicia sesión.`,
        pos: 'bottom-center',
        status: 'warning'
      });    
      return push('/login');         // If not logged in, "redirect" user to login
    };
      
    getEmergencies()
    .then( res => {
      
      const { emergencies } = res.data;
      setConsultations(emergencies);

    })
    .catch( error => {
      if (error.response.status === 401) {
        localStorage.clear();
        resetUserContext();
        push('/login');
      }
    })
    
  }, []);

  return (

    <Fragment>
      <h2>Urgencias</h2>
      <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => push(`${url}/crear`)} >
        + Nueva Urgencia
      </button>
      <div className="uk-overflow-auto">
        { consultations.length < 1 ? (
            <h4 className="uk-text-danger">No has agregado urgencias</h4>
          ) : null
        }
        <table className="uk-table uk-table-striped uk-table-hover uk-table-middle">
          <thead>
            <tr>
              <th className="uk-text-center">Fecha</th>
              <th className="uk-text-center">Hora</th>
              <th className="uk-text-center uk-visible@s">Motivo de consulta</th>
              <th className="uk-text-center uk-visible@s">Diagnóstico</th>
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
                    <td className="uk-text-center uk-visible@s uk-width-1-3@s">{consultation.diagnosis}</td>
                    <td className="uk-text-center uk-visible@s">{`${consultation.doctor}`}</td>
                    <td className="uk-text-center">
                      <button className="uk-button uk-button-default uk-button-small uk-border-pill" onClick={event => push({pathname: `${url}/ver`, state: {consultation: consultation}}) } >
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
                            <h3 className="uk-text-center">Datos de la Consulta</h3>
                            <p className="uk-text-center">Fecha: {moment(consultation.date).locale('es').format('LL')}</p>
                            <p className="uk-text-center">Doctor: {consultation.doctor}</p>
                          </div>
                          <div className="uk-modal-body uk-padding-small uk-flex uk-flex-column uk-flex-middle">
                            { consultation.treatment ? (
                                <button className="uk-modal-close uk-button uk-button-default uk-border-pill uk-margin-small uk-width-4-5 uk-width-1-2@s" onClick={event => push({ pathname: '/recetas/ver', state: {prescriptionID: consultation.treatment} }) } >
                                  Ver Receta
                                </button>
                              ) : (
                                <Fragment>
                                  <p className="uk-margin-remove">Agregar:</p>
                                  <button className="uk-modal-close uk-button uk-button-default uk-border-pill uk-margin-small uk-width-4-5 uk-width-1-2@s" onClick={event => push({ pathname: '/recetas/crear', state: {consultation: consultation} }) } >
                                    Receta
                                  </button>
                                </Fragment>
                              )
                            }
                            { consultation.studies.length > 0 ? (
                                <button className="uk-modal-close uk-button uk-button-default uk-border-pill uk-margin-small uk-width-4-5 uk-width-1-2@s" onClick={event => push('/laboratorio')} >
                                  Ver Estudios
                                </button>
                              ) : (
                                <Fragment>
                                  <p className="uk-margin-remove">{ !consultation.treatment ? "o Estudio:" : "Agregar Estudio:"}</p>
                                  <button className="uk-modal-close uk-button uk-button-default uk-border-pill uk-margin-small uk-width-4-5 uk-width-1-2@s" onClick={event => push({ pathname: '/laboratorio/crear', state: {consultation: consultation} }) } >
                                    Laboratorio
                                  </button>
                                  <button className="uk-modal-close uk-button uk-button-default uk-border-pill uk-margin-small uk-width-4-5 uk-width-1-2@s" onClick={event => push({ pathname: '/imagenologia/crear', state: {consultation: consultation} }) } >
                                    Rayos X
                                  </button>
                                </Fragment>
                              )
                            }
                            </div>
                            <div className="uk-modal-footer uk-flex uk-flex-column uk-flex-middle">
                              <button className="uk-modal-close uk-button uk-button-primary uk-border-pill uk-margin-small uk-width-4-5 uk-width-1-2@s"  onClick={event => push({pathname: `${url}/editar`, state: {consultation: consultation}}) } >
                                Modificar
                              </button>
                              <button className="uk-modal-close uk-button uk-button-danger uk-border-pill uk-margin-small uk-width-4-5 uk-width-1-2@s" onClick={event => push({pathname: `${url}/eliminar`, state: {consultation: consultation}}) } >
                                Eliminar
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
    </Fragment>
  )
}

export default Emergency