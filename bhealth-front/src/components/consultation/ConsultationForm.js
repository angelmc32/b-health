import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import CatalogSearchbar from '../common/CatalogSearchbar';
import useForm from '../../hooks/useForm';
import diseases from '../../catalogs/cie10.json';
import specialties from '../../catalogs/medspecs.json';
import moment from 'moment';
import UIkit from 'uikit';
import { createConsultation, editConsultation } from '../../services/consultation-services';
import 'moment/locale/es';  // without this line it didn't work
moment.locale('es');

const ConsultationForm = ({ url, action }) => {

  const { user, resetUserContext } = useContext(AppContext);
  const { form, resetForm, handleInput, handleSearchbarInput } = useForm();
  const [ state, setState ] = useState({
    isButtonDisabled: false,
    spinnerState: false,
    errorMessage: null,
    diagnosisInputClass: null,
    doctorSpecialtyClass: null
  });
  let originalDate, originalHours, originalMinutes, originalPeriod;
  const { location, push } = useHistory();
  let consultation;
  if ( action === 'update' && !location.state )
    push(url)
  else if ( action === 'update' ) { // When editing, save values for input defaultValues and in case of no change, use them in form
    consultation = location.state.consultation;
    originalDate = moment(consultation.date).format('YYYY-MM-DD');
    originalHours = parseInt(moment(consultation.date).format('h'));
    originalMinutes = moment(consultation.date).format('mm');
    originalPeriod = moment(consultation.date).format('A');
    // form['diagnosis'] = consultation.diagnosis
    // form['doctor_specialty'] = consultation.doctor_specialty
  }

  useEffect( () => {
    if ( !user._id ) {    // If there is no user logged in, send a notification and "redirect" to login
      UIkit.notification({
        message: '<p class="uk-text-center">Por favor inicia sesión',
        pos: 'bottom-center',
        status: 'warning'
      });    
      return push('/login');         // If not logged in, "redirect" user to login
    };
    if ( form['diagnosis'] ) {
      setState( prevState => ({...prevState, errorMessage: null, diagnosisInputClass: null}));
    }
    if ( form['doctor_specialty'] ) {
      setState( prevState => ({...prevState, errorMessage: null, doctorSpecialtyClass: null}));
    }
  }, [form, form.diagnosis, form.doctor_specialty])

  const handleSubmit = (event) => {

    event.preventDefault();
    setState( prevState => ({...prevState, isButtonDisabled: true, spinnerState: true}));
    let datetime;
    if ( action === 'update' ) {  // When editing, check for datetime info in form, if undefined, set them to original values
      if ( Object.keys(form).length === 0 ) {
        setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false, errorMessage: 'Realice una modificación a su consulta. Si desea cambiar el diagnóstico o especialidad del médico, seleccione alguna de las opciones presentadas.'}) );
        return;
      }
      if ( !form['only-date'] ) form['only-date'] = originalDate;
      if ( !form['time-hours'] ) form['time-hours'] = originalHours;
      if ( !form['time-minutes'] ) form['time-minutes'] = originalMinutes;
      if ( !form['time-period'] ) form['time-period'] = originalPeriod;
    }
    if ( action === 'create' && ( !form['diagnosis'] || !form['doctor_specialty'] ) ) {
      if ( !form['diagnosis'] ) {
        setState( prevState => ({...prevState, isButtonDisabled: false, errorMessage: 'Selecciona un diagnóstico', diagnosisInputClass: 'uk-form-danger'}));
      }
      if ( !form['doctor_specialty'] ) {
        setState( prevState => ({...prevState, isButtonDisabled: false, errorMessage: 'Selecciona la especialidad de tu médico', doctorSpecialtyClass: 'uk-form-danger'}));
      }
      return;
    }

    if (!form['only-date']) form['only-date'] = moment().format('YYYY-MM-DD')
    if (!form['time-hours']) form['time-hours'] = "12"
    if (!form['time-minutes']) form['time-minutes'] = "00"
    if (!form['time-period']) form['time-period'] = "PM"
    
    if ( form['time-period'] === 'AM' ) { // Editing date and time inputs for mongodb date
      if ( form['time-hours'] == '12' )
        datetime = `${form['only-date']}T00:${form['time-minutes']}:00-05:00`;
      else if ( form['time-hours'] == '11' || form['time-hours'] == '10' )
        datetime = `${form['only-date']}T${form['time-hours']}:${form['time-minutes']}:00-05:00`;
      else
        datetime = `${form['only-date']}T0${form['time-hours']}:${form['time-minutes']}:00-05:00`;
    }
    else {
      if ( form['time-hours'] === '12' )
      datetime = `${form['only-date']}T12:${form['time-minutes']}:00-05:00`;
      else {
        switch (form['time-hours']) {
          case '1': datetime = `${form['only-date']}T13:${form['time-minutes']}:00-05:00`; break;
          case '2': datetime = `${form['only-date']}T14:${form['time-minutes']}:00-05:00`; break;
          case '3': datetime = `${form['only-date']}T15:${form['time-minutes']}:00-05:00`; break;
          case '4': datetime = `${form['only-date']}T16:${form['time-minutes']}:00-05:00`; break;
          case '5': datetime = `${form['only-date']}T17:${form['time-minutes']}:00-05:00`; break;
          case '6': datetime = `${form['only-date']}T18:${form['time-minutes']}:00-05:00`; break;
          case '7': datetime = `${form['only-date']}T19:${form['time-minutes']}:00-05:00`; break;
          case '8': datetime = `${form['only-date']}T20:${form['time-minutes']}:00-05:00`; break;
          case '9': datetime = `${form['only-date']}T21:${form['time-minutes']}:00-05:00`; break;
          case '10': datetime = `${form['only-date']}T22:${form['time-minutes']}:00-05:00`; break;
          case '11': datetime = `${form['only-date']}T23:${form['time-minutes']}:00-05:00`; break;
          default: datetime = `${form['only-date']}T12:${form['time-minutes']}:00-05:00`; break;
        }  
      }
    }
    form['date'] = datetime;

    if ( action === 'create' ) {
      createConsultation(form)
      .then( res => {           // Success -> notification and send to new consultation view,
        const { consultation } = res.data    // Destructure updated preferences document from response
        UIkit.notification({  // Send UIkit success notification
          message: '<p class="uk-text-center">La consulta fue creada exitosamente</p>',
          pos: 'bottom-center',
          status: 'success'
        });
        resetForm();
        setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}))
        push({pathname: `${url}/ver`, state: {consultation: consultation}})

      })
      .catch( res => {          // Error -> notification and redirect if unauthorized
        const { msg } = res.response.data;
        if ( msg === 'Sesión expirada. Reinicia sesión por favor.' ) {
          localStorage.clear();
          resetUserContext();
          UIkit.notification({  // Send UIkit error notification
            message: `<p class="uk-text-center">${msg}</p>`,
            pos: 'bottom-center',
            status: 'warning'
          });
          push('/login');
        }
        else
          UIkit.notification({  // Send UIkit error notification
            message: `<p class="uk-text-center">${msg}</p>`,
            pos: 'bottom-center',
            status: 'warning'
          });
        setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}))
      });
    }

    if ( action === 'update' ) {
      editConsultation(consultation._id, form)
      .then( res => {           // Success -> notification and send to new consultation view,
        const { consultation } = res.data;
        UIkit.notification({
          message: '<p class="uk-text-center">La consulta fue actualizada exitosamente</p>',
          pos: 'bottom-center',
          status: 'success'
        });
        setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}));
        resetForm();
        push({pathname: `${url}/ver`, state: {consultation: consultation}});

      })
      .catch( res => {          // Error -> notification and redirect if unauthorized
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
          UIkit.notification({  // Send UIkit error notification
            message: `<p class="uk-text-center">${msg}</p>`,
            pos: 'bottom-center',
            status: 'danger'
          });
        
        setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}))
      });
    }
  }

  if (action === 'create')
    return (
      <Fragment>
        <h2>Crear Consulta</h2>
        <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => { resetForm(); push(url)}} >
          Regresar
        </button>
        <form onSubmit={handleSubmit} className="uk-form-stacked uk-text-left uk-container">
          <div className="uk-margin">
            <label className="uk-form-label" htmlFor="date">Fecha y hora de consulta:</label>
            <div className="uk-form-controls uk-flex uk-flex-wrap uk-flex-between uk-width-1-1 uk-margin-small-bottom">
              <div className="uk-width-1-1 uk-width-1-2@s uk-margin-small">
                <input className="uk-input uk-border-pill uk-text-center" type="date" name="only-date" onChange={handleInput} defaultValue={moment().format('YYYY-MM-DD')} max={moment().format('YYYY-MM-DD')} required />
              </div>
              <div className="uk-width-1-1 uk-width-1-2@s uk-flex uk-flex-around">
                <select name="time-hours" onChange={handleInput} className="uk-select uk-border-pill uk-width-1-3" defaultValue="12" required >
                  <option disabled={true} value="">Hora</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                </select>
                <select name="time-minutes" onChange={handleInput} className="uk-select uk-border-pill uk-width-1-3" defaultValue="00" required >
                  <option disabled={true} value="">Minutos</option>
                  <option>00</option>
                  <option>15</option>
                  <option>30</option>
                  <option>45</option>
                </select>
                <select name="time-period" onChange={handleInput} className="uk-select uk-border-pill uk-width-1-4" defaultValue="PM" required >
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
            </div>
            <label className="uk-form-label" htmlFor="form-stacked-text">Motivo de consulta:</label>
            <div className="uk-form-controls uk-margin-small-bottom">
              <textarea className="uk-textarea uk-border-pill uk-text-center" rows="2" name="chief_complaint" onChange={handleInput} placeholder="Dolor, fiebre, etc..." required></textarea>
            </div>
            <label className="uk-form-label" htmlFor="form-stacked-text">Diagnóstico:</label>
            <div className="uk-form-controls uk-margin-small-bottom">
              {/* <input className="uk-input uk-border-pill" type="text" name="diagnosis" onChange={handleInput} placeholder="Introducir enfermedad o padecimiento diagnosticado" required/> */}
              <CatalogSearchbar suggestions={diseases} propertyName={'NOMBRE'} type={'diagnosis'} inputClass={state.diagnosisInputClass} form={form} handleSearchbarInput={handleSearchbarInput} />
              {/* <CatalogSearchbar type="diagnosis" form={form} handleFormInput={handleInput}/> */}
            </div>
            <label className="uk-form-label" htmlFor="form-stacked-text">Médico tratante:</label>
            <div className="uk-form-controls uk-margin-small-bottom">
              <input className="uk-input uk-border-pill uk-text-center" type="text" name="doctor" onChange={handleInput} placeholder="Nombre del doctor..."  required/>
            </div>
            <label className="uk-form-label" htmlFor="form-stacked-text">Especialidad del Médico:</label>
            <div className="uk-form-controls uk-margin-small-bottom">
              <CatalogSearchbar suggestions={specialties} propertyName={'ESPECIALIDAD'} type="doctor_specialty" inputClass={state.doctorSpecialtyClass} form={form} handleSearchbarInput={handleSearchbarInput} />
            </div>
            <label className="uk-form-label" htmlFor="form-stacked-text">Lugar de consulta:</label>
            <div className="uk-form-controls uk-margin-small-bottom">
              <select name="medical_facility" onChange={handleInput} className="uk-select uk-border-pill" defaultValue="" required>
                <option value="">Selecciona una opción</option>
                <option>Consultorio privado independiente</option>
                <option>Consultorio en hospital privado</option>
                <option>Consultorio en clínica privada</option>
                <option>Consultorio de farmacia</option>
                <option>Consultorio en clínica/hospital IMSS</option>
                <option>Consultorio en clínica/hospital ISSSTE</option>
                <option>Consultorio en clínica/hospital SSA</option>
                <option>Otro</option>
              </select>
            </div>
          </div>
          { state.errorMessage ? 
            <p className="uk-text-center uk-text-danger">{state.errorMessage}</p> : null 
          }
          <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin-medium">
            <button type="submit" className="uk-button uk-button-primary uk-button uk-border-pill uk-width-2-3 uk-width-1-4@m" disabled={state.isButtonDisabled} >
            { !state.spinnerState ? "Crear Consulta" : "Creando"}  <div className={ state.spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
            </button>
          </div>
        </form>
      </Fragment>
    )
  
  else if (action === 'update' && consultation)
    return (
      <Fragment>
        <h2>Editar Consulta</h2>
        <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => { resetForm(); push(url)}} >
          Regresar
        </button>
        <form onSubmit={handleSubmit} className="uk-form-stacked uk-text-left uk-container">
          <div className="uk-margin">
            <div>
              <label className="uk-form-label" htmlFor="date">Fecha y hora de consulta:</label>
              <div className="uk-form-controls uk-flex uk-flex-wrap uk-flex-between uk-width-1-1 uk-margin-small-bottom">
                <div className="uk-width-1-1 uk-width-1-2@s uk-margin-small">
                  <input className="uk-input uk-border-pill uk-text-center" type="date" name="only-date" onChange={handleInput} defaultValue={originalDate} max={moment().format('YYYY-MM-DD')} required />
                </div>
                <div className="uk-width-1-1 uk-width-1-2@s uk-flex uk-flex-around">
                  <select name="time-hours" onChange={handleInput} className="uk-select uk-border-pill uk-width-1-3" defaultValue={originalHours} required>
                    <option disabled={true}>Hora</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>
                    <option>9</option>
                    <option>10</option>
                    <option>11</option>
                    <option>12</option>
                  </select>
                  <select name="time-minutes" onChange={handleInput} className="uk-select uk-border-pill uk-width-1-3" defaultValue={originalMinutes} required>
                    <option disabled={true}>Minutos</option>
                    <option>00</option>
                    <option>15</option>
                    <option>30</option>
                    <option>45</option>
                  </select>
                  <select name="time-period" onChange={handleInput} className="uk-select uk-border-pill uk-width-1-4" defaultValue={originalPeriod} required>
                    <option disabled={true}>AM/PM</option>
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
              </div>
            </div>
            
            <label className="uk-form-label" htmlFor="form-stacked-text">Motivo de consulta:</label>
            <div className="uk-form-controls uk-margin-small-bottom">
              <textarea className="uk-textarea uk-border-pill uk-text-center" rows="2" name="chief_complaint" onChange={handleInput} defaultValue={consultation.chief_complaint} required></textarea>
            </div>
            <label className="uk-form-label" htmlFor="form-stacked-text">Diagnóstico:</label>
            <div className="uk-form-controls uk-margin-small-bottom">
              <CatalogSearchbar suggestions={diseases} propertyName={'NOMBRE'} type={'diagnosis'} form={form} inputValue={consultation.diagnosis} handleSearchbarInput={handleSearchbarInput} />
            </div>
            <label className="uk-form-label" htmlFor="form-stacked-text">Médico tratante:</label>
            <div className="uk-form-controls uk-margin-small-bottom">
              <input className="uk-input uk-border-pill uk-text-center" type="text" name="doctor" onChange={handleInput} defaultValue={consultation.doctor} required/>
            </div>
            <label className="uk-form-label" htmlFor="form-stacked-text">Especialidad del Médico:</label>
            <div className="uk-form-controls uk-margin-small-bottom">
              <CatalogSearchbar suggestions={specialties} propertyName={'ESPECIALIDAD'} type="doctor_specialty" form={form} inputValue={consultation.doctor_specialty} handleSearchbarInput={handleSearchbarInput} />
            </div>
            <label className="uk-form-label" htmlFor="form-stacked-text">Lugar de consulta:</label>
            <div className="uk-form-controls uk-margin-small-bottom">
              <select name="medical_facility" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={consultation.medical_facility} >
                <option>Consultorio privado independiente</option>
                <option>Consultorio en hospital privado</option>
                <option>Consultorio en clínica privada</option>
                <option>Consultorio de farmacia</option>
                <option>Consultorio en clínica/hospital IMSS</option>
                <option>Consultorio en clínica/hospital ISSSTE</option>
                <option>Consultorio en clínica/hospital SSA</option>
                <option>Otro</option>
              </select>
            </div>
          </div>
          { state.errorMessage ? 
            <p className="uk-text-center uk-text-danger">{state.errorMessage}</p> : null 
          }
          <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin-medium">
            <button type="submit" className="uk-button uk-button-primary uk-button uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" disabled={state.isButtonDisabled} >
              { !state.spinnerState ? "Editar consulta" : "Actualizando"}  <div className={ state.spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
            </button>
          </div>
        </form>
      </Fragment>
    )
  else
    return (
      <Fragment>
        <h2>Ocurrió un error</h2>
        <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => { resetForm(); push(`${url}`)}} >
          Regresar
        </button>
      </Fragment>)

}

export default ConsultationForm