import React, { useContext, useEffect, useState, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import useDrugsForm from '../../hooks/useDrugsForm';
import UIkit from 'uikit';
import moment from 'moment';                                        // Import momentjs for date formatting
import { Document, Page } from '../../../node_modules/react-pdf/dist/entry.webpack';

import { createPrescription } from '../../services/prescription-services';
import { editConsultation } from '../../services/consultation-services';

const PrescriptionForm = ({ url, action }) => {

  const { user, resetUserContext } = useContext(AppContext);
  const { form, handleInput, handleFileInput } = useDrugsForm();
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
  const [ drugs, setDrugs ] = useState([]);
  const [ drugFields, setDrugFields ] = useState([]);
  const [ drugQuantity, setDrugQuantity] = useState(0);
  let drug = {'generic_name': null, 'brand_name': null, 'dosage_form': null, 'dose': null, 'directions': null};

  let consultation;
  if ( action === 'update' && !location.state )
    push(url);
  else if ( action === 'create' && location.state )
    consultation = location.state.consultation;

  useEffect( () => {
    if ( !user._id ) {    // If there is no user logged in, send a notification and "redirect" to login
      UIkit.notification({
        message: '<p class="uk-text-center">Por favor inicia sesión',
        pos: 'bottom-center',
        status: 'warning'
      });    
      return push('/login');         // If not logged in, "redirect" user to login
    };
    
    if ( form.image || drugs.length > 0 ) {
      setState( prevState => ({...prevState, isButtonDisabled: false, errorMessage: null}))
    }

  }, [drugQuantity, form, drugs])

  const handleSubmit = (event) => {

    event.preventDefault();               // Prevent page reloading after submit action
    setState( prevState => ({...prevState, isButtonDisabled: true, spinnerState: true}))
    

    const formData = new FormData();      // Declare formData as new instance of FormData class
    const { image } = form;     // Destructure profile_picture from form

    form.drugsJSON = JSON.stringify(drugs);
    if ( drugs.length < 1 && !image ) {
      setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false, errorMessage: 'Debes agregar una imagen o un medicamento'}))
      return;
    }

    // Iterate through every key in form object and append name:value to formData
    for (let key in form) {

      // If profile_picture, append as first item in array (currently 1 file allowed, index 0)
      if ( key === 'image' ) formData.append(key, image[0]);

      else formData.append(key, form[key]);
      
    }

    if ( consultation ) {
      formData.append('date', moment(consultation.date));
      formData.append('doctor', consultation.doctor);
      formData.append('consultation', consultation._id);
    }
    
    if ( action === 'create') {
      // Call edit service with formData as parameter, which includes form data for user profile information
      createPrescription(formData)
      .then( res => {

        const { prescription } = res.data   // Destructure updated user document from response

        if ( consultation ) {
          editConsultation(consultation._id, {treatment: prescription._id})
          .then( res => {

            const { consultation } = res.data   // Destructure updated user document from response
            // Send UIkit success notification
            UIkit.notification({
              message: '<p className="uk-text-center">¡Tu receta fue creada exitosamente!</p>',
              pos: 'bottom-center',
              status: 'success'
            });
            setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}));
            push({pathname: `${url}/ver`, state: {prescription: prescription}})
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
          // Send UIkit success notification
          UIkit.notification({
            message: '<p className="uk-text-center">¡Tu receta fue creada exitosamente!</p>',
            pos: 'bottom-center',
            status: 'success'
          });
          setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}));
          push({pathname: url, state: {prescription: prescription}})
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

  const handleDrugInput = (event, index) => {

    switch (event.target.name) {
      case 'name':
        drugs[index].name = event.target.value;
        // setForm( prevState => ({...prevState, ['drugs']: {[name]:value}}) );
        break;
      // case 'generic_name':
      //   drugs[index].generic_name = event.target.value;
      //   // setForm( prevState => ({...prevState, ['drugs']: {[name]:value}}) );
      //   break;
      // case 'brand_name':
      //   drugs[index].brand_name = event.target.value;
      //   // setForm( prevState => ({...prevState, [name]: value}) );
      //   break;
      case 'dosage_form':
        drugs[index].dosage_form = event.target.value;
        // setForm( prevState => ({...prevState, [name]: value}) );
        break;
      case 'dose':
        drugs[index].dose = event.target.value;
        // setForm( prevState => ({...prevState, [name]: value}) );
        break;
      case 'schedule':
        drugs[index].schedule = event.target.value;
        // setForm( prevState => ({...prevState, [name]: value}) );
        break;
      case 'periodicity':
        drugs[index].periodicity = event.target.value;
        // setForm( prevState => ({...prevState, [name]: value}) );
        break;
      case 'directions':
        drugs[index].directions = event.target.value;
        // setForm( prevState => ({...prevState, [name]: value}) );
        break;
    }

  }
  
  const addDrugField = (event) => {

    event.preventDefault();
    drugFields.push(1)
    drugs.push(drug);

    setDrugFields(drugFields);
    setDrugQuantity(drugQuantity+1)

    return null;

  }

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

  const deleteDrugField = (event) => {

    event.preventDefault();
    drugFields.pop()
    drugs.pop();

    setDrugFields(drugFields);
    setDrugQuantity(drugQuantity-1)

    return null;
  }

  return (
    <Fragment>
      <h2>Nueva Receta</h2>
      <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={ event => push(url) } >
        Regresar
      </button>
      <form onSubmit={handleSubmit} className="uk-form-stacked uk-text-left uk-container">
        <div className="uk-margin">
          <h4>Datos de la Receta</h4>
          <label className="uk-form-label" htmlFor="date">Fecha de receta:</label>
          <div className="uk-form-controls uk-margin-small-bottom">
            <input className="uk-input uk-border-pill uk-text-center" type="date" name="date" onChange={handleInput} defaultValue={consultation ? moment(consultation.date).format('YYYY-MM-DD') : null} max={moment().format('YYYY-MM-DD')} required/>
          </div>
          <label className="uk-form-label" htmlFor="doctor">Doctor que atendió:</label>
          <div className="uk-form-controls uk-margin-small-bottom">
            <input className="uk-input uk-border-pill uk-text-center" type="text" name="doctor" onChange={handleInput} placeholder="Nombre del doctor..." defaultValue={consultation ? consultation.doctor : null} required/>
          </div>
          <div id="drugs" className="uk-margin">
            { drugFields.map( (drugField, index) => 
              <div className="uk-margin" key={index}>
                <h4>Medicamento {index+1} <span className="uk-margin-left" uk-icon="minus-circle" onClick={event => deleteDrugField(event)}></span></h4>
                <label className="uk-form-label" htmlFor="form-stacked-text">Nombre:</label>
                <div className="uk-form-controls">
                  <input className="uk-input uk-border-pill uk-text-center" type="text" name="name" onChange={event => handleDrugInput(event, index)} placeholder="Nombre del medicamento" required />
                </div>
                <label className="uk-form-label" htmlFor="form-stacked-text">Presentación:</label>
                <div className="uk-form-controls">
                  <input className="uk-input uk-border-pill uk-text-center" type="text" name="dosage_form" onChange={event => handleDrugInput(event, index)} placeholder="Tabletas, jarabe, etc..." />
                </div>
                <label className="uk-form-label" htmlFor="form-stacked-text">Dosis:</label>
                <div className="uk-form-controls">
                  <input className="uk-input uk-border-pill uk-text-center" type="text" name="dose" onChange={event => handleDrugInput(event, index)} placeholder="500 mg, 10 ml, etc..." />
                </div>
                <h5 className="uk-margin-small uk-text-bold">Indicaciones del Doctor</h5>
                <label className="uk-form-label" htmlFor="form-stacked-text">Horario:</label>
                <div className="uk-form-controls">
                  <input className="uk-input uk-border-pill uk-text-center" type="text" name="schedule" onChange={event => handleDrugInput(event, index)} placeholder="cada 8 horas, cada 12 horas..." />
                </div>
                <label className="uk-form-label" htmlFor="form-stacked-text">Número de días:</label>
                <div className="uk-form-controls">
                  <input className="uk-input uk-border-pill uk-text-center" type="text" name="periodicity" onChange={event => handleDrugInput(event, index)} placeholder="3 días, 7 días..." />
                </div>
                <label className="uk-form-label" htmlFor="form-stacked-text">Indicaciones:</label>
                <div className="uk-form-controls">
                  <input className="uk-input uk-border-pill uk-text-center" type="text" name="directions" onChange={event => handleDrugInput(event, index)} placeholder="En ayunas, etc..." />
                </div>
              </div> ) }
          </div>
          <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin">
            <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m" onClick={event => addDrugField(event)} >
              + Medicamento
            </button>
          </div>
          
          <div className="uk-flex uk-flex-middle uk-flex-center uk-margin">
            <div className="uk-width-3-5@s uk-flex uk-flex-center uk-flex-middle">
            <p className="uk-text-middle uk-margin-remove">Imagen de la receta:</p>
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
        {/* { consultation ?
            <h5 className="uk-margin-small uk-text-center@s">Está agregando esta receta a la sig. consulta:
              <br/> Fecha: {moment(consultation.date).locale('es').format('LL')}
              <br/> Médico: {consultation.doctor}
              <br/> Diagnóstico: {consultation.diagnosis}
            </h5>
              : null
        } */}
        </div>
        { state.errorMessage ? <p className="uk-text-danger uk-text-center">{state.errorMessage}</p> : null }
        { !consultation ? 
          <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin-medium">
            <button type="submit" className="uk-button uk-button-primary uk-border-pill uk-width-2-3 uk-width-1-4@m" disabled={state.isButtonDisabled} >
              { !state.spinnerState ? "Crear Receta" : "Creando"}  <div className={ state.spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
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
                { !state.spinnerState ? "Agregar Receta" : "Agregando"}  <div className={ state.spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
              </button>
            </div>
          </Fragment>
        }
      </form>
    </Fragment>
  )
}

export default PrescriptionForm