import React, { useEffect, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import UIkit from 'uikit';
import moment from 'moment';

import VitalSignsForm from '../vitalsigns/VitalSignsForm'
import ProfileCard from '../profile/ProfileCard'

import happy_img from '../../images/icons/happy-face.svg'
import sad_img from '../../images/icons/sad-face.svg'
import sick_img from '../../images/icons/sick-face.svg'
import add_vitals_icon from '../../images/icons/add-vitals.svg'
import blood_pressure_icon from '../../images/icons/blood-pressure.svg'
import blood_sugar_icon from '../../images/icons/blood-sugar.svg'
import heart_rate_icon from '../../images/icons/heart-rate.svg'
import temperature_icon from '../../images/icons/temperature.svg'
import weight_icon from '../../images/icons/weight.svg'

const Home = () => {

  const { user, setUser, route, setRoute } = useContext(AppContext); // Destructure user state variable
  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user

  const [ vitalsFormValues, setVitalsFormValues ] = useState({temperature: null, blood_pressure_sys: null, blood_pressure_dias: null, blood_sugar: null, heart_rate: null, weight: null});

  // Hook to update component when user state variable is modified
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

  }, [user] );
  
  return (
    <div className="content">
      <div className="uk-section">
        <h2 className="uk-margin-small-top">Hola {user.first_name === "Nombres" ? "Usuario" : user.first_name}</h2>
        <p>{moment(Date.now()).locale('es').format('LL')}</p>
        <div className="uk-container uk-overflow-auto">
          <div className="uk-grid uk-grid-collapse">
            <div className="uk-width-1-1 uk-width-1-3@s uk-grid uk-grid-collapse">
              <div className="uk-width-1-1">
                <h4>¿Cómo te sientes?</h4>
              </div>
              <div className="uk-width-1-3 uk-card-hover uk-padding">
                <img src={happy_img} alt=""/>
              </div>
              <div className="uk-width-1-3 uk-card-hover uk-padding uk-light">
                <img src={sad_img} alt=""/>
              </div>
              <div className="uk-width-1-3 uk-card-hover uk-padding uk-light">
                <img src={sick_img} alt=""/>
              </div>
            </div>
            <div className="uk-width-1-1 uk-grid uk-grid-collapse">
              <ul className="uk-width-1-1 uk-child-width-1-2@s" uk-accordion="true">
                <li className="uk-open">
                  <a className="uk-accordion-title" href="#">Mis Medicamentos</a>
                  <div className="uk-accordion-content">
                    <table className="uk-table uk-table-hover uk-table-divider uk-margin-small-bottom">
                      <tbody>
                        <tr>
                          <td className="uk-text-center">Medicamento 1</td>
                          <td>
                            <span className="uk-margin-small-right" uk-icon="bell"></span>
                            <span className="uk-margin-small-right" uk-icon="info"></span>
                          </td>
                        </tr>
                        <tr>
                          <td className="uk-text-center">Medicamento 2</td>
                          <td>
                            <span className="uk-margin-small-right" uk-icon="bell"></span>
                            <span className="uk-margin-small-right" uk-icon="info"></span>
                          </td>
                        </tr>
                        <tr>
                          <td className="uk-text-center">Medicamento 3</td>
                          <td>
                            <span className="uk-margin-small-right" uk-icon="bell"></span>
                            <span className="uk-margin-small-right" uk-icon="info"></span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <button className="uk-button uk-button-default uk-border-pill uk-button-small">Agregar Medicamento</button>
                  </div>
                </li>
                <li>
                  <a className="uk-accordion-title" href="#">Mis Padecimientos</a>
                  <div className="uk-accordion-content">
                    <table className="uk-table uk-table-hover uk-table-divider uk-margin-small-bottom">
                        <tbody>
                          <tr>
                            <td className="uk-text-center">
                              Padecimiento 1
                              <span className="uk-margin-small-left" uk-icon="info"></span>
                            </td>
                            <td>
                              <button className="uk-button uk-button-default uk-border-pill uk-button-small">+ Consulta</button>
                            </td>
                          </tr>
                          <tr>
                            <td className="uk-text-center">
                              Padecimiento 2
                              <span className="uk-margin-small-left" uk-icon="info"></span>
                            </td>
                            <td>
                              <button className="uk-button uk-button-default uk-border-pill uk-button-small">+ Consulta</button>
                            </td>
                          </tr>
                          <tr>
                            <td className="uk-text-center">
                              Padecimiento 3
                              <span className="uk-margin-small-left" uk-icon="info"></span>
                            </td>
                            <td>
                              <button className="uk-button uk-button-default uk-border-pill uk-button-small">+ Consulta</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <button className="uk-button uk-button-default uk-border-pill uk-button-small">Agregar Padecimiento</button>
                  </div>
                </li>
                <li>
                  <a className="uk-accordion-title" href="#">Signos Vitales</a>
                  <div className="uk-accordion-content">
                    <VitalSignsForm vitalsFormValues={vitalsFormValues} setVitalsFormValues={setVitalsFormValues} setRoute={setRoute}/>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Home