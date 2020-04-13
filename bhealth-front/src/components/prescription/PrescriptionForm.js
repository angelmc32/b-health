import React, { useEffect, useState } from 'react';
import moment from 'moment';                                        // Import momentjs for date formatting

const PrescriptionForm = ({ handleSubmit, handleInput, handleFileInput, form, isButtonDisabled, objectHandler, drugs }) => {

  const [ drugFields, setDrugFields ] = useState([]);
  const [ drugQuantity, setDrugQuantity] = useState(0);
  let drug = {'generic_name': null, 'brand_name': null, 'dosage_form': null, 'dose': null, 'directions': null};

  useEffect( () => {

    console.log(objectHandler)
    // console.log(moment(objectHandler.date).format('YYYY-MM-DD') )

  }, [drugQuantity])

  const handleDrugInput = (event, index) => {

    switch (event.target.name) {
      case 'generic_name':
        drugs[index].generic_name = event.target.value;
        // setForm( prevState => ({...prevState, ['drugs']: {[name]:value}}) );
        break;
      case 'brand_name':
        drugs[index].brand_name = event.target.value;
        // setForm( prevState => ({...prevState, [name]: value}) );
        break;
      case 'dosage_form':
        drugs[index].dosage_form = event.target.value;
        // setForm( prevState => ({...prevState, [name]: value}) );
        break;
      case 'dose':
        drugs[index].dose = event.target.value;
        // setForm( prevState => ({...prevState, [name]: value}) );
        break;
      case 'directions':
        drugs[index].directions = event.target.value;
        // setForm( prevState => ({...prevState, [name]: value}) );
        break;
    }

  }
  
  const addDrugField = (event) => {

    event.preventDefault();
    drugFields.push(1)
    drugs.push(drug);

    setDrugFields(drugFields);
    setDrugQuantity(drugQuantity+1)

    return null;

  }

  const deleteDrugField = (event) => {

    event.preventDefault();
    drugFields.pop()
    drugs.pop();

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
          <input className="uk-input uk-border-pill" type="date" name="date" onChange={handleInput} defaultValue={objectHandler ? moment(objectHandler.date).format('YYYY-MM-DD') : null}/>
        </div>
        <label className="uk-form-label" htmlFor="doctor">Doctor que atendió:</label>
        <div className="uk-form-controls">
          <input className="uk-input uk-border-pill" type="text" name="doctor" onChange={handleInput} placeholder="Nombre del doctor..." defaultValue={objectHandler ? objectHandler.doctor : null}/>
        </div>
        <div className="uk-flex uk-flex-middle uk-flex-around uk-margin">
          <label className="uk-form-label" htmlFor="form-stacked-text">Imagen de la receta:</label>
          <div className="js-upload uk" uk-form-custom="true">
            <input onChange={handleFileInput} name="image" type="file" multiple />
            <button className="uk-button uk-button-default uk-border-pill" type="button" tabIndex="-1">Seleccionar</button>
          </div>
        </div>
        
        <div id="drugs" className="uk-margin">
          { drugFields.map( (drugField, index) => 
            <div className="uk-margin" key={index}>
              <h4>Medicamento {index+1} <span className="uk-margin-left" uk-icon="minus-circle" onClick={event => deleteDrugField(event)}></span></h4>
              <label className="uk-form-label" htmlFor="form-stacked-text">Nombre Genérico:</label>
              <div className="uk-form-controls">
                <input className="uk-input uk-border-pill" type="text" name="generic_name" onChange={event => handleDrugInput(event, index)} placeholder="Nombre genérico del medicamento" />
              </div>
              <label className="uk-form-label" htmlFor="form-stacked-text">Nombre Comercial:</label>
              <div className="uk-form-controls">
                <input className="uk-input uk-border-pill" type="text" name="brand_name" onChange={event => handleDrugInput(event, index)} placeholder="Nombre comercial del medicamento" />
              </div>
              <label className="uk-form-label" htmlFor="form-stacked-text">Presentación:</label>
              <div className="uk-form-controls">
                <input className="uk-input uk-border-pill" type="text" name="dosage_form" onChange={event => handleDrugInput(event, index)} placeholder="Tabletas, jarabe, etc..." />
              </div>
              <label className="uk-form-label" htmlFor="form-stacked-text">Dosis:</label>
              <div className="uk-form-controls">
                <input className="uk-input uk-border-pill" type="text" name="dose" onChange={event => handleDrugInput(event, index)} placeholder="500 mg, 10 ml, etc..." />
              </div>
              <label className="uk-form-label" htmlFor="form-stacked-text">Indicaciones:</label>
              <div className="uk-form-controls">
                <input className="uk-input uk-border-pill" type="text" name="directions" onChange={event => handleDrugInput(event, index)} placeholder="1 tableta c/8 horas, 1 inyección diaria, etc..." />
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
        <button type="submit" className="uk-button uk-button-primary uk-border-pill uk-width-2-3 uk-width-1-4@m" disabled={isButtonDisabled} >
          Crear receta
        </button>
      </div>
      
    </form>
  )
}

export default PrescriptionForm