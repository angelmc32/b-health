import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../../AppContext';
import { useParams, Link, useHistory } from 'react-router-dom'

const Registration = () => {

  const { user } = useContext(AppContext);   // Destructure setUser function for user state manipulation
  const { push } = useHistory();                          // Destructure push method from useHistory to "redirect" user

  useEffect(() => {

    if ( user._id ) {    // If there is no user logged in, send a notification and "redirect" to login
      
      return push('/home');         // If not logged in, "redirect" user to login

    };

  }, [])

  return (
    <div className="uk-section">
      <div className="uk-container uk-margin-top uk-margin-remove-top@s">
        <h2>¡Gracias por registrarte!</h2>
        <h4>Solo hace falta verificar tu correo electrónico</h4>
        <p>Te hemos enviado un correo electrónico con una liga para activar tu cuenta <br /> ¡Estás a un click de empezar a utilizar la plataforma!</p>
        <h5 className="uk-text-danger">La liga expira en 10 minutos</h5>
        <p>Asegúrate de revisar en tu carpeta de correo no deseado/spam</p>
      </div>
    </div>
  )
}

export default Registration
