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
        <h4 className="uk-margin-remove">Hoy es {moment(Date.now()).locale('es').format('LL')}</h4>

        <div className="uk-container uk-overflow-auto uk-margin">
          <div className="uk-grid uk-grid-collapse uk-child-width-1-1 uk-child-width-1-2@s" uk-grid="true">
            <div className="card-section-white uk-flex uk-flex-column uk-flex-center uk-flex-middle">
              Mi Salud
              <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin">
                Compartir
              </button>
            </div>
            <div className="card-section-white">
              Mis Medicamentos
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home