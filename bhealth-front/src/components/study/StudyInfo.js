import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import useForm from '../../hooks/useForm'
import moment from 'moment';                                        // Import momentjs for date formatting
import UIkit from 'uikit';                                          // Import UIkit for notifications
import { Document, Page } from '../../../node_modules/react-pdf/dist/entry.webpack';
import { getStudy, deleteStudy, editStudy } from '../../services/study-services';
import { editConsultation } from '../../services/consultation-services';
import 'moment/locale/es'  // without this line it didn't work
moment.locale('es')

const StudyInfo = ({ url, action }) => {

  const { user, resetUserContext } = useContext(AppContext);
  const { form, resetForm, handleInput, handleFileInput } = useForm();
  const { location, push } = useHistory();
  const [ state, setState ] = useState({
    isButtonDisabled: false,
    spinnerState: false,
    isError: false,
    errorMsg: 'Ha ocurrido un error, intenta de nuevo',
    study: {
      date: '',
      doctor: '',
      image: ''
    },
    imageLoaded: false,
    showImagePreview: false,
    isUserEditing: false,
    isUserAdding: false,
    isUserEditingImg: false,
    errorMessage: null
  });
  const [ imgPreviewState, setImgPreviewState ] = useState({file: '',imagePreviewUrl: ''})
  let studyID;

  if ( !location.state )
    push(url);
  
  useEffect( () => {

    if ( !user._id ) {    // If there is no user logged in, send a notification and "redirect" to login
      // Send UIkit warning notification: User must log in
      UIkit.notification({
        message: '<p class="uk-text-center">Por favor inicia sesión',
        pos: 'bottom-center',
        status: 'warning'
      });
      return push('/login');         // If not logged in, "redirect" user to login
    };
    
    if ( location.state && !state.study._id ) {
      if ( location.state.study ){
        setState( prevState => ({...prevState, study: location.state.study}) );
        }
      if ( location.state.studyID )
      studyID = location.state.studyID;
    }
    if ( studyID ) {
      getStudy(studyID)
      .then( res => {
        const { study } = res.data;
        setState( prevState => ({...prevState, study: study}) );
        studyID = null;
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
      });
    }

    if ( Object.keys(form).length > 0) 
      setState( prevState => ({...prevState, errorMessage: null}) );

  }, [form]);

  const deleteStudyBtn = (studyID) => {

    setState( prevState => ({...prevState, isButtonDisabled: true, spinnerState: true}))

    deleteStudy(studyID)
    .then( res => {

      const { study } = res.data

      // if ( study.consultation ) {
      //   editConsultation(study.consultation, {treatment: null})
      //   .then( res => {
      //     const { consultation } = res.data
      //     setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}))
      //     // Send UIkit success notification
      //     UIkit.notification({
      //       message: '<p class="uk-text-center">Se ha eliminado la receta exitosamente</p>',
      //       pos: 'bottom-center',
      //       status: 'success'
      //     });
      //     push(url);
      //   })
      //   .catch( res => {

      //     const { msg } = res.response.data;

      //     // Send UIkit error notification
      //     UIkit.notification({
      //       message: `<p class="uk-text-center">${msg}</p>`,
      //       pos: 'bottom-center',
      //       status: 'danger'
      //     });

      //     setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}))
      //   });
      // }
      // else {
        setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}))
        // Send UIkit success notification
        UIkit.notification({
          message: '<p class="uk-text-center">Se ha eliminado la receta exitosamente</p>',
          pos: 'bottom-center',
          status: 'success'
        });
        push(url)
      // }
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
      setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false, isError: true}))
    })

  }

  const handleImageChange = (event) => {    // Handle image upload for preview within browser
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

  const confirmImageUpdate = (event) => {
    event.preventDefault();               // Prevent page reloading after submit action
    setState( prevState => ({...prevState, isButtonDisabled: true, spinnerState: true}))
    const formData = new FormData();      // Declare formData as new instance of FormData class
    const { image } = form;     // Destructure profile_picture from form

    formData.append('image', image[0]);

    editStudy(state.study._id, formData)
    .then( res => {

      const { study } = res.data   // Destructure updated user document from response

      setState( prevState => ({...prevState, isUserEditingImg: false, isButtonDisabled: false, spinnerState: false, study: study, showImagePreview: false, imageLoaded: false}));
      push({pathname: `${url}/ver`, state: {study: study}})
      UIkit.notification({
        message: '<p class="uk-text-center">Se ha agregado la imagen exitosamente</p>',
        pos: 'bottom-center',
        status: 'success'
      });
    })
    .catch( res => {

      const { msg } = res.response.data;
      if ( msg === 'Sesión expirada. Reinicia sesión por favor.' ) {
        localStorage.clear();
        resetUserContext();
        UIkit.notification({
          message: `<p class="uk-text-center">${msg}</p>`,
          pos: 'bottom-center',
          status: 'warning'
        });
        push('/login');
      }
      else 
        UIkit.notification({
          message: `<p class="uk-text-center">${msg}</p>`,
          pos: 'bottom-center',
          status: 'danger'
        });

      setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}))
    });

  }

  const cancelImageUpdate = () => {         // Cancel image upload
    setImgPreviewState({file: '',imagePreviewUrl: ''});
    setState( prevState => ({...prevState, imageLoaded: false, showImagePreview: false, isUserEditingImg: false}) )
    resetForm();
  }

  const handleUpdate = (event) => {

    event.preventDefault();               // Prevent page reloading after submit action
    setState( prevState => ({...prevState, isButtonDisabled: true, spinnerState: true}))
    

    const formData = new FormData();      // Declare formData as new instance of FormData class
    for (let key in form) {     // Iterate through every key in form object and append name:value to formData
      formData.append(key, form[key]);
    }
    
    editStudy(state.study._id, formData)
    .then( res => {
      const { study } = res.data   // Destructure updated user document from response
      setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false, isUserEditing: false, study: study}));
      UIkit.notification({
        message: '<p class="uk-text-center">Se ha actualizado el estudio</p>',
        pos: 'bottom-center',
        status: 'success'
      });
      document.getElementById('date').value = moment(study.date).format('LL')
      document.getElementById('doctor_name').value = study.doctor
      resetForm();
      push({pathname: `${url}/ver`, state: {study: study}})
    })
    .catch( res => {
      const { msg } = res.response.data;
      if ( msg === 'Sesión expirada. Reinicia sesión por favor.' ) {
        localStorage.clear();
        resetUserContext();
        UIkit.notification({
          message: `<p class="uk-text-center">${msg}</p>`,
          pos: 'bottom-center',
          status: 'warning'
        });
        push('/login');
      }
      else 
        UIkit.notification({
          message: `<p class="uk-text-center">${msg}</p>`,
          pos: 'bottom-center',
          status: 'danger'
        });

      setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}))
    });
  };

  return (
    <div className="uk-container">
      <h2>{action !== 'delete' ? 'Ver Estudio' : 'Eliminar Estudio'}</h2>
      { action !== 'delete' ?
          <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={ event => { push(url) } } >
            Regresar
          </button>
        :
          !state.spinnerState ?
            <div className="uk-width-1-1 uk-flex uk-flex-column uk-flex-middle uk-margin-large-bottom">
              <div className="uk-width-1-1">
                <p>¿Estás seguro que deseas eliminar el siguiente estudio?</p>
              </div>
              <div className="uk-width-4-5 uk-width-1-2@s uk-flex uk-flex-around">
                <button className="uk-button uk-button-danger uk-border-pill uk-width-1-3" onClick={event=> deleteStudyBtn(state.study._id)} disabled={state.isButtonDisabled}>
                  Sí
                </button>
                <button className="uk-button uk-button-default uk-border-pill uk-width-1-3" onClick={ event => { push(url) } } >
                  No
                </button>
              </div>
            </div>
            :
            <button type="submit" className="uk-button uk-button-primary uk-button uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" disabled={state.isButtonDisabled} >
              Eliminando<div className={ state.spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
            </button>
          
      }
      <div className="uk-margin uk-flex uk-flex-column uk-flex-middle">
        
        <div className="uk-width-1-1 uk-child-width-1-2@s uk-child-width-1-1 uk-grid-small uk-grid-match uk-flex uk-flex-around"  uk-grid="true">
          <div>
            <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
              <a className={ state.isUserEditing ? "uk-text-danger uk-position-top-right uk-position-small" : "eva-edit uk-position-top-right uk-position-small"} href="#" onClick={event => { event.preventDefault(); setState( prevState => ({...prevState, isUserEditingImg: false, isUserEditing: !prevState.isUserEditing}) )} }>
                <span uk-icon={state.isUserEditing ? "ban" : "pencil"}></span>
              </a>
              <h4 className="uk-margin-small">Datos del Estudio</h4>
              <form onSubmit={handleUpdate}>
                <div className="uk-margin-small">
                  <p className="uk-margin-remove">Nombre del Estudio::</p>
                  <div className="uk-form-controls uk-margin-small" hidden={state.isUserEditing}>
                    <input className="uk-input uk-border-pill uk-text-center" type="text" id="study_name_input" name="study_name" onChange={handleInput} value={state.study.study_name || ''} disabled={!state.isUserEditing} required />
                  </div>
                  <div className="uk-form-controls uk-margin-small" hidden={!state.isUserEditing}>
                    { state.study.study_type === 'lab' ?
                        <select name="study_name" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={state.study.study_name} required>
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
                        <select name="study_name" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={state.study.study_name} required>
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
                </div>
                <div className="uk-margin-small">
                  <p className="uk-margin-remove">Fecha del estudio:</p>
                  <div className="uk-form-controls uk-margin-small" hidden={state.isUserEditing}>
                    <input className="uk-input uk-border-pill uk-text-center" type="text" id="date" value={moment(state.study.date).format('LL')} disabled={!state.isUserEditing} />
                  </div>
                  <div className="uk-form-controls uk-margin-small" hidden={!state.isUserEditing}>
                    <input onChange={handleInput} id="date_input" name="date" className="uk-input uk-border-pill uk-text-center" type="date" defaultValue={ state.study.date ? moment(state.study.date).format('YYYY-MM-DD') : null} max={moment().format('YYYY-MM-DD')} disabled={!state.isUserEditing} required />
                  </div>
                </div>
                <div className="uk-margin-small">
                  <p className="uk-margin-remove">Doctor que solicitó:</p>
                  <div className="uk-form-controls uk-margin-small">
                    <input className="uk-input uk-border-pill uk-text-center" type="text" id="doctor_name" name="doctor" onChange={handleInput} value={form.doctor !== undefined ? form.doctor : state.study.doctor} disabled={!state.isUserEditing} required />
                  </div>
                </div>
                <div className="uk-width-1-1 uk-text-right uk-margin" hidden={!state.isUserEditing}>
                  <button type="submit" className="uk-button uk-button-link eva-edit" href="#" disabled={state.isButtonDisabled}>
                    { !state.spinnerState ? "Guardar cambios" : "Guardando"}<span className="uk-margin-small-left" uk-icon="check" hidden={state.spinnerState}></span><div className={ state.spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
                  </button>
                </div>
              </form>
              { state.study.consultation ? (
                <button type="submit" className="uk-button uk-button-default uk-border-pill uk-width-3-4 uk-width-1-2@s" onClick={(event) => push({pathname: '/consultas/ver', state: {consultationID: state.study.consultation} }) } >
                  Ver Consulta
                </button>
              ) : 
              <p className="uk-margin">No está asociado a ninguna consulta</p>
            }
            </div>
          </div>
          <div>
            <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
            <a className={ state.isUserEditingImg ? "uk-text-danger uk-position-top-right uk-position-small" : "eva-edit uk-position-top-right uk-position-small"} href="#" onClick={event => { event.preventDefault(); setState( prevState => ({...prevState, isUserEditingImg: !prevState.isUserEditingImg, isUserEditing: false}) )} }>
              <span uk-icon={state.isUserEditingImg ? "ban" : "pencil"}></span>
            </a>
            <h4 className="uk-margin-small">Imagen del Estudio</h4>
              { state.study.image === 'Sin imagen registrada' || state.isUserEditingImg ?
                  <div className="js-upload uk-margin uk-width-1-1" uk-form-custom="true">
                    <input onChange={event => {handleFileInput(event); handleImageChange(event)}} name="image" type="file" accept="image/*,.pdf" multiple />
                    {/* <button className="uk-button uk-button-default uk-border-pill" type="button" tabIndex="-1">{ !state.imageLoaded ? "Seleccionar" : "Cambiar"}</button> */}
                  
                    <button className="uk-button uk-button-default uk-border-pill uk-width-3-4 uk-width-1-2@s" type="button" tabIndex={-1} >
                      {  state.isUserEditingImg && !state.imageLoaded ? "Nueva Imagen" : !state.imageLoaded ? "Agregar" : "Cambiar"}
                      <span className="uk-margin-left" uk-icon={ !state.imageLoaded ? "upload" : "refresh"}></span>
                    </button>
                  </div>
                :
                  <div className="uk-margin" uk-lightbox="true">
                    <a className="uk-button uk-button-default uk-border-pill uk-width-3-4 uk-width-1-2@s" href={state.study.image} data-alt="Image">Ver Imagen<span className="uk-margin-small-left" uk-icon="image"></span></a>
                  </div>
              }
              { state.imageLoaded ? 
                <Fragment>
                  <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin-remove">
                    <button className="uk-button uk-button-default uk-border-pill uk-width-3-4 uk-width-1-2@m" type="button" onClick={ event => setState( prevState => ({...prevState, showImagePreview: !prevState.showImagePreview}))} >
                      { !state.showImagePreview ? "Vista Previa" : "Cerrar Imagen"} <span className="uk-margin-left-small" uk-icon="image"></span>
                    </button>
                  </div>
                  <div className="uk-width-1-1 uk-flex uk-flex-around uk-margin-small">
                    {
                      state.spinnerState ? 
                        <button className="uk-button uk-button-primary uk-border-pill uk-width-3-4 uk-width-1-2@m" type="button" disabled >
                          Guardando <div className="uk-margin-left-small" uk-spinner="true"></div>
                        </button>
                      :
                      <Fragment>
                        <button className="uk-button uk-button-primary uk-border-pill uk-width-2-5 uk-width-1-5@s uk-padding-remove" type="button" onClick={confirmImageUpdate} >
                          Guardar
                        </button>
                        <button className="uk-button uk-button-default uk-border-pill uk-width-2-5 uk-width-1-5@s uk-padding-remove" type="button" onClick={cancelImageUpdate} >
                          Cancelar
                        </button>
                      </Fragment>
                    }
                  </div>
                </Fragment>
                : null
              }
            </div>
          </div>
        </div>
        {state.showImagePreview ? 
          <div>
            <div className="uk-card uk-card-hover uk-card-body uk-padding">
              <a className="uk-text-muted uk-position-top-right uk-position-small" href="#" onClick={ event => { event.preventDefault(); setState( prevState => ({...prevState, showImagePreview: false}) )} } >
                <span uk-icon="close"></span>
              </a>
              <div className="uk-flex uk-flex-middle uk-flex-center uk-margin">
                <div className="uk-flex uk-flex-center uk-width-1-1 uk-width-3-4@s">
                  { imgPreviewState.file.name.split('.').pop() !== "pdf" ?
                      <img src={imgPreviewState.imagePreviewUrl} />
                    : <Document file={{url: imgPreviewState.imagePreviewUrl}} >
                        <Page pageNumber={1} width={300} />
                      </Document> 
                  }
                </div>
              </div>
            </div>
          </div>
          : null }
      </div>
    </div>
  )

}

export default StudyInfo