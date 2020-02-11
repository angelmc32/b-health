import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';                      // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import useForm from '../../hooks/useForm';                          // Import useForm custom hook
import UIkit from 'uikit';                                          // Import UIkit for notifications
import moment from 'moment';                                        // Import momentjs for date formatting

const ConsultationForm = ({ handleSubmit, handleInput, form, isButtonDisabled }) => {
  return (
    <form onSubmit={handleSubmit} className="uk-form-stacked uk-text-left">
      <div className="uk-margin">
        <label className="uk-form-label" htmlFor="date">Fecha de consulta</label>
        <div className="uk-form-controls">
          <input className="uk-input" type="date" name="date" onChange={handleInput} />
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Doctor que atendió:</label>
        <div className="uk-form-controls">
          <input className="uk-input" type="text" name="doctor" onChange={handleInput} placeholder="Nombre del doctor..." />
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Motivo de consulta</label>
        <div className="uk-form-controls">
          <input className="uk-input" type="text" name="chief_complaint" onChange={handleInput} placeholder="Dolor, fiebre, etc..." />
        </div>
        <label className="uk-form-label">Sistema afectado:</label>
        <div className="uk-form-controls" >
          <select className="uk-select uk-form-width-large" name="systems_chief_complaint" onChange={handleInput} >
            <option value="Otros">Otros</option>
            <option value="Cardiovascular">Cardiovascular</option>
            <option value="Dermatológico">Dermatológico</option>
            <option value="Dolor">Dolor</option>
            <option value="Endócrino">Endócrino</option>
            <option value="Gastrointestinal">Gastrointestinal</option>
            <option value="Génito-Urinario">Génito-Urinario</option>
            <option value="Músculo-esquelético">Músculo-esquelético</option>
            <option value="Órganos de los Sentidos">Órganos de los Sentidos</option>
            <option value="Psiquiátrico">Psiquiátrico</option>
            <option value="Respiratorio">Respiratorio</option>
            <option value="Sistema Hemato-Linfático">Sistema Hemato-Linfático</option>
            <option value="Sistema Inmunológico">Sistema Inmunológico</option>
            <option value="Sistema Nervioso">Sistema Nervioso</option>
            <option value="Síntomas Generales">Síntomas Generales</option>
          </select>
        </div>
        <label className="uk-form-label" htmlFor="form-stacked-text">Diagnóstico</label>
        <div className="uk-form-controls">
          <input className="uk-input" type="text" name="diagnosis" onChange={handleInput} placeholder="Introduce para buscar..." />
        </div>
        <div className="uk-width-1-1 uk-flex">
          <div className="uk-width-1-2">
            <label className="uk-form-label" htmlFor="form-stacked-text">Temperatura</label>
            <div className="uk-form-controls">
              <input className="uk-input uk-width-4-5" type="number" step=".1" name="temperature" onChange={handleInput} />
            </div>
            <label className="uk-form-label" htmlFor="form-stacked-text">Presión Sistólica</label>
            <div className="uk-form-controls">
              <input className="uk-input uk-width-4-5" type="number" name="blood_pressure_sys" onChange={handleInput} />
            </div>
            <label className="uk-form-label" htmlFor="form-stacked-text">Glucosa</label>
            <div className="uk-form-controls">
              <input className="uk-input uk-width-4-5" type="number" name="blood_sugar" onChange={handleInput} />
            </div>
            
          </div>
          <div className="uk-width-1-2">
            <label className="uk-form-label" htmlFor="form-stacked-text">Frecuencia Cardiaca</label>
            <div className="uk-form-controls">
              <input className="uk-input uk-width-4-5" type="number" name="heart_rate" onChange={handleInput} />
            </div>
            <label className="uk-form-label" htmlFor="form-stacked-text">Presión Diastólica</label>
            <div className="uk-form-controls">
              <input className="uk-input uk-width-4-5" type="number" name="blood_pressure_dias" onChange={handleInput} />
            </div>
            
            <label className="uk-form-label" htmlFor="form-stacked-text">Peso</label>
            <div className="uk-form-controls">
              <input className="uk-input uk-width-4-5" type="number" step=".001" name="weight" onChange={handleInput} />
            </div>
            
          </div>
        </div>
        
      </div>
      <div className="uk-width-1-1 uk-flex uk-flex-center">
        <button type="submit" className="uk-button uk-button-primary uk-button-small uk-border-pill" disabled={isButtonDisabled} >
          Crear consulta
        </button>
      </div>
      
    </form>
  )
}

export default ConsultationForm