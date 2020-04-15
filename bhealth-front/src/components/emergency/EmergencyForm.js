import React from 'react';
import CatalogSearchbar from '../common/CatalogSearchbar'

const EmergencyForm = ({ handleSubmit, handleInput, form, isButtonDisabled }) => {
  return (
    <form onSubmit={handleSubmit} className="uk-form-stacked uk-text-left">
      <div className="uk-margin">
      <label className="uk-form-label" htmlFor="date">Fecha y hora de urgencia:</label>
                <div className="uk-form-controls uk-flex uk-flex-wrap uk-flex-between uk-width-1-1">
                  <div className="uk-width-1-1 uk-width-1-2@s">
                    <input className="uk-input uk-border-pill" type="date" name="only-date" onChange={handleInput} required={true} />
                  </div>
                  <div className="uk-width-1-1 uk-width-1-3@s uk-flex uk-flex-around">
                    <select name="time-hours" onChange={handleInput} className="uk-select uk-border-pill uk-width-1-3" defaultValue="Hora">
                      <option disabled={true}>Hora</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7</option>
                      <option>8</option>
                      <option>9</option>
                      <option>10</option>
                      <option>11</option>
                      <option>12</option>
                    </select>
                    <select name="time-minutes" onChange={handleInput} className="uk-select uk-border-pill uk-width-1-3" defaultValue="Minutos">
                      <option disabled={true}>Minutos</option>
                      <option>00</option>
                      <option>15</option>
                      <option>30</option>
                      <option>45</option>
                    </select>
                    <select name="time-period" onChange={handleInput} className="uk-select uk-border-pill uk-width-1-4" defaultValue="AM/PM">
                      <option disabled={true}>AM/PM</option>
                      <option>AM</option>
                      <option>PM</option>
                    </select>
                  </div>
                </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Motivo de visita:</label>
        <div className="uk-form-controls">
          <input className="uk-input uk-border-pill" type="text" name="chief_complaint" onChange={handleInput} placeholder="Dolor, fiebre, etc..."  required={true}/>
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Diagnóstico:</label>
        <div className="uk-form-controls">
          <CatalogSearchbar type="diagnosis" form={form} handleFormInput={handleInput}/>
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Médico tratante:</label>
        <div className="uk-form-controls">
          <input className="uk-input uk-border-pill" type="text" name="doctor" onChange={handleInput} placeholder="Nombre completo del médico"  required={true}/>
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Especialidad del Médico:</label>
        <div className="uk-form-controls">
          <CatalogSearchbar type="doctor_specialty" form={form} handleFormInput={handleInput}/>
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Clínica:</label>
        <div className="uk-form-controls">
          <input className="uk-input uk-border-pill" type="text" name="facility_name" onChange={handleInput} placeholder="Hospital General de México..." required={true}/>
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Observaciones y comentarios:</label>
        <div className="uk-form-controls">
          <input className="uk-input uk-border-pill" type="text" name="description" onChange={handleInput} placeholder="Describir evento" required={true}/>
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