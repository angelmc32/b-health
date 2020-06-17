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
  const [ passwordValidationObj, setPasswordValidationObj ] = useState({minLength: false, oneCap: false, oneLow: false, oneNumber: false})

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
    const regEXlowcase = /^(?=.*[a-z])/
    const regEXuppercase = /^(?=.*[A-Z])/
    const regEXnumber = /^(?=.*\d)/
    const regEXminlength = /[a-zA-Z\d]{8,}$/
    setPasswordValidationObj( prevState => ({...prevState, oneLow: regEXlowcase.test(password)}) )
    setPasswordValidationObj( prevState => ({...prevState, oneCap: regEXuppercase.test(password)}) )
    setPasswordValidationObj( prevState => ({...prevState, oneNumber: regEXnumber.test(password)}) )
    setPasswordValidationObj( prevState => ({...prevState, minLength: regEXminlength.test(password)}) )
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
        if ( action === 'login' ) return null
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
            <NavLink to="/registro" className="uk-margin-small-left">
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
            <div className="uk-margin uk-flex uk-flex-center">
              { action === 'signup' ?
                <div className="uk-width-1-2@s uk-flex uk-flex-column">
                  <div className="uk-width-1-1 uk-flex">
                      { passwordValidationObj.oneCap ?
                        <div className="uk-width-1-2 uk-flex uk-flex-center@s uk-flex-middle uk-text-success">
                          <span uk-icon="check"></span> Una letra mayúscula
                        </div>
                        : 
                        <div className="uk-width-1-2 uk-flex uk-flex-center@s uk-flex-middle">
                          <span uk-icon="warning"></span>  Una letra mayúscula
                        </div>
                      }
                      { passwordValidationObj.oneNumber ?
                        <div className="uk-width-1-2 uk-flex uk-flex-left uk-flex-middle uk-text-success">
                          <span uk-icon="check"></span> Un número
                        </div>
                        : 
                        <div className="uk-width-1-2 uk-flex uk-flex-left uk-flex-middle">
                          <span uk-icon="warning"></span>  Un número
                        </div>
                      }
                      
                  </div>
                  <div className="uk-width-1-1 uk-flex">
                    { passwordValidationObj.oneLow ?
                      <div className="uk-width-1-2 uk-flex uk-flex-center@s uk-flex-middle uk-text-success">
                        <span uk-icon="check"></span> Una letra minúscula
                      </div>
                      : 
                      <div className="uk-width-1-2 uk-flex uk-flex-center@s uk-flex-middle">
                        <span uk-icon="warning"></span>  Una letra minúscula
                      </div>
                    }
                    { passwordValidationObj.minLength ?
                      <div className="uk-width-1-2 uk-flex uk-flex-left uk-flex-middle uk-text-success">
                        <span uk-icon="check"></span> Mínimo 8 caracteres
                      </div>
                      : 
                      <div className="uk-width-1-2 uk-flex uk-flex-left uk-flex-middle">
                        <span uk-icon="warning"></span> Mínimo 8 caracteres
                      </div>
                    }
                  </div>
                </div> : null
              }
            </div>
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
               Estoy de acuerdo con los <a href={`#modal-sections-0`} uk-toggle={`target: #modal-sections-0`}>términos y condiciones</a>
            </div>
            <div id={`modal-sections-0`} uk-modal="true">
              <div className="uk-modal-dialog uk-modal-body">
              <button className="uk-modal-close-default" type="button" uk-close="true" />
                <h2 className="uk-modal-title uk-text-center">Consentimiento Informado</h2>
                  <h6 className="uk-text-center">A fin de dar cumplimiento a la Ley de Protección de Datos Personales se dispone establecer la siguiente
                  CLÁUSULA para el <br/>Consentimiento expreso de CESIÓN DE DATOS PERSONALES.</h6>
                  <p className="uk-text-center">
                  El USUARIO o su TUTOR LEGAL, queda informado y consciente de forma expresa que los datos personales
                  que facilite pasan a formar parte de un fichero (Base de Datos) responsabilidad de la Empresa con la finalidad
                  de llevar a cabo los distintos servicios que forman parte de su labor aquí expuestos. Aquí se incluyen datos
                  relativos a su persona y familia de carácter personal y de salud. Y autorizando la sesión de sus datos a otras
                  personas o entidades relacionadas, tales como entidades aseguradoras y prestadoras de servicios que
                  integrarían la oferta de servicios complementarios que puedan interesarles para su adquisición.
                  </p>
                  <p className="uk-text-center">
                  El USUARIO o su TUTOR LEGAL queda informado de que podrá ejercer los derechos de acceso, rectificación,
                  oposición y cancelación dirigiéndose a la dirección de la Empresa en el domicilio social..
                  </p>
                  <p className="uk-text-center">Doy consentimiento a Registro de Datos Personales; Recibir comunicación vía Correo Electrónico,
                  WhatsApp, y a través de publicidad selectiva.
                  </p>
                </div>
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