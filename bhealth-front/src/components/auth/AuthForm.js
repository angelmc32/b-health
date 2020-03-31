import React from 'react';                        // Import React
import { NavLink } from 'react-router-dom';       // Import NavLink for "navigation"

// Declare AuthForm functional component, receives action variable for conditional rendering,
// email, password and confirm_password variables from form state variable, and submit and handleChange functions
const AuthForm = ( { submit, action, email = '', password = '', confirm_password = '', handleChange } ) => (


  <div className="uk-margin-top uk-margin-remove-top@s">

    <div className="uk-margin">

      <h2>{action === "signup" ? "Registro" : "Inicia Sesión"}</h2>
  
      { action === "signup" ? (
        <p>¿Ya tienes cuenta? 
          <NavLink to="/login" className="uk-margin-small-left">
            Accede aquí
          </NavLink>
        </p>
        ) : (
        <p>¿Primera vez? 
          <NavLink to="/signup" className="uk-margin-small-left">
            Regístrate aquí
          </NavLink>
        </p>
        )
      }
    
    </div>

      <form className="uk-form-stacked uk-margin" onSubmit={submit}>
        
        <div className="uk-margin">
          <label className="uk-form-label">Correo Electrónico:</label>
          <div className="uk-inline">
            <span className="uk-form-icon" uk-icon="icon: user"></span>
            <input onChange={handleChange} name="email" value={email} className="uk-input uk-border-pill" type="email" />
          </div>
        </div>
        <div className="uk-margin">
          <label className="uk-form-label">Contraseña:</label>
          <div className="uk-inline">
            <span className="uk-form-icon" uk-icon="icon: lock"></span>
            <input
              onChange={handleChange}
              name="password"
              value={password}
              className="uk-input uk-border-pill"
              type="password"
            />
          </div>
        </div>
          { action === "signup" ? (
          <div className="uk-margin">
            <label className="uk-form-label">Confirma tu contraseña:</label>
            <div className="uk-inline">
              <span className="uk-form-icon" uk-icon="icon: lock"></span>
              <input
                onChange={handleChange}
                name="confirm_password"
                value={confirm_password}
                className="uk-input uk-border-pill"
                type="password"
              />
            </div>
          </div>
          ) : null }

        

        <button className="uk-button uk-button-primary uk-border-pill uk-margin" type="submit">
          {action === "signup" ? "Registrar" : "Entrar"}
        </button>

      </form>
  </div>
);

export default AuthForm;