import React, { useEffect, useState, useContext } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import useForm from '../../hooks/useForm';
import UIkit from 'uikit';
import moment from 'moment';

import { getHospitalizations, getHospitalization, createHospitalization } from '../../services/hospitalization-services';
import HospitalizationForm from './HospitalizationForm';
import HospitalizationInfo from './HospitalizationInfo';

const Hozpitalization = () => {

  // Destructure form state variable, handleInput and handleFileInput functions for form state manipulation
  const { form, handleInput } = useForm();

  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user
  const { user, route, setRoute, objectHandler, setObjectHandler } = useContext(AppContext);
  const [ hospitalization, setHospitalization ] = useState({});
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

    getHospitalizations()
    .then( res => {
      
      const { hospitalizations } = res.data;
      setHospitalizations(hospitalizations);
      setRoute('hospitalizations');

    })
    
  }, [isButtonDisabled]);

  const handleSubmit = (event) => {

    event.preventDefault();
    setIsButtonDisabled(true);
    console.log(form)

    createHospitalization(form)
    .then( res => {

      const { hospitalization } = res.data    // Destructure updated preferences document from response

      // Send UIkit success notification
      UIkit.notification({
        message: `<span uk-icon='close'></span> '¡La hospitalización fue creada exitosamente!'`,
        pos: 'bottom-center',
        status: 'success'
      });

      setRoute('hospitalizations');
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
  
  const loadHospitalization = (hospitalization) => {
    setHospitalization(hospitalization);
    setRoute('read');
  }

  const goToPrescription = (event, hospitalization, newRoute) => {
    event.preventDefault();
    setHospitalization(hospitalization);
    setObjectHandler(hospitalization);
    setRoute(newRoute);
    console.log(objectHandler)
  }

  const goToStudies = (event, hospitalization, newRoute) => {
    event.preventDefault();
    setObjectHandler(hospitalization);
    setRoute(newRoute);
    console.log(objectHandler);
  }

  return (
    <div className="content">
      
        { route === 'hospitalizations' ? (
          <div className="uk-section">
            <h2>Hospitalizaciones</h2>
            <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('create')} >
              + Nueva Hospitalización
            </button>
            <div className="uk-overflow-auto">
              <table className="uk-table uk-table-striped uk-table-hover">
                <thead>
                  <tr>
                    <th className="uk-text-center">Fecha</th>
                    <th className="uk-text-center">Diagnóstico</th>
                    <th className="uk-text-center uk-visible@s">Clínica</th>
                    <th className="uk-text-center uk-visible@s">Estancia</th>
                    <th className="uk-text-center">Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  { hospitalizations ? 
                      hospitalizations.map( (hospitalization, index) => 
                        <tr key={index} >
                          <td className="uk-text-center">{moment(hospitalization.admission_date).locale('es').format('LL')}</td>
                          <td className="uk-text-center">{hospitalization.diagnosis}</td>
                          <td className="uk-text-center uk-visible@s">{hospitalization.facility_name}</td>
                          <td className="uk-text-center uk-visible@s">{`No disponible`}</td>
                          <td className="uk-text-center">
                            <button className="uk-button uk-button-default uk-button-small uk-border-pill" onClick={event => loadHospitalization({hospitalization})} >
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
                                  <h3 className="uk-text-center">Datos de la Hospitalización</h3>
                                  <p>Fecha: {moment(hospitalization.date).locale('es').format('LL')}</p>
                                  <p>Clínica: {hospitalization.facility_name}</p>
                                  <p>Duración de la estancia: {hospitalization.admission_date - hospitalization.discharge_date}</p>
                                </div>
                                <div className="uk-modal-body uk-flex uk-flex-column">
                                  { hospitalization.treatment ? (
                                      <button className="uk-button uk-button-default uk-border-pill uk-margin" onClick={event => goToPrescription(event, hospitalization, 'read')} >
                                        <NavLink to="/recetas">Ver Receta</NavLink>
                                      </button>
                                    ) : (
                                      <button className="uk-button uk-button-default uk-border-pill uk-margin" onClick={event => goToPrescription(event, hospitalization, 'create')} >
                                        <NavLink to="/recetas">Agregar Receta</NavLink>
                                      </button>
                                    )
                                  }
                                  { hospitalization.studies ? (
                                      <button className="uk-button uk-button-default uk-border-pill uk-margin" onClick={event => goToStudies(event, hospitalization, 'read')} >
                                        <NavLink to="/estudios">Ver Estudios</NavLink>
                                      </button>
                                    ) : (
                                      <button className="uk-button uk-button-default uk-border-pill uk-margin" onClick={event => goToStudies(event, hospitalization, 'create')} >
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
                  <h2>Nueva Hospitalización</h2>
                  <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('hospitalizations')} >
                    Regresar
                  </button>
                  <HospitalizationForm handleSubmit={handleSubmit} handleInput={handleInput} form={form} isButtonDisabled={isButtonDisabled} />
                </div>
              </div>
            ) : (
              route === 'read' ? (
                <div className="uk-section">
                  <h2>Ver Hospitalización</h2>
                  <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('hospitalizations')} >
                    Regresar
                  </button>
                  <HospitalizationInfo {...hospitalization} />
                </div>
              ) : (
                <div className="uk-section">
                  <h2>Cargando...</h2>
                  <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('hospitalizations')} >
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

export default Hozpitalization