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
          <input className="uk-input uk-border-pill" type="date" name="admission_date" onChange={handleInput} required={true}/>
        </div>
        <label className="uk-form-label" htmlFor="date">Fecha de alta:</label>
        <div className="uk-form-controls">
          <input className="uk-input uk-border-pill" type="date" name="discharge_date" onChange={handleInput} />
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Motivo de visita</label>
        <div className="uk-form-controls">
          <input className="uk-input uk-border-pill" type="text" name="chief_complaint" onChange={handleInput} placeholder="Dolor, fiebre, etc..." required={true}/>
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Diagnóstico</label>
        <div className="uk-form-controls">
          <CatalogSearchbar type="diagnosis" form={form} handleFormInput={handleInput}/>
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Procedimiento</label>
        <div className="uk-form-controls">
          <CatalogSearchbar type="procedure" form={form} handleFormInput={handleInput}/>
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Médico tratante:</label>
        <div className="uk-form-controls">
          <input className="uk-input uk-border-pill" type="text" name="doctor" onChange={handleInput} placeholder="Nombre completo del médico"  required={true}/>
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Especialidad del Médico:</label>
        <div className="uk-form-controls">
          <CatalogSearchbar type="doctor_specialty" form={form} handleFormInput={handleInput}/>
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Clínica</label>
        <div className="uk-form-controls">
          <input className="uk-input uk-border-pill" type="text" name="facility_name" onChange={handleInput} placeholder="Hospital General de México..." required={true} />
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Observaciones y comentarios</label>
        <div className="uk-form-controls">
          <input className="uk-input uk-border-pill" type="text" name="description" onChange={handleInput} placeholder="Describir evento" required={true} />
        </div>
        
      </div>
      <div className="uk-width-1-1 uk-flex uk-flex-center">
        <button type="submit" className="uk-button uk-button-primary uk-border-pill uk-width-2-3 uk-width-1-4@m" disabled={isButtonDisabled} >
          Crear Visita
        </button>
      </div>
      
    </form>
  )
}

export default HospitalizationForm