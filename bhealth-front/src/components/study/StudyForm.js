import React, { useEffect, useState } from 'react';

const StudyForm = ({ handleSubmit, handleInput, handleFileInput, form, isButtonDisabled, objectHandler }) => {

  const [ drugFields, setDrugFields ] = useState([]);
  const [ drugQuantity, setDrugQuantity] = useState(0);

  useEffect( () => {

  }, [drugQuantity])
  
  const addDrugField = (event) => {

    event.preventDefault();
    drugFields.push(1)

    setDrugFields(drugFields);
    setDrugQuantity(drugQuantity+1)

    return null;

  }

  const deleteDrugField = (event) => {

    event.preventDefault();
    drugFields.pop()

    setDrugFields(drugFields);
    setDrugQuantity(drugQuantity-1)

    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="uk-form-stacked uk-text-left">
      <div className="uk-margin">
        <h4>Datos del Estudio</h4>
        <label className="uk-form-label" htmlFor="date">Fecha de estudio:</label>
        <div className="uk-form-controls">
          <input className="uk-input" type="date" name="date" onChange={handleInput} />
        </div>
        <label className="uk-form-label" htmlFor="doctor">Doctor que solicitó:</label>
        <div className="uk-form-controls">
          <input className="uk-input" type="text" name="doctor" onChange={handleInput} placeholder="Nombre del doctor..." />
        </div>
        
        <div className="uk-margin">
          <h4>Estudio</h4>
          <label className="uk-form-label" htmlFor="form-stacked-text">Nombre de Estudio:</label>
          <div className="uk-form-controls">
            <input className="uk-input" type="text" name="study_name" onChange={handleInput} placeholder="Nombre del estudio..." />
          </div>
          <label className="uk-form-label" htmlFor="form-stacked-text">Nombre de Laboratorio:</label>
          <div className="uk-form-controls">
            <input className="uk-input" type="text" name="facility_name" onChange={handleInput} placeholder="Dónde se realizó los estudios" />
          </div>
          <div className="uk-flex uk-flex-middle uk-flex-around uk-margin">
            <label className="uk-form-label" htmlFor="form-stacked-text">Imagen del Estudio:</label>
            <div className="js-upload uk" uk-form-custom="true">
              <input onChange={handleFileInput} name="image" type="file" multiple />
              <button className="uk-button uk-button-default" type="button" tabIndex="-1">Seleccionar</button>
            </div>
          </div>
        </div>
        
      </div>
      <div className="uk-width-1-1 uk-flex uk-flex-center">
        <button type="submit" className="uk-button uk-button-primary uk-button-small uk-border-pill" disabled={isButtonDisabled} >
          Crear Estudio
        </button>
      </div>
      
    </form>
  )
}

export default StudyForm