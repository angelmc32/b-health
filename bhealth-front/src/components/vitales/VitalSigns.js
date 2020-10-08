import React, { useEffect, useState, useContext, Fragment } from 'react';
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import useForm from '../../hooks/useForm';                          // Import useForm custom hook
import UIkit from 'uikit';                                          // Import UIkit for notifications
import moment from 'moment';                                        // Import momentjs for date formatting
import 'moment/locale/es'  // without this line it didn't work

import VitalSignsGraph from './VitalSignsGraph'

import { getVitalSigns } from '../../services/vitalsigns-services'

const VitalSigns = ({ push, url }) => {

  const { user, resetUserContext } = useContext(AppContext);

  const [ vitalSigns, setVitalSigns ] = useState([]);
  const [ state, setState ] = useState({
    isButtonDisabled: false,
    spinnerState: true,
    showGraph: false,
    showLastRecords: true,
    showAllRecords: false,
    temperatureAvg: null,
    sistPressureAvg: null,
    diasPressureAvg: null,
    heartRateAvg: null,
    spo2Avg: null,
    respRateAvg: null, 
    bloodSugarAvg: null,
    weightAvg: null, 
    heightAvg: null
  })

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
    
    getVitalSigns()
    .then( res => {
      
      const { vitalsigns } = res.data;
      setVitalSigns(vitalSigns);

      let temperature = 0, tempCounter = 0;
      let sistPressure = 0, sistPressCounter = 0;
      let diasPressure = 0, diasPressCounter = 0;
      let heartRate = 0, heartRateCounter = 0;
      let spo2 = 0, spo2Counter = 0;
      let respRate = 0, respRateCounter = 0;
      let bloodSugar = 0, bloodSugarCounter = 0;
      let weight = 0, weightCounter = 0;
      let height = 0, heightCounter = 0;

      if ( state.showLastRecords ) {
        vitalsigns.map( record => {

          setVitalSigns(vitalsigns);
          const entries = Object.entries(record);
  
          for ( const [ vital, value ] of entries ) {     
            switch(vital) {
              case 'temperature' : if ( value !== null && temperature === 0 ) {temperature = value; tempCounter = record.date}
                                    break;
              case 'blood_pressure_sys' : if ( value !== null && sistPressure === 0 ) {sistPressure = value; sistPressCounter = record.date;}
                                          break;
              case 'blood_pressure_dias' : if ( value !== null && diasPressure === 0 ) {diasPressure = value; diasPressCounter = record.date;}
                                            break;
              case 'heart_rate' : if ( value !== null && heartRate === 0 ) {heartRate = value; heartRateCounter = record.date;}
                                  break;
              case 'spo2' : if ( value !== null && spo2 === 0 ) {spo2 = value; spo2Counter = record.date;}
                                  break;
              case 'resp_rate' : if ( value !== null && respRate === 0 ) {respRate = value; respRateCounter = record.date;}
                                  break;
              case 'blood_sugar' : if ( value !== null && bloodSugar === 0 ) {bloodSugar = value; bloodSugarCounter = record.date;}
                                    break;
              case 'height' : if ( value !== null && height === 0 ) {height = value; heightCounter = record.date;}
                              break;
              case 'weight' : if ( value !== null && weight === 0 ) {weight = value; weightCounter = record.date;}
                              break;
            }
          }
  
        });

        setState({
          isButtonDisabled: false,
          spinnerState: false,
          showLastRecords: true,
          temperatureAvg: temperature,
          temperatureDate: tempCounter,
          sistPressureAvg: sistPressure,
          diasPressureAvg: diasPressure,
          pressureDate: sistPressCounter,
          heartRateAvg: heartRate,
          heartRateDate: heartRateCounter,
          spo2Avg: spo2,
          spo2Date: spo2Counter,
          respRateAvg: respRate,
          respRateDate: respRateCounter,
          bloodSugarAvg: bloodSugar,
          bloodSugarDate: bloodSugarCounter,
          weightAvg: weight,
          weightDate: weightCounter,
          heightAvg: height,
          heightDate: heightCounter,
        })

      }
      else {
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
              case 'resp_rate' : if ( value !== null ) {respRate += value; respRateCounter++;}
                                  break;
              case 'blood_sugar' : if ( value !== null ) {bloodSugar += value; bloodSugarCounter++;}
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
          respRateAvg: Math.floor(respRate/respRateCounter), 
          bloodSugarAvg: Math.floor(bloodSugar/bloodSugarCounter),
          weightAvg: weight/weightCounter, 
          heightAvg: height/heightCounter
        })
      }

    })
    .catch( res => {

      let { msg } = res.response.data

      if (res.response.status === 401) {
        localStorage.clear();
        resetUserContext();
        push('/login');
      } 
      else {
        UIkit.notification({
          message: `<p class="uk-text-center">${msg}</p>`,
          pos: 'bottom-center',
          status: 'danger'
        });
      }
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
        <Fragment>
          <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin-small-top">
            <ul className="uk-flex uk-flex-center uk-width-1-1 uk-margin-remove@s" uk-tab="connect: #my-id" >
              <li className="uk-active"><a href="#" onClick={ event=> setState( prevState => ({...prevState, showLastRecords: true, showGraph: false, showAllRecords: false}) ) }>Resumen</a></li>
              <li><a href="#" onClick={ event=> setState( prevState => ({...prevState, showLastRecords: false, showGraph: false, showAllRecords: true}) ) }>Todos</a></li>
            </ul>
          </div>
          <div id="my-id" className="uk-switcher" uk-switcher="true">
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
                      <Fragment>
                        <p>{state.temperatureAvg.toFixed(1)} °C</p>
                        <p className="uk-text-meta uk-margin-remove">Último registro:</p>
                        <p className="uk-margin-remove">{state.temperatureDate ? moment(state.temperatureDate).format('L') : null}</p>
                      </Fragment>
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
                      <Fragment>
                        <p>{state.sistPressureAvg}/{state.diasPressureAvg} mmHg</p>
                        <p className="uk-text-meta uk-margin-remove">Último registro:</p>
                        <p className="uk-margin-remove">{state.pressureDate ? moment(state.pressureDate).format('L') : null}</p>
                      </Fragment>
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
                      <Fragment>
                        <p>{state.heartRateAvg} lpm</p>
                        <p className="uk-text-meta uk-margin-remove">Último registro:</p>
                        <p className="uk-margin-remove">{state.heartRateDate ? moment(state.heartRateDate).format('L') : null}</p>
                      </Fragment>
                      :
                      !state.spinnerState ? 
                          <p className="uk-text-danger">Sin registros</p>
                        : <div uk-spinner="true"></div>
                    }
                  </div>
                </div>
                <div>
                  <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                    <h5>Saturación Parcial de O2</h5>
                    { state.spo2Avg ?
                      <Fragment>
                        <p>{state.spo2Avg} %</p>
                        <p className="uk-text-meta uk-margin-remove">Último registro:</p>
                        <p className="uk-margin-remove">{state.spo2Date ? moment(state.spo2Date).format('L') : null}</p>
                      </Fragment>
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
                      <Fragment>
                        <p>{state.respRateAvg} rpm</p>
                        <p className="uk-text-meta uk-margin-remove">Último registro:</p>
                        <p className="uk-margin-remove">{state.respRateDate ? moment(state.respRateDate).format('L') : null}</p>
                      </Fragment>
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
                      <Fragment>
                        <p>{state.bloodSugarAvg} mg/dl</p>
                        <p className="uk-text-meta uk-margin-remove">Último registro:</p>
                        <p className="uk-margin-remove">{state.bloodSugarDate ? moment(state.bloodSugarDate).format('L') : null}</p>
                      </Fragment>
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
                      <Fragment>
                        <p>{state.weightAvg.toFixed(2)} kg</p>
                        <p className="uk-text-meta uk-margin-remove">Último registro:</p>
                        <p className="uk-margin-remove">{state.weightDate ? moment(state.weightDate).format('L') : null}</p>
                      </Fragment>
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
                      <Fragment>
                        <p>{state.heightAvg.toFixed(2)} cm</p>
                        <p className="uk-text-meta uk-margin-remove">Último registro:</p>
                        <p className="uk-margin-remove">{state.heightDate ? moment(state.heightDate).format('L') : null}</p>
                      </Fragment>
                      :
                      !state.spinnerState ? 
                          <p className="uk-text-danger">Sin registros</p>
                        : <div uk-spinner="true"></div>
                    }
                  </div>
                </div>
                <div className="uk-width-1-1 uk-width-1-3@s">
                  <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                    <h5>Índice de Masa Corporal</h5>
                    <a className="uk-position-small uk-position-top-right" uk-icon="icon: question"></a>
                    <div className="uk-margin-small" uk-drop="mode: click">
                      <div className="uk-card uk-card-body uk-card-default">El IMC es un criterio ampliamente aceptado pero no es exacto. Clasifica a las personas en infrapeso, peso normal, sobrepeso y obesidad, basándose exclusivamente en el peso del individuo y su altura (talla).</div>
                    </div>
                    { state.weightAvg && state.heightAvg ?
                      <Fragment>
                        <p>{(state.weightAvg/(state.heightAvg*state.heightAvg/10000)).toFixed(2)}</p>
                        {
                          (state.weightAvg/(state.heightAvg*state.heightAvg/10000)).toFixed(2) < 18.5 ?
                            <p className="uk-text-warning">Bajo peso <span uk-icon="icon: triangle-down"></span></p>
                          : (state.weightAvg/(state.heightAvg*state.heightAvg/10000)).toFixed(2) < 25 ?
                              <p className="uk-text-success">Peso normal <span uk-icon="icon: check"></span></p>
                            : (state.weightAvg/(state.heightAvg*state.heightAvg/10000)).toFixed(2) < 30 ?
                                <p className="uk-text-warning">Sobrepeso <span uk-icon="icon: triangle-up"></span></p>
                              : <p className="uk-text-danger">Obesidad <span uk-icon="icon: triangle-up"></span><span uk-icon="icon: triangle-up"></span></p>
                        }
                      </Fragment>
                      :
                      !state.spinnerState ? 
                          <p className="uk-text-danger">Sin registros</p>
                        : <div uk-spinner="true"></div>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              { vitalSigns.length < 1 ? (
                  <h4 className="uk-text-danger">No has registrado signos vitales</h4>
                ) : null
              }
              <table className="uk-table uk-table-hover uk-table-middle">
                <thead>
                  <tr>
                    <th className="uk-text-center">Fecha</th>
                    <th className="uk-text-center">Hora</th>
                    <th className="uk-text-center uk-visible@s">Temperatura</th>
                    <th className="uk-text-center uk-visible@s">Presión Arterial</th>
                    <th className="uk-text-center uk-visible@s">Frecuencia Cardiaca</th>
                    <th className="uk-text-center uk-visible@s">SpO2</th>
                    <th className="uk-text-center uk-visible@s">Frecuencia Respiratoria</th>
                    <th className="uk-text-center uk-visible@s">Glucosa</th>
                    <th className="uk-text-center uk-visible@s">Peso</th>
                    <th className="uk-text-center uk-visible@s">Talla</th>
                    <th className="uk-text-center">Detalles</th>
                    <th className="uk-text-center uk-visible@s">Modificar</th>
                  </tr>
                </thead>
                <tbody>
                  { vitalSigns ? 
                      vitalSigns.map( (vitalSign, index) => 
                        <tr key={index}>
                          <td className="uk-text-center">{moment(vitalSign.date).locale('es').format('L')}</td>
                          <td className="uk-text-center">{moment(vitalSign.date).locale('es').format('LT')}</td>
                          <td className="uk-text-center uk-visible@s">{vitalSign.temperature ? `${vitalSign.temperature} °C` : '-'}</td>
                          <td className="uk-text-center uk-visible@s">{vitalSign.blood_pressure_sys ? `${vitalSign.blood_pressure_sys}/${vitalSign.blood_pressure_dias} mmHg` : '-'}</td>
                          <td className="uk-text-center uk-visible@s">{vitalSign.heart_rate ? `${vitalSign.heart_rate} lpm` : '-'}</td>
                          <td className="uk-text-center uk-visible@s">{vitalSign.spo2 ? `${vitalSign.spo2} %` : '-'}</td>
                          <td className="uk-text-center uk-visible@s">{vitalSign.resp_rate ? `${vitalSign.resp_rate} rpm` : '-'}</td>
                          <td className="uk-text-center uk-visible@s">{vitalSign.blood_sugar ? `${vitalSign.blood_sugar} mg/dl` : '-'}</td>
                          <td className="uk-text-center uk-visible@s">{vitalSign.weight ? `${vitalSign.weight} kg` : '-'}</td>
                          <td className="uk-text-center uk-visible@s">{vitalSign.height ? `${vitalSign.height} cm` : '-'}</td>
                          <td className="uk-text-center">
                            <button className="uk-button uk-button-default uk-button-small uk-border-pill" onClick={event =>  push({pathname: '/signosvitales/ver', state: {vitalSign: vitalSign} }) } >
                              Ver
                            </button>
                          </td>
                          <td className="uk-width-1-6 uk-width-auto@s">
                            <a href={`#modal-sections-${index}`} uk-toggle={`target: #modal-sections-${index}`}>
                              <span className="uk-margin-small-right uk-text-primary" uk-icon="more-vertical"></span>
                            </a>
                            <div id={`modal-sections-${index}`} className="uk-flex-top" uk-modal="true">
                              <div className="uk-modal-dialog uk-margin-auto-vertical">
                                <button className="uk-modal-close-default" type="button" uk-close="true" />
                                <div className="uk-modal-header">
                                  <h3 className="uk-text-center">Datos del Registro de Signos VItales</h3>
                                  <p className="uk-text-center">Fecha: {moment(vitalSign.date).locale('es').format('LL')}</p>
                                  <p className="uk-text-center">Hora: {moment(vitalSign.date).locale('es').format('LT')}</p>
                                </div>
                                <div className="uk-modal-body uk-flex uk-flex-column uk-flex-middle">
                                  <button className="uk-modal-close uk-button uk-button-primary uk-border-pill uk-margin-small uk-width-3-4 uk-width-1-2@s"  onClick={event => push({ pathname: `${url}/editar`,  state: {vitalSign: vitalSign} }) } >
                                    Modificar
                                  </button>
                                  <button className="uk-modal-close uk-button uk-button-danger uk-border-pill uk-margin-small uk-width-3-4 uk-width-1-2@s" onClick={event => push({pathname: `${url}/eliminar`, state: {vitalSign: vitalSign} }) } >
                                    Eliminar
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    : <tr>
                        <td>Cargando</td>
                        <td>Cargando</td>
                        <td>Cargando</td>
                      </tr>
                }
                </tbody>
              </table>
            </div>
          </div>
        </Fragment>
        : 
        <Fragment>
          <VitalSignsGraph vitalsigns={vitalSigns} />
        </Fragment>        
      }
    </div>
          
  )
}

export default VitalSigns
