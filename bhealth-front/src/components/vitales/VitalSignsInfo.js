import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import useForm from '../../hooks/useForm';
import UIkit from 'uikit';                                          // Import UIkit for notifications
import moment from 'moment';                                        // Import momentjs for date formatting

import { getOneVitalSigns, editVitalSigns, deleteVitalSigns } from '../../services/vitalsigns-services'

const VitalSignsForm = ({ url, action }) => {

  const { form, resetForm, handleInput } = useForm();
  const { user, resetUserContext } = useContext(AppContext);
  let thisMoment = moment().format(), datetime;
  const { location, push } = useHistory();

  const [ state, setState ] = useState({
    isButtonDisabled: action === 'delete' ? false : false,
    spinnerState: false,
    vitalSignsID: null,
    temperature: false,
    blood_pressure: false,
    blood_pressure_sys: false,
    blood_pressure_dias: false,
    heart_rate: false,
    spo2: false,
    resp_rate: false,
    blood_sugar: false,
    isFastin: false,
    weight: false,
    height: false,
    date: false,
    showDateInput: false
  });

  useEffect( () => {

    if ( !user._id ) {    // If there is no user logged in, send a notification and "redirect" to login

      // Send UIkit warning notification: User must log in
      UIkit.notification({
        message: '<p class="uk-text-center">Por favor inicia sesión</p>',
        pos: 'bottom-center',
        status: 'warning'
      });
      
      return push('/login');         // If not logged in, "redirect" user to login

    };

    if ( location.state && !state.vitalSignsID ) {
      if ( location.state.vitalSign ){
        setState( prevState => ({...prevState,
            vitalSignsID: location.state.vitalSign._id,
            temperature: location.state.vitalSign.temperature ? true : false ,
            blood_pressure: location.state.vitalSign.blood_pressure_sys ? true : false ,
            blood_pressure_sys: location.state.vitalSign.blood_pressure_sys ? true : false ,
            blood_pressure_dias: location.state.vitalSign.blood_pressure_dias ? true : false ,
            heart_rate: location.state.vitalSign.heart_rate ? true : false ,
            spo2: location.state.vitalSign.spo2 ? true : false ,
            resp_rate: location.state.vitalSign.resp_rate ? true : false ,
            blood_sugar: location.state.vitalSign.blood_sugar ? true : false ,
            isFasting: location.state.vitalSign.isFasting ? true : false ,
            weight: location.state.vitalSign.weight ? true : false ,
            height: location.state.vitalSign.height ? true : false ,
            date: location.state.vitalSign.date,
          })
        );
        form['temperature'] = location.state.vitalSign.temperature;
        form['blood_pressure_sys'] = location.state.vitalSign.blood_pressure_sys;
        form['blood_pressure_dias'] = location.state.vitalSign.blood_pressure_dias;
        form['heart_rate'] = location.state.vitalSign.heart_rate;
        form['spo2'] = location.state.vitalSign.spo2;
        form['resp_rate'] = location.state.vitalSign.resp_rate;
        form['blood_sugar'] = location.state.vitalSign.blood_sugar;
        form['isFasting'] = location.state.vitalSign.isFasting;
        form['weight'] = location.state.vitalSign.weight;
        form['height'] = location.state.vitalSign.height;
        form['only-date'] = moment(location.state.vitalSign.date).format('YYYY-MM-DD');
        form['time-hours'] = moment(location.state.vitalSign.date).format('HH') > 12 ? moment(location.state.vitalSign.date).format('HH') - 12 : moment(location.state.vitalSign.date).format('HH');
        form['time-minutes'] = moment(location.state.vitalSign.date).format('mm');
        form['time-period'] = moment(location.state.vitalSign.date).format('a').toUpperCase();
        }
      if ( location.state.vitalSignID )
        state.vitalSignsID = location.state.vitalSignID;
    }
    if ( state.vitalSignsID ) {
      getOneVitalSigns(state.vitalSignsID)
      .then( res => {
        const { vitalsigns } = res.data;
        setState( prevState => ({...prevState, vitalSigns: vitalsigns}) );
        state.vitalSignsID = null;
      })
      .catch( res => {
        const { msg } = res.response.data
        if (res.response.status === 401) {
          localStorage.clear();
          resetUserContext();
          push('/login');
        }
        UIkit.notification({
          message: `<p class="uk-text-center">${msg}</p>`,
          pos: 'bottom-center',
          status: 'danger'
        });
      });
    }

    if ( Object.keys(form).length > 0) 
      setState( prevState => ({...prevState, errorMessage: null}) );

  }, [])

  const handleSubmit = (event) => {

    event.preventDefault();
    
    setState( prevState => ({...prevState, isButtonDisabled: true, spinnerState: true}))
    // setState( prevState => ({...prevState, spinnerState: true}))

    if (!state.date)
      form['date'] = thisMoment;
    else {
      if ( form['time-period'] === 'AM' ) {
        if ( form['time-hours'] === '12' )
          datetime = `${form['only-date']}T00:${form['time-minutes']}:00`;
        else
          datetime = `${form['only-date']}T0${form['time-hours']}:${form['time-minutes']}:00`;
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
      }
      form['date'] = datetime;
    }

    if (Object.keys(form).length === 0 && form.constructor === Object) {

      setState({
        isButtonDisabled: true,
        spinnerState: false,
        temperature: false,
        blood_pressure: false,
        heart_rate: false,
        spo2: false,
        resp_rate: false,
        blood_sugar: false,
        weight: false,
        height: false
      });

      return null

    }

    editVitalSigns(state.vitalSignsID, form)
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
        spo2: false,
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
        form['blood_pressure_sys'] = null;
        form['blood_pressure_dias'] = null;
      }
      else
        form[vitalSignName] = null;

      //if (Object.keys(form).length === 0 && form.constructor === Object)
        //setState( prevState => ({...prevState, isButtonDisabled: true}))
        
    } 
    else
      setState( prevState => ({...prevState, isButtonDisabled: false}))

    setState( prevState => ({...prevState, [vitalSignName]: !prevState[vitalSignName]}))

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

  const deleteVitalsBtn = (vitalSignsID) => {

    setState( prevState => ({...prevState, isButtonDisabled: true, spinnerState: true}))

    deleteVitalSigns(vitalSignsID)
    .then( res => {

      setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}))
      // Send UIkit success notification
      UIkit.notification({
        message: '<p class="uk-text-center">Se ha eliminado el registro exitosamente</p>',
        pos: 'bottom-center',
        status: 'success'
      });
      push(url)
    })
    .catch( res => {
      const { msg } = res.response.data
      if (res.response.status === 401) {
        localStorage.clear();
        resetUserContext();
        push('/login');
      }
      else
        UIkit.notification({
          message: `<p class="uk-text-center">${msg}</p>`,
          pos: 'bottom-center',
          status: 'danger'
        });
      setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}))
    })

  }

  return (
    <div className="uk-margin">
      <h2>{action !== 'delete' ? 'Modificar Registro' : 'Eliminar Registro'}</h2>
      { action !== 'delete' ?
          <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={ event => { push(url) } } >
            Regresar
          </button>
        :
          !state.spinnerState ?
            <div className="uk-width-1-1 uk-flex uk-flex-column uk-flex-middle uk-margin-bottom">
              <div className="uk-width-1-1">
                <p>¿Estás seguro que deseas eliminar el siguiente registro?</p>
              </div>
              <div className="uk-width-4-5 uk-width-1-2@s uk-flex uk-flex-around">
                <button className="uk-button uk-button-danger uk-border-pill uk-width-1-3" onClick={event=> deleteVitalsBtn(state.vitalSignsID)} disabled={state.isButtonDisabled}>
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
      <form onSubmit={handleSubmit}>

        <div className="uk-margin-small uk-flex uk-flex-column uk-flex-center uk-flex-middle">
          
          <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-width-1-1 uk-width-2-3@s">
            <div className="uk-margin-small-bottom uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
              <label>Fecha y hora del registro:</label>
              <input className="uk-input uk-border-pill" type="date" name="only-date" defaultValue={form['only-date'] || null} onChange={handleInput} required/>
            </div>
            <div className="uk-width-1-1 uk-width-2-3@s uk-flex uk-flex-around">
              <input type="number" name="time-hours" defaultValue={form['time-hours'] || null} onChange={handleInput} className="uk-select uk-border-pill uk-width-1-3" min={1} max={12} step="1" required />
              <input type="number" name="time-minutes" defaultValue={form['time-minutes'] || null} onChange={handleInput} className="uk-select uk-border-pill uk-width-1-3" min={0} max={59} step="1" required />
              <select name="time-period" defaultValue={moment(location.state.vitalSign.date).format('a').toUpperCase()} onChange={handleInput} className="uk-select uk-border-pill uk-width-1-4" required>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

        </div>
        
        <div className="uk-child-width-1-3@m uk-child-width-1-1 uk-grid-small uk-grid-match" uk-grid="true">
          <div onClick={ !state.temperature ? (event => changeCardClass('temperature')) : null}>
            <div className={ !state.temperature ? "uk-card uk-card-hover uk-card-body uk-padding-small" : "uk-card uk-card-primary uk-card-body uk-padding-small"}>                  
              <h5 className="uk-margin-remove">Temperatura</h5>       
              { state.temperature ? 
                  <div className="uk-flex uk-flex-center uk-flex-middle">
                    <a onClick={event => changeCardClass('temperature')} className="uk-position-small uk-position-center-right" uk-icon="icon: minus-circle; ratio: 1.25"></a>
                    <div className="uk-flex uk-flex-right uk-flex-middle uk-width-3-5">
                      <input className="uk-input uk-border-pill uk-text-center uk-width-2-3" type="number" name="temperature" defaultValue={location.state.vitalSign.temperature || null} min={35} max={40} step="0.1" onChange={handleInput} required/>
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
                      <input className="uk-input uk-border-pill uk-text-center uk-width-2-3" type="number" name="blood_pressure_sys" defaultValue={location.state.vitalSign.blood_pressure_sys || null} min={60} max={250} placeholder="Sistólica (alta)" onChange={handleInput} required/>
                      <p className="uk-margin-small-left uk-width-1-6"> mmHg</p>
                    </div>
                    <div className="uk-flex uk-flex-center uk-flex-middle uk-width-4-5">
                      <input className="uk-input uk-border-pill uk-text-center uk-width-2-3" type="number" name="blood_pressure_dias" defaultValue={location.state.vitalSign.blood_pressure_dias || null} min={30} max={140} placeholder="Diastólica (baja)" onChange={handleInput} required/>
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
                      <input className="uk-input uk-border-pill uk-text-center uk-width-2-3" type="number" name="heart_rate" defaultValue={location.state.vitalSign.heart_rate || null} min={35} max={200} onChange={handleInput} required/>
                      <p className="uk-margin-small-left uk-width-1-6">lpm</p>
                    </div>
                  </div>
                : null
              }
            </div>
          </div>
          <div onClick={ !state.spo2 ? (event => changeCardClass('spo2')) : null}>
            <div className={ !state.spo2 ? "uk-card uk-card-hover uk-card-body uk-padding-small" : "uk-card uk-card-primary uk-card-body uk-padding-small"}>
              <h5 className="uk-margin-remove">Saturación Parcial O2</h5>
              { state.spo2 ? 
                  <div className="uk-flex uk-flex-center uk-flex-middle">
                    <a onClick={event => changeCardClass('spo2')} className="uk-position-small uk-position-center-right" uk-icon="icon: minus-circle; ratio: 1.25"></a>
                    <div className="uk-flex uk-flex-right uk-flex-middle uk-width-3-5">
                      <input className="uk-input uk-border-pill uk-text-center uk-width-2-3" type="number" name="spo2" defaultValue={location.state.vitalSign.spo2 || null} min={85} max={100} onChange={handleInput} required/>
                      <p className="uk-margin-small-left uk-width-1-6">%</p>
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
                      <input className="uk-input uk-border-pill uk-text-center uk-width-2-3" type="number" name="resp_rate" defaultValue={location.state.vitalSign.resp_rate || null} min={10} max={40} onChange={handleInput} required/>
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
                      <input className="uk-input uk-border-pill uk-text-center uk-width-2-3" type="number" name="blood_sugar" defaultValue={location.state.vitalSign.blood_sugar || null} min={60} max={250} onChange={handleInput} required/>
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
                      <input className="uk-input uk-border-pill uk-text-center uk-width-2-3" type="number" name="weight" defaultValue={location.state.vitalSign.weight || null} min={30} max={250} step="0.001" onChange={handleInput} required/>
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
                      <input className="uk-input uk-border-pill uk-text-center uk-width-2-3" type="number" name="height" defaultValue={location.state.vitalSign.height || null} min={30} max={250} onChange={handleInput} required/>
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
            { !state.spinnerState ? "Modificar registro" : "Modificando"}  <div className={ state.spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
          </button>
        </div>
      </form>
    </div>
  )
}

export default VitalSignsForm