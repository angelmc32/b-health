import React, { useState } from 'react';
import CatalogSearchbar from '../common/CatalogSearchbar'
import VitalSignsForm from '../vitalsigns/VitalSignsForm'

const ConsultationForm = ({ handleSubmit, handleInput, form, isButtonDisabled }) => {

  const [ showVitalsForm, setShowVitalsForm ] = useState(false);

  const toggleVitalsForm = (event) => {
    event.preventDefault();
    setShowVitalsForm(!showVitalsForm)
  }

  return (
    <form onSubmit={handleSubmit} className="uk-form-stacked uk-text-left">
      <div className="uk-margin">
        <label className="uk-form-label" htmlFor="date">Fecha de consulta</label>
        <div className="uk-form-controls">
          <input className="uk-input" type="date" name="date" onChange={handleInput} />
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Doctor que atendió:</label>
        <div className="uk-form-controls">
          <input className="uk-input" type="text" name="doctor" onChange={handleInput} placeholder="Nombre del doctor..." />
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Motivo de consulta</label>
        <div className="uk-form-controls">
          <input className="uk-input" type="text" name="chief_complaint" onChange={handleInput} placeholder="Dolor, fiebre, etc..." />
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Diagnóstico</label>
        <div className="uk-form-controls">
          <CatalogSearchbar type="drugs" form={form} handleFormInput={handleInput}/>
        </div>
        <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin">
          {
            showVitalsForm ? (
              <button type="submit" className="uk-button uk-button-secondary uk-button-small uk-border-pill uk-width-2-3 uk-width-1-4@m" onClick={toggleVitalsForm} >
                - Signos Vitales
              </button>
            ) : (
              <button type="submit" className="uk-button uk-button-secondary uk-button-small uk-border-pill uk-width-2-3 uk-width-1-4@m" onClick={toggleVitalsForm}  >
                + Signos Vitales
              </button>
            )
          }
          
        </div>
        { showVitalsForm ? (
            <div className="uk-width-1-1 uk-flex">
              <div className="uk-width-1-2">
                <label className="uk-form-label" htmlFor="form-stacked-text">Temperatura</label>
                <div className="uk-form-controls">
                  <input className="uk-input uk-width-4-5" type="number" step=".1" name="temperature" onChange={handleInput} />
                </div>
                <label className="uk-form-label" htmlFor="form-stacked-text">Presión Sistólica</label>
                <div className="uk-form-controls">
                  <input className="uk-input uk-width-4-5" type="number" name="blood_pressure_sys" onChange={handleInput} />
                </div>
                <label className="uk-form-label" htmlFor="form-stacked-text">Glucosa</label>
                <div className="uk-form-controls">
                  <input className="uk-input uk-width-4-5" type="number" name="blood_sugar" onChange={handleInput} />
                </div>
                
              </div>
              <div className="uk-width-1-2">
                <label className="uk-form-label" htmlFor="form-stacked-text">Frecuencia Cardiaca</label>
                <div className="uk-form-controls">
                  <input className="uk-input uk-width-4-5" type="number" name="heart_rate" onChange={handleInput} />
                </div>
                <label className="uk-form-label" htmlFor="form-stacked-text">Presión Diastólica</label>
                <div className="uk-form-controls">
                  <input className="uk-input uk-width-4-5" type="number" name="blood_pressure_dias" onChange={handleInput} />
                </div>
                
                <label className="uk-form-label" htmlFor="form-stacked-text">Peso</label>
                <div className="uk-form-controls">
                  <input className="uk-input uk-width-4-5" type="number" step=".001" name="weight" onChange={handleInput} />
                </div>
                
              </div>
            </div>
          ) : null
        }
      </div>
      <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin">
        <button type="submit" className="uk-button uk-button-secondary uk-button-small uk-border-pill" disabled={isButtonDisabled} >
          Agregar receta
        </button>
      </div>
      <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin">
        <button type="submit" className="uk-button uk-button-primary uk-button-small uk-border-pill" disabled={isButtonDisabled} >
          Crear consulta
        </button>
      </div>
      
    </form>
  )
}

export default ConsultationForm