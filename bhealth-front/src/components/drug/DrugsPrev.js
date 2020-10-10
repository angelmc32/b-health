import React, { useEffect, useState, useContext, Fragment } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import useForm from '../../hooks/useForm';                          // Import useForm custom hook
import UIkit from 'uikit';                                          // Import UIkit for notifications
import moment from 'moment';                                        // Import momentjs for date formatting
import 'moment/locale/es'  // without this line it didn't work

import { getDrugs } from '../../services/drug-services'

const Drugs = ({ push }) => {

  // Destructure form state variable, handleInput and handleFileInput functions for form state manipulation
  const { form, handleInput } = useForm();
  let { path, url } = useRouteMatch();
  const { user, route, setRoute, objectHandler, setObjectHandler, resetUserContext } = useContext(AppContext);

  const [ drugs, setDrugs ] = useState([]);
  const [ state, setState ] = useState({
    isButtonDisabled: false,
    spinnerState: true,
    morningArray: [],
    afternoonArray: [],
    nightArray: [],
    anytimeArray: []
  })

  useEffect( () => {

    if ( !user._id ) {    // If there is no user logged in, send a notification and "redirect" to login

      // Send UIkit warning notification: User must log in
      // UIkit.notification({
      //   message: '<p class="uk-text-center">Por favor inicia sesión</p>',
      //   pos: 'bottom-center',
      //   status: 'warning'
      // });
      
      return push('/login');         // If not logged in, "redirect" user to login

    };
    
    getDrugs()
    .then( res => {
      
      const { drugs } = res.data;
      setDrugs(drugs);

      drugs.map( drug => {
        if ( drug.isCurrentTreatment ) {
          if ( drug.schedule.some( scheduleElement => scheduleElement.slice(0,2) >= 4 && scheduleElement.slice(0,2) < 12 ) )
            state.morningArray.push(drug)
          if ( drug.schedule.some( scheduleElement => scheduleElement.slice(0,2) >= 12 && scheduleElement.slice(0,2) < 20 ) )
            state.afternoonArray.push(drug)
          if ( drug.schedule.some( scheduleElement => scheduleElement.slice(0,2) >= 20 || scheduleElement.slice(0,2) < 4 ) )
            state.nightArray.push(drug)
          if ( drug.frequency === 'Uso único' || drug.frequency === 'Según sea necesario' )
            state.anytimeArray.push(drug)
        }
        else return null
      })

      setState( prevState => ({...prevState, spinnerState: false}))

    })
    .catch( res => {

      console.log(res.response)

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

  const openTimeOfTheDay = (time, drugsArray) => {
    push({pathname: `${url}/${time}`, state: {drugsArray}})
  }


  
  return (
    <Fragment>
      <h2>Mis Medicamentos</h2>
      <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => push(`${url}/registrar`)} >
        + Medicamento
      </button>
      <div className="uk-container">
      <div className="uk-child-width-1-4@m uk-child-width-1-2 uk-grid-small uk-grid-match" uk-grid="true">
        <div onClick={ (event) => { openTimeOfTheDay('manana', state.morningArray) } } >
          <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
            <h5>Mañana</h5>
            { !state.spinnerState ? 
                !state.morningArray.length ?
                  <p className="uk-text-danger">Sin registros</p>
                :
                  state.morningArray.map( (drug, index) => {
                    return <p key={index}>{drug.name}</p>
                  })
              : <div uk-spinner="true"></div>
            }
          </div>
        </div>
        <div onClick={ (event) => { openTimeOfTheDay('tarde', state.afternoonArray) } } >
          <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
            <h5>Tarde</h5>
            { !state.spinnerState ? 
                !state.afternoonArray.length ?
                  <p className="uk-text-danger">Sin registros</p>
                :
                  state.afternoonArray.map( (drug, index) => {
                    return <p key={index}>{drug.name}</p>
                  })
              : <div uk-spinner="true"></div>
            }
          </div>
        </div>
        <div onClick={ (event) => { openTimeOfTheDay('noche', state.nightArray) } } >
          <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
            <h5>Noche</h5>
            { !state.spinnerState ? 
                !state.nightArray.length ?
                  <p className="uk-text-danger">Sin registros</p>
                :
                  state.nightArray.map( (drug, index) => {
                    return <p key={index}>{drug.name}</p>
                  })
              : <div uk-spinner="true"></div>
            }
          </div>
        </div>
        <div  onClick={ (event) => { openTimeOfTheDay('sin-horario', state.anytimeArray) } } >
          <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
            <h5>Sin horario</h5>
            { !state.spinnerState ? 
                !state.anytimeArray.length ?
                  <p className="uk-text-danger">Sin registros</p>
                :
                  state.anytimeArray.map( (drug, index) => {
                    return <p key={index}>{drug.name}</p>
                  })
              : <div uk-spinner="true"></div>
            }
          </div>
        </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Drugs