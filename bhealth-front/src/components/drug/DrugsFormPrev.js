import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom'
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import useForm from '../../hooks/useForm';
import UIkit from 'uikit';                                          // Import UIkit for notifications
import Stepper from 'react-stepper-horizontal'
import moment from 'moment';                                        // Import momentjs for date formatting

import { createDrug } from '../../services/drug-services'

const DrugsForm = ({url}) => {

  const { user, resetUserContext } = useContext(AppContext);
  const { form, setForm, resetForm, handleInput } = useForm();
  const { push } = useHistory();
  const [ state, setState ] = useState({
    isButtonDisabled: true,
    spinnerState: false,
    currentStep: 0,
    isCurrentTreatment: true,
    isSelfMedicated: false,
    times_per_day: 1,
    schedule: [
      <div className="uk-form-controls uk-flex uk-flex-between uk-flex-middle uk-margin-small" key={0}>
        <p className="uk-margin-remove">1</p>
        <input className="uk-input uk-border-pill uk-width-3-5 uk-text-center" type="time" name="schedule_0" onChange={ (event) => changeScheduleValues(event, 0) } placeholder="" required />
        <input className="uk-input uk-border-pill uk-width-1-3 uk-text-center" type="number" name="quantity_0" onChange={ (event) => changeQuantityValues(event, 0) } placeholder="Cantidad" step="1" min={1} required />
      </div>
      ],
    scheduleValues: [null],
    quantityValues: [null],
    showSchedule: false
  })

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

    if ( form.name )
      setState( prevState => ({...prevState, isButtonDisabled: false}));
    if ( form.frequency === "No aplica" )
      resetSchedule();
    
  }, [form])

  const handleSubmit = (event) => {
    event.preventDefault();
    if ( !form.duration_units || form.duration_units === "Uso único" ) {
      form['duration_units'] = "Uso único";
      form['duration_number'] = null;
      form['frequency'] = "No aplica"
    }
    if ( !form.times_per_day ) {
      form['times_per_day'] = state.times_per_day
    }
    form['isCurrentTreatment'] = state.isCurrentTreatment
    form['isSelfMedicated'] = state.isSelfMedicated

    setState( prevState => ({...prevState, isButtonDisabled: true, spinnerState: true}))
    
    createDrug(form)
    .then( res => {
      const { drug } = res.data;
      console.log(drug)
      UIkit.notification({
        message: '<p class="uk-text-center">Se ha registrado el medicamento</p>',
        pos: 'bottom-center',
        status: 'success'
      });
      resetForm();
      push(url);
    })
    .catch( res => {

      let { msg } = res.response.data

      if (res.response.status === 401) {
        localStorage.clear();
        resetUserContext();
        UIkit.notification({
          message: '<p class="uk-text-center">Por favor inicia sesión</p>',
          pos: 'bottom-center',
          status: 'warning'
        });
        resetForm();
        push('/login');
      } else
          UIkit.notification({
            message: `<p class="uk-text-center">${msg}</p>`,
            pos: 'bottom-center',
            status: 'danger'
          });
          setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}))
    });
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

  const resetSchedule = () => {
    setState( prevState => ({...prevState, 
      spinnerState: false,
      currentStep: 1,
      times_per_day: 1,
      schedule: [
        <div className="uk-form-controls uk-flex uk-flex-between uk-flex-middle uk-margin-small" key={0}>
          <p className="uk-margin-remove">1</p>
          <input className="uk-input uk-border-pill uk-width-3-5 uk-text-center" type="time" name="schedule_0" onChange={ (event) => changeScheduleValues(event, 0) } placeholder="" required />
          <input className="uk-input uk-border-pill uk-width-1-3 uk-text-center" type="number" name="quantity_0" onChange={ (event) => changeQuantityValues(event, 0) } placeholder="Cantidad" step="1" min={1} required />
        </div>
        ],
      scheduleValues: [null],
      quantityValues: [null],
      showSchedule: false
    }))
  }

  const checkIsEmpty = (element) => {
    return element === null
  }

  const formStepper = <Stepper 
      steps={ 
        [
          {
            onClick: (event) => {
              event.preventDefault()
              setState( prevState => ({...prevState, currentStep: 0}))
            }
          },
          {
            onClick: (event) => {
              event.preventDefault()
              setState( prevState => ({...prevState, currentStep: 1}))
            }
          }
        ]
      } 
      activeStep={state.currentStep}
      activeColor={'#4F39BF'}
      completeColor={'#4F39BF'}
      circleTop={12}
      circleFontSize={14} />

  return (
    <div className="uk-margin">
      <h2>Agregar Medicamento</h2>
      <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => push(`${url}`)} >
        Regresar
      </button>
      <form onSubmit={handleSubmit} className="uk-text-left uk-flex uk-flex-column uk-container">
        <div className="uk-width-1-1 uk-flex uk-flex-middle">
          <a className={ state.currentStep === 0 ? "uk-disabled uk-text-muted" : "stepper-primary"} uk-icon="icon: chevron-left" onClick={ state.currentStep === 0 ? null : (event) => {event.preventDefault(); setState( prevState => ({...prevState, currentStep: prevState.currentStep-1})) }}></a>
          {formStepper}
          <a className={ state.currentStep === 1 || !form.name ? "uk-disabled uk-text-muted" : "stepper-primary"} uk-icon="icon: chevron-right" onClick={ state.currentStep === 1 ? null : (event) => {event.preventDefault(); setState( prevState => ({...prevState, currentStep: prevState.currentStep+1})) }}></a>
        </div>
        <div className={ state.currentStep == 0 ? "uk-visible uk-margin-small" : "uk-hidden" }>
          <div className="uk-width-1-1">
            <label className="uk-form-label" htmlFor="form-stacked-text">Nombre del medicamento:</label>
            <div className="uk-form-controls">
              <input className="uk-input uk-border-pill uk-text-center" name="name" onChange={handleInput} placeholder="Introduce el nombre para poder continuar..." required />
            </div>
          </div>
          <div className="uk-width-1-1 uk-flex uk-flex-between uk-flex-wrap">
            <div className="uk-width-1-1 uk-width-1-2@s">
              <label className="uk-form-label" htmlFor="form-stacked-text">Dosis <span className="uk-text-italic">(opcional)</span>:</label>
              <div className="uk-flex uk-flex-around">
                <div className="uk-form-controls uk-width-2-3">
                  <input className="uk-input uk-border-pill uk-text-center" name="dosage" type="number" onChange={handleInput} />
                </div>
                <div className="uk-form-controls uk-width-1-4">
                  { form.dosage ? 
                    <select name="dosage_units" onChange={handleInput} className="uk-select uk-border-pill uk-text-center" defaultValue="" >
                      <option value=""></option>
                      <option >mg</option>
                      <option>µg</option>
                      <option>g</option>
                      <option>ml</option>
                      <option>mg/ml</option>
                      <option>mg/g</option>
                      <option>µg/mg</option>
                      <option>µg/µg</option>
                      <option>UI</option>
                      <option>UI/ml</option>
                      <option >UIK/ml</option>
                    </select>
                  : null
                  }
                </div>
              </div>
            </div>
            <div className="uk-width-1-1 uk-width-1-2@s">
              <label className="uk-form-label" htmlFor="form-stacked-text">Presentación <span className="uk-text-italic">(opcional)</span>:</label>
              <div className="uk-form-controls">
                <input className="uk-input uk-border-pill uk-text-center" name="dosage_form" onChange={handleInput} placeholder="Jarabe, tabletas, crema..." />
              </div>
            </div>
            <div className="uk-margin-small-top uk-flex uk-flex-middle uk-width-1-1">
              <label className="uk-form-label uk-width-1-2">¿Lo está tomando actualmente?</label>
              <div className="uk-flex uk-flex-around uk-width-1-2 uk-child-width-2-5 uk-child-width-1-3@s">
                <button className={ state.isCurrentTreatment ? "uk-button uk-button-secondary uk-border-pill selected uk-width-2-5 uk-text-center uk-padding-remove" : "uk-button uk-button-default uk-border-pill uk-width-2-5 uk-text-center uk-padding-remove"} onClick={ (event) => { event.preventDefault(); setState( prevState => ({...prevState, isCurrentTreatment: true})) }} >
                  Sí
                </button>
                <button className={ !state.isCurrentTreatment ? "uk-button uk-button-secondary uk-border-pill selected uk-width-2-5 uk-text-center uk-padding-remove" : "uk-button uk-button-default uk-border-pill uk-width-2-5 uk-text-center uk-padding-remove"} onClick={ (event) => { event.preventDefault(); setState( prevState => ({...prevState, isCurrentTreatment: false})) }} >
                  No
                </button>
              </div>
            </div>
            <div className="uk-margin-small-top uk-flex uk-flex-middle uk-width-1-1">
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
          </div>
        </div>
        <div className={ state.currentStep !== 0 ? "uk-visible uk-margin-top" : "uk-hidden" }>
          <div className="uk-width-1-1">
            <label className="uk-form-label" htmlFor="form-stacked-text">{ state.isCurrentTreatment ? "Duración del tratamiento actual:" : "Duración del tratamiento anterior:"}</label>
            <div className="uk-flex uk-flex-around">
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
          <div className="uk-width-1-1">
            <div className="uk-width-1-1">
              <label className="uk-form-label" htmlFor="form-stacked-text">Frecuencia:</label>
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
            <div className="uk-width-1-1">
              <label className="uk-form-label" htmlFor="form-stacked-text">Veces al día:</label>
              <div className="uk-form-controls">
                <select name="times_per_day" onChange={changeTimesPerDay} className="uk-select uk-border-pill uk-text-center" defaultValue={1} required>
                  <option value={1}>1 vez al día</option>
                  <option value={2}>2 veces al día</option>
                  <option value={3}>3 veces al día</option>
                  <option value={4}>4 veces al día</option>
                </select>
              </div>
            </div>
            
          </div>
          <div className="uk-margin-small uk-flex uk-flex-middle uk-width-1-1">
            <label className="uk-text-center uk-width-1-2">¿Deseas agregar recordatorios?</label>
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
              <label className="uk-form-label" htmlFor="form-stacked-text">Selecciona horario para tomar tu medicamento:</label>
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
        <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin-top">
          <div className="uk-width-3-5@s uk-width-1-3@m uk-flex uk-flex-between">
            <button className="uk-button uk-button-default wizard uk-border-pill uk-width-1-3" disabled={ state.currentStep === 0 ? true : false } onClick={ (event) => {event.preventDefault(); setState( prevState => ({...prevState, currentStep: prevState.currentStep-1})) }} >
              <span uk-icon="arrow-left"></span>
            </button>
            <button className="uk-button uk-button-default wizard uk-border-pill uk-width-1-3" disabled={ state.currentStep === 1 || !form.name ? true : false } onClick={ (event) => {event.preventDefault(); setState( prevState => ({...prevState, currentStep: prevState.currentStep+1})) }} >
              <span uk-icon="arrow-right"></span>
            </button>
          </div>
        </div>
      </form>
      
    </div>
  )
}

export default DrugsForm