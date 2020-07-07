import React, { useEffect, useState } from 'react';
import ImgUploader from '../common/ImgUploader'
import moment from 'moment';                                        // Import momentjs for date formatting
import { Document, Page } from '../../../node_modules/react-pdf/dist/entry.webpack';

const PrescriptionForm = ({ handleSubmit, handleInput, handleFileInput, form, isButtonDisabled, objectHandler, drugs }) => {

  const [ imgPreviewState, setImgPreviewState ] = useState({file: '',imagePreviewUrl: ''})
  const [ showImgPreview, setShowImgPreview ] = useState(false)
  const [ drugFields, setDrugFields ] = useState([]);
  const [ drugQuantity, setDrugQuantity] = useState(0);
  let drug = {'generic_name': null, 'brand_name': null, 'dosage_form': null, 'dose': null, 'directions': null};

  useEffect( () => {

  }, [drugQuantity, showImgPreview])

  const handleDrugInput = (event, index) => {

    switch (event.target.name) {
      case 'name':
        drugs[index].name = event.target.value;
        // setForm( prevState => ({...prevState, ['drugs']: {[name]:value}}) );
        break;
      // case 'generic_name':
      //   drugs[index].generic_name = event.target.value;
      //   // setForm( prevState => ({...prevState, ['drugs']: {[name]:value}}) );
      //   break;
      // case 'brand_name':
      //   drugs[index].brand_name = event.target.value;
      //   // setForm( prevState => ({...prevState, [name]: value}) );
      //   break;
      case 'dosage_form':
        drugs[index].dosage_form = event.target.value;
        // setForm( prevState => ({...prevState, [name]: value}) );
        break;
      case 'dose':
        drugs[index].dose = event.target.value;
        // setForm( prevState => ({...prevState, [name]: value}) );
        break;
      case 'schedule':
        drugs[index].schedule = event.target.value;
        // setForm( prevState => ({...prevState, [name]: value}) );
        break;
      case 'periodicity':
        drugs[index].periodicity = event.target.value;
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

  const handleImageChange = (event) => {
    event.preventDefault();

    let reader = new FileReader();
    let file = event.target.files[0];

    reader.onloadend = () => {
      setImgPreviewState({
        file: file,
        imagePreviewUrl: reader.result
      });
      setShowImgPreview(true)
    }

    reader.readAsDataURL(file)
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
          <input className="uk-input uk-border-pill" type="date" name="date" onChange={handleInput} defaultValue={objectHandler ? moment(objectHandler.date).format('YYYY-MM-DD') : null} required={true}/>
        </div>
        <label className="uk-form-label" htmlFor="doctor">Doctor que atendió:</label>
        <div className="uk-form-controls">
          <input className="uk-input uk-border-pill" type="text" name="doctor" onChange={handleInput} placeholder="Nombre del doctor..." defaultValue={objectHandler ? objectHandler.doctor : null} required={true}/>
        </div>
        <div id="drugs" className="uk-margin">
          { drugFields.map( (drugField, index) => 
            <div className="uk-margin" key={index}>
              <h4>Medicamento {index+1} <span className="uk-margin-left" uk-icon="minus-circle" onClick={event => deleteDrugField(event)}></span></h4>
              <label className="uk-form-label" htmlFor="form-stacked-text">Nombre:</label>
              <div className="uk-form-controls">
                <input className="uk-input uk-border-pill" type="text" name="name" onChange={event => handleDrugInput(event, index)} placeholder="Nombre del medicamento" required={true} />
              </div>
              {/* <label className="uk-form-label" htmlFor="form-stacked-text">Nombre Genérico:</label>
              <div className="uk-form-controls">
                <input className="uk-input uk-border-pill" type="text" name="generic_name" onChange={event => handleDrugInput(event, index)} placeholder="Nombre genérico del medicamento" />
              </div>
              <label className="uk-form-label" htmlFor="form-stacked-text">Nombre Comercial:</label>
              <div className="uk-form-controls">
                <input className="uk-input uk-border-pill" type="text" name="brand_name" onChange={event => handleDrugInput(event, index)} placeholder="Nombre comercial del medicamento" />
              </div> */}
              <label className="uk-form-label" htmlFor="form-stacked-text">Presentación:</label>
              <div className="uk-form-controls">
                <input className="uk-input uk-border-pill" type="text" name="dosage_form" onChange={event => handleDrugInput(event, index)} placeholder="Tabletas, jarabe, etc..." />
              </div>
              
              <h5 className="uk-margin-small">Indicaciones</h5>
              <label className="uk-form-label" htmlFor="form-stacked-text">Dosis:</label>
              <div className="uk-form-controls">
                <input className="uk-input uk-border-pill" type="text" name="dose" onChange={event => handleDrugInput(event, index)} placeholder="500 mg, 10 ml, etc..." />
              </div>
              <label className="uk-form-label" htmlFor="form-stacked-text">Horario:</label>
              <div className="uk-form-controls">
                <input className="uk-input uk-border-pill" type="text" name="schedule" onChange={event => handleDrugInput(event, index)} placeholder="cada 8 horas, cada 12 horas..." />
              </div>
              <label className="uk-form-label" htmlFor="form-stacked-text">Número de días:</label>
              <div className="uk-form-controls">
                <input className="uk-input uk-border-pill" type="text" name="periodicity" onChange={event => handleDrugInput(event, index)} placeholder="3 días, 7 días..." />
              </div>
              <label className="uk-form-label" htmlFor="form-stacked-text">Indicaciones:</label>
              <div className="uk-form-controls">
                <input className="uk-input uk-border-pill" type="text" name="directions" onChange={event => handleDrugInput(event, index)} placeholder="En ayunas, etc..." />
              </div>
            </div> ) }
        </div>
        <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin">
          <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m" onClick={event => addDrugField(event)} >
            + Medicamento
          </button>
        </div>
        
        <div className="uk-flex uk-flex-middle uk-flex-center uk-margin">
          <div className="uk-width-3-5@s uk-flex uk-flex-center uk-flex-middle">
          <p className="uk-text-middle uk-margin-remove">Imagen de la receta:</p>
          <div className="js-upload uk" uk-form-custom="true">
            <input onChange={event => {handleFileInput(event); handleImageChange(event)}} name="image" type="file" accept="image/*,.pdf" multiple />
            <button className="uk-button uk-button-default uk-border-pill" type="button" tabIndex="-1">{ !showImgPreview ? "Seleccionar" : "Cambiar"}</button>
          </div>
          </div>
        </div>
        { showImgPreview ?
            <div className="uk-flex uk-flex-middle uk-flex-center uk-margin">
              <div className="uk-flex uk-flex-center uk-width-3-5@s">
                { imgPreviewState.file.name.split('.').pop() !== "pdf" ?
                    <img src={imgPreviewState.imagePreviewUrl} />
                  : <Document file={{url: imgPreviewState.imagePreviewUrl}} >
                      <Page pageNumber={1} width={300} />
                    </Document> 
                }
              </div>
            </div> 
          : null
        }
        
      </div>
      <div id="target" className="uk-width-1-1 uk-flex uk-flex-center">
        <button type="submit" className="uk-button uk-button-primary uk-border-pill uk-width-2-3 uk-width-1-4@m" disabled={isButtonDisabled} >
          Crear receta
        </button>
      </div>
      
    </form>
  )
}

export default PrescriptionForm