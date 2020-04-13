import React, { useEffect, useState } from 'react';
import { useHistory, NavLink } from 'react-router-dom';                      // Import useHistory for "redirection"
import moment from 'moment';                                        // Import momentjs for date formatting
import { getOneVitalSignsConsultation } from '../../services/vitalsigns-services'

import 'moment/locale/es'  // without this line it didn't work
moment.locale('es')

const ConsultationInfo = ({ consultation, goToPrescription }) => {

  const [ vitals, setVitals ] = useState({});

  useEffect( () => {

    getOneVitalSignsConsultation(consultation._id)
    .then( res => {

      const { vitalsigns } = res.data;
      setVitals(vitalsigns)
      
    })

  }, [])

  return (
    <div className="uk-container">
      <div className="uk-margin">
        <h4>Motivo de Consulta</h4>
        <p>Síntomas indicados por paciente: {consultation.chief_complaint}</p>
        <p>Fecha de consulta: {moment(consultation.date).locale('es').format('LL')}</p>
        <hr className="uk-divider-icon"></hr>
        <h4>Diagnóstico</h4>
        <p>Diagnóstico: {consultation.diagnosis}</p>
        <p>Doctor: {consultation.doctor}</p>
        <hr className="uk-divider-icon"></hr>
        <h4>Tratamiento</h4>
        { consultation.prescription ? (
            <button className="uk-button uk-button-default uk-border-pill uk-margin" onClick={event => goToPrescription(event, consultation, 'read')} >
              <NavLink to="/recetas">Ver Receta</NavLink>
            </button>
          ) : (
            <button className="uk-button uk-button-default uk-border-pill uk-margin" onClick={event => goToPrescription(event, consultation, 'create')} >
              <NavLink to="/recetas">Agregar Receta</NavLink>
            </button>
          )
        }
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