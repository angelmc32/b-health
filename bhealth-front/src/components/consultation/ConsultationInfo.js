import React from 'react';
import moment from 'moment';                                        // Import momentjs for date formatting

const ConsultationInfo = ({ consultation }) => {
  return (
    <div className="uk-container">
      <div className="uk-margin">
        <p>Fecha de consulta: {moment(consultation.date).locale('es').format('LL')}</p>
        <p>Doctor: {consultation.doctor}</p>
        <p>Motivo de consulta: {consultation.chief_complaint}</p>
        <p>Sistema afectado: {consultation.systems_chief_complaint[0]}</p>
        <p>Diagnóstico: {consultation.diagnosis}</p>
        <p>Temperatura: {consultation.temperature}</p>
        <p>Presión Arterial: {consultation.blood_pressure_sys} / {consultation.blood_pressure_dias}</p>
        <p>Frecuencia Cardiaca: {consultation.heart_rate}</p>
        <p>Nivel de Glucosa: {consultation.glucose}</p>
        <p>Peso: {consultation.weight}</p>
      </div>
    </div>
  )
}

export default ConsultationInfo