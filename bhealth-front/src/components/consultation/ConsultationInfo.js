import React, { useEffect, useState } from 'react';
import { useHistory, NavLink } from 'react-router-dom';                      // Import useHistory for "redirection"
import moment from 'moment';                                        // Import momentjs for date formatting
import { getOneVitalSignsConsultation } from '../../services/vitalsigns-services'

import 'moment/locale/es'  // without this line it didn't work
moment.locale('es')

const ConsultationInfo = ({ consultation, goToPrescription }) => {

  const [ vitals, setVitals ] = useState({});

  // useEffect( () => {

  //   getOneVitalSignsConsultation(consultation._id)
  //   .then( res => {

  //     const { vitalsigns } = res.data;
  //     setVitals(vitalsigns)
      
  //   })

  // }, [])

  return (
    <div className="uk-container">
      <div className="uk-child-width-1-3@m uk-child-width-1-1 uk-grid-small uk-grid-match uk-margin" uk-grid="true">
        <div>
          <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
            <h4>Información</h4>
            <p>Doctor: {consultation.doctor}</p>
            <p>Especialidad: {consultation.doctor_specialty}</p>
            <p>Fecha de consulta: {moment(consultation.date).locale('es').format('LL')}</p>
            <p>Hora de consulta:  {moment(consultation.date).format('h')}:{moment(consultation.date).format('mm')}  {moment(consultation.date).format('A')}</p>
            
          </div>
        </div>
        <div>
          <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
            <h4>Consulta</h4>
            <p>Síntomas indicados por paciente: {consultation.chief_complaint}</p>
            <p>Diagnóstico: {consultation.diagnosis}</p>
          </div>
        </div>
        <div>
          <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
          <h4>Tratamiento</h4>
        { consultation.treatment ? (
            <button className="uk-button uk-button-default uk-border-pill uk-margin" onClick={event => goToPrescription(event, consultation, 'special')} >
              <NavLink to="/recetas">Ver Receta</NavLink>
            </button>
          ) : (
            <button className="uk-button uk-button-default uk-border-pill uk-margin" onClick={event => goToPrescription(event, consultation, 'create')} >
              <NavLink to="/recetas">Agregar Receta</NavLink>
            </button>
          )
        }
          </div>
        </div>
        
        
        
        {/* <p>Temperatura: {vitals.temperature ? vitals.temperature : 'No registrada'}</p>
        <p>Presión Arterial: {vitals.blood_pressure_sys ? `${vitals.blood_pressure_sys} / ${vitals.blood_pressure_dias}` : 'No registrada'}</p>
        <p>Frecuencia Cardiaca: {vitals.heart_rate ? vitals.heart_rate : 'No registrada'}</p>
        <p>Nivel de Glucosa: {vitals.glucose ? vitals.glucose : 'No registrada'}</p>
        <p>Peso: {vitals.weight ? vitals.weight : 'No registrado'}</p> */}
      </div>
    </div>
  )
}

export default ConsultationInfo