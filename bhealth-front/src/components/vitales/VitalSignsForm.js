import React, { useEffect, useState } from 'react';
import useForm from '../../hooks/useForm';
import UIkit from 'uikit';                                          // Import UIkit for notifications
import moment from 'moment';                                        // Import momentjs for date formatting

import VitalSignsCard from '../vitalsigns/VitalSignsCard'

import happy_img from '../../images/icons/happy-face.svg'
import sad_img from '../../images/icons/sad-face.svg'
import add_vitals_icon from '../../images/icons/add-vitals.svg'
import blood_pressure_icon from '../../images/icons/blood-pressure.svg'
import blood_sugar_icon from '../../images/icons/blood-sugar.svg'
import heart_rate_icon from '../../images/icons/heart-rate.svg'
import temperature_icon from '../../images/icons/temperature.svg'
import weight_icon from '../../images/icons/weight.svg'

import { getVitalSigns, getOneVitalSigns, createVitalSigns } from '../../services/vitalsigns-services'

const VitalSignsForm = ({push, url}) => {

  const { form, resetForm, handleInput } = useForm();
  let thisMoment = moment().format(), datetime;

  const [ state, setState ] = useState({
    isButtonDisabled: true,
    spinnerState: false,
    temperature: false,
    blood_pressure: false,
    heart_rate: false,
    resp_rate: false,
    blood_sugar: false,
    weight: false,
    height: false,
    showDateInput: false
  })

  const handleSubmit = (event) => {

    event.preventDefault();
    
    setState( prevState => ({...prevState, isButtonDisabled: true, spinnerState: true}))
    setState( prevState => ({...prevState, spinnerState: true}))

    if (!state.showDateInput)
      form['date'] = thisMoment;
    else {
      if ( form.timeperiod === 'AM' ) {
        if ( form['time-hours'] === '12' )
          datetime = `${form['only-date']}T00:${form['time-minutes']}:00`;
        else
          datetime = `${form['only-date']}T${form['time-hours']}:${form['time-minutes']}:00`;
      }
      else {
        if ( form['time-hours'] === '12' )
          datetime = `${form['only-date']}T12:${form['time-minutes']}:00`;
        else {
          switch (form['time-hours']) {
            case '1': datetime = `${form['only-date']}T13:${form['time-minutes']}:00`; break;
            case '2': datetime = `${form['only-date']}T14:${form['time-minutes']}:00`; break;
            case '3': datetime = `${form['only-date']}T15:${form['time-minutes']}:00`; break;
            case '4': datetime = `${form['only-date']}T16:${form['time-minutes']}:00`; break;
            case '5': datetime = `${form['only-date']}T17:${form['time-minutes']}:00`; break;
            case '6': datetime = `${form['only-date']}T18:${form['time-minutes']}:00`; break;
            case '7': datetime = `${form['only-date']}T19:${form['time-minutes']}:00`; break;
            case '8': datetime = `${form['only-date']}T20:${form['time-minutes']}:00`; break;
            case '9': datetime = `${form['only-date']}T21:${form['time-minutes']}:00`; break;
            case '10': datetime = `${form['only-date']}T22:${form['time-minutes']}:00`; break;
            case '11': datetime = `${form['only-date']}T23:${form['time-minutes']}:00`; break;
            default: datetime = `${form['only-date']}T12:${form['time-minutes']}:00`; break;
          }
        }
        form['date'] = datetime;
      }
    }

    if (Object.keys(form).length === 0 && form.constructor === Object) {

      console.log('no vale')
      setState({
        isButtonDisabled: true,
        spinnerState: false,
        temperature: false,
        blood_pressure: false,
        heart_rate: false,
        resp_rate: false,
        blood_sugar: false,
        weight: false,
        height: false
      });

      return null

    }

    createVitalSigns(form)
    .then( res => {

      const { vitalSigns } = res.data    // Destructure updated preferences document from response

      // Send UIkit success notification
      UIkit.notification({
        message: '<p class="uk-text-center">¡El registro de signos vitales fue creado exitosamente!</p>',
        pos: 'bottom-center',
        status: 'success'
      });

      setState({
        isButtonDisabled: true,
        spinnerState: false,
        temperature: false,
        blood_pressure: false,
        heart_rate: false,
        resp_rate: false,
        blood_sugar: false,
        weight: false,
        height: false
      });

      resetForm();

      push(`${url}`)

    })
    .catch( res => {

      const { msg } = res.response.data

      // Send UIkit error notification
      UIkit.notification({
        message: `<p class="uk-text-center">${msg}</p>`,
        pos: 'bottom-center',
        status: 'danger'
      });
      
      setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}))

    });

  }

  const changeCardClass = (vitalSignName) => {

    if ( state[vitalSignName] ) {

      if ( vitalSignName === 'blood_pressure' ) {
        delete form['blood_pressure_sys']
        delete form['blood_pressure_dias']
      }
      else
        delete form[vitalSignName]

      if (Object.keys(form).length === 0 && form.constructor === Object)
        setState( prevState => ({...prevState, isButtonDisabled: true}))
        
    } 
    else
      setState( prevState => ({...prevState, isButtonDisabled: false}))

    setState( prevState => ({...prevState, [vitalSignName]: !prevState[vitalSignName]}))

  }

  const changeDateInputState = (event, showInputState) => {

    event.preventDefault();
    setState( prevState => ({...prevState, showDateInput: showInputState}) );

    // if (form['only-date'] === undefined || form['time-hours'] === undefined || form['time-minutes'] === undefined || form['time-period'] === undefined)
    //   setState( prevState => ({...prevState, isButtonDisabled: true}) );

    if (showInputState) {
      form['only-date'] = undefined;
      form['time-hours'] = undefined;
      form['time-minutes'] = undefined;
      form['time-period'] = undefined
    } else {
      delete form['only-date'];
      delete form['time-hours'];
      delete form['time-minutes'];
      delete form['time-period'];
    }

  }

  const dateValidation = (event) => {
    
    const { name, value } = event.target;

    if (name !== 'time-hours') form['time-hours'] = '12'
    if (name !== 'time-minutes') form['time-minutes'] = '00'
    if (name !== 'time-period') form['time-period'] = 'PM'
    handleInput(event);
    if (form['only-date'] !== undefined && form['time-hours'] !== undefined && form['time-minutes'] !== undefined && form['time-period'] !== undefined)
    setState( prevState => ({...prevState, isButtonDisabled: false}) );
  }

  return (
    <div className="uk-margin">
      <h2>Registrar Signos Vitales</h2>
      <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin-small" onClick={event => push(`${url}`)} >
        Regresar
      </button>
      <p>Selecciona los signos vitales a registrar</p>
      <form onSubmit={handleSubmit}>
        <div className="uk-width-1-1 uk-flex uk-flex-center uk-hidden@s">
          <button type="submit" className="uk-button uk-button-primary uk-button uk-border-pill uk-width-2-3 uk-width-1-4@m" disabled={state.isButtonDisabled} >
            { !state.spinnerState ? "Crear registro" : "Registrando"}  <div className={ state.spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
          </button>
        </div>

        <div className="uk-margin-small uk-flex uk-flex-column uk-flex-center uk-flex-middle">
          <div className="uk-flex uk-flex-column uk-flex-middle uk-width-1-1 uk-width-1-3@s">
            <div className="uk-margin-small-bottom uk-text-bold">{moment(thisMoment).format('LLL')} {moment(thisMoment).format('a')}</div>
          </div>
          <div className="uk-margin-small-bottom uk-flex uk-flex-middle uk-width-1-1 uk-width-2-5@s uk-child-width-1-2">
            <label>Usar fecha y hora actual:</label>
            <div className="uk-flex uk-flex-around uk-child-width-1-2 uk-child-width-1-3@s">
              <button className={ !state.showDateInput ? "uk-button uk-button-secondary uk-border-pill selected" : "uk-button uk-button-default uk-border-pill"} onClick={event => changeDateInputState(event, false)}>
                Sí
              </button>
              <button className={ state.showDateInput ? "uk-button uk-button-secondary uk-border-pill selected" : "uk-button uk-button-default uk-border-pill"} onClick={event => changeDateInputState(event, true)} >
                No
              </button>
            </div>
          </div>
          { state.showDateInput ? 
          <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-width-1-1 uk-width-2-3@s">
            <div className="uk-margin-small-bottom uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
              <label>Fecha y hora del registro:</label>
              <input className="uk-input uk-border-pill" type="date" name="only-date" onChange={dateValidation} required/>
            </div>
            <div className="uk-width-1-1 uk-width-2-3@s uk-flex uk-flex-around">
              <select name="time-hours" onChange={dateValidation} className="uk-select uk-border-pill uk-width-1-3" defaultValue="12" required>
                <option disabled={true}>12</option>
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
              <select name="time-minutes" onChange={dateValidation} className="uk-select uk-border-pill uk-width-1-3" defaultValue="00" required>
                <option disabled={true}>00</option>
                <option>00</option>
                <option>15</option>
                <option>30</option>
                <option>45</option>
              </select>
              <select name="time-period" onChange={dateValidation} className="uk-select uk-border-pill uk-width-1-4" defaultValue="PM" required>
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>
          </div>
          : null
        }
        </div>
        
        <div className="uk-child-width-1-3@m uk-child-width-1-1 uk-grid-small uk-grid-match" uk-grid="true">
          <div onClick={ !state.temperature ? (event => changeCardClass('temperature')) : null}>
            <div className={ !state.temperature ? "uk-card uk-card-hover uk-card-body uk-padding-small" : "uk-card uk-card-primary uk-card-body uk-padding-small"}>                  
              <h5 className="uk-margin-remove">Temperatura</h5>       
              { state.temperature ? 
                  <div className="uk-flex uk-flex-center uk-flex-middle">
                    <a onClick={event => changeCardClass('temperature')} className="uk-position-small uk-position-center-right" uk-icon="icon: minus-circle; ratio: 1.25"></a>
                    <div className="uk-flex uk-flex-right uk-flex-middle uk-width-3-5">
                      <input className="uk-input uk-border-pill uk-text-center uk-width-2-3" type="number" name="temperature" min={35} max={40} step="0.1" onChange={handleInput} required/>
                      <p className="uk-margin-small-left uk-width-1-6">°C</p>
                    </div>
                  </div>
                : null
              }
            </div>
          </div>
          <div onClick={ !state.blood_pressure ? (event => changeCardClass('blood_pressure')) : null}>
            <div className={ !state.blood_pressure ? "uk-card uk-card-hover uk-card-body uk-padding-small" : "uk-card uk-card-primary uk-card-body uk-padding-small"}>
              <h5 className="uk-margin-remove">Presión Arterial</h5>
              { state.blood_pressure ? 
                  <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
                    <a onClick={event => changeCardClass('blood_pressure')} className="uk-position-small uk-position-center-right" uk-icon="icon: minus-circle; ratio: 1.25"></a>
                    <div className="uk-flex uk-flex-center uk-flex-middle uk-width-4-5">
                      <input className="uk-input uk-border-pill uk-text-center uk-width-2-3" type="number" name="blood_pressure_sys" min={90} max={250} placeholder="Sistólica (alta)" onChange={handleInput} required/>
                      <p className="uk-margin-small-left uk-width-1-6"> mmHg</p>
                    </div>
                    <div className="uk-flex uk-flex-center uk-flex-middle uk-width-4-5">
                      <input className="uk-input uk-border-pill uk-text-center uk-width-2-3" type="number" name="blood_pressure_dias" min={60} max={140} placeholder="Diastólica (baja)" onChange={handleInput} required/>
                      <p className="uk-margin-small-left uk-width-1-6"> mmHg</p>
                    </div>
                  </div>
                : null
              }
            </div>
          </div>
          <div onClick={ !state.heart_rate ? (event => changeCardClass('heart_rate')) : null}>
            <div className={ !state.heart_rate ? "uk-card uk-card-hover uk-card-body uk-padding-small" : "uk-card uk-card-primary uk-card-body uk-padding-small"}>
              <h5 className="uk-margin-remove">Frecuencia Cardiaca</h5>
              { state.heart_rate ? 
                  <div className="uk-flex uk-flex-center uk-flex-middle">
                    <a onClick={event => changeCardClass('heart_rate')} className="uk-position-small uk-position-center-right" uk-icon="icon: minus-circle; ratio: 1.25"></a>
                    <div className="uk-flex uk-flex-right uk-flex-middle uk-width-3-5">
                      <input className="uk-input uk-border-pill uk-text-center uk-width-2-3" type="number" name="heart_rate" min={35} max={200} onChange={handleInput} required/>
                      <p className="uk-margin-small-left uk-width-1-6">lpm</p>
                    </div>
                  </div>
                : null
              }
            </div>
          </div>
          <div onClick={ !state.resp_rate ? (event => changeCardClass('resp_rate')) : null}>
            <div className={ !state.resp_rate ? "uk-card uk-card-hover uk-card-body uk-padding-small" : "uk-card uk-card-primary uk-card-body uk-padding-small"}>
              <h5 className="uk-margin-remove">Frecuencia Respiratoria</h5>
              { state.resp_rate ? 
                  <div className="uk-flex uk-flex-center uk-flex-middle">
                    <a onClick={event => changeCardClass('resp_rate')} className="uk-position-small uk-position-center-right" uk-icon="icon: minus-circle; ratio: 1.25"></a>
                    <div className="uk-flex uk-flex-right uk-flex-middle uk-width-3-5">
                      <input className="uk-input uk-border-pill uk-text-center uk-width-2-3" type="number" name="resp_rate" min={10} max={40} onChange={handleInput} required/>
                      <p className="uk-margin-small-left uk-width-1-6">rpm</p>
                    </div>
                  </div>
                : null
              }
            </div>
          </div>
          <div onClick={ !state.blood_sugar ? (event => changeCardClass('blood_sugar')) : null}>
            <div className={ !state.blood_sugar ? "uk-card uk-card-hover uk-card-body uk-padding-small" : "uk-card uk-card-primary uk-card-body uk-padding-small"}>
              <h5 className="uk-margin-remove">Glucosa</h5>
              { state.blood_sugar ? 
                  <div className="uk-flex uk-flex-center uk-flex-middle">
                    <a onClick={event => changeCardClass('blood_sugar')} className="uk-position-small uk-position-center-right" uk-icon="icon: minus-circle; ratio: 1.25"></a>
                    <div className="uk-flex uk-flex-right uk-flex-middle uk-width-3-5">
                      <input className="uk-input uk-border-pill uk-text-center uk-width-2-3" type="number" name="blood_sugar" min={60} max={250} onChange={handleInput} required/>
                      <p className="uk-margin-small-left uk-width-1-6">mg/dl</p>
                    </div>
                  </div>
                : null
              }
            </div>
          </div>
          <div onClick={ !state.weight ? (event => changeCardClass('weight')) : null}>
            <div className={ !state.weight ? "uk-card uk-card-hover uk-card-body uk-padding-small" : "uk-card uk-card-primary uk-card-body uk-padding-small"}>
              <h5 className="uk-margin-remove">Peso</h5>
              { state.weight ? 
                  <div className="uk-flex uk-flex-center uk-flex-middle">
                    <a onClick={event => changeCardClass('weight')} className="uk-position-small uk-position-center-right" uk-icon="icon: minus-circle; ratio: 1.25"></a>
                    <div className="uk-flex uk-flex-right uk-flex-middle uk-width-3-5">
                      <input className="uk-input uk-border-pill uk-text-center uk-width-2-3" type="number" name="weight" min={30} max={300} step="0.001" onChange={handleInput} required/>
                      <p className="uk-margin-small-left uk-width-1-6">kg</p>
                    </div>
                  </div>
                : null
              }
            </div>
          </div>
          <div onClick={ !state.height ? (event => changeCardClass('height')) : null}>
            <div className={ !state.height ? "uk-card uk-card-hover uk-card-body uk-padding-small" : "uk-card uk-card-primary uk-card-body uk-padding-small"}>
              <h5 className="uk-margin-remove">Talla</h5>
              { state.height ? 
                  <div className="uk-flex uk-flex-center uk-flex-middle">
                    <a onClick={event => changeCardClass('height')} className="uk-position-small uk-position-center-right" uk-icon="icon: minus-circle; ratio: 1.25"></a>
                    <div className="uk-flex uk-flex-right uk-flex-middle uk-width-3-5">
                      <input className="uk-input uk-border-pill uk-text-center uk-width-2-3" type="number" name="height" min={30} max={300} onChange={handleInput} required/>
                      <p className="uk-margin-small-left uk-width-1-6">cm</p>
                    </div>
                  </div>
                : null
              }
            </div>
          </div>
        </div>
        <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin">
          <button type="submit" className="uk-button uk-button-primary uk-button uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" disabled={state.isButtonDisabled} >
            { !state.spinnerState ? "Crear registro" : "Registrando"}  <div className={ state.spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
          </button>
        </div>
      </form>
    </div>
  )
}

export default VitalSignsForm