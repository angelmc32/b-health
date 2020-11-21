import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';                      // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import useForm from '../../hooks/useForm';                          // Import useForm custom hook
import UIkit from 'uikit';                                          // Import UIkit for notifications
import moment from 'moment';                                        // Import momentjs for date formatting
import { Document, Page } from '../../../node_modules/react-pdf/dist/entry.webpack';
import 'moment/locale/es'  // without this line it didn't work

import { createStudy } from '../../services/study-services';
import { editConsultation } from '../../services/consultation-services';

const StudyForm = ({ studyType, url, action }) => {

  const { user, resetUserContext } = useContext(AppContext);
  const { form, handleInput, handleFileInput } = useForm();
  const { location, push } = useHistory();
  const [ state, setState ] = useState({
    isButtonDisabled: false,
    spinnerState: false,
    errorMsg: 'Ha ocurrido un error, intenta de nuevo',
    errorMessage: null,
    imageLoaded: false,
    showImagePreview: false,
    checkboxState: false
  })
  const [ imgPreviewState, setImgPreviewState ] = useState({file: '',imagePreviewUrl: ''})

  let consultation;
  if ( action === 'update' && !location.state )
    push(url);
  else if ( action === 'create' && location.state ){
    consultation = location.state.consultation;
  }

  const handleSubmit = (event) => {

    event.preventDefault();               // Prevent page reloading after submit action
    setState( prevState => ({...prevState, isButtonDisabled: true, spinnerState: true}))

    const formData = new FormData();      // Declare formData as new instance of FormData class
    const { image } = form;     // Destructure profile_picture from form
    for (let key in form) {     // Iterate through every key in form object and append name:value to formData
      // If image, append as first item in array (currently 1 file allowed, index 0)
      if ( key === 'image' ) formData.append(key, image[0]);
      else formData.append(key, form[key]);
    }

    if ( consultation ) {
      if ( !form['date'] ) formData.append('date', moment(consultation.date));
      formData.append('doctor', consultation.doctor);
      formData.append('consultation', consultation._id);
    }

    formData.append('study_type', studyType)
    
    if ( action === 'create') {
      // Call edit service with formData as parameter, which includes form data for user profile information
      createStudy(formData)
      .then( res => {

        const { study } = res.data   // Destructure updated user document from response

        if ( consultation ) {

          let { studies } = consultation;
          studies.push(study._id)
          console.log(studies)

          editConsultation(consultation._id, {studies: studies})
          .then( res => {

            const { consultation } = res.data   // Destructure updated user document from response
            // Send UIkit success notification
            UIkit.notification({
              message: '<p class="uk-text-center">Tu estudio fue agregado exitosamente</p>',
              pos: 'bottom-center',
              status: 'success'
            });
            setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}));
            push({pathname: `${url}/ver`, state: {study: study}})
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

            setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}))
          });
        }
        else {
          UIkit.notification({
            message: '<p class="uk-text-center">Tu estudio fue creado exitosamente</p>',
            pos: 'bottom-center',
            status: 'success'
          });
          setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}));
          push({pathname: `${url}/ver`, state: {study: study}})
        }

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

        setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}))
      });
    }
    
  };

  const handleImageChange = (event) => {
    event.preventDefault();

    let reader = new FileReader();
    let file = event.target.files[0];

    if (!file)
      return
    else {
      reader.onloadend = () => {
        setImgPreviewState({
          file: file,
          imagePreviewUrl: reader.result
        });
        setState( prevState => ({...prevState, imageLoaded: true}) )
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Fragment>
      <h2>Nuevo Estudio</h2>
      <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={ event => push(url) } >
        Regresar
      </button>
      <form onSubmit={handleSubmit} className="uk-form-stacked uk-text-left uk-container">
        <div className="uk-margin">
          <h4>Datos del Estudio: {studyType === 'lab' ? "Laboratorio" : "Rayos X e Imagen"}</h4>
          <label className="uk-form-label" htmlFor="date">Fecha de estudio:</label>
          <div className="uk-form-controls uk-margin-small-bottom">
            <input className="uk-input uk-border-pill uk-text-center" type="date" name="date" onChange={handleInput} defaultValue={consultation ? moment(consultation.date).format('YYYY-MM-DD') : null} max={moment().format('YYYY-MM-DD')} required/>
          </div>
          <label className="uk-form-label" htmlFor="doctor">Doctor que solicitó el estudio:</label>
          <div className="uk-form-controls uk-margin-small-bottom">
            <input className="uk-input uk-border-pill uk-text-center" type="text" name="doctor" onChange={handleInput} placeholder="Nombre del doctor..." defaultValue={consultation ? consultation.doctor : null} required/>
          </div>
          
          <div className="uk-margin">
            <h4>Estudio</h4>
            <label className="uk-form-label" htmlFor="form-stacked-text">Nombre del Estudio:</label>
            <div className="uk-form-controls uk-margin-small-bottom">
              { studyType === 'lab' ?
                  <select name="study_name" onChange={handleInput} className="uk-select uk-border-pill" defaultValue="" required>
                    <option value="" disabled>Seleccionar</option>
                    <option>Análisis de Química Sanguínea</option>
                    <option>Análisis de Hematología</option>
                    <option>Análisis de Orina</option>
                    <option>Análisis de Microbiología</option>
                    <option>Análisis de Hormonas</option>
                    <option>Análisis de Pruebas Inmunológicas</option>
                    <option>Análisis de Parasitología</option>
                    <option>Análisis de Biología Molecular</option>
                    <option>Otras</option>
                  </select>
                : 
                  <select name="study_name" onChange={handleInput} className="uk-select uk-border-pill" defaultValue="" required>
                    <option value="" disabled>Seleccionar</option>
                    <option>Radiografías Simples</option>
                    <option>Estudio de Fluoroscopía</option>
                    <option>Ultrasonido</option>
                    <option>Mamografía</option>
                    <option>Tomografía Computarizada (TC)</option>
                    <option>Resonancia Magnética (RM)</option>
                    <option>Estudios de Medicina Nuclear (MN)</option>
                    <option>Tomografía por Emisión de Positrones (PET)</option>
                    <option>Otras</option>
                  </select>
              }
            </div>
            <label className="uk-form-label" htmlFor="form-stacked-text">Nombre de Laboratorio <span className="uk-text-italic">(opcional)</span>:</label>
            <div className="uk-form-controls uk-margin-small-bottom">
              <input className="uk-input uk-border-pill uk-text-center" type="text" name="facility_name" onChange={handleInput} placeholder="Dónde se realizó los estudios" />
            </div>
            <div className="uk-flex uk-flex-middle uk-flex-center uk-margin">
              <div className="uk-width-3-5@s uk-flex uk-flex-center uk-flex-middle">
                <p className="uk-text-middle uk-margin-remove">Subir resultados:</p>
                <div className="js-upload uk" uk-form-custom="true">
                  <input onChange={event => {handleFileInput(event); handleImageChange(event)}} name="image" type="file" accept="image/*,.pdf" multiple />
                  <button className="uk-button uk-button-default uk-border-pill" type="button" tabIndex="-1">{ !state.imageLoaded ? "Seleccionar" : "Cambiar"}</button>
                </div>
              </div>
            </div>
            { state.imageLoaded ? 
              <Fragment>
                <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin">
                  <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m" type="button" onClick={ event => setState( prevState => ({...prevState, showImagePreview: !prevState.showImagePreview}))} >
                    { !state.showImagePreview ? "Ver Imagen" : "Cerrar Imagen"} <span className="uk-margin-left" uk-icon="image"></span>
                  </button>
                </div>
                
                {state.showImagePreview ?
                  <div className="uk-flex uk-flex-middle uk-flex-center uk-margin">
                    <div className="uk-flex uk-flex-center uk-width-3-5@s">
                      { imgPreviewState.file.name.split('.').pop() !== "pdf" ?
                          <img src={imgPreviewState.imagePreviewUrl} />
                        : <Document file={{url: imgPreviewState.imagePreviewUrl}} >
                            <Page pageNumber={1} width={300} />
                          </Document> 
                      }
                    </div>
                  </div> 
                  : null
                }
                <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin">
                  <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m" type="button" onClick={ event => { setState( prevState => ({...prevState, imageLoaded: false, showImagePreview: false})); setImgPreviewState({file: '',imagePreviewUrl: ''}) } } >
                    Borrar Imagen<span className="uk-margin-left" uk-icon="trash"></span>
                  </button>
                </div>
              </Fragment>
              : null
            }
          </div>
          
        </div>
        { state.errorMessage ? <p className="uk-text-danger uk-text-center">{state.errorMessage}</p> : null }
        { !consultation ? 
          <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin-medium">
            <button type="submit" className="uk-button uk-button-primary uk-border-pill uk-width-2-3 uk-width-1-4@m" disabled={state.isButtonDisabled} >
              { !state.spinnerState ? "Crear Estudio" : "Creando"}  <div className={ state.spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
            </button>
          </div>
          : 
          <Fragment>
            <div className="uk-width-1-1 uk-margin-top uk-text-center">
              <input type="checkbox" className="uk-checkbox uk-margin-small-right uk-text-center" defaultChecked={state.checkboxState} onChange={() => setState( prevState => ({...prevState, checkboxState: !prevState.checkboxState} ))} />
               Esta receta corresponde a la consulta con el Médico: {consultation ? consultation.doctor : null}
            </div>
            <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin-medium">
              <button type="submit" className="uk-button uk-button-primary uk-border-pill uk-width-2-3 uk-width-1-4@m" disabled={state.isButtonDisabled || !state.checkboxState} >
                { !state.spinnerState ? "Agregar Estudio" : "Agregando"}  <div className={ state.spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
              </button>
            </div>
          </Fragment>
        }
        
      </form>

    </Fragment>
  )
}

export default StudyForm