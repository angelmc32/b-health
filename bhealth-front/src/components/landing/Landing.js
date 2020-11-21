import React, { useEffect, useContext } from 'react'
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom';         // Import NavLink for "navigation"
import { AppContext } from '../../AppContext';
import UIkit from 'uikit';
import medAppImg from '../../images/icons/eva-app.svg'
import peaceImg from '../../images/icons/peace-of-mind.svg'
import remindersImg from '../../images/icons/reminders.svg'
import privacyImg from '../../images/icons/data-privacy.svg'

const Landing = () => {

  const { user, setUser, route, setRoute } = useContext(AppContext); // Destructure user state variable
  
  const { push } = useHistory();
  
  useEffect( () => {

    if ( user._id ) {    // If there is no user logged in, send a notification and "redirect" to login
      
      return push('/home');         // If not logged in, "redirect" user to login

    };

  }, [user] );
  
  return (
    <div className="content">

      <div className="uk-section">
          <div className="uk-width-1-1 uk-width-2-3@m uk-height-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle">
            <h1>La <span className="uk-text-secondary uk-text-bold">salud</span> de tu <span className="uk-text-primary uk-text-bold">familia</span>, <br/> en tus manos.</h1>
            <h3 className="uk-margin-small">Tus datos. Tus medicamentos. Tu salud.</h3>
            
            <NavLink to="/registro" className="uk-width-1-1 uk-margin-large">
              <button className="uk-button uk-button-primary uk-button-large uk-width-2-3 uk-width-1-3@s uk-width-1-5@xl uk-border-pill">
                Regístrate Gratis
              </button>
            </NavLink>

            <NavLink to="/login" className="uk-width-1-1 uk-margin">
              <button className="uk-button uk-button-muted uk-button-large uk-width-2-3 uk-border-pill uk-hidden@s">
                Inicia Sesión
              </button>
            </NavLink>
            
            
        </div>
      </div>

      <div className="uk-section uk-flex uk-flex-middle uk-visible@s">

          <div className="uk-grid uk-grid-medium uk-child-width-1-1 uk-child-width-expand@m">

            <div className="uk-margin-top">
              <div className="uk-card uk-flex uk-flex-column uk-flex-center uk-flex-middle">
                <div className="uk-card-media-top uk-width-1-3 uk-flex uk-flex-center uk-flex-middle">
                  <img className="uk-margin-small-top" src={peaceImg} alt="" />
                </div>
                <div className="uk-card-body uk-padding-small">
                  <h3 className="uk-margin-small">Tranquilidad <br/>al alcance de un click</h3>
                  <p className="uk-margin-remove">Más que un Expediente Clínico, creamos una <span className="uk-text-primary uk-text-bold">red de salud</span> que cuida a tu familia. Acceso a médicos y clínicas, desde tu teléfono.</p>
                </div>
              </div>
            </div>
            
            <div className="uk-margin">
              <div className="uk-card uk-flex uk-flex-column uk-flex-center uk-flex-middle">
                <div className="uk-card-media-top uk-width-1-3 uk-flex uk-flex-center uk-flex-middle">
                  <img className="uk-margin-small-top" src={remindersImg} alt="" />
                </div>
                <div className="uk-card-body uk-padding-small">
                  <h3 className="uk-margin-small">Cumple tus objetivos, <br/>mejora tu salud</h3>
                  <p className="uk-margin-remove">Recordatorios para <span className="uk-text-primary uk-text-bold">medicamentos</span> y <span className="uk-text-primary uk-text-bold">signos vitales.</span> <br/>Le recordamos a tus familiares por tí.</p>
                </div>
              </div>
            </div>

            <div className="uk-margin">
              <div className="uk-card uk-flex uk-flex-column uk-flex-center uk-flex-middle">
                <div className="uk-card-media-top uk-width-1-3 uk-flex uk-flex-center uk-flex-middle">
                  <img className="uk-margin-small-top" src={medAppImg} alt="" />
                </div>
                <div className="uk-card-body uk-padding-small">
                  <h3 className="uk-margin-small">Acceso 24/7 al perfil médico<br/>de tu familia</h3>
                  <p className="uk-margin-remove">La información clínica de tu familia, <span className="uk-text-primary uk-text-bold">siempre segura y disponible.</span> Tus recetas, consultas y estudios, en donde estés.</p>
                </div>
              </div>
            </div>

        </div>
      </div>

            <div className="uk-section uk-hidden@s uk-flex uk-flex-center uk-flex-middle">
              <div className="uk-card uk-flex uk-flex-column uk-flex-center uk-flex-middle">
                <div className="uk-card-media-top uk-width-1-3 uk-flex uk-flex-center uk-flex-middle">
                  <img className="uk-margin-small-top" src={peaceImg} alt="" />
                </div>
                <div className="uk-card-body uk-padding-small">
                  <h3 className="uk-margin-small">Tranquilidad <br/>al alcance de un click</h3>
                  <p className="uk-margin-remove">Más que un Expediente Clínico, creamos una <span className="uk-text-primary uk-text-bold">red de salud</span> que cuida a tu familia. Acceso a médicos y clínicas, desde tu teléfono.</p>
                </div>
              </div>
            </div>
            
            <div className="uk-section uk-hidden@s uk-flex uk-flex-center uk-flex-middle">
              <div className="uk-card uk-flex uk-flex-column uk-flex-center uk-flex-middle">
                <div className="uk-card-media-top uk-width-1-3 uk-flex uk-flex-center uk-flex-middle">
                  <img className="uk-margin-small-top" src={remindersImg} alt="" />
                </div>
                <div className="uk-card-body uk-padding-small">
                  <h3 className="uk-margin-small">Cumple tus objetivos, <br/>mejora tu salud</h3>
                  <p className="uk-margin-remove">Recordatorios para <span className="uk-text-primary uk-text-bold">medicamentos</span> y <span className="uk-text-primary uk-text-bold">signos vitales.</span> <br/>Le recordamos a tus familiares por tí.</p>
                </div>
              </div>
            </div>

            <div className="uk-section uk-hidden@s uk-flex uk-flex-center uk-flex-middle">
              <div className="uk-card uk-flex uk-flex-column uk-flex-center uk-flex-middle">
                <div className="uk-card-media-top uk-width-1-3 uk-flex uk-flex-center uk-flex-middle">
                  <img className="uk-margin-small-top" src={medAppImg} alt="" />
                </div>
                <div className="uk-card-body uk-padding-small">
                  <h3 className="uk-margin-small">Acceso 24/7 al perfil médico<br/>de tu familia</h3>
                  <p className="uk-margin-remove">La información clínica de tu familia, <span className="uk-text-primary uk-text-bold">siempre segura y disponible.</span> Tus recetas, consultas y estudios, en donde estés.</p>
                </div>
              </div>
            </div>
      
      {/* <div className="uk-section">
        <div className="uk-container">
          <div className="uk-card uk-flex uk-flex-column uk-flex-center uk-flex-middle">
            <div className="uk-card-media-top uk-width-1-3 uk-flex uk-flex-center uk-flex-middle">
              <img className="uk-margin-small-top" src={peaceImg} alt="" />
            </div>
            <div className="uk-card-body uk-padding-small">
              <h3 className="uk-margin-small">Tranquilidad <br/>al alcance de un click</h3>
              <p className="uk-margin-remove">Más que un Expediente Clínico, creamos una <span className="uk-text-primary uk-text-bold">red de salud</span> que cuida a tu familia. Acceso a médicos y clínicas, desde tu teléfono.</p>
            </div>
          </div>
        </div>
        <div className="uk-container">
          <div className="uk-card uk-flex uk-flex-column uk-flex-center uk-flex-middle">
            <div className="uk-card-media-top uk-width-1-3 uk-flex uk-flex-center uk-flex-middle">
              <img className="uk-margin-small-top" src={remindersImg} alt="" />
            </div>
            <div className="uk-card-body uk-padding-small">
              <h3 className="uk-margin-small">Cumple tus objetivos, <br/>mejora tu salud</h3>
              <p className="uk-margin-remove">Recordatorios para <span className="uk-text-primary uk-text-bold">medicamentos</span> y <span className="uk-text-primary uk-text-bold">signos vitales.</span> <br/>Le recordamos a tus familiares por tí.</p>
            </div>
          </div>
        </div>
        <div className="uk-container">
          <div className="uk-card uk-flex uk-flex-column uk-flex-center uk-flex-middle">
            <div className="uk-card-media-top uk-width-1-3 uk-flex uk-flex-center uk-flex-middle">
              <img className="uk-margin-small-top" src={medAppImg} alt="" />
            </div>
            <div className="uk-card-body uk-padding-small">
              <h3 className="uk-margin-small">Acceso 24/7 al perfil médico<br/>de tu familia</h3>
              <p className="uk-margin-remove">La información clínica de tu familia, <span className="uk-text-primary uk-text-bold">siempre segura y disponible.</span> Tus recetas, consultas y estudios, en donde estés.</p>
            </div>
          </div>
        </div>
      </div> */}
      <div className="uk-section uk-flex uk-flex-center uk-flex-middle">
        <div className="uk-card uk-flex uk-flex-column uk-flex-center uk-flex-middle">
          <div className="uk-card-media-top uk-width-2-5 uk-flex uk-flex-center uk-flex-middle">
            <img className="uk-margin-small-top" src={privacyImg} alt="" />
          </div>
          <div className="uk-card-body uk-padding-small">
            <h3 className="uk-margin-small">Tú estás en control de tu información</h3>
            <p className="uk-margin-remove">Tú decides la información que quieras compartir con familiares o médicos. Tu <span className="uk-text-primary uk-text-bold">privacidad</span> y tu <span className="uk-text-primary uk-text-bold">salud</span> son nuestra prioridad.</p>
            <p className="uk-margin-remove">Todos los datos son encriptados, y solo tú puedes autorizar el acceso a tu información y la de tu familia.</p>
          </div>
        </div>
      </div>
      {/* <div className="uk-section uk-hidden@s">
        <div className="uk-container">
          <div className="uk-text-left">
            <h1>Toma el control <br/> de tu salud</h1>
            <h4>Nadie conoce mejor tu salud <br/>y la de tu familia que tú.</h4>
            <h3>Con Eva, nunca fue más sencillo</h3>
          </div>
        </div>
      </div> */}

    </div>
  )
}

export default Landing
