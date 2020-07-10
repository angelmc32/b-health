import React, { useEffect, useState, useContext } from 'react';
import { useHistory, NavLink } from 'react-router-dom';                      // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import useForm from '../../hooks/useForm';                          // Import useForm custom hook
import UIkit from 'uikit';                                          // Import UIkit for notifications
import moment from 'moment';                                        // Import momentjs for date formatting
import 'moment/locale/es'  // without this line it didn't work

import VitalSignsGraph from './VitalSignsGraph'

import { getVitalSigns, getOneVitalSigns, createVitalSigns } from '../../services/vitalsigns-services'

const VitalSigns = () => {

  // Destructure form state variable, handleInput and handleFileInput functions for form state manipulation
  const { form, handleInput } = useForm();

  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user
  const { user, route, setRoute, objectHandler, setObjectHandler, resetUserContext } = useContext(AppContext);
  const [ vitalSign, setVitalSign] = useState({});
  const [ vitalSigns, setVitalSigns ] = useState([]);
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(false);
  const [ vitalsFormValues, setVitalsFormValues ] = useState({temperature: null, blood_pressure_sys: null, blood_pressure_dias: null, blood_sugar: null, heart_rate: null, weight: null});

  const [ showDateInput, setShowDateInput ] = useState(false);
  const [ temperatureAvg, setTemperatureAvg ] = useState(null);
  const [ sistPressureAvg, setSistPressureAvg ] = useState(null);
  const [ diasPressureAvg, setDiasPressureAvg ] = useState(null);
  const [ heartRateAvg, setHeartRateAvg ] = useState(null);
  const [ respRateAvg, setRespRateAvg ] = useState(null);
  const [ bloodSugarAvg, setBloodSugarAvg ] = useState(null);
  const [ weightAvg, setWeightAvg ] = useState(null);
  const [ heightAvg, setHeightAvg ] = useState(null);
  let thisMoment = moment().format();
  let datetime;

  useEffect( () => {

    console.log(datetime)
    
    getVitalSigns()
    .then( res => {
      
      const { vitalsigns } = res.data;

      let temperature = 0, tempCounter = 0;
      let sistPressure = 0, sistPressCounter = 0;
      let diasPressure = 0, diasPressCounter = 0;
      let heartRate = 0, heartRateCounter = 0;
      let respRate = 0, repsRateCounter = 0;
      let bloodSugar = 0, bloodSugCounter = 0;
      let weight = 0, weightCounter = 0;
      let height = 0, heightCounter = 0;

      vitalsigns.map( record => {

        setVitalSigns(vitalsigns);
        const entries = Object.entries(record);

        for ( const [ vital, value ] of entries ) {
          
          switch(vital) {
            case 'temperature' : if ( value !== null ) {temperature += value; tempCounter++;}
                                  break;
            case 'blood_pressure_sys' : if ( value !== null ) {sistPressure += value; sistPressCounter++;}
                                        break;
            case 'blood_pressure_dias' : if ( value !== null ) {diasPressure += value; diasPressCounter++;}
                                          break;
            case 'heart_rate' : if ( value !== null ) {heartRate += value; heartRateCounter++;}
                                break;
            case 'resp_rate' : if ( value !== null ) {respRate += value; repsRateCounter++;}
                                break;
            case 'blood_sugar' : if ( value !== null ) {bloodSugar += value; bloodSugCounter++;}
                                  break;
            case 'height' : if ( value !== null ) {height += value; heightCounter++;}
                            break;
            case 'weight' : if ( value !== null ) {weight += value; weightCounter++;}
                            break;
          }

        }

      });

      setTemperatureAvg(temperature/tempCounter);
      setSistPressureAvg(Math.floor(sistPressure/sistPressCounter));
      setDiasPressureAvg(Math.floor(diasPressure/diasPressCounter));
      setHeartRateAvg(Math.floor(heartRate/heartRateCounter));
      setRespRateAvg(Math.floor(respRate/repsRateCounter));
      setBloodSugarAvg(Math.floor(bloodSugar/bloodSugCounter));
      setWeightAvg(weight/weightCounter);
      setHeightAvg(height/heightCounter);

    })
    .catch( error => {
      if (error.response.status === 401) {
        localStorage.clear();
        resetUserContext();
        push('/login');
      }
    })
    ;

  }, [route, isButtonDisabled])

  const handleSubmit = (event) => {

    event.preventDefault();
    // setIsButtonDisabled(true);

    // if (!showDateInput && form['only-date'] === undefined || form['time-hours'] === undefined || form['time-minutes'] === undefined || form['time-period'] === undefined) {
    //   setIsButtonDisabled(true);

    // }
    if (!showDateInput)
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
    
    console.log(form)

    createVitalSigns(form)
    .then( res => {

      const { vitalsigns } = res.data;

      setVitalSigns(vitalsigns);
      console.log(vitalsigns)

      // Send UIkit success notification
      UIkit.notification({
        message: `<span uk-icon='close'></span> '¡Tus signos vitales fueron registrados exitosamente!'`,
        pos: 'bottom-center',
        status: 'success'
      });

      setIsButtonDisabled(false);
      setShowDateInput(false);
      setRoute('none');

    })
    .catch( error => {

      console.log(error);

      // Send UIkit error notification
      UIkit.notification({
        message: `<span uk-icon='close'></span> ${error}`,
        pos: 'bottom-center',
        status: 'danger'
      });
      
      setIsButtonDisabled(false);

    });

    setRoute('none');

  }

  const changeDateInputState = (event, showInputState) => {
    event.preventDefault();
    setShowDateInput(showInputState);

    if (showInputState) {
      form['only-date'] = undefined;
      form['time-hours'] = undefined;
      form['time-minutes'] = undefined;
      form['time-period'] = undefined
    }
    
    if (form['only-date'] === undefined || form['time-hours'] === undefined || form['time-minutes'] === undefined || form['time-period'] === undefined)
      setIsButtonDisabled(true)
    console.log(showInputState)
    console.log(thisMoment)
    console.log(form)
  }

  const dateValidation = (event) => {
    
    const { name, value } = event.target;

    if (name !== 'time-hours') form['time-hours'] = '12'
    if (name !== 'time-minutes') form['time-minutes'] = '00'
    if (name !== 'time-period') form['time-period'] = 'PM'
    handleInput(event);
    if (form['only-date'] !== undefined && form['time-hours'] !== undefined && form['time-minutes'] !== undefined && form['time-period'] !== undefined)
      setIsButtonDisabled(false)
  }

  return (
    <div className="uk-section">
      <div className="uk-container">
        { route === 'none' ? (
            <div>
              <h2>Signos Vitales</h2>
              <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin-small" onClick={event => setRoute('create')} >
                + Nuevo Registro
              </button>
              <button className="uk-button uk-button-primary uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin-small" onClick={event => setRoute('graph')} >
                Ver Gráfica
              </button>
              <div className="uk-margin">
                { vitalSigns.length < 1 ? (
                    <h4 className="uk-text-danger">No has realizado ningún registro</h4>
                  ) : null
                }
                <div className="uk-child-width-1-3@m uk-child-width-1-2 uk-grid-small uk-grid-match" uk-grid="true">
                  <div>
                    <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                      <h5>Temperatura</h5>
                      { temperatureAvg ? 
                        <p>{temperatureAvg.toFixed(1)} °C</p>
                        :
                        <p className="uk-text-danger">Sin registros</p>
                      }
                    </div>
                  </div>
                  <div>
                    <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                      <h5>Presión Arterial</h5>
                      { sistPressureAvg && diasPressureAvg ?
                        <p>{sistPressureAvg}/{diasPressureAvg} mmHg</p>
                        :
                        <p className="uk-text-danger">Sin registros</p>
                      }
                    </div>
                  </div>
                  <div>
                    <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                      <h5>Frecuencia Cardiaca</h5>
                      { heartRateAvg ? 
                        <p>{heartRateAvg} lpm</p>
                        :
                        <p className="uk-text-danger">Sin registros</p>
                      }
                    </div>
                  </div>
                  <div>
                    <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                      <h5>Frecuencia Respiratoria</h5>
                      { respRateAvg ?
                        <p>{respRateAvg} rpm</p>
                        :
                        <p className="uk-text-danger">Sin registros</p>
                      }
                    </div>
                  </div>
                  <div>
                    <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                      <h5>Glucosa</h5>
                      { bloodSugarAvg ?
                        <p>{bloodSugarAvg} mg/dl</p>
                        :
                        <p className="uk-text-danger">Sin registros</p>
                      }
                    </div>
                  </div>
                  <div>
                    <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                      <h5>Peso</h5>
                      { weightAvg ?
                        <p>{weightAvg.toFixed(2)} kg</p>
                        :
                        <p className="uk-text-danger">Sin registros</p>
                      }
                    </div>
                  </div>
                  <div>
                    <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                      <h5>Talla</h5>
                      { heightAvg ?
                        <p>{heightAvg} cm</p>
                        :
                        <p className="uk-text-danger">Sin registros</p>
                      }
                    </div>
                  </div>
                  <div>
                    <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                      <h5>IMC</h5>
                      { weightAvg && heightAvg ?
                        <p>{(weightAvg/(heightAvg*heightAvg/10000)).toFixed(2)}</p>
                        :
                        <p className="uk-text-danger">Sin registros</p>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : route === 'create' ? (
              <div>
                <h2>Registrar Signos Vitales</h2>
                <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('none')} >
                  Regresar
                </button>
                <form onSubmit={handleSubmit} className="uk-margin uk-width-1-1 uk-flex uk-flex-column">
                  <div className="uk-margin-small-bottom uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                    <label>Presión Arterial:</label>
                    <div className="uk-form-controls uk-flex uk-child-width-1-2">
                      <input name="blood_pressure_sys" className="uk-input uk-border-pill" type="number" onChange={handleInput} placeholder="Alta"/>
                      <input name="blood_pressure_dias" className="uk-input uk-border-pill" type="number" onChange={handleInput} placeholder="Baja"/>
                    </div>
                  </div>
                  <div className="uk-margin-small-bottom uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                    <label>Temperatura:</label>
                    <div className="uk-form-controls">
                      <input name="temperature" step="any" className="uk-input uk-border-pill" type="number" onChange={handleInput} />
                    </div>
                  </div>
                  <div className="uk-margin-small-bottom uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                    <label>Frecuencia Cardiaca:</label>
                    <div className="uk-form-controls">
                      <input name="heart_rate" className="uk-input uk-border-pill" type="number" onChange={handleInput} />
                    </div>
                  </div>
                  <div className="uk-margin-small-bottom uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                    <label>Frecuencia Respiratoria:</label>
                    <div className="uk-form-controls">
                      <input name="resp_rate" className="uk-input uk-border-pill" type="number" onChange={handleInput} />
                    </div>
                  </div>
                  <div className="uk-margin-small-bottom uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                    <label>Glucosa en sangre:</label>
                    <div className="uk-form-controls">
                      <input name="blood_sugar" className="uk-input uk-border-pill" type="number" onChange={handleInput} />
                    </div>
                  </div>
                  <div className="uk-margin-small-bottom uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                    <label>Peso:</label>
                    <div className="uk-form-controls">
                      <input name="weight" className="uk-input uk-border-pill" step="any" type="number" onChange={handleInput} />
                    </div>
                  </div>
                  <div className="uk-margin-small-bottom uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                    <label>Talla (cm):</label>
                    <div className="uk-form-controls">
                      <input name="height" className="uk-input uk-border-pill" type="number" onChange={handleInput} />
                    </div>
                  </div>
                  <div className="uk-margin-small uk-flex uk-flex-column uk-flex-center uk-flex-middle">
                    <div className="uk-flex uk-flex-column uk-flex-middle uk-width-1-1">
                      <div className="uk-margin-small-bottom uk-text-bold">{moment(datetime).format('LLL')} {moment(datetime).format('a')}</div>
                    </div>
                    <div className="uk-margin-small-bottom uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                      <label>Usar fecha y hora actual:</label>
                      <div className="uk-flex uk-flex-around uk-child-width-1-2">
                        <button className={ !showDateInput ? "uk-button uk-button-secondary uk-border-pill selected" : "uk-button uk-button-default uk-border-pill"} onClick={event => changeDateInputState(event, false)}>
                          Sí
                        </button>
                        <button className={ showDateInput ? "uk-button uk-button-secondary uk-border-pill selected" : "uk-button uk-button-default uk-border-pill"} onClick={event => changeDateInputState(event, true)} >
                          No
                        </button>
                      </div>
                    </div>
                    
                  </div>
                  { showDateInput ? 
                    <div>
                      <div className="uk-margin-small-bottom uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2 uk-hidden@s">
                        <label>Fecha y hora del registro:</label>
                        <input className="uk-input uk-border-pill" type="date" name="only-date" onChange={dateValidation} />
                      </div>
                    
                      <div className="uk-margin-small-bottom uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2 uk-visible@s">
                        <label>Fecha y hora del registro:</label>
                        <div className="uk-flex uk-flex-around uk-child-width-1-5">
                          <input className="uk-input uk-border-pill uk-width-1-3" type="date" name="only-date" onChange={dateValidation} />
                          <select name="time-hours" onChange={dateValidation} className="uk-select uk-border-pill" defaultValue="Hora">
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
                          <input name="time-minutes" className="uk-input uk-border-pill" type="number" onChange={dateValidation} placeholder="Minutos" />
                          <select name="time-period" onChange={handleInput} className="uk-select uk-border-pill uk-width-1-5" defaultValue="PM">
                            <option>AM</option>
                            <option>PM</option>
                          </select>
                        </div>
                        
                      </div>
                      <div className="uk-width-1-1 uk-width-1-2@s uk-flex uk-flex-around uk-hidden@s">
                        <select name="time-hours" onChange={dateValidation} className="uk-select uk-border-pill uk-width-1-3" defaultValue="12">
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
                        <select name="time-minutes" onChange={dateValidation} className="uk-select uk-border-pill uk-width-1-3" defaultValue="00">
                          <option disabled={true}>00</option>
                          <option>00</option>
                          <option>15</option>
                          <option>30</option>
                          <option>45</option>
                        </select>
                        <select name="time-period" onChange={dateValidation} className="uk-select uk-border-pill uk-width-1-4" defaultValue="PM">
                          <option>AM</option>
                          <option>PM</option>
                        </select>
                      </div>
                    </div>
                    : null
                  }

                  { isButtonDisabled && showDateInput ?
                      <p className="uk-text-danger uk-margin-small">Selecciona una fecha y hora por favor</p>
                      : null
                  }

                  <div className="uk-margin uk-width-1-1 uk-flex uk-flex-center uk-flex-middle">
                    <button type="submit" className="uk-button uk-button-primary uk-button uk-border-pill uk-width-2-3 uk-width-1-4@m" disabled={isButtonDisabled} >
                      Crear registro
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <h2>Mis Signos Vitales</h2>
                <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('none')} >
                  Regresar
                </button>
                <VitalSignsGraph vitalsigns={vitalSigns} />
              </div>
            )
        }
        
      </div>
    </div>
  )
}

export default VitalSigns
