import React, { useEffect, useState, useContext } from 'react';
import { useHistory, NavLink } from 'react-router-dom';                      // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import useForm from '../../hooks/useForm';                          // Import useForm custom hook
import UIkit from 'uikit';                                          // Import UIkit for notifications
import moment from 'moment';                                        // Import momentjs for date formatting
import 'moment/locale/es'  // without this line it didn't work

import { getVitalSigns, getOneVitalSigns, createVitalSigns } from '../../services/vitalsigns-services'

const VitalSigns = () => {

  // Destructure form state variable, handleInput and handleFileInput functions for form state manipulation
  const { form, handleInput } = useForm();

  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user
  const { user, route, setRoute, objectHandler, setObjectHandler } = useContext(AppContext);
  const [ vitalSign, setVitalSign] = useState({});
  const [ vitalSigns, setVitalSigns ] = useState([]);
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(false);
  const [ vitalsFormValues, setVitalsFormValues ] = useState({temperature: null, blood_pressure_sys: null, blood_pressure_dias: null, blood_sugar: null, heart_rate: null, weight: null});

  const [ temperatureAvg, setTemperatureAvg ] = useState(null);
  const [ sistPressureAvg, setSistPressureAvg ] = useState(null);
  const [ diasPressureAvg, setDiasPressureAvg ] = useState(null);
  const [ heartRateAvg, setHeartRateAvg ] = useState(null);
  const [ respRateAvg, setRespRateAvg ] = useState(null);
  const [ bloodSugarAvg, setBloodSugarAvg ] = useState(null);
  const [ weightAvg, setWeightAvg ] = useState(null);
  const [ heightAvg, setHeightAvg ] = useState(null);

  useEffect( () => {
    
    getVitalSigns()
    .then( res => {
      
      const { vitalsigns } = res.data
      console.log(vitalsigns)

      let temperature = 0, tempCounter = 0;
      let sistPressure = 0, sistPressCounter = 0;
      let diasPressure = 0, diasPressCounter = 0;
      let heartRate = 0, heartRateCounter = 0;
      let respRate = 0, repsRateCounter = 0;
      let bloodSugar = 0, bloodSugCounter = 0;
      let weight = 0, weightCounter = 0;
      let height = 0, heightCounter = 0;

      vitalsigns.map( record => {

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
            case 'blood_sugar' : {bloodSugar += value; bloodSugCounter++;}
                                  break;
            case 'height' : if ( value !== null ) {height += value; weightCounter++;}
                            break;
            case 'weight' : if ( value !== null ) {weight += value; heightCounter++;}
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
  }, [])

  const handleSubmit = (event) => {

    event.preventDefault();
    setIsButtonDisabled(true);

    createVitalSigns(form)
    .then( res => {

      const { vitalsigns } = res.data;

      console.log(vitalsigns)

      // Send UIkit success notification
      UIkit.notification({
        message: `<span uk-icon='close'></span> '¡Tus signos vitales fueron registrados exitosamente!'`,
        pos: 'bottom-center',
        status: 'success'
      });

      setRoute('none');
      setIsButtonDisabled(false);

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

    })
  }

  return (
    <div className="uk-section">
      <div className="uk-container">
        { route === 'none' ? (
            <div>
              <h2>Signos Vitales</h2>
              <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('create')} >
                + Nuevo Registro
              </button>
              <div className="uk-margin">
                <div className="uk-child-width-1-3@m uk-child-width-1-2 uk-grid-small uk-grid-match" uk-grid="true">
                  <div>
                    <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                      <h5>Temperatura</h5>
                      <p>{temperatureAvg ? temperatureAvg.toFixed(1) : null} °C</p>
                    </div>
                  </div>
                  <div>
                    <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                      <h5>Presión Arterial</h5>
                      <p>{sistPressureAvg}/{diasPressureAvg} mmHg</p>
                    </div>
                  </div>
                  <div>
                    <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                      <h5>Frecuencia Cardiaca</h5>
                      <p>{heartRateAvg} lpm</p>
                    </div>
                  </div>
                  <div>
                    <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                      <h5>Frecuencia Respiratoria</h5>
                      <p>{respRateAvg} rpm</p>
                    </div>
                  </div>
                  <div>
                    <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                      <h5>Glucosa</h5>
                      <p>{bloodSugarAvg} mg/dl</p>
                    </div>
                  </div>
                  <div>
                    <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                      <h5>Peso</h5>
                      <p>{weightAvg} kg</p>
                    </div>
                  </div>
                  <div>
                    <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                      <h5>Talla</h5>
                      <p>{heightAvg} cm</p>
                    </div>
                  </div>
                  <div>
                    <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                      <h5>IMC</h5>
                      <p>{weightAvg && heightAvg ?  (weightAvg/(heightAvg*heightAvg/10000)).toFixed(2) : null}</p>
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
                  <div className="uk-margin-small uk-width-1-1 uk-flex uk-flex-center uk-flex-middle">
                    <button type="submit" className="uk-button uk-button-primary uk-button uk-border-pill uk-width-2-3 uk-width-1-4@m" disabled={isButtonDisabled} >
                      Crear registro
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              null
            )
        }
        
      </div>
    </div>
  )
}

export default VitalSigns
