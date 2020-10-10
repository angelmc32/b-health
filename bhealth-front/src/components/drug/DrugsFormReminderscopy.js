import React, { useEffect, useState, useContext, Fragment } from 'react';
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import useForm from '../../hooks/useForm';
import UIkit from 'uikit';
import moment from 'moment';

const DrugsForm = ({push, url}) => {

  const { user, setUser, resetUserContext } = useContext(AppContext); // Destructure user state variable
  const { form, setForm, resetForm, handleInput, handleFileInput } = useForm();
  const [ state, setState ] = useState({
    isUserEditing: false,
    isButtonDisabled: true,
    spinnerState: false,
    errorMessage: null,
    showNewProfilePic: false
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(form)
  }

  const toggleIsUserEditing = (event) => {
    event.preventDefault()
    resetForm();
    // document.getElementById('date_of_birth_input').value = moment(user.date_of_birth).format('YYYY-MM-DD')
    setState( prevState => ({...prevState, isUserEditing: !prevState.isUserEditing, errorMessage: null, isButtonDisabled: true}))
  }

  const changeTimesPerDay = (event) => {
    const { value } = event.target;
    let { schedule } = state;
    
    schedule.splice(0,schedule.length)
    state.scheduleValues.splice(1,state.scheduleValues.length)
    state.quantityValues.splice(1,state.quantityValues.length)
    for ( let i = 0 ; i < value ; i++ ) {
      schedule.push(
        <div className="uk-form-controls uk-flex uk-flex-between uk-flex-middle uk-margin-small" key={i}>
          <p className="uk-margin-remove">{i+1}</p>
          <input className="uk-input uk-border-pill uk-width-3-5 uk-text-center" type="time" name={`schedule_${i}`} onChange={ (event) => changeScheduleValues(event, i) } placeholder="" required />
          <input className="uk-input uk-border-pill uk-width-1-3 uk-text-center" type="number" name={`quantity_${i}`} onChange={ (event) => changeQuantityValues(event, i) } placeholder="Cantidad" step="1" min={1} required />
        </div>
      )
      if ( i > 0 ) {
        state.scheduleValues.push(null);
        state.quantityValues.push(null)
      }
    }
    setState( prevState => ({...prevState, times_per_day: value, schedule}));
  }

  const changeScheduleValues = (event, index) => {
    const { value } = event.target;
    state.scheduleValues[index] = value
    setForm( prevState => ({...prevState, ['schedule']: state.scheduleValues}))
  }
  const changeQuantityValues = (event, index) => {
    const { value } = event.target;
    if ( value > 0 ) {
      state.quantityValues[index] = value
      setForm( prevState => ({...prevState, ['quantity']: state.quantityValues}))
    } else {
      return null
    }
  }

  return (
    <Fragment>
      <h2>Agregar Medicamento</h2>
      <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => push(`${url}`)} >
        Regresar
      </button>
      <div className="uk-container">
        <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin-small-top">
          <ul className="uk-flex uk-flex-center uk-width-1-1 uk-margin-remove@s" uk-tab="connect: #my-id" >
            <li><a href="#">Medicamento</a></li>
            <li className="uk-active"><a href="#">Recordatorio</a></li>
          </ul>
        </div>
        <div id="my-id" className="uk-switcher" uk-switcher="true">
            
          <div className="uk-card uk-card-hover uk-card-body uk-padding-small uk-padding@s">
            <h4 className="uk-margin-remove-bottom">Datos del Medicamento</h4>
            <a className={ state.isUserEditing ? "uk-text-danger uk-position-top-right uk-position-small" : "eva-edit uk-position-top-right uk-position-small"} href="#" onClick={toggleIsUserEditing}>
              <span uk-icon={state.isUserEditing ? "ban" : "pencil"}></span>
            </a>
            <a className={ state.isUserEditing ? "uk-text-danger" : "eva-edit"} href="#" onClick={toggleIsUserEditing}>
              { state.isUserEditing ? "Cancelar cambios" : "Editar" }
            </a>
            <form onSubmit={handleSubmit} className="uk-form-stacked uk-text-left">
              <label className="uk-form-label uk-margin-small-top" htmlFor="name">Nombre:</label>
              <div className="uk-form-controls">
                <input className="uk-input uk-border-pill uk-text-center" name="name" onChange={handleInput} placeholder="Nombre del medicamento..." required />
              </div>
              <label className="uk-form-label uk-margin-top" htmlFor="form-stacked-text">Presentación <span className="uk-text-italic">(opcional)</span>:</label>
              <div className="uk-form-controls">
                <input className="uk-input uk-border-pill uk-text-center" name="dosage_form" onChange={handleInput} placeholder="Jarabe, tabletas, crema..." />
              </div>
              
              <div className="uk-margin-top uk-flex uk-flex-middle uk-width-1-1">
                <label className="uk-form-label uk-width-1-2">¿Es automedicado?</label>
                <div className="uk-flex uk-flex-around uk-width-1-2 uk-child-width-2-5 uk-child-width-1-3@s">
                  <button className={ state.isSelfMedicated ? "uk-button uk-button-secondary uk-border-pill selected uk-width-2-5 uk-text-center uk-padding-remove" : "uk-button uk-button-default uk-border-pill uk-width-2-5 uk-text-center uk-padding-remove"} onClick={ (event) => { event.preventDefault(); setState( prevState => ({...prevState, isSelfMedicated: true})) }} >
                    Sí
                  </button>
                  <button className={ !state.isSelfMedicated ? "uk-button uk-button-secondary uk-border-pill selected uk-width-2-5 uk-text-center uk-padding-remove" : "uk-button uk-button-default uk-border-pill uk-width-2-5 uk-text-center uk-padding-remove"} onClick={ (event) => { event.preventDefault(); setState( prevState => ({...prevState, isSelfMedicated: false})) }} >
                    No
                  </button>
                </div>
              </div>
              <button type="submit" className="uk-button uk-button-primary uk-button uk-border-pill uk-width-2-3 uk-width-1-4@m uk-align-center uk-margin" hidden={!state.isUserEditing} disabled={state.isButtonDisabled}>
                { !state.spinnerState ? "Guardar cambios" : "Guardando"}  <div className={ state.spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
              </button>
            </form>
          </div>

          <div className="uk-card uk-card-hover uk-card-body uk-padding-small uk-padding@s">

            <h4 className="uk-margin-remove-bottom">Recordatorio: {form.name ? form.name : null}</h4>

            <div className=" uk-margin-small-top uk-flex uk-flex-center uk-flex-middle uk-width-1-1 uk-text-left">
              <label className="uk-form-label uk-width-1-2 uk-margin-small-top">¿Lo está tomando actualmente?</label>
              <div className="uk-flex uk-flex-around uk-width-1-2 uk-child-width-2-5 uk-child-width-1-3@s">
                <button className={ state.isCurrentTreatment ? "uk-button uk-button-secondary uk-border-pill selected uk-width-2-5 uk-text-center uk-padding-remove" : "uk-button uk-button-default uk-border-pill uk-width-2-5 uk-text-center uk-padding-remove"} onClick={ (event) => { event.preventDefault(); setState( prevState => ({...prevState, isCurrentTreatment: true})) }} >
                  Sí
                </button>
                <button className={ !state.isCurrentTreatment ? "uk-button uk-button-secondary uk-border-pill selected uk-width-2-5 uk-text-center uk-padding-remove" : "uk-button uk-button-default uk-border-pill uk-width-2-5 uk-text-center uk-padding-remove"} onClick={ (event) => { event.preventDefault(); setState( prevState => ({...prevState, isCurrentTreatment: false})) }} >
                  No
                </button>
              </div>
            </div>

            <div className="uk-margin-small-top uk-width-1-1 uk-text-left">
              <label className="uk-form-label uk-margin-small" htmlFor="form-stacked-text">{ state.isCurrentTreatment ? "Duración del tratamiento actual:" : "Duración del tratamiento anterior:"}</label>
              <div className="uk-flex uk-flex-between">
                  <div className="uk-form-controls uk-width-2-3">
                    <select name="duration_units" onChange={handleInput} className="uk-select uk-border-pill" defaultValue=" Uso único" >
                      <option> Uso único</option>
                      <option>{ form.duration_number > 1 ? "Días" : "Día" }</option>
                      <option>{ form.duration_number > 1 ? "Semanas" : "Semana" }</option>
                      <option>{ form.duration_number > 1 ? "Meses" : "Mes" }</option>
                      <option>Según sea necesario</option>
                    </select>
                  </div>
                  <div className="uk-form-controls uk-width-1-4">
                    { form.duration_units && form.duration_units !== "Uso único" && form.duration_units !== "Según sea necesario"?
                        <select name="duration_number" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={1} disabled={ form.duration_units === "Uso único"}>
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                          <option value={5}>5</option>
                          <option value={6}>6</option>
                        </select>
                      : null
                    }
                  </div>
                  
                </div>
            </div>
            <div className="uk-margin-small-top uk-width-1-1 uk-text-left">
              <label className="uk-form-label uk-margin-small-top" htmlFor="form-stacked-text">Frecuencia:</label>
              <div className="uk-form-controls">
                <select name="frequency" onChange={handleInput} className="uk-select uk-border-pill uk-text-center" defaultValue="No aplica" disabled={form.duration_units === 'Uso único' || form.duration_units === 'Según sea necesario'}>
                  <option value="No aplica">No aplica (uso único)</option>
                  <option disabled={form.duration_units === " Uso único" || !form.duration_units ? true : false}>Según sea necesario</option>
                  <option disabled={form.duration_units === " Uso único" || !form.duration_units ? true : false}>Diario</option>
                  <option disabled={form.duration_units === " Uso único" || !form.duration_units ? true : false}>Días específicos de la semana</option>
                  <option disabled={form.duration_units === " Uso único" || !form.duration_units ? true : false}>Intervalo de días</option>
                </select>
              </div>
            </div>
            <div className="uk-margin-small-top uk-width-1-1 uk-text-left">
              <label className="uk-form-label uk-margin-small-top" htmlFor="form-stacked-text">Veces al día:</label>
              <div className="uk-form-controls">
                <select name="times_per_day" onChange={changeTimesPerDay} className="uk-select uk-border-pill uk-text-center" defaultValue={1} required>
                  <option value={1}>1 vez al día</option>
                  <option value={2}>2 veces al día</option>
                  <option value={3}>3 veces al día</option>
                  <option value={4}>4 veces al día</option>
                </select>
              </div>
            </div>
                
            <div className="uk-margin-small uk-flex uk-flex-middle uk-width-1-1">
              <label className="uk-text-center uk-width-1-2 uk-margin-small-top">¿Deseas agregar recordatorios?</label>
              <div className="uk-flex uk-flex-around uk-width-1-2 uk-child-width-2-5 uk-child-width-1-3@s">
                <button className={ state.showSchedule ? "uk-button uk-button-secondary uk-border-pill selected uk-width-2-5 uk-text-center uk-padding-remove" : "uk-button uk-button-default uk-border-pill uk-width-2-5 uk-text-center uk-padding-remove"} onClick={ (event) => { event.preventDefault(); setState( prevState => ({...prevState, showSchedule: true, currentStep: 2})) }} >
                  Sí
                </button>
                <button className={ !state.showSchedule ? "uk-button uk-button-secondary uk-border-pill selected uk-width-2-5 uk-text-center uk-padding-remove" : "uk-button uk-button-default uk-border-pill uk-width-2-5 uk-text-center uk-padding-remove"} onClick={ (event) => { event.preventDefault(); setState( prevState => ({...prevState, showSchedule: false, currentStep: 1})) }} >
                  No
                </button>
              </div>
            </div>
            { state.showSchedule ? 
              <div className="uk-margin-small">
                
              <div className="uk-width-1-1">
                <label className="uk-form-label uk-margin-small-top" htmlFor="form-stacked-text">Selecciona horario para tomar tu medicamento:</label>
                { state.schedule.map( (jsxElement) => jsxElement ) }
              </div>
            </div>
              : null
            }
            <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin-large-top">
              <button type="submit" className="uk-button uk-button-primary uk-button uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" disabled={state.isButtonDisabled} >
                { !state.spinnerState ? "Registrar" : "Registrando"}  <div className={ state.spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

    </Fragment>
  )
}

export default DrugsForm
