import React, { useEffect, useState, useContext, Fragment } from 'react';
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import useForm from '../../hooks/useForm';
import UIkit from 'uikit';
import moment from 'moment';

import { createDrug } from '../../services/drug-services'

const DrugsForm = ({push, url}) => {

  const { user, resetUserContext } = useContext(AppContext); // Destructure user state variable
  const { form, resetForm, handleInput } = useForm();
  const [ state, setState ] = useState({
    isUserEditing: false,
    isButtonDisabled: true,
    isSelfMedicated: false,
    spinnerState: false,
    errorMessage: null,
  });

  useEffect( () => {
    if ( !user._id ) {    // If there is no user logged in, send a notification and "redirect" to login
      // Send UIkit warning notification: User must log in
      UIkit.notification({
        message: '<p class="uk-text-center">Por favor inicia sesión',
        pos: 'bottom-center',
        status: 'warning'
      });
      return push('/login');         // If not logged in, "redirect" user to login
    };
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault();
    form['isSelfMedicated'] = state.isSelfMedicated
    console.log(form)

    setState( prevState => ({...prevState, isButtonDisabled: true, spinnerState: true}))
    
    createDrug(form)
    .then( res => {
      const { drug } = res.data;
      console.log(drug)
      UIkit.notification({
        message: '<p class="uk-text-center">Se ha registrado el medicamento</p>',
        pos: 'bottom-center',
        status: 'success'
      });
      resetForm();
      push(url);
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
        resetForm();
        push('/login');
      } else
          UIkit.notification({
            message: `<p class="uk-text-center">${msg}</p>`,
            pos: 'bottom-center',
            status: 'danger'
          });
          setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}))
    });

  }

  const toggleIsUserEditing = (event) => {
    event.preventDefault()
    resetForm();
    // document.getElementById('date_of_birth_input').value = moment(user.date_of_birth).format('YYYY-MM-DD')
    setState( prevState => ({...prevState, isUserEditing: !prevState.isUserEditing, errorMessage: null, isButtonDisabled: true}))
  }

  return (
    <Fragment>
      <h2>Agregar Medicamento</h2>
      <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => push(`${url}`)} >
        Regresar
      </button>
      <div className="uk-container">
        
          <div className="uk-card uk-card-hover uk-card-body uk-padding-small uk-padding@s uk-flex uk-flex-column uk-flex-middle">
            <h4 className="uk-margin-remove-bottom">Datos del Medicamento</h4>
            <a className={ state.isUserEditing ? "uk-text-danger uk-position-top-right uk-position-small" : "eva-edit uk-position-top-right uk-position-small"} href="#" onClick={toggleIsUserEditing}>
              <span uk-icon={state.isUserEditing ? "ban" : "pencil"}></span>
            </a>
            <a className={ state.isUserEditing ? "uk-text-danger" : "eva-edit"} href="#" onClick={toggleIsUserEditing}>
              { state.isUserEditing ? "Cancelar cambios" : "Editar" }
            </a>
            <form onSubmit={handleSubmit} className="uk-form-stacked uk-text-left uk-width-3-5@s">
              <label className="uk-form-label uk-margin-small-top" htmlFor="name">Nombre:</label>
              <div className="uk-form-controls">
                <input className="uk-input uk-border-pill uk-text-center" name="name" onChange={handleInput} placeholder="Nombre del medicamento..." required />
              </div>
              <label className="uk-form-label uk-margin-top" htmlFor="dosage_form">Presentación <span className="uk-text-italic">(opcional)</span>:</label>
              <div className="uk-form-controls">
                <input className="uk-input uk-border-pill uk-text-center" name="dosage_form" onChange={handleInput} placeholder="Jarabe, tabletas, crema..." />
              </div> 
              <label className="uk-form-label uk-margin-top" htmlFor="directions">Indicaciones <span className="uk-text-italic">(opcional)</span>:</label>
              <div className="uk-form-controls">
                <textarea className="uk-textarea uk-border-pill uk-text-center" rows={2} name="directions" onChange={handleInput} placeholder="Tomar por la mañana, en ayunas, cada 12 horas..." />
              </div>
              <div className="uk-margin-top uk-flex uk-flex-middle uk-width-1-1">
                <label className="uk-form-label uk-width-1-2">¿Es automedicado?</label>
                <div className="uk-flex uk-flex-around uk-width-1-2 uk-child-width-2-5 uk-child-width-1-3@s">
                  <button className={ state.isSelfMedicated ? "uk-button uk-button-secondary uk-border-pill selected uk-width-2-5 uk-text-center uk-padding-remove" : "uk-button uk-button-default uk-border-pill uk-width-2-5 uk-text-center uk-padding-remove"} onClick={ (event) => { event.preventDefault(); setState( prevState => ({...prevState, isSelfMedicated: true})) }} >
                    Sí
                  </button>
                  <button className={ !state.isSelfMedicated ? "uk-button uk-button-secondary uk-border-pill selected uk-width-2-5 uk-text-center uk-padding-remove" : "uk-button uk-button-default uk-border-pill uk-width-2-5 uk-text-center uk-padding-remove"} onClick={ (event) => { event.preventDefault(); setState( prevState => ({...prevState, isSelfMedicated: false})) }} >
                    No
                  </button>
                </div>
              </div>
              { state.errorMessage ? 
                <p className="uk-text-center uk-text-danger">{state.errorMessage}</p> : null 
              }
              <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin-medium-top">
                <button type="submit" className="uk-button uk-button-primary uk-button uk-border-pill uk-width-2-3 uk-width-1-4@m uk-align-center">
                  { !state.spinnerState ? "Agregar" : "Guardando"}  <div className={ state.spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
                </button>
              </div>
            </form>
          </div>
          
      </div>

    </Fragment>
  )
}

export default DrugsForm
