import React, { useEffect, useState, useContext } from 'react';
import { useHistory, NavLink } from 'react-router-dom';                      // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import useForm from '../../hooks/useForm';                          // Import useForm custom hook
import UIkit from 'uikit';                                          // Import UIkit for notifications
import moment from 'moment';                                        // Import momentjs for date formatting
import 'moment/locale/es'  // without this line it didn't work
import { getConsultations } from '../../services/consultation-services';
import { getEmergencies } from '../../services/emergency-services';
import { getHospitalizations } from '../../services/hospitalization-services';

moment.locale('es')

const Disease = () => {

  // Destructure form state variable, handleInput and handleFileInput functions for form state manipulation
  const { form, handleInput } = useForm();

  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user
  const { user, route, setRoute, objectHandler, setObjectHandler, resetUserContext } = useContext(AppContext);
  const [ disease, setDisease] = useState({});
  const [ diseases, setDiseases ] = useState([]);
  const [ consultations, setConsultations ] = useState([]);
  const [ emergencies, setEmergencies ] = useState([]);
  const [ hospitalizations, setHospitalizations ] = useState([]);
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(false);
  let diseasesHandler = []

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
        diseasesHandler.push(consultations[i].diagnosis)
      }

    })
    .catch( error => {
      if (error.response.status === 401) {
        localStorage.clear();
        resetUserContext();
        push('/login');
      }
    })

    getEmergencies()
    .then( res => {
      
      const { emergencies } = res.data;
      setEmergencies(emergencies);

      for ( let i = 0 ; i < emergencies.length ; i++ ) {
        diseasesHandler.push(emergencies[i].diagnosis)
      }

    })

    getHospitalizations()
    .then( res => {
      
      const { hospitalizations } = res.data;
      setHospitalizations(hospitalizations);

      for ( let i = 0 ; i < hospitalizations.length ; i++ ) {
        diseasesHandler.push(hospitalizations[i].diagnosis)
      }

      setDiseases(diseasesHandler);
      setRoute('diseases')

    })

    console.log(diseasesHandler)
    console.log(diseases)
    
  }, [route]);

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
      { route === 'diseases' ? (
          <div className="uk-section">
            <h2>Mis Padecimientos</h2>
            {/* <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('create')} >
              + Nuevo Padecimiento
            </button> */}
            <div className="uk-overflow-auto">
              <table className="uk-table uk-table-striped uk-table-hover uk-table-middle">
                <thead>
                  <tr>
                    <th className="uk-text-center">Diagnóstico</th>
                    <th className="uk-text-center">Detalles</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  { diseases ? 
                      diseases.map( (disease, index) => 
                        <tr key={index} >
                          <td className="uk-text-center">{disease ? disease : 'No definida'}</td>
                          <td className="uk-text-center">
                            <button className="uk-button uk-button-default uk-button-small uk-border-pill" uk-toggle={`target: #modal-sections-${index}`} >
                              Ver
                            </button>
                            <div id={`modal-sections-${index}`} className="uk-flex-top" uk-modal="true">
                              <div className="uk-modal-dialog uk-margin-auto-vertical">
                                <button className="uk-modal-close-default" type="button" uk-close="true" />
                                <div className="uk-modal-header">
                                  <h3 className="uk-text-center">Datos del Padecimiento</h3>
                                  <p>Nombre: {disease}</p>
                                  <p>Fecha de primer diagnóstico: No disponible</p>
                                  <p>Doctor o Clínica que realizó diagnóstico: No disponible</p>
                                  <p>Aquí se presentará un resumen del padecimiento, así como una liga para mayor información</p>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td></td>
                          {/* <td>
                            <a href={`#modal-sections-${index}`} uk-toggle={`target: #modal-sections-${index}`}>
                              <span className="uk-margin-small-right" uk-icon="more-vertical"></span>
                            </a>
                            
                          </td> */}
                        </tr>
                      )
                    : <tr>
                        <td>Cargando</td>
                        <td>Cargando</td>
                      </tr>
                }
                </tbody>
              </table>
            </div>
          </div>
          ) : ( null
            // route === 'create' ? (
            //   <div className="uk-section">
            //     <div className="uk-container">
            //       <h2>Nueva Consulta</h2>
            //       <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('consultations')} >
            //         Regresar
            //       </button>
            //       <ConsultationFormSpecial handleSubmit={handleSubmit} handleInput={handleInput} form={form} isButtonDisabled={isButtonDisabled} setVitalsFormValues={setVitalsFormValues}/>
            //     </div>
            //   </div>
            // ) : (
            //   route === 'read' ? (
            //     <div className="uk-section">
            //       <h2>Ver Consulta</h2>
            //       <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('consultations')} >
            //         Regresar
            //       </button>
            //       <ConsultationInfo {...consultation} />
            //     </div>
            //   ) : (
            //     <div className="uk-section">
            //       <h2>Cargando...</h2>
            //       <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('consultations')} >
            //         Regresar
            //       </button>
            //     </div> 
            //   )
            // )
          )
        }
    </div>
    
  )
}

export default Disease