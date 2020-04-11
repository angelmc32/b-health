import React from 'react'
import { Link, NavLink } from 'react-router-dom';         // Import NavLink for "navigation"
import placeholderImg from '../../images/icons/diamond-icon.svg'

const Landing = () => {
  
  return (
    <div className="content">

      <div className="uk-section">
        <div className="uk-container uk-height-1-1">
          <div className="uk-width-1-1 uk-width-2-3@m uk-height-1-1 uk-flex uk-flex-column uk-flex-center uk-flex-middle">
            <h1>La <span className="uk-text-secondary uk-text-bold">salud</span> de tu <span className="uk-text-primary uk-text-bold">familia</span>, <br/> en tus manos.</h1>
            <h3 className="uk-margin-remove">Tus datos. Tus medicamentos. Tu salud.</h3>
            <Link to="/registro" className="uk-width-1-1 uk-margin-large uk-hidden@s">
              <button className="uk-button uk-button-primary uk-width-2-3 uk-border-pill">
                Regístrate Gratis
              </button>
            </Link>
            <Link to="/login" className="uk-width-1-1 uk-hidden@s">
              <button className="uk-button uk-button-muted uk-width-2-3 uk-border-pill">
                Inicia Sesión
              </button>
            </Link>
            <Link to="/registro" className="uk-width-1-1 uk-margin-large">
              <button className="uk-visible@s uk-button uk-button-primary uk-button-large uk-border-pill">
                Regístrate Gratis
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="uk-section">
        <div className="uk-container">
          <div className="uk-grid uk-child-width-1-1 uk-child-width-1-3@m">
            <div>
              <div className="uk-card uk-card-default uk-flex uk-flex-column uk-flex-center uk-flex-middle">
                <div className="uk-card-media-top uk-width-1-5 uk-flex uk-flex-center uk-flex-middle">
                  <img className="uk-margin-small-top" src={placeholderImg} alt="" />
                </div>
                <div className="uk-card-body uk-padding-small">
                  <h3 className="uk-margin-remove">Tu Expediente Clínico</h3>
                  <p className="uk-margin-remove">La información clínica de tu <span className="uk-text-primary uk-text-bold">familia</span>, siempre segura y disponible.</p>
                </div>
              </div>
            </div>
            <div>
              <div className="uk-card uk-card-default uk-flex uk-flex-column uk-flex-center uk-flex-middle">
                <div className="uk-card-media-top uk-width-1-5 uk-flex uk-flex-center uk-flex-middle">
                  <img className="uk-margin-small-top" src={placeholderImg} alt="" />
                </div>
                <div className="uk-card-body uk-padding-small">
                  <h3 className="uk-margin-remove">Monitorea tu salud</h3>
                  <p className="uk-margin-remove">Recordatorios para tus <span className="uk-text-primary uk-text-bold">medicamentos</span> y <span className="uk-text-primary uk-text-bold">signos vitales</span></p>
                </div>
              </div>
            </div>
            <div>
              <div className="uk-card uk-card-default uk-flex uk-flex-column uk-flex-center uk-flex-middle">
                <div className="uk-card-media-top uk-width-1-5 uk-flex uk-flex-center uk-flex-middle">
                  <img className="uk-margin-small-top" src={placeholderImg} alt="" />
                </div>
                <div className="uk-card-body uk-padding-small">
                  <h3 className="uk-margin-remove">Controla el acceso</h3>
                  <p className="uk-margin-remove">Tú decides la información que quieras compartir con <span className="uk-text-primary uk-text-bold">familiares o médicos</span></p>
                </div>
              </div>
            </div>
          </div>
          {/* 
          <div className="uk-visible@s uk-flex uk-width-1-1 uk-child-width-1-3">
            <div>Test</div>
            <div>Test</div>
            <div>Test</div>
          </div> */}
        </div>
      </div>

      <div className="uk-section uk-hidden@s">
        <div className="uk-container">
          <div className="uk-text-left">
            <h1>Toma el control <br/> de tu salud</h1>
            <h4>Nadie conoce mejor tu salud <br/>y la de tu familia que tú.</h4>
            <h3>Con B-Health, nunca fue más sencillo</h3>
          </div>
          
        </div>
        {/* <div className="uk-flex uk-flex-column uk-width-1-1 uk-child-width-1-1">
          <div>Test</div>
          <div>Test</div>
          <div>Test</div>
        </div> */}
      </div>

    </div>
  )
}

export default Landing
