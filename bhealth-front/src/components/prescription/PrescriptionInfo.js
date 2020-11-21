import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import useForm from '../../hooks/useForm'
import moment from 'moment';                                        // Import momentjs for date formatting
import UIkit from 'uikit';                                          // Import UIkit for notifications
import { Document, Page } from '../../../node_modules/react-pdf/dist/entry.webpack';
import { getPrescription, deletePrescription, editPrescription } from '../../services/prescription-services';
import { editConsultation } from '../../services/consultation-services';
import 'moment/locale/es'  // without this line it didn't work
moment.locale('es')

const PrescriptionInfo = ({ url, action }) => {

  const { user, resetUserContext } = useContext(AppContext);
  const { form, resetForm, handleInput, handleFileInput } = useForm();
  const { location, push } = useHistory();
  const [ state, setState ] = useState({
    isButtonDisabled: false,
    spinnerState: false,
    errorMsg: 'Ha ocurrido un error, intenta de nuevo',
    prescription: {
      date: '',
      doctor: '',
      image: '',
      drugs: []
    },
    imageLoaded: false,
    showImagePreview: false,
    isUserEditing: false,
    isUserAdding: false,
    isUserEditingImg: false,
    errorMessage: null
  });
  const [ imgPreviewState, setImgPreviewState ] = useState({file: '',imagePreviewUrl: ''})
  let prescriptionID;

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
    
    if ( location.state && !state.prescription._id ) {
      if ( location.state.prescription ){
        setState( prevState => ({...prevState, prescription: location.state.prescription}) );
        }
      if ( location.state.prescriptionID )
        prescriptionID = location.state.prescriptionID;
    }
    if ( prescriptionID ) {
      getPrescription(prescriptionID)
      .then( res => {
        const { prescription } = res.data;
        setState( prevState => ({...prevState, prescription: prescription}) );
        prescriptionID = null;
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

  const deletePrescriptionBtn = (prescriptionID) => {

    setState( prevState => ({...prevState, isButtonDisabled: true, spinnerState: true}))

    deletePrescription(prescriptionID)
    .then( res => {

      const { prescription } = res.data

      if ( prescription.consultation ) {
        editConsultation(prescription.consultation, {treatment: null})
        .then( res => {
          const { consultation } = res.data
          setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}))
          // Send UIkit success notification
          UIkit.notification({
            message: '<p class="uk-text-center">Se ha eliminado la receta exitosamente</p>',
            pos: 'bottom-center',
            status: 'success'
          });
          push(url);
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
        setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}))
        // Send UIkit success notification
        UIkit.notification({
          message: '<p class="uk-text-center">Se ha eliminado la receta exitosamente</p>',
          pos: 'bottom-center',
          status: 'success'
        });
        push(url)
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

    editPrescription(state.prescription._id, formData)
    .then( res => {

      const { prescription } = res.data   // Destructure updated user document from response

      setState( prevState => ({...prevState, isUserEditingImg: false, isButtonDisabled: false, spinnerState: false, prescription: prescription, showImagePreview: false, imageLoaded: false}));
      push({pathname: `${url}/ver`, state: {prescription: prescription}})
      UIkit.notification({
        message: '<p class="uk-text-center">Se ha agregado la imagen exitosamente</p>',
        pos: 'bottom-center',
        status: 'success'
      });
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

  const cancelImageUpdate = () => {         // Cancel image upload
    setImgPreviewState({file: '',imagePreviewUrl: ''});
    setState( prevState => ({...prevState, imageLoaded: false, showImagePreview: false, isUserEditingImg: false}) )
    resetForm();
  }

  const toggleIsUserEditing = (event) => {
    event.preventDefault();
    resetForm();
    setState( prevState => ({...prevState, isUserEditing: !prevState.isUserEditing, isUserEditingImg: false, isUserAdding: false, errorMessage: null, isButtonDisabled: false, prescription: prevState.prescription}))
    
  }

  const handleUpdate = (event, index, action = null) => {
    event.preventDefault();
    let { drugs } = state.prescription;
    const formData = new FormData();

    if ( action !== 'remove') {
      if ( index === -1 ) {
        if ( !form.name ) {
          setState( prevState => ({...prevState, errorMessage: 'El nombre es requerido'}))
          return;
        }
        drugs.push(form)
      }
      else {
        if ( Object.keys(form).length < 1 ) {
          setState( prevState => ({...prevState, errorMessage: 'Realiza un cambio para modificar receta'}))
          return;
        }
        for (let key in form) {
          drugs[index][key] = form[key]
        }
      }
    }
    else if ( action === 'remove' ) {
      drugs.splice(index, 1)
    }
    
    let drugsJSON = JSON.stringify(drugs);
    formData.append('drugsJSON', drugsJSON);
    
    editPrescription(state.prescription._id, formData)
    .then( res => {

      const { prescription } = res.data   // Destructure updated user document from response
      resetForm();
      setState( prevState => ({...prevState, isUserEditing: false, isButtonDisabled: false, spinnerState: false, prescription: prescription, showImagePreview: false, imageLoaded: false, errorMessage: null, isUserAdding: false}));
      push({pathname: `${url}/ver`, state: {prescription: prescription}})
      UIkit.notification({
        message: '<p class="uk-text-center">Se ha actualizado la receta</p>',
        pos: 'bottom-center',
        status: 'success'
      });
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

  return (
    <Fragment>
      <h2>{action !== 'delete' ? 'Ver Receta' : 'Eliminar Receta'}</h2>
      { action !== 'delete' ?
          <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={ event => { push(url) } } >
            Regresar
          </button>
        :
          !state.spinnerState ?
            <div className="uk-width-1-1 uk-flex uk-flex-column uk-flex-middle uk-margin-large-bottom">
              <div className="uk-width-1-1">
                <p>¿Estás seguro que deseas eliminar la siguiente receta?</p>
              </div>
              <div className="uk-width-4-5 uk-width-1-2@s uk-flex uk-flex-around">
                <button className="uk-button uk-button-danger uk-border-pill uk-width-1-3" onClick={event=> deletePrescriptionBtn(state.prescription._id)} disabled={state.isButtonDisabled}>
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
      <div className="uk-container uk-margin uk-flex uk-flex-column uk-flex-middle">
        
        <div className="uk-width-1-1 uk-child-width-1-2@s uk-child-width-1-1 uk-grid-small uk-grid-match uk-flex uk-flex-around"  uk-grid="true">
          <div>
            <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
              <h4 className="uk-margin-small">Datos de la Receta</h4>
              <p className="uk-margin-remove">Fecha de receta: {moment(state.prescription.date).locale('es').format('LL')}</p>
              <p className="uk-margin-small">Doctor: {state.prescription.doctor}</p>
              { state.prescription.consultation ? (
                <button className="uk-button uk-button-default uk-border-pill uk-width-3-4 uk-width-1-2@s" onClick={(event) => push({pathname: '/consultas/ver', state: {consultationID: state.prescription.consultation} }) } >
                  Ver Consulta
                </button>
              ) : 
              <p className="uk-margin-small">No está asociada a ninguna consulta</p>
            }
            </div>
          </div>
          <div>
            <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
            <a className={ state.isUserEditingImg ? "uk-text-danger uk-position-top-right uk-position-small" : "eva-edit uk-position-top-right uk-position-small"} href="#" onClick={event => { event.preventDefault(); setState( prevState => ({...prevState, isUserEditingImg: !prevState.isUserEditingImg, isUserEditing: false}) )} }>
              <span uk-icon={state.isUserEditingImg ? "ban" : "pencil"}></span>
            </a>
            <h4 className="uk-margin-small">Imagen de la Receta</h4>
              { state.prescription.image === 'Sin imagen registrada' || state.isUserEditingImg ?
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
                    <a className="uk-button uk-button-default uk-border-pill uk-width-3-4 uk-width-1-2@s" href={state.prescription.image} data-alt="Image">Ver Imagen<span className="uk-margin-small-left" uk-icon="image"></span></a>
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
          <div className="uk-width-1-1 uk-child-width-1-1 uk-grid-small uk-grid-match" uk-grid="true">
            <div>
              <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                <h4 className="uk-margin-small">Medicamentos</h4>
                <ul className="uk-flex uk-flex-column uk-flex-center uk-flex-middle" uk-accordion="true">
                  { state.prescription.drugs.map( (drug, index) =>
                    <li className={"uk-width-5-6 uk-width-3-5@s uk-margin-small"} key={index}>
                      <a className="uk-accordion-title uk-text-left uk-text-middle" href="#" onClick={ state.isUserEditing ? toggleIsUserEditing : event => setState(prevState => ({...prevState, isUserAdding: false})) }><h5 className="uk-margin-remove">{index+1}. {state.prescription.drugs[index].name}</h5></a>
                      <div className="uk-accordion-content uk-margin-small-top">
                        <div className="uk-width-1-1 uk-flex uk-flex-between">
                          <a className="uk-text-danger uk-margin-small" href="#" onClick={ event => handleUpdate(event, index, 'remove') }>
                            Eliminar<span className="uk-margin-small-left" uk-icon="trash"></span>
                          </a>
                          <a className={ state.isUserEditing ? "uk-text-danger" : "eva-edit"} href="#" onClick={toggleIsUserEditing}>
                            { state.isUserEditing ? "Cancelar" : "Editar" }<span className="uk-margin-small-left" uk-icon={state.isUserEditing ? "ban" : "pencil"}></span>
                          </a>
                        </div>
                        <form onSubmit={event => handleUpdate(event, index)} className="uk-form-stacked uk-text-left">
                          <label className="uk-margin-remove">Nombre:</label>
                          <div className="uk-form-controls uk-margin-small">
                            <input className="uk-input uk-border-pill uk-text-center" type="text" name="name" onChange={handleInput} value={form.name !== undefined ? form.name : state.prescription.drugs[index].name || ""} disabled={!state.isUserEditing} required />
                          </div>
                          <label className="uk-margin-remove">Presentación:</label>
                          <div className="uk-form-controls uk-margin-small">
                            <input className="uk-input uk-border-pill uk-text-center" type="text" name="dosage_form" onChange={handleInput} value={form.dosage_form !== undefined ? form.dosage_form : state.prescription.drugs[index].dosage_form || ""} disabled={!state.isUserEditing} />
                          </div>
                          <label className="uk-margin-remove">Dosis:</label>
                          <div className="uk-form-controls uk-margin-small">
                            <input className="uk-input uk-border-pill uk-text-center" type="text" name="dose" onChange={handleInput} value={form.dose !== undefined ? form.dose : state.prescription.drugs[index].dose || ""} disabled={!state.isUserEditing} />
                          </div>
                          <label className="uk-margin-remove">Horario:</label>
                          <div className="uk-form-controls uk-margin-small">
                            <input className="uk-input uk-border-pill uk-text-center" type="text" name="schedule" onChange={handleInput} value={form.schedule !== undefined ? form.schedule : state.prescription.drugs[index].schedule || ""} disabled={!state.isUserEditing} />
                          </div>
                          <label className="uk-margin-remove">Número de días:</label>
                          <div className="uk-form-controls uk-margin-small">
                            <input className="uk-input uk-border-pill uk-text-center" type="text" name="periodicity" onChange={handleInput} value={form.periodicity !== undefined ? form.periodicity : state.prescription.drugs[index].periodicity || ""} disabled={!state.isUserEditing} />
                          </div>
                          <label className="uk-margin-remove">Indicaciones:</label>
                          <div className="uk-form-controls uk-margin-small">
                            <input className="uk-input uk-border-pill uk-text-center" type="text" name="directions" onChange={handleInput} value={form.directions !== undefined ? form.directions : state.prescription.drugs[index].directions || ""} disabled={!state.isUserEditing} />
                          </div>
                          <p className="uk-text-center uk-text-danger">{state.errorMessage}</p>
                          <div className="uk-width-1-1 uk-text-right uk-margin" hidden={!state.isUserEditing}>
                            <button type="submit" className="uk-button uk-button-link eva-edit" href="#">
                              Guardar cambios<span className="uk-margin-small-left" uk-icon="check"></span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </li>
                    )
                  }
                </ul>
                    
                <div className="uk-margin-small-top uk-flex uk-flex-column uk-flex-middle">
                  <button className="uk-button uk-button-default uk-border-pill uk-width-3-4 uk-width-1-4@s" onClick={ event => setState( prevState => ({...prevState, isUserAdding: !prevState.isUserAdding, isUserEditing: false, isUserEditingImg: false})) }>
                    { !state.isUserAdding ? "Agregar" : "Cancelar" }<span className="uk-margin-small-left" uk-icon={ !state.isUserAdding ? "plus-circle" : "ban" }></span>
                  </button>
                  <form onSubmit={event => handleUpdate(event, -1, 'add')} className="uk-form-stacked uk-text-left uk-margin uk-width-5-6 uk-width-2-5@s" hidden={!state.isUserAdding}>
                    <label className="uk-margin-remove">Nombre:</label>
                    <div className="uk-form-controls uk-margin-small">
                      <input className="uk-input uk-border-pill uk-text-center" type="text" name="name" onChange={handleInput} value={form.name || ""} required />
                    </div>
                    <label className="uk-margin-remove">Presentación:</label>
                    <div className="uk-form-controls uk-margin-small">
                      <input className="uk-input uk-border-pill uk-text-center" type="text" name="dosage_form" onChange={handleInput} value={form.dosage_form || ""} />
                    </div>
                    <label className="uk-margin-remove">Dosis:</label>
                    <div className="uk-form-controls uk-margin-small">
                      <input className="uk-input uk-border-pill uk-text-center" type="text" name="dose" onChange={handleInput} value={form.dose || ""} />
                    </div>
                    <label className="uk-margin-remove">Horario:</label>
                    <div className="uk-form-controls uk-margin-small">
                      <input className="uk-input uk-border-pill uk-text-center" type="text" name="schedule" onChange={handleInput} value={form.schedule || ""} />
                    </div>
                    <label className="uk-margin-remove">Número de días:</label>
                    <div className="uk-form-controls uk-margin-small">
                      <input className="uk-input uk-border-pill uk-text-center" type="text" name="periodicity" onChange={handleInput} value={form.periodicity || ""} />
                    </div>
                    <label className="uk-margin-remove">Indicaciones:</label>
                    <div className="uk-form-controls uk-margin-small">
                      <input className="uk-input uk-border-pill uk-text-center" type="text" name="directions" onChange={handleInput} value={form.directions || ""} />
                    </div>
                    <p className="uk-text-center uk-text-danger">{state.errorMessage}</p>
                    <div className="uk-width-1-1 uk-text-right uk-margin">
                      <button type="submit" className="uk-button uk-button-link eva-edit" href="#">
                        Agregar<span className="uk-margin-small-left" uk-icon="plus-circle"></span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

      </div>
    </Fragment>
  )
}

export default PrescriptionInfo