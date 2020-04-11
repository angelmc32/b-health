import React, { useState, useContext } from 'react'
import { AppContext } from '../AppContext'
import moment from 'moment';                                    // Import momentjs for date formatting

const Questionnaire = ({title = 'Cuestionario', questionnaire = [1,2,3]}) => {

  const { user, setUser, route, setRoute } = useContext(AppContext); // Destructure user state variable

  const handleInput = (event) => {
    console.log(event)
  }

  const questionnaire_var = [
    <div>
      <label className="uk-form-label" htmlFor="date">Nombres:</label>
      <div className="uk-form-controls">
        <input className="uk-input uk-border-pill" type="text" name="first_name" onChange={handleInput} placeholder={user.first_name} />
      </div>
      <label className="uk-form-label" htmlFor="form-stacked-text">Apellido paterno:</label>
      <div className="uk-form-controls">
        <input className="uk-input uk-border-pill" type="text" name="last_name1" onChange={handleInput} placeholder={user.last_name1} />
      </div>
      <label className="uk-form-label" htmlFor="form-stacked-text">Apellido materno:</label>
      <div className="uk-form-controls">
        <input className="uk-input uk-border-pill" type="text" name="last_name2" onChange={handleInput} placeholder={user.last_name2} />
      </div>
      <label className="uk-form-label">Fecha de nacimiento: {moment.utc(user.date_of_birth).format('LL')}</label>
      <div className="uk-inline">
        <input onChange={handleInput} name="date_of_birth" className="uk-input uk-border-pill" type="date" />
      </div>
      <label className="uk-form-label" htmlFor="form-stacked-text">Género</label>
      <div className="uk-margin uk-flex uk-flex-around">
        <label><input onChange={handleInput} className="uk-radio" type="radio" name="gender" value="F" />  Mujer</label>
        <label><input onChange={handleInput} className="uk-radio" type="radio" name="gender" value="M" />  Hombre</label>
        <label><input onChange={handleInput} className="uk-radio" type="radio" name="gender" value="N" />  No binario</label>
      </div>
    </div>
    ,
    <div>
      <label className="uk-form-label">CURP:</label>
      <div className="uk-form-controls">
        <input onChange={handleInput} name="curp" className="uk-input uk-border-pill" type="text" placeholder={user.curp} />
      </div>
      <label className="uk-form-label">Código Postal:</label>
      <div className="uk-form-controls">
        <input onChange={handleInput} name="zip_code" className="uk-input uk-border-pill" type="number" placeholder={user.zip_code ? user.zip_code : 5544332211} />
      </div>
      <label className="uk-form-label">Estado Civil:</label>
      <div className="uk-form-controls">
        <select className="uk-select uk-border-pill">
          <option>Soltero</option>
          <option>Casado</option>
          <option>Viudo</option>
          <option>Divorciado</option>
        </select>
      </div>
      <label className="uk-form-label">Grado Máximo de Estudios:</label>
      <div className="uk-form-controls">
        <select className="uk-select uk-border-pill">
          <option>Primaria</option>
          <option>Secundaria</option>
          <option>Preparatoria</option>
          <option>Licenciatura</option>
          <option>Posgrado</option>
        </select>
      </div>
    </div>,
    <div>
      <label className="uk-form-label">Teléfono/Whatsapp:</label>
      <div className="uk-form-controls">
        <input onChange={handleInput} name="phone_numnber" className="uk-input uk-border-pill" type="number" placeholder={user.phone_number ? user.phone_number : 5544332211} />
      </div>
      <label className="uk-form-label">Correo electrónico:</label>
      <div className="uk-form-controls">
        <input onChange={handleInput} name="email" className="uk-input uk-border-pill" type="email" placeholder={user.email} />
      </div>
    </div>
  ]

  const [ currentStep, setCurrentStep ] = useState(0);

  const changeStepState = (index) => {
    setCurrentStep(index)
  }

  return (
    <div className="content">
      <div className="uk-section">
        <div className="uk-container">
          <h2>{title}</h2>
          <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" >
            Regresar
          </button>
          <div className="uk-flex uk-flex-center">
            <ul className="uk-dotnav">
              {
                questionnaire_var.map( (section, index) => 
                  <li onClick={() => changeStepState(index)} key={index} className={ index === currentStep ? "uk-active" : null }><a href="#">{index}</a></li>
                )
              }
            </ul>
          </div>
          <form className="uk-form-stacked uk-text-left uk-margin">
            {
              questionnaire_var.map( (section, index) => 
                <div key={index} className={ index === currentStep ? "uk-visible uk-margin" : "uk-hidden" }>
                  { section }
                </div>
              )
            }
            <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin-large">
              <button type="submit" className="uk-button uk-button-primary uk-border-pill uk-width-3-5 uk-width-1-4@s" >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Questionnaire