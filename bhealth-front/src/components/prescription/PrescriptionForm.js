import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';                      // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import useForm from '../../hooks/useForm';                          // Import useForm custom hook
import UIkit from 'uikit';                                          // Import UIkit for notifications
import moment from 'moment';                                        // Import momentjs for date formatting

const PrescriptionForm = ({ handleSubmit, handleInput, handleFileInput, form, isButtonDisabled }) => {

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
        <h4>Datos de la Receta</h4>
        <label className="uk-form-label" htmlFor="date">Fecha de receta:</label>
        <div className="uk-form-controls">
          <input className="uk-input" type="date" name="date" onChange={handleInput} />
        </div>
        <label className="uk-form-label" htmlFor="doctor">Doctor que atendió:</label>
        <div className="uk-form-controls">
          <input className="uk-input" type="text" name="doctor" onChange={handleInput} placeholder="Nombre del doctor..." />
        </div>
        <div className="uk-flex uk-flex-middle uk-flex-around uk-margin">
          <label className="uk-form-label" htmlFor="form-stacked-text">Imagen de la receta:</label>
          <div className="js-upload uk" uk-form-custom="true">
            <input onChange={handleFileInput} name="image" type="file" multiple />
            <button className="uk-button uk-button-default" type="button" tabIndex="-1">Seleccionar</button>
          </div>
        </div>
        
        <div id="drugs" className="uk-margin">
          { drugFields.map( (drugField, index) => 
            <div className="uk-margin" key={index}>
              <h4>Medicamento {index+1} <span className="uk-margin-left" uk-icon="minus-circle" onClick={event => deleteDrugField(event)}></span></h4>
              <label className="uk-form-label" htmlFor="form-stacked-text">Nombre Genérico:</label>
              <div className="uk-form-controls">
                <input className="uk-input" type="text" name="brand_name" onChange={handleInput} placeholder="Nombre genérico del medicamento" />
              </div>
              <label className="uk-form-label" htmlFor="form-stacked-text">Nombre Comercial:</label>
              <div className="uk-form-controls">
                <input className="uk-input" type="text" name="generic_name" onChange={handleInput} placeholder="Nombre comercial del medicamento" />
              </div>
              <label className="uk-form-label" htmlFor="form-stacked-text">Presentación:</label>
              <div className="uk-form-controls">
                <input className="uk-input" type="text" name="dosage_form" onChange={handleInput} placeholder="Tabletas, jarabe, etc..." />
              </div>
              <label className="uk-form-label" htmlFor="form-stacked-text">Dosis:</label>
              <div className="uk-form-controls">
                <input className="uk-input" type="text" name="dose" onChange={handleInput} placeholder="500 mg, 10 ml, etc..." />
              </div>
              <label className="uk-form-label" htmlFor="form-stacked-text">Indicaciones:</label>
              <div className="uk-form-controls">
                <input className="uk-input" type="text" name="directions" onChange={handleInput} placeholder="1 tableta c/8 horas, 1 inyección diaria, etc..." />
              </div>
            </div> ) }
        </div>
        <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin">
          <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m" onClick={event => addDrugField(event)} >
            + Medicamento
          </button>
        </div>
        
        
      </div>
      <div className="uk-width-1-1 uk-flex uk-flex-center">
        <button type="submit" className="uk-button uk-button-primary uk-button-small uk-border-pill" disabled={isButtonDisabled} >
          Crear receta
        </button>
      </div>
      
    </form>
  )
}

export default PrescriptionForm