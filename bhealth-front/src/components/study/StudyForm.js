import React, { useEffect, useState } from 'react';

const StudyForm = ({ studyType, handleSubmit, handleInput, handleFileInput, form, isButtonDisabled, objectHandler }) => {

  return (
    <form onSubmit={handleSubmit} className="uk-form-stacked uk-text-left">
      <div className="uk-margin">
        <h4>Datos del Estudio de {studyType === 'lab' ? "Laboratorio" : "Rayos X e Imagen"}</h4>
        <label className="uk-form-label" htmlFor="date">Fecha de estudio:</label>
        <div className="uk-form-controls">
          <input className="uk-input uk-border-pill" type="date" name="date" onChange={handleInput} required={true}/>
        </div>
        <label className="uk-form-label" htmlFor="doctor">Doctor que solicitó:</label>
        <div className="uk-form-controls">
          <input className="uk-input uk-border-pill" type="text" name="doctor" onChange={handleInput} placeholder="Nombre del doctor..." />
        </div>
        
        <div className="uk-margin">
          <h4>Estudio</h4>
          <label className="uk-form-label" htmlFor="form-stacked-text">Nombre de Estudio:</label>
          <div className="uk-form-controls">
            { studyType === 'lab' ?
                <select name="study_name" onChange={handleInput} className="uk-select uk-border-pill" defaultValue="" required={true}>
                  <option>Seleccionar</option>
                  <option>Análisis de Química Sanguínea</option>
                  <option>Análisis de Hematología</option>
                  <option>Análisis de Orina</option>
                  <option>Análisis de Microbiología</option>
                  <option>Análisis de Hormonas</option>
                  <option>Análisis de Pruebas Inmunológicas</option>
                  <option>Análisis de Parasitología</option>
                  <option>Análisis de Biología Molecular</option>
                  <option>Otras</option>
                </select>
              : 
                <select name="study_name" onChange={handleInput} className="uk-select uk-border-pill" defaultValue="" required={true}>
                  <option>Seleccionar</option>
                  <option>Radiografías Simples</option>
                  <option>Estudio de Fluoroscopía</option>
                  <option>Ultrasonido</option>
                  <option>Mamografía</option>
                  <option>Tomografía Computarizada (TC)</option>
                  <option>Resonancia Magnética (RM)</option>
                  <option>Estudios de Medicina Nuclear (MN)</option>
                  <option>Tomografía por Emisión de Positrones (PET)</option>
                  <option>Otras</option>
                </select>
            }
          </div>
          <label className="uk-form-label" htmlFor="form-stacked-text">Nombre de Laboratorio:</label>
          <div className="uk-form-controls">
            <input className="uk-input uk-border-pill" type="text" name="facility_name" onChange={handleInput} placeholder="Dónde se realizó los estudios"  required={true}/>
          </div>
          <div className="uk-flex uk-flex-middle uk-margin">
            <label className="uk-form-label" htmlFor="form-stacked-text">Subir resultados:</label>
            <div className="js-upload uk" uk-form-custom="true">
              <input onChange={handleFileInput} name="image" type="file" multiple />
              <button className="uk-button uk-button-default uk-border-pill uk-margin-left" type="button" tabIndex="-1">Seleccionar</button>
            </div>
          </div>
        </div>
        
      </div>
      <div className="uk-width-1-1 uk-flex uk-flex-center">
        <button type="submit" className="uk-button uk-button-primary uk-border-pill uk-width-2-3 uk-width-1-4@m" disabled={isButtonDisabled} >
          Crear Estudio
        </button>
      </div>
      
    </form>
  )
}

export default StudyForm