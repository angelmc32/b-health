import React, { useEffect, useContext, useState } from 'react';           // Import React and useContext hook
import { useHistory } from 'react-router-dom';                  // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                  // Import AppContext to use created context
import UIkit from 'uikit';                                      // Import UIkit for notifications
import moment from 'moment';                                    // Import momentjs for date formatting

import { editProfile } from '../../services/profile-services'

const Consent = () => {

  const { user, setUser, route, setRoute } = useContext(AppContext); // Destructure user state variable
  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user

  const giveConsent = () => {

    const formData = new FormData();      // Declare formData as new instance of FormData class
    
    formData.append('gaveConsent', true);

    // Call edit service with formData as parameter, which includes form data for user profile information
    editProfile(formData)
    .then( res => {

      const { user } = res.data   // Destructure updated user document from response
      
      setUser(user);              // Modify user state variable with updated information
      setRoute('none');
      
      if( user.isProfileComplete ) 
        push('/home')
      else
        push('/perfil')

      // Send UIkit success notification
      UIkit.notification({
        message: `<span uk-icon='close'></span> '¡Ahora puedes usar la aplicación!'`,
        pos: 'bottom-center',
        status: 'success'
      });

    })
    .catch( error => {

      console.log(error);

      // Send UIkit error notification
      UIkit.notification({
        message: `<span uk-icon='close'></span> ${error}`,
        pos: 'bottom-center',
        status: 'danger'
      });

    });

  }
  return (
    <div className="content">
      <div className="uk-section">
        <div className="uk-container uk-padding-large">
          <h2>Consentimiento Informado</h2>
          <h4>A fin de dar cumplimiento a la Ley de Protección de Datos Personales se dispone establecer la siguiente
          CLÁUSULA para el <br/>Consentimiento expreso de CESIÓN DE DATOS PERSONALES.</h4>
          <p>
          El USUARIO o su TUTOR LEGAL, queda informado y consciente de forma expresa que los datos personales
          que facilite pasan a formar parte de un fichero (Base de Datos) responsabilidad de la Empresa con la finalidad
          de llevar a cabo los distintos servicios que forman parte de su labor aquí expuestos. Aquí se incluyen datos
          relativos a su persona y familia de carácter personal y de salud. Y autorizando la sesión de sus datos a otras
          personas o entidades relacionadas, tales como entidades aseguradoras y prestadoras de servicios que
          integrarían la oferta de servicios complementarios que puedan interesarles para su adquisición.
          </p>
          <p>
          El USUARIO o su TUTOR LEGAL queda informado de que podrá ejercer los derechos de acceso, rectificación,
          oposición y cancelación dirigiéndose a la dirección de la Empresa en el domicilio social..
          </p>
          <p>Doy consentimiento a Registro de Datos Personales; Recibir comunicación vía Correo Electrónico,
          WhatsApp, y a través de publicidad selectiva.
          </p>
          <button className="uk-button uk-button-primary uk-button uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={giveConsent} >
            Acepto
          </button>
        </div>
      </div>
      
    </div>
  )
}

export default Consent