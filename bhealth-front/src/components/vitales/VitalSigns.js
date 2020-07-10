import React, { useEffect, useState, useContext, Fragment } from 'react';
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import useForm from '../../hooks/useForm';                          // Import useForm custom hook
import UIkit from 'uikit';                                          // Import UIkit for notifications
import moment from 'moment';                                        // Import momentjs for date formatting
import 'moment/locale/es'  // without this line it didn't work

import VitalSignsGraph from './VitalSignsGraph'

import { getVitalSigns } from '../../services/vitalsigns-services'

const VitalSigns = ({ push, url }) => {

  // Destructure form state variable, handleInput and handleFileInput functions for form state manipulation
  const { form, handleInput } = useForm();

  const { user, route, setRoute, objectHandler, setObjectHandler, resetUserContext } = useContext(AppContext);

  const [ vitalSigns, setVitalSigns ] = useState([]);
  const [ state, setState ] = useState({
    isButtonDisabled: false,
    spinnerState: true,
    showGraph: false,
    temperatureAvg: null,
    sistPressureAvg: null,
    diasPressureAvg: null,
    heartRateAvg: null,
    respRateAvg: null, 
    bloodSugarAvg: null,
    weightAvg: null, 
    heightAvg: null
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
    
    getVitalSigns()
    .then( res => {
      
      const { vitalsigns } = res.data;
      setVitalSigns(vitalSigns);

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

      setState({
        isButtonDisabled: false,
        spinnerState: false,
        temperatureAvg: temperature/tempCounter,
        sistPressureAvg: Math.floor(sistPressure/sistPressCounter),
        diasPressureAvg: Math.floor(diasPressure/diasPressCounter),
        heartRateAvg: Math.floor(heartRate/heartRateCounter),
        respRateAvg: Math.floor(respRate/repsRateCounter), 
        bloodSugarAvg: Math.floor(bloodSugar/bloodSugCounter),
        weightAvg: weight/weightCounter, 
        heightAvg: height/heightCounter
      })

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
        push('/login');
      } else
          UIkit.notification({
            message: `<p class="uk-text-center">${msg}</p>`,
            pos: 'bottom-center',
            status: 'danger'
          });
    });

  }, [])

  return (
    <div>
      <h2>Signos Vitales</h2>
      <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin-small" onClick={event => push(`${url}/registrar`)} >
        + Nuevo Registro
      </button>
      <button className="uk-button uk-button-primary uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin-small" onClick={event => setState(prevState => ({...prevState, showGraph: !prevState.showGraph}))} disabled={state.spinnerState}>
        { !state.showGraph ? "Ver Gráfica" : "Ver Signos Vitales"}  <div className={ state.spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
      </button>
      { !state.showGraph ? 
          <div className="uk-margin">
            { vitalSigns.length && !state.spinnerState < 1 ? (
                <h4 className="uk-text-danger">No has realizado ningún registro</h4>
              ) : null
            }
            <div className="uk-child-width-1-3@m uk-child-width-1-2 uk-grid-small uk-grid-match" uk-grid="true">
              <div>
                <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                  <h5>Temperatura</h5>
                  { state.temperatureAvg ? 
                    <p>{state.temperatureAvg.toFixed(1)} °C</p>
                    :
                    !state.spinnerState ? 
                        <p className="uk-text-danger">Sin registros</p>
                      : <div uk-spinner="true"></div>
                  }
                </div>
              </div>
              <div>
                <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                  <h5>Presión Arterial</h5>
                  { state.sistPressureAvg && state.diasPressureAvg ?
                    <p>{state.sistPressureAvg}/{state.diasPressureAvg} mmHg</p>
                    :
                    !state.spinnerState ? 
                        <p className="uk-text-danger">Sin registros</p>
                      : <div uk-spinner="true"></div>
                  }
                </div>
              </div>
              <div>
                <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                  <h5>Frecuencia Cardiaca</h5>
                  { state.heartRateAvg ? 
                    <p>{state.heartRateAvg} lpm</p>
                    :
                    !state.spinnerState ? 
                        <p className="uk-text-danger">Sin registros</p>
                      : <div uk-spinner="true"></div>
                  }
                </div>
              </div>
              <div>
                <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                  <h5>Frecuencia Respiratoria</h5>
                  { state.respRateAvg ?
                    <p>{state.respRateAvg} rpm</p>
                    :
                    !state.spinnerState ? 
                        <p className="uk-text-danger">Sin registros</p>
                      : <div uk-spinner="true"></div>
                  }
                </div>
              </div>
              <div>
                <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                  <h5>Glucosa</h5>
                  { state.bloodSugarAvg ?
                    <p>{state.bloodSugarAvg} mg/dl</p>
                    :
                    !state.spinnerState ? 
                        <p className="uk-text-danger">Sin registros</p>
                      : <div uk-spinner="true"></div>
                  }
                </div>
              </div>
              <div>
                <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                  <h5>Peso</h5>
                  { state.weightAvg ?
                    <p>{state.weightAvg.toFixed(2)} kg</p>
                    :
                    !state.spinnerState ? 
                        <p className="uk-text-danger">Sin registros</p>
                      : <div uk-spinner="true"></div>
                  }
                </div>
              </div>
              <div>
                <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                  <h5>Talla</h5>
                  { state.heightAvg ?
                    <p>{state.heightAvg} cm</p>
                    :
                    !state.spinnerState ? 
                        <p className="uk-text-danger">Sin registros</p>
                      : <div uk-spinner="true"></div>
                  }
                </div>
              </div>
              <div>
                <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                  <h5>IMC</h5>
                  { state.weightAvg && state.heightAvg ?
                    <p>{(state.weightAvg/(state.heightAvg*state.heightAvg/10000)).toFixed(2)}</p>
                    :
                    !state.spinnerState ? 
                        <p className="uk-text-danger">Sin registros</p>
                      : <div uk-spinner="true"></div>
                  }
                </div>
              </div>
            </div>
          </div>
        : 
        <Fragment>
          <VitalSignsGraph vitalsigns={vitalSigns} />
        </Fragment>        
      }
    </div>
          
  )
}

export default VitalSigns
