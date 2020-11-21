import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../AppContext';                  // Import AppContext to use created context
import useForm from '../../hooks/useForm';                      // Import useForm custom hook
import UIkit from 'uikit';                                      // Import UIkit for notifications

import { editPassword } from '../../services/profile-services';  // Import edit API call

const ProfilePassword = ({ push, url }) => {

  const { user, resetUserContext } = useContext(AppContext); // Destructure user state variable
  const [ state, setState ] = useState({
    isButtonDisabled: true,
    spinnerState: false,
    email: '',
    password: '',
    newPassword: '',
    confirm_password: '',
    passwordInputState: null,
    confPasswordInputState: null
  });
  
  const [ passwordValidationObj, setPasswordValidationObj ] = useState({minLength: false, oneCap: false, oneLow: false, oneNumber: false})

  useEffect( () => {

    if ( !user._id ) {    // If there is no user logged in, send a notification and "redirect" to login
      // Send UIkit warning notification: User must log in
      UIkit.notification({
        message: "<p class='uk-text-center'>Por favor inicia sesión.</p>",
        pos: 'bottom-center',
        status: 'warning'
      });
      return push('/login');         // If not logged in, "redirect" user to login
    }
      
    if ( state.passwordInputState === 'uk-form-success' && state.confPasswordInputState === 'uk-form-success' )
      setState( prevState => ({...prevState, isButtonDisabled: false}) )
    else
      setState( prevState => ({...prevState, isButtonDisabled: true}) )

    if ( state.spinnerState )
      setState( prevState => ({...prevState, isButtonDisabled: true}) )

  }, [passwordValidationObj, state.confirm_password])

  const validatePassword = (password) => {
    const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&-_/]{8,}$/;
    const regEXlowcase = /^(?=.*[a-z])/
    const regEXuppercase = /^(?=.*[A-Z])/
    const regEXnumber = /^(?=.*\d)/
    const regEXminlength = /[A-Za-z\d@$!%*?&-_/]{8,}$/
    setPasswordValidationObj( prevState => ({...prevState, oneLow: regEXlowcase.test(password)}) )
    setPasswordValidationObj( prevState => ({...prevState, oneCap: regEXuppercase.test(password)}) )
    setPasswordValidationObj( prevState => ({...prevState, oneNumber: regEXnumber.test(password)}) )
    setPasswordValidationObj( prevState => ({...prevState, minLength: regEXminlength.test(password)}) )
    return regEx.test(password);
  }

  const inputValidation = (event) => {

    const { name, value } = event.target;

    setState( prevState => ({...prevState, [name]: value}) );

    switch( name ) {
      case 'newPassword': {
        if (  validatePassword(value) )
          setState( prevState => ({...prevState, passwordInputState: 'uk-form-success'}) )
        else
          setState( prevState => ({...prevState, passwordInputState: 'uk-form-danger'}) )
        break;
      }
      case 'confirm_password': {
        if ( value === state.newPassword )
          setState( prevState => ({...prevState, confPasswordInputState: 'uk-form-success'}) )
        else
          setState( prevState => ({...prevState, confPasswordInputState: 'uk-form-danger'}) )
      }
    }
    
  }

  const submitNewPassword = (event) => {

    state['email'] = user.email
    event.preventDefault();
    setState( prevState => ({...prevState, isButtonDisabled: true, spinnerState: true}) )

    editPassword(state)
    .then( res => {

      setState({
        isButtonDisabled: true,
        spinnerState: false,
        email: '',
        password: '',
        newPassword: '',
        confirm_password: '',
        passwordInputState: null,
        confPasswordInputState: null
      })

      // Send UIkit success notification
      UIkit.notification({
        message: '<p class="uk-text-center">Tu contraseña fue actualizada exitosamente</p>',
        pos: 'bottom-center',
        status: 'success'
      });

      push(url);

    })
    .catch( res => {

      let msg;

      if ( res.response )
        msg = res.response.data.msg;
      else
        msg = "Ocurrió un error, intenta de nuevo"

      setState( prevState => 
        ({
          isButtonDisabled: true,
          spinnerState: false,
          password: '',
          newPassword: '',
          confirm_password: '',
          passwordInputState: 'uk-text-danger',
          confPasswordInputState: 'uk-text-danger'
        })
      )
      setPasswordValidationObj({minLength: false, oneCap: false, oneLow: false, oneNumber: false})
      if ( msg === 'Sesión expirada. Reinicia sesión por favor.' ) {
        localStorage.clear();
        resetUserContext();
        UIkit.notification({
          message: `<p class="uk-text-center">${msg}</p>`,
          pos: 'bottom-center',
          status: 'warning'
        });
        push('/login');
      }
      else 
        UIkit.notification({
          message: `<p class="uk-text-center">${msg}</p>`,
          pos: 'bottom-center',
          status: 'danger'
        });

    });
  }

  return (
    <div className="uk-padding-small">
      <h2>Cambiar Contraseña</h2>
      <form className="uk-form-stacked" onSubmit={submitNewPassword}>
        <div className="uk-margin">
          <label className="uk-form-label">Contraseña Actual:</label>
          <div className="uk-inline uk-width-4-5 uk-width-1-3@s">
            <span className="uk-form-icon" uk-icon="icon: lock"></span>
            <input
              onChange={event => inputValidation(event)}
              name="password"
              value={state.password}
              className="uk-input uk-width-1-1 uk-border-pill"
              type="password"
              required={true}
            />
          </div>
        </div>
        <div className="uk-margin">
          <label className="uk-form-label">Nueva Contraseña:</label>
          <div className="uk-inline uk-width-4-5 uk-width-1-3@s">
            <span className="uk-form-icon" uk-icon="icon: lock"></span>
            <input
              onChange={event => inputValidation(event)}
              name="newPassword"
              value={state.newPassword}
              className={ state.passwordInputState !== null ? 
                `${state.passwordInputState} uk-input uk-width-1-1 uk-border-pill` : "uk-input uk-width-1-1 uk-border-pill"
              }
              type="password"
              required={true}
            />
          </div>
          <div className="uk-margin uk-flex uk-flex-center">
            <div className="uk-width-1-2@s uk-flex uk-flex-column">
              <div className="uk-width-1-1 uk-flex">
                  { passwordValidationObj.oneCap ?
                    <div className="uk-width-1-2 uk-flex uk-flex-center@s uk-flex-middle uk-text-success">
                      <span uk-icon="check" className="uk-width-1-6"></span> Una letra mayúscula
                    </div>
                    : 
                    <div className="uk-width-1-2 uk-flex uk-flex-center@s uk-flex-middle">
                      <span uk-icon="warning" className="uk-width-1-6"></span>  Una letra mayúscula
                    </div>
                  }
                  { passwordValidationObj.oneNumber ?
                    <div className="uk-width-1-2 uk-flex uk-flex-middle uk-text-success">
                      <span uk-icon="check" className="uk-width-1-6"></span> Un número
                    </div>
                    : 
                    <div className="uk-width-1-2 uk-flex uk-flex-middle">
                      <span uk-icon="warning" className="uk-width-1-6"></span>  Un número
                    </div>
                  }
                  
              </div>
              <div className="uk-width-1-1 uk-flex">
                { passwordValidationObj.oneLow ?
                  <div className="uk-width-1-2 uk-flex uk-flex-center@s uk-flex-middle uk-text-success">
                    <span uk-icon="check" className="uk-width-1-6"></span> Una letra minúscula
                  </div>
                  : 
                  <div className="uk-width-1-2 uk-flex uk-flex-center@s uk-flex-middle">
                    <span uk-icon="warning" className="uk-width-1-6"></span>  Una letra minúscula
                  </div>
                }
                { passwordValidationObj.minLength ?
                  <div className="uk-width-1-2 uk-flex uk-flex-left uk-flex-middle uk-text-success">
                    <span uk-icon="check" className="uk-width-1-6"></span> Mínimo 8 caracteres
                  </div>
                  : 
                  <div className="uk-width-1-2 uk-flex uk-flex-left uk-flex-middle">
                    <span uk-icon="warning" className="uk-width-1-6"></span> Mínimo 8 caracteres
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
        <div className="uk-margin">
          <label className="uk-form-label">Confirma tu Nueva Contraseña:</label>
          <div className="uk-inline uk-width-4-5 uk-width-1-3@s">
            <span className="uk-form-icon" uk-icon="icon: lock"></span>
            <input
              onChange={event => inputValidation(event)}
              name="confirm_password"
              value={state.confirm_password}
              className={state.confPasswordInputState !== null ? `${state.confPasswordInputState} uk-input uk-width-1-1 uk-border-pill` : "uk-input uk-width-1-1 uk-border-pill"}
              type="password"
            />
          </div>
          { state.confPasswordInputState === 'uk-form-danger' ?
              <div>
                <span className="uk-text-danger">Asegúrate de introducir la misma contraseña</span>
              </div>
            : null 
          }
        </div>
        <button disabled={state.isButtonDisabled} className="uk-button uk-button-primary uk-border-pill uk-width-3-5 uk-width-1-5@s uk-margin" type="submit">
          {state.spinnerState ? "Cambiando" : "Cambiar"} <div className={ state.spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
        </button>
      </form>
    </div>
  )
}

export default ProfilePassword