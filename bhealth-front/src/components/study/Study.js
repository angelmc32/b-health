import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';                      // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import useForm from '../../hooks/useForm';                          // Import useForm custom hook
import UIkit from 'uikit';                                          // Import UIkit for notifications
import moment from 'moment';                                        // Import momentjs for date formatting
import 'moment/locale/es'  // without this line it didn't work

import { getStudies, createStudy, getStudy, editStudy } from '../../services/study-services';
import StudyForm from './StudyForm';
import StudyInfo from './StudyInfo';

moment.locale('es')

const Study = ({studyType}) => {

  // Destructure form state variable, handleInput and handleFileInput functions for form state manipulation
  const { form, resetForm, handleInput, handleFileInput } = useForm();

  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user
  const { user, route, setRoute, objectHandler, setObjectHandler } = useContext(AppContext);
  const [ study, setStudy] = useState({});
  const [ studies, setStudies ] = useState([]);
  const [ showForm, setShowForm ] = useState(false);
  const [ showConsultation, setShowConsultation ] = useState(false);
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

    if ( route !== 'create' && route !== 'read' ) {
      getStudies(studyType)
      .then( res => {
      
        const { studies } = res.data;
        setStudies(studies);
        setRoute('studies');

      });
    }

    
    
  }, [route]);

  const handleSubmit = (event) => {

    event.preventDefault();               // Prevent page reloading after submit action
    setIsButtonDisabled(true)

    form['study_type'] = studyType;
    // if ( objectHandler ) form['consultation'] = objectHandler.id;

    const formData = new FormData();      // Declare formData as new instance of FormData class
    const { image } = form;     // Destructure profile_picture from form

    // Iterate through every key in form object and append name:value to formData
    for (let key in form) {

      // If profile_picture, append as first item in array (currently 1 file allowed, index 0)
      if ( key === 'image' ) formData.append(key, image[0]);

      else formData.append(key, form[key]);
      
    }
    
    // Call edit service with formData as parameter, which includes form data for user profile information
    createStudy(formData)
    .then( res => {

      const { study } = res.data   // Destructure updated user document from response

      // Send UIkit success notification
      UIkit.notification({
        message: `<span uk-icon='close'></span> '¡Tu estudio fue creado exitosamente!'`,
        pos: 'bottom-center',
        status: 'success'
      });

      setRoute('studies');
      setIsButtonDisabled(false);
      setObjectHandler();

    })
    .catch( error => {

      console.log(error);

      // Send UIkit error notification
      UIkit.notification({
        message: `<span uk-icon='close'></span> ${error}`,
        pos: 'bottom-center',
        status: 'danger'
      });

      setIsButtonDisabled(false)

    });

    resetForm();
    
  };

  const toggleButton = () => setIsButtonDisabled(!isButtonDisabled);
  
  const loadStudy = (study) => {
    setStudy(study);
    setRoute('read');
  }

  const backButton = () => {
    setRoute('studies');
    resetForm();
    console.log('back')
    console.log(form)
  }

  return (

    <div className="content">
      
        { route === 'studies' ? (
          <div className="uk-section">
            <h2>{studyType === 'lab' ? "Laboratorio" : "Rayos X e Imagen"}</h2>
            <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('create')} >
              + Nuevo Estudio
            </button>
            <div className="uk-overflow-auto">
              { studies.length < 1 ? (
                  <h4 className="uk-text-danger">No has agregado estudios</h4>
                ) : null
              }
              <table className="uk-table uk-table-striped uk-table-hover uk-table-middle">
                <thead>
                  <tr>
                    <th className="uk-text-center">Fecha</th>
                    <th className="uk-text-center uk-visible">Estudio</th>
                    <th className="uk-text-center">Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  { studies ? 
                      studies.map( (study, index) => 
                        <tr key={index}>
                          <td className="uk-text-center">{moment(study.date).locale('es').format('LL')}</td>
                          <td className="uk-text-center uk-visible">{study.study_name}</td>
                          <td className="uk-text-center">
                            <button className="uk-button uk-button-default uk-button-small uk-border-pill" onClick={event => loadStudy({study})} >
                              Ver
                            </button>
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
                  <h2>Nuevo Estudio</h2>
                  <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={backButton} >
                    Regresar
                  </button>
                  <StudyForm studyType={studyType} handleSubmit={handleSubmit} handleInput={handleInput} handleFileInput={handleFileInput} form={form} isButtonDisabled={isButtonDisabled} objectHandler={objectHandler}/>
                </div>
              </div>
            ) : (
              route === 'read' ? (
                <div className="uk-section">
                  <h2>Ver Estudio</h2>
                  <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={backButton} >
                    Regresar
                  </button>
                  <StudyInfo {...study} />
                </div>
              ) : (
                <div className="uk-section">
                  <h2>Cargando...</h2>
                  <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={backButton} >
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

export default Study