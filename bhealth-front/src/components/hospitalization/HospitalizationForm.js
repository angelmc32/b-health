import React from 'react';
import CatalogSearchbar from '../common/CatalogSearchbar'

const HospitalizationForm = ({ handleSubmit, handleInput, form, isButtonDisabled }) => {
  return (
    <form onSubmit={handleSubmit} className="uk-form-stacked uk-text-left">
      <div className="uk-margin">
      <label className="uk-form-label" htmlFor="form-stacked-text">¿Ingresó usted al quirófano?</label>
        <div className="uk-margin uk-flex uk-flex-around">
          <label><input onChange={handleInput} className="uk-radio" type="radio" name="isSurgery" value={false} />No</label>
          <label><input onChange={handleInput} className="uk-radio" type="radio" name="isSurgery" value={true} />Sí</label>
        </div>
        <label className="uk-form-label" htmlFor="date">Fecha de admisión:</label>
        <div className="uk-form-controls">
          <input className="uk-input" type="date" name="admission_date" onChange={handleInput} />
        </div>
        <label className="uk-form-label" htmlFor="date">Fecha de alta:</label>
        <div className="uk-form-controls">
          <input className="uk-input" type="date" name="discharge_date" onChange={handleInput} />
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Motivo de visita</label>
        <div className="uk-form-controls">
          <input className="uk-input" type="text" name="chief_complaint" onChange={handleInput} placeholder="Dolor, fiebre, etc..." />
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Diagnóstico</label>
        <div className="uk-form-controls">
          <CatalogSearchbar type="diagnosis" form={form} handleFormInput={handleInput}/>
        </div>
        
        <label className="uk-form-label" htmlFor="form-stacked-text">Clínica</label>
        <div className="uk-form-controls">
          <input className="uk-input" type="text" name="facility_name" onChange={handleInput} placeholder="Hospital General de México..." />
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Observaciones y comentarios</label>
        <div className="uk-form-controls">
          <input className="uk-input" type="text" name="description" onChange={handleInput} placeholder="Describir evento" />
        </div>
        
      </div>
      <div className="uk-width-1-1 uk-flex uk-flex-center">
        <button type="submit" className="uk-button uk-button-primary uk-button-small uk-border-pill" disabled={isButtonDisabled} >
          Crear hospitalización
        </button>
      </div>
      
    </form>
  )
}

export default HospitalizationForm