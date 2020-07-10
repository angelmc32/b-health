import React, { useEffect, useState, useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';                      // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import useDrugsForm from '../../hooks/useDrugsForm';                          // Import useForm custom hook
import UIkit from 'uikit';                                          // Import UIkit for notifications
import Icons from 'uikit/dist/js/uikit-icons';
import moment from 'moment';                                        // Import momentjs for date formatting
import 'moment/locale/es'  // without this line it didn't work

import { getPrescriptions, createPrescription, getPrescription, editPrescription, deletePrescription } from '../../services/prescription-services';
import { editConsultation, getConsultation } from '../../services/consultation-services';
import { createDrug } from '../../services/drug-services';

import PrescriptionForm from './PrescriptionForm';
import PrescriptionInfo from './PrescriptionInfo';

moment.locale('es')
UIkit.use(Icons);   // Execute to allow icon use

const Prescription = () => {

  // Destructure form state variable, handleInput and handleFileInput functions for form state manipulation
  const { form, setForm, handleInput, handleFileInput } = useDrugsForm();

  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user
  const { user, route, setRoute, objectHandler, setObjectHandler, resetUserContext } = useContext(AppContext);
  const [ prescription, setPrescription] = useState({});
  const [ prescriptions, setPrescriptions ] = useState([]);
  const [ showForm, setShowForm ] = useState(false);
  const [ showConsultation, setShowConsultation ] = useState(false);
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(false);
  const [ drugs, setDrugs ] = useState([])

  useEffect( () => {

    if ( !user._id ) {    // If there is no user logged in, send a notification and "redirect" to login

      // Send UIkit warning notification: User must log in
      UIkit.notification({
        message: `<p className='uk-text-center'>Por favor inicia sesión.</p>`,
        pos: 'bottom-center',
        status: 'warning'
      });
      
      return push('/login');         // If not logged in, "redirect" user to login

    };

    if ( route === 'prescriptions' || route === 'none' ) {

      setObjectHandler(null)

      getPrescriptions()
      .then( res => {
      
        const { prescriptions } = res.data;
        setPrescriptions(prescriptions);
        setRoute('prescriptions');

      })
      .catch( error => {
        if (error.response.status === 401) {
          localStorage.clear();
          resetUserContext();
          push('/login');
        }
      });

    }

    if ( route === 'special' ) {
      getPrescription(objectHandler.treatment)
      .then( res => {
      
        const { prescription } = res.data;
        loadPrescription({prescription}, 'read')
        // setPrescription(prescription);
        // setRoute('read')

      })
      .catch( res => {
        if (res.response.status === 401) {
          localStorage.clear();
          resetUserContext();
          push('/login');
        }
      });
    }
    
  }, [isButtonDisabled, route]);

  const handleSubmit = (event) => {

    event.preventDefault();               // Prevent page reloading after submit action
    setIsButtonDisabled(true)

    const formData = new FormData();      // Declare formData as new instance of FormData class
    const { image } = form;     // Destructure profile_picture from form

    form.drugsJSON = JSON.stringify(drugs);

    // Iterate through every key in form object and append name:value to formData
    for (let key in form) {

      // If profile_picture, append as first item in array (currently 1 file allowed, index 0)
      if ( key === 'image' ) formData.append(key, image[0]);

      else formData.append(key, form[key]);
      
    }

    if ( objectHandler ) {
      formData.append('date', moment(objectHandler.date));
      formData.append('doctor', objectHandler.doctor);
      formData.append('consultation', objectHandler._id);
    }
    
    // Call edit service with formData as parameter, which includes form data for user profile information
    createPrescription(formData)
    .then( res => {

      const { prescription } = res.data   // Destructure updated user document from response

      if ( objectHandler ) {
        editConsultation(objectHandler._id, {treatment: prescription._id})
        .then( res => {

          const { consultation } = res.data   // Destructure updated user document from response
          // Send UIkit success notification
          UIkit.notification({
            message: `<p className='uk-text-center'>¡Tu receta fue creada exitosamente!</p>`,
            pos: 'bottom-center',
            status: 'success'
          });

          setRoute('prescriptions');
          setIsButtonDisabled(false);
          setObjectHandler({});
        })
        .catch( res => {

          const { msg } = res.response.data;

          // Send UIkit error notification
          UIkit.notification({
            message: `<p class="uk-text-center">${msg}</p>`,
            pos: 'bottom-center',
            status: 'danger'
          });

          setIsButtonDisabled(false)
        });
      }
      else {
        setRoute('prescriptions');
        setIsButtonDisabled(false);
        setObjectHandler({});
      }

    })
    .catch( res => {

      const { msg } = res.response.data

      // Send UIkit error notification
      UIkit.notification({
        message: `<span uk-icon='close'></span> ${msg}`,
        pos: 'bottom-center',
        status: 'danger'
      });

      setIsButtonDisabled(false)

    });
    
  };

  const toggleButton = () => setIsButtonDisabled(!isButtonDisabled);
  
  const loadPrescription = (prescriptionData, newRoute) => {
    setPrescription(prescriptionData);
    setRoute(newRoute);
  }

  const loadConsultation = (consultationID) => {
    setObjectHandler(consultationID);
    setRoute('special');
    push('/consultas')
  }

  const deleteConsultationObject = () => {
    setObjectHandler(null);
    setRoute('prescriptions');
  }

  const deletePrescriptionBtn = (prescriptionID) => {

    setIsButtonDisabled(true)

    deletePrescription(prescriptionID)
    .then( res => {

      const { prescription } = res.data

      if ( prescription.consultation ) {
        editConsultation(prescription.consultation, {treatment: null})
        .then( res => {
          const { consultation } = res.data
          setIsButtonDisabled(false)
          // Send UIkit success notification
          UIkit.notification({
            message: `<p class='uk-text-center'>Se ha eliminado la receta exitosamente.</p>`,
            pos: 'bottom-center',
            status: 'success'
          });
          setRoute('prescriptions');
        })
        .catch( res => {

          const { msg } = res.response.data;

          // Send UIkit error notification
          UIkit.notification({
            message: `<span uk-icon='close'></span> ${msg}`,
            pos: 'bottom-center',
            status: 'danger'
          });

          setIsButtonDisabled(false)
        });
      }
      else {
        setIsButtonDisabled(false)
        // Send UIkit success notification
        UIkit.notification({
          message: `Se ha eliminado la receta exitosamente`,
          pos: 'bottom-center',
          status: 'success'
        });
        setRoute('prescriptions');
      }
    })
    .catch( res => {
      // Send UIkit error notification
      UIkit.notification({
        message: `No se ha podido eliminar la receta`,
        pos: 'bottom-center',
        status: 'danger'
      });
      setRoute('prescriptions');
    })

  }

  return (

    <div className="content">
      
        { route === 'prescriptions' || route === 'none' ? (
          <div className="uk-section">
            <h2>Recetas</h2>
            <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('create')} >
              + Nueva Receta
            </button>
            <div className="uk-overflow-auto">
              { prescriptions.length < 1 ? (
                  <h4 className="uk-text-danger">No has agregado recetas</h4>
                ) : null
              }
              <table className="uk-table uk-table-striped uk-table-hover uk-table-middle">
                <thead>
                  <tr>
                    <th className="uk-text-center">Fecha</th>
                    <th className="uk-text-center">Médico</th>
                    <th className="uk-text-center uk-visible@s">Consulta</th>
                    <th className="uk-text-center">Detalles</th>
                    <th className="uk-text-center uk-visible@s">Modificar</th>
                  </tr>
                </thead>
                <tbody>
                  { prescriptions ? 
                      prescriptions.map( (prescription, index) => 
                        <tr key={index}>
                          <td className="uk-text-center">{moment(prescription.date).locale('es').format('LL')}</td>
                          <td className="uk-text-center">{`${prescription.doctor}`}</td>
                          <td className="uk-text-center uk-visible@s">{prescription.consultation ? 
                            <button className="uk-button uk-button-default uk-button-small uk-border-pill" onClick={event => loadConsultation(prescription.consultation)} >
                              Ver Consulta
                            </button> 
                            : '-'}
                          </td>
                          <td className="uk-text-center">
                            <button className="uk-button uk-button-default uk-button-small uk-border-pill" onClick={event => loadPrescription({prescription}, 'read')} >
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
                                  <h3 className="uk-text-center">Datos de la Receta</h3>
                                  <p className="uk-text-center">Fecha: {moment(prescription.date).locale('es').format('LL')}</p>
                                  <p className="uk-text-center">Doctor: {prescription.doctor}</p>
                                </div>
                                <div className="uk-modal-body uk-flex uk-flex-column uk-flex-middle">
                                  { prescription.image === 'Sin imagen registrada' ? (
                                      <button className="uk-modal-close uk-button uk-button-default uk-border-pill uk-margin-small uk-width-1-2@s" onClick={event => console.log('ADD IMAGE')} >
                                        Agregar Imagen
                                      </button>
                                    ) : (
                                      <button className="uk-modal-close uk-button uk-button-default uk-border-pill uk-margin-small uk-width-1-2@s" onClick={event => console.log('VIEW IMAGE')} >
                                        Ver Imagen
                                      </button>
                                    )
                                  }
                                  <button className="uk-modal-close uk-button uk-button-primary uk-border-pill uk-margin-small uk-width-1-2@s"  onClick={event => console.log('EDIT PRESCRIPTION')} >
                                    Modificar Receta
                                  </button>
                                  <button className="uk-modal-close uk-button uk-button-danger uk-border-pill uk-margin-small uk-width-1-2@s" onClick={event => loadPrescription({prescription}, 'delete')} >
                                    Eliminar Receta
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
          </div>
          ) : (
            route === 'create' ? (
              <div className="uk-section">
                <div className="uk-container">
                  <h2>Nueva Receta</h2>
                  { objectHandler ?
                      <h4>Corresponde a consulta realizada el {moment(objectHandler.date).locale('es').format('LL')}</h4>
                      : null
                  }
                  <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={deleteConsultationObject} >
                    Regresar
                  </button>
                  <PrescriptionForm handleSubmit={handleSubmit} handleInput={handleInput} handleFileInput={handleFileInput} form={form} isButtonDisabled={isButtonDisabled} objectHandler={objectHandler} drugs={drugs} setDrugs={setDrugs}/>
                </div>
              </div>
            ) : (
              route === 'read' || route === 'delete' ? (
                <div className="uk-section">
                  <h2>{route === 'read' ? 'Ver Receta' : 'Eliminar Receta'}</h2>
                  { route === 'read' ? 
                      <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('prescriptions')} >
                        Regresar
                      </button>
                    : 
                    <div className="uk-width-1-1 uk-flex uk-flex-column uk-flex-middle uk-margin-large-bottom">
                      <div className="uk-width-1-1">
                        <p>¿Estás seguro que deseas eliminar la siguiente receta?</p>
                      </div>
                      <div className="uk-width-4-5 uk-flex uk-flex-around">
                        <button className="uk-button uk-button-danger uk-border-pill uk-width-1-3" onClick={event=> deletePrescriptionBtn(prescription.prescription._id)} disabled={isButtonDisabled}>
                          Sí
                        </button>
                        <button className="uk-button uk-button-default uk-border-pill uk-width-1-3" onClick={event => setRoute('prescriptions')} >
                          No
                        </button>
                      </div>
                    </div>
                  }
                  <PrescriptionInfo {...prescription} />
                </div>
              ) : (
                <div className="uk-section">
                  <h2>Cargando...</h2>
                  <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('prescriptions')} >
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

export default Prescription