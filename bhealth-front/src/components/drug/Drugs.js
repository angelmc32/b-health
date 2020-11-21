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
    isError: false,
    errorMsg: 'Ha ocurrido un error, intenta de nuevo',
    isLoading: true,
    morningArray: [],
    afternoonArray: [],
    nightArray: [],
    anytimeArray: []
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

      setState( prevState => ({...prevState, spinnerState: false, isLoading: false}))

    })
    .catch( res => {

      let status;
      if ( res.response ) {
        setState( prevState => ({...prevState, errorMsg: res.response.data.msg}) );
        status = res.response.status
      }

      if (status === 401) {
        localStorage.clear();
        resetUserContext();
        UIkit.notification({
          message: `<p class="uk-text-center">${state.errorMsg}</p>`,
          pos: 'bottom-center',
          status: 'warning'
        });
        push('/login');
      } else
          UIkit.notification({
            message: `<p class="uk-text-center">${state.errorMsg}</p>`,
            pos: 'bottom-center',
            status: 'danger'
          });
      setState( prevState => ({...prevState, isLoading: false, isError: true}))
    });

  }, [])

  const openTimeOfTheDay = (time, drugsArray) => {
    push({pathname: `${url}/${time}`, state: {drugsArray}})
  }


  
  return (
    <Fragment>
      <h2>Medicamentos</h2>
      <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => push(`${url}/registrar`)} >
        + Medicamento
      </button>
      <div className="uk-overflow-auto">
        { state.isLoading ?
            <h4>Cargando <div uk-spinner="true"></div></h4>
          : 
          drugs.length < 1 ? (
            <h4 className="uk-text-danger">{ state.isError ? state.errorMsg : "No has agregado medicamentos"}</h4>
          ) : null
        }
        <table className="uk-table uk-table-striped uk-table-hover uk-table-middle">
          <thead>
            <tr>
              
              <th className="uk-text-center uk-visible">Medicamento</th>
              <th className="uk-text-center uk-visible@m">Presentación</th>
              <th className="uk-text-center">Fecha Agregada</th>
              <th className="uk-text-center">Detalles</th>
              
            </tr>
          </thead>
          <tbody>
            { drugs ? 
                drugs.map( (drug, index) => 
                  <tr key={index}>
                    <td className="uk-text-center uk-visible">{drug.name}</td>
                    <td className="uk-text-center uk-visible">{drug.dosage_form}</td>
                    <td className="uk-text-center">{moment(drug.createdAt).locale('es').format('LL')}</td>
                    <td className="uk-text-center">
                      <button className="uk-button uk-button-default uk-button-small uk-border-pill" onClick={event => console.log('ver')} >
                        Ver
                      </button>
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
    </Fragment>
  )
}

export default Drugs