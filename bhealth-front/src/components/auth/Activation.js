import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../../AppContext';
import { useParams, Link, useHistory } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import { activate } from '../../services/auth-services'
import UIkit from 'uikit'

const Activation = () => {

  const { user, setUser, setRoute } = useContext(AppContext);   // Destructure setUser function for user state manipulation
  const { push } = useHistory();                          // Destructure push method from useHistory to "redirect" user

  const [state, setState] = useState({
    name: '',
    token: '',
    buttonText: 'Activar cuenta',
    successMsg: '',
    errorMsg: ''
  });

  const { activationToken } = useParams();
  const { email } = jwt.decode(activationToken);

  const { name, token, buttonText, successMsg, errorMsg } = state;

  useEffect(() => {

    if ( user._id ) {    // If there is no user logged in, send a notification and "redirect" to login
      
      return push('/home');         // If not logged in, "redirect" user to login

    };

    setState({...state, token: activationToken});

  }, [])

  const clickActivate = async (event) => {
    
    event.preventDefault();
    setState({...state, buttonText: 'Activando'});

    activate(token)
    .then( res => {

      const { user, token } = res.data;
      setState({...state, name: '', token: '', buttonText: '¡Cuenta activada!', successMsg: res.data.message})

      // Store user and token in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      setUser(user);    // Modify user state variable, setting the user data in the state
      setRoute('');

      // Send UIkit error notification
      UIkit.notification({
        message: `<p class="uk-text-center">¡Bienvenido a Beesalud!</p>`,
        pos: 'bottom-center',
        status: 'success'
      });

      if ( user.gaveConsent)
        push('/home');    // "Redirect" user to home
      else
        push('/consentimiento')

    })
    .catch( res => {

      setState({...state, buttonText: 'Expirado', errorMsg: res.response.data.msg})
      const { msg } = res.response.data;

      // Send UIkit error notification
      UIkit.notification({
        message: `<p class="uk-text-center">${msg}</p>`,
        pos: 'bottom-center',
        status: 'danger'
      });
    })
  }

  return (
    <div className="uk-section">
      <div className="uk-container uk-margin-top uk-margin-remove-top@s">
        <h2>¿Listo para empezar a utilizar Beesalud?</h2>
        <h4>Haz click en el botón de abajo para activar tu cuenta</h4>
        { buttonText !== 'Expirado' ? 
            <button disabled={buttonText === 'Expirado' ? true : false} className={buttonText !== 'Expirado' ? "uk-button uk-button-primary uk-border-pill uk-width-3-5 uk-width-1-5@s uk-margin" : "uk-hidden"} onClick={clickActivate}>
              {buttonText}
            </button>
          :
            <button className="uk-button uk-button-muted uk-border-pill uk-width-4-5 uk-width-1-5@s uk-margin" onClick={() => push({pathname: '/registro', state: {email}})}>
              Intentar de nuevo
            </button>
        }
      </div>
    </div>
  )
}

export default Activation