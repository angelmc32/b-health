import React from 'react';
import DrugSearchbar from '../common/DrugSearchbar'

const DrugForm = ({ handleSubmit, handleInput, form, isButtonDisabled }) => {
  return (
    <form onSubmit={handleSubmit} className="uk-form-stacked uk-text-left">
      <div className="uk-margin">
        <label className="uk-form-label" htmlFor="date">Fecha de inicio del tratamiento:</label>
        <div className="uk-form-controls">
          <input className="uk-input" type="date" name="date_added" onChange={handleInput} />
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Nombre de patente:</label>
        <div className="uk-form-controls">
          <input className="uk-input" type="text" name="brand_name" onChange={handleInput} placeholder="Tempra, Aspirina..." />
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Nombre genérico:</label>
        <div className="uk-form-controls">
          <DrugSearchbar type="drugs" form={form} handleFormInput={handleInput}/>
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Dosis:</label>
        <div className="uk-form-controls">
          <input className="uk-input" type="text" name="dose" onChange={handleInput} placeholder="500 mg, 5 mg, etc..." />
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Presentación:</label>
        <div className="uk-form-controls">
          <input className="uk-input" type="text" name="dosage_form" onChange={handleInput} placeholder="Tableta, jarabe, etc" />
        </div>
        
      </div>
      <div className="uk-width-1-1 uk-flex uk-flex-center">
        <button type="submit" className="uk-button uk-button-primary uk-width-2-3 uk-border-pill" disabled={isButtonDisabled} >
          Agregar
        </button>
      </div>
      
    </form>
  )
}

export default DrugForm