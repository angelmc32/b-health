import React, { useEffect, useContext, useState } from 'react'
import { useHistory, NavLink } from 'react-router-dom';
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
        <h2 className="uk-margin-small-top">¡Bienvenido!</h2>
        <h4 className="uk-margin-remove">Hoy es {moment(Date.now()).locale('es').format('LL')}</h4>

        <div className="uk-container uk-margin">
          <div className="uk-grid uk-grid-collapse uk-child-width-1-1 uk-child-width-1-2@s uk-height-large" uk-grid="true">
            <div className=" uk-height-1-1@s uk-flex uk-flex-column uk-flex-center uk-flex-middle">
              <h1>La <span className="uk-text-secondary uk-text-bold">salud</span> de tu <span className="uk-text-primary uk-text-bold">familia</span>, <br/> en tus manos.</h1>
              <h3 className="uk-margin-remove">Tus datos. Tus medicamentos. Tu salud.</h3>
            </div>
            <div className="uk-flex uk-flex-center uk-flex-middle uk-flex-column">
            <div className="uk-width-5-6 card-section-white uk-flex uk-flex-column uk-flex-center uk-flex-middle">
              Mi Salud
              <NavLink className="uk-width-1-1 uk-margin-top" to="/signosvitales">
                <button className="uk-button uk-button-primary uk-border-pill uk-width-2-3">
                  Signos Vitales
                </button>
              </NavLink>
              <NavLink className="uk-width-1-1 uk-margin-small" to="/consultas">
                <button className="uk-button uk-button-primary uk-border-pill uk-width-2-3" onClick={setRoute("create")}>
                  Nueva Consulta
                </button>
              </NavLink>
              <NavLink className="uk-width-1-1 uk-margin-small" to="/resumen">
                <button className="uk-button uk-button-default uk-border-pill uk-width-2-3">
                  Compartir
                </button>
              </NavLink>
            </div>
            <div className="uk-width-5-6 card-section-white uk-flex uk-flex-column uk-flex-center uk-flex-middle">
              Cuidar mi salud
              <NavLink className="uk-width-1-1 uk-margin-top" to="/recetas">
                <button className="uk-button uk-button-primary uk-border-pill uk-width-2-3">
                  Mis Recetas
                </button>
              </NavLink>
              <NavLink className="uk-width-1-1 uk-margin-small-top" to="/laboratorio">
                <button className="uk-button uk-button-primary uk-border-pill uk-width-2-3">
                  Laboratorio
                </button>
              </NavLink>
              <NavLink className="uk-width-1-1 uk-margin-small-top" to="/imagenologia">
                <button className="uk-button uk-button-primary uk-border-pill uk-width-2-3">
                  Rayos X e Imagen
                </button>
              </NavLink>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home