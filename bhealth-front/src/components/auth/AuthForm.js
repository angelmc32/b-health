import React, { useEffect, useState } from 'react';                        // Import React
import { NavLink } from 'react-router-dom';       // Import NavLink for "navigation"

// Declare AuthForm functional component, receives action variable for conditional rendering,
// email, password and confirm_password variables from form state variable, and submit and handleChange functions
const AuthForm = ( { submit, action, email = '', password = '', confirm_password = '', handleChange } ) => {

  let error = null;
  const [ emailInputState, setEmailInputState ] = useState(null)
  const [ passwordInputState, setPasswordInputState ] = useState(null)
  const [ confPasswordInputState, setConfPasswordInputState ] = useState(null)
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(true)

  useEffect( () => {
    if ( emailInputState === 'uk-form-success' && passwordInputState === 'uk-form-success' && confPasswordInputState === 'uk-form-success' )
      setIsButtonDisabled(false);
    else
      setIsButtonDisabled(true);
  }, [emailInputState, passwordInputState, confPasswordInputState])

  const validateEmail = (email) => {
    const regEx = /\S+@\S+\.\S+/;
    return regEx.test(email);
  }

  const validatePassword = (password) => {
    const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regEx.test(password);
  }

  const inputValidation = (event) => {

    const { name, value } = event.target;

    handleChange(event);

    switch( name ) {
      case 'email': {
        if ( validateEmail(value) ) 
          setEmailInputState('uk-form-success');
        else 
          setEmailInputState('uk-form-danger');
        break;
      }
      case 'password': {
        if (  validatePassword(value) )
          setPasswordInputState('uk-form-success');
        else
          setPasswordInputState('uk-form-danger');
        break;
      }
      case 'confirm_password': {
        if ( value === password )
          setConfPasswordInputState('uk-form-success')
        else
          setConfPasswordInputState('uk-form-danger')
      }
    }
    
  }

  return (
    <div className=" uk-width-1-1 uk-margin-top uk-margin-remove-top@s">

      <div className="uk-margin">

        <h2>{action === "signup" ? "Registro" : "Inicia Sesión"}</h2>
    
        { action === "signup" ? (
          <p>¿Ya tienes cuenta? 
            <NavLink to="/login" className="uk-margin-small-left">
              Accede aquí
            </NavLink>
          </p>
          ) : (
          <p>¿No tienes cuenta? 
            <NavLink to="/signup" className="uk-margin-small-left">
              Regístrate aquí
            </NavLink>
          </p>
          )
        }
      
      </div>

        <form className="uk-form-stacked" onSubmit={submit}>
          
          <div className="uk-margin">
            <label className="uk-form-label">Correo Electrónico:</label>
            <div className="uk-inline uk-width-4-5 uk-width-1-3@s">
              <span className="uk-form-icon" uk-icon="icon: user"></span>
              <input onChange={event => inputValidation(event)} name="email" value={email} className={emailInputState !== null ? `${emailInputState} uk-input uk-width-1-1 uk-border-pill` : "uk-input uk-width-1-1 uk-border-pill"} type="email" />
            </div>
            { emailInputState === 'uk-form-danger' ?
                <div>
                  <span className="uk-text-danger">Introduce una dirección de correo válida</span>
                </div>
              : null 
            }
          </div>
          <div className="uk-margin">
            <label className="uk-form-label">Contraseña:</label>
            <div className="uk-inline uk-width-4-5 uk-width-1-3@s">
              <span className="uk-form-icon" uk-icon="icon: lock"></span>
              <input
                onChange={event => inputValidation(event)}
                name="password"
                value={password}
                className={
                  action === 'signup' ?
                    passwordInputState !== null ? `${passwordInputState} uk-input uk-width-1-1 uk-border-pill` : "uk-input uk-width-1-1 uk-border-pill"
                  : "uk-input uk-width-1-1 uk-border-pill"}
                type="password"
              />
            </div>
            { passwordInputState === 'uk-form-danger' ?
                <div>
                  <span className="uk-text-danger">La contraseña debe contener al menos una mayúscula, una minúscula y un número</span>
                </div>
              : null 
            }
          </div>
            { action === "signup" ? (
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
            <div className="uk-width-1-1 uk-margin-top">
              <input type="checkbox" className="uk-checkbox uk-margin-small-right"/>
               Estoy de acuerdo con los términos de condiciones
            </div>
            </div>
            ) : null }
            
            

          

          <button disabled={action === 'signup' ? isButtonDisabled : false} className="uk-button uk-button-primary uk-border-pill uk-width-3-5 uk-width-1-5@s uk-margin" type="submit">
            {action === "signup" ? "Registrar" : "Entrar"}
          </button>

        </form>
    </div>
  )

}

export default AuthForm;