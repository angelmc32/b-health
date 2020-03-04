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
    <div className="content">
      {
        !showVitalsForm ? (
          <div className="uk-section">
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
            </form>
          </div>
        ) : (
          <div className="uk-section">
            <h2>Registro de Signos Vitales</h2>
            <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={toggleVitalsForm} >
              Regresar
            </button>
            <VitalSignsForm type="consultation" setShowVitalsForm={setShowVitalsForm} />
          </div>
        )
      }
    
    </div>
    
  )
}

export default ConsultationForm