import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../../AppContext';
import { useParams, Link, useHistory } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import useForm from '../../hooks/useForm';              // Import useForm custom hook
import UIkit from 'uikit';                              // Import UIkit for notifications

import { reset } from '../../services/auth-services'

const ResetPassword = () => {

  const { form, handleInput } = useForm();                // Destructure form state variable and handleInput function
  const { user, route, setRoute } = useContext(AppContext);   // Destructure setUser function for user state manipulation
  const { push } = useHistory();                          // Destructure push method from useHistory to "redirect" user
  const [ password, setPassword ] = useState('')
  const [ confirm_password, setConfirmPassword ] = useState('')
  const [ passwordInputState, setPasswordInputState ] = useState(null)
  const [ confPasswordInputState, setConfPasswordInputState ] = useState(null)
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(false)
  const [ spinnerState, setSpinnerState ] = useState(false)
  const [ passwordValidationObj, setPasswordValidationObj ] = useState({minLength: false, oneCap: false, oneLow: false, oneNumber: false})
  
  const { resetPasswordLink } = useParams();
  const { email, first_name } = jwt.decode(resetPasswordLink);
  
  useEffect(() => {

    if ( user._id ) {    // If there is no user logged in, send a notification and "redirect" to login
      
      return push('/home');         // If not logged in, "redirect" user to login

    };

    if ( passwordInputState === 'uk-form-success' && confPasswordInputState === 'uk-form-success' )
      setIsButtonDisabled(false);
    else
      setIsButtonDisabled(true);

    if ( spinnerState )
      setIsButtonDisabled(true);

  }, [passwordInputState, confPasswordInputState, spinnerState])

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

    switch( name ) {
      case 'password': {
        setPassword(value)
        if (  validatePassword(value) )
          setPasswordInputState('uk-form-success');
        else
          setPasswordInputState('uk-form-danger');
        break;
      }
      case 'confirm_password': {
        setConfirmPassword(value)
        if ( value === password )
          setConfPasswordInputState('uk-form-success')
        else
          setConfPasswordInputState('uk-form-danger')
      }
    }
    
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    form['newPassword'] = password;
    form['confirm_newPassword'] = confirm_password;
    form['resetPasswordLink'] = resetPasswordLink;
    setIsButtonDisabled(true);
    setSpinnerState(true)

    reset(form)
    .then( res => {
      const { msg } = res.data;
      UIkit.notification({
        message: `<p class="uk-text-center">${msg}</p>`,
        pos: 'bottom-center',
        status: 'success'
      });
      setIsButtonDisabled(false);
      setSpinnerState(false);
      push('/login');
    })
    .catch( res => {
      const { msg } = res.response.data;
      UIkit.notification({
        message: `<p class="uk-text-center">${msg}</p>`,
        pos: 'bottom-center',
        status: 'danger'
      });
      setIsButtonDisabled(false);
      setSpinnerState(false);
      push('/recuperar');
    })
  }

  return (
    <div className="uk-section">
      <div className="uk-container uk-margin-top uk-margin-remove-top@s">
        <h2>Restablecer tu contraseña</h2>
        <p>Hola {first_name}, por favor introduce tu nueva contraseña</p>
        <form className="uk-form-stacked" onSubmit={handleSubmit}>
          <div className="uk-margin">
            <label className="uk-form-label">Nueva Contraseña:</label>
            <div className="uk-inline uk-width-4-5 uk-width-1-3@s">
              <span className="uk-form-icon" uk-icon="icon: lock"></span>
              <input
                onChange={event => inputValidation(event)}
                name="password"
                value={password}
                className={passwordInputState !== null ? `${passwordInputState} uk-input uk-width-1-1 uk-border-pill` : "uk-input uk-width-1-1 uk-border-pill"}
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
              <label className="uk-form-label">Confirma tu contraseña:</label>
              <div className="uk-inline uk-width-4-5 uk-width-1-3@s">
                <span className="uk-form-icon" uk-icon="icon: lock"></span>
                <input
                  onChange={event => inputValidation(event)}
                  name="confirm_password"
                  value={confirm_password}
                  className={passwordInputState !== null ? `${confPasswordInputState} uk-input uk-width-1-1 uk-border-pill` : "uk-input uk-width-1-1 uk-border-pill"}
                  type="password"
                />
              </div>
              { confPasswordInputState === 'uk-form-danger' ?
                <div>
                  <span className="uk-text-danger">Asegúrate de introducir la misma contraseña</span>
                </div>
                : null 
              }
            </div>
            <button className="uk-button uk-button-primary uk-button uk-border-pill uk-width-4-5 uk-width-1-4@m uk-margin" disabled={isButtonDisabled} type="submit">
              { !spinnerState ? "Restablecer contraseña" : "Restableciendo"}  <div className={ spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
            </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword