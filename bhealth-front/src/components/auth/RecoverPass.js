import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../../AppContext';
import { useParams, Link, useHistory } from 'react-router-dom'
import UIkit from 'uikit';                              // Import UIkit for notifications

import { recover } from '../../services/auth-services'

const RecoverPassword = () => {

  const { user, route, setRoute } = useContext(AppContext);   // Destructure setUser function for user state manipulation
  const { push } = useHistory();                          // Destructure push method from useHistory to "redirect" user
  const [ email, setEmail ] = useState('')
  const [ emailInputState, setEmailInputState ] = useState(null)
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(false)
  const [ spinnerState, setSpinnerState ] = useState(false)

  useEffect(() => {

    if ( user._id ) {    // If there is no user logged in, send a notification and "redirect" to login
      
      return push('/home');         // If not logged in, "redirect" user to login

    };

    if ( emailInputState === 'uk-form-success' )
      setIsButtonDisabled(false);
    else
      setIsButtonDisabled(true);

    if ( spinnerState )
      setIsButtonDisabled(true);

  }, [emailInputState, spinnerState, route])

  const validateEmail = (email) => {
    const regEx = /\S+@\S+\.\S+/;
    return regEx.test(email);
  }

  const inputValidation = (event) => {

    const { name, value } = event.target;

    setEmail(value);
    if ( validateEmail(value) ) 
      setEmailInputState('uk-form-success');
    else 
      setEmailInputState('uk-form-danger');

  }

  const handleClick = (event) => {
    event.preventDefault()
    setSpinnerState(true)

    recover({email})
    .then( res => {
      // Send UIkit error notification
      UIkit.notification({
        message: `<p class="uk-text-center">Se ha enviado un correo con instrucciones para restablecer tu contraseña</p>`,
        pos: 'bottom-center',
        status: 'success'
      });
      setEmail('')
      setEmailInputState(null)
      setSpinnerState(false)
      setIsButtonDisabled(true)
      setRoute('success')
    })
    .catch( res => {

      let msg;
      setSpinnerState(false);

      if ( res.response )
        msg = res.response.data.msg;
      else
        msg = "Ocurrió un error, intenta de nuevo"

      // Send UIkit error notification
      UIkit.notification({
        message: `<p class="uk-text-center">${msg}</p>`,
        pos: 'bottom-center',
        status: 'danger'
      });

    });
  }

  return (
    <div className="uk-section">
      { route === 'none' ?
        <div className="uk-container uk-margin-top uk-margin-remove-top@s">
          <h2>Restablecer tu contraseña</h2>
          <h4>Introduce tu correo electrónico y te enviaremos una liga para restablecer tu contraseña</h4>
          <div className="uk-flex uk-flex-center uk-margin-large-top">
            <input onChange={inputValidation} placeholder="Tu correo electrónico..." className={emailInputState !== null ? `${emailInputState} uk-width-4-5 uk-width-1-3@s uk-input uk-border-pill uk-text-center` : "uk-width-4-5 uk-width-1-3@s uk-input uk-border-pill uk-text-center"} type="email" name="email" required={true} />
          </div>
          { emailInputState === 'uk-form-danger' ?
              <div>
                <span className="uk-text-danger">Introduce una dirección de correo válida</span>
              </div>
            : null 
          }
          <button onClick={handleClick} className="uk-button uk-button-primary uk-button uk-border-pill uk-width-3-5 uk-width-1-5@m uk-margin" disabled={isButtonDisabled}>
            { !spinnerState ? "Enviar correo" : "Enviando"}  <div className={ spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
          </button>
          <p>Asegúrate de revisar en tu carpeta de correo no deseado/spam</p>
        </div>
      : 
        <div className="uk-container uk-margin-top uk-margin-remove-top@s">
          <h2>¡Correo enviado!</h2>
          <h4>Revisa tu correo electrónico por favor.</h4>
          <p className="uk-text-danger">Asegúrate de revisar en tu carpeta de correo no deseado/spam</p>
          <p className="uk-text-danger">¡La liga expira en 10 minutos!</p>
          <button onClick={event => setRoute('none')} className="uk-button uk-button-muted uk-button uk-border-pill uk-width-4-5 uk-width-1-5@m uk-margin">
            Intentar de nuevo
          </button>
        </div>
      }
    </div>
  )
}

export default RecoverPassword
