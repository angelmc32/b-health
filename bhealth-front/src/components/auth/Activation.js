import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../../AppContext';
import { useParams, Link, useHistory } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import { activate } from '../../services/auth-services'
import UIkit from 'uikit'

const Activation = () => {

  const { setUser, setRoute } = useContext(AppContext);   // Destructure setUser function for user state manipulation
  const { push } = useHistory();                          // Destructure push method from useHistory to "redirect" user

  const [state, setState] = useState({
    name: '',
    token: '',
    buttonText: 'Activar cuenta',
    successMsg: '',
    errorMsg: ''
  });

  const { activationToken } = useParams();

  const { name, token, buttonText, successMsg, errorMsg } = state;

  useEffect(() => {

    console.log(jwt.decode(activationToken))

    setState({...state, token: activationToken});

  }, [])

  const clickActivate = async (event) => {
    
    event.preventDefault();
    console.log('Activating');
    setState({...state, buttonText: 'Activando'});

    activate(token)
    .then( res => {

      const { user, token } = res.data
      console.log(res);
      setState({...state, name: '', token: '', buttonText: '¡Cuenta activada!', successMsg: res.data.message})

      // Store user and token in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      setUser(user);    // Modify user state variable, setting the user data in the state
      setRoute('');
      if ( user.gaveConsent)
        push('/home');    // "Redirect" user to home
      else
        push('/consentimiento')

    })
    .catch( res => {

      console.log(res.response.data)
      setState({...state, buttonText: 'Expirado', errorMsg: res.response.data.msg})
      const { msg } = res.response.data;

      // Send UIkit error notification
      UIkit.notification({
        message: `<span uk-icon='close'></span> ${msg}`,
        pos: 'bottom-center',
        status: 'danger'
      });
    })
  }

  return (
    <div className="uk-section">
      <div className="uk-container">
        <h2>¿Listo para empezar a utilizar Beesalud?</h2>
        <h4>Haz click en el botón de abajo para activar tu cuenta</h4>
        <button className="uk-button uk-button-primary uk-border-pill uk-width-3-5 uk-width-1-5@s uk-margin" onClick={clickActivate}>
          {buttonText}
        </button>
        { buttonText === 'Expirado' ? 
        <div className="uk-width-1-1">
          <Link to="/registro">
            <button className="uk-button uk-button-muted uk-border-pill uk-width-3-5 uk-width-1-5@s uk-margin">
              Intentar de nuevo
            </button>
          </Link>
        </div>
          
        : null }
      </div>
    </div>
  )
}

export default Activation