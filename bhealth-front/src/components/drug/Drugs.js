import React, { useEffect, useState, useContext, Fragment } from 'react';
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import useForm from '../../hooks/useForm';                          // Import useForm custom hook
import UIkit from 'uikit';                                          // Import UIkit for notifications
import moment from 'moment';                                        // Import momentjs for date formatting
import 'moment/locale/es'  // without this line it didn't work

import { getDrugs } from '../../services/drug-services'

const Drugs = ({ push, url }) => {

  // Destructure form state variable, handleInput and handleFileInput functions for form state manipulation
  const { form, handleInput } = useForm();

  const { user, route, setRoute, objectHandler, setObjectHandler, resetUserContext } = useContext(AppContext);

  const [ drugs, setDrugs ] = useState([]);
  const [ state, setState ] = useState({
    isButtonDisabled: false,
    spinnerState: true
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
    
    getDrugs()
    .then( res => {
      
      const { drugs } = res.data;
      setDrugs(drugs);

      setState({
        isButtonDisabled: false,
        spinnerState: false
      })

      console.log(drugs)

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
      <h2>Mis Medicamentos</h2>
      <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin-small" onClick={event => push(`${url}/registrar`)} >
        + Medicamento
      </button>
      <div className="uk-child-width-1-4@m uk-child-width-1-2 uk-grid-small uk-grid-match" uk-grid="true">
        <div>
          <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
            <h5>Mañana</h5>
            { !state.spinnerState ? 
                  <p className="uk-text-danger">Sin registros</p>
                : <div uk-spinner="true"></div>
            }
          </div>
        </div>
        <div>
          <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
            <h5>Tarde</h5>
            { !state.spinnerState ? 
                  <p className="uk-text-danger">Sin registros</p>
                : <div uk-spinner="true"></div>
            }
          </div>
        </div>
        <div>
          <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
            <h5>Noche</h5>
            { !state.spinnerState ? 
                  <p className="uk-text-danger">Sin registros</p>
                : <div uk-spinner="true"></div>
            }
          </div>
        </div>
        <div>
          <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
            <h5>Sin horario</h5>
            { !state.spinnerState ? 
                  <p className="uk-text-danger">Sin registros</p>
                : <div uk-spinner="true"></div>
            }
          </div>
        </div>
      </div>
    </div>
          
  )
}

export default Drugs
