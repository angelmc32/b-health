import React from 'react';
import moment from 'moment';                                        // Import momentjs for date formatting

const EmergencyInfo = ({ emergency }) => {
  return (
    <div className="uk-container">
      <div className="uk-margin">
        <p>Fecha de visita: {moment(emergency.date).locale('es').format('LL')}</p>
        <p>Motivo de visita: {emergency.chief_complaint}</p>
        <p>Diagnóstico: {emergency.diagnosis}</p>
        <p>Clínica: {emergency.facility_name}</p>
        <p>Observaciones y comentarios: {emergency.description}</p>
      </div>
    </div>
  )
}

export default EmergencyInfo