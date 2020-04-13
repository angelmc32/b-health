import React from 'react';
import CatalogSearchbar from '../common/CatalogSearchbar'

const EmergencyForm = ({ handleSubmit, handleInput, form, isButtonDisabled }) => {
  return (
    <form onSubmit={handleSubmit} className="uk-form-stacked uk-text-left">
      <div className="uk-margin">
        <label className="uk-form-label" htmlFor="date">Fecha de urgencia:</label>
        <div className="uk-form-controls">
          <input className="uk-input uk-border-pill" type="date" name="date" onChange={handleInput} />
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Motivo de visita</label>
        <div className="uk-form-controls">
          <input className="uk-input uk-border-pill" type="text" name="chief_complaint" onChange={handleInput} placeholder="Dolor, fiebre, etc..." />
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Diagnóstico</label>
        <div className="uk-form-controls">
          <CatalogSearchbar type="diagnosis" form={form} handleFormInput={handleInput}/>
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Clínica</label>
        <div className="uk-form-controls">
          <input className="uk-input uk-border-pill" type="text" name="facility_name" onChange={handleInput} placeholder="Hospital General de México..." />
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Observaciones y comentarios</label>
        <div className="uk-form-controls">
          <input className="uk-input uk-border-pill" type="text" name="description" onChange={handleInput} placeholder="Describir evento" />
        </div>
        
      </div>
      <div className="uk-width-1-1 uk-flex uk-flex-center">
        <button type="submit" className="uk-button uk-button-primary uk-border-pill uk-width-2-3 uk-width-1-4@m" disabled={isButtonDisabled} >
          Crear Urgencia
        </button>
      </div>
      
    </form>
  )
}

export default EmergencyForm