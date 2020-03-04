import React from 'react';
import moment from 'moment';                                        // Import momentjs for date formatting

const HospitalizationInfo = ({ hospitalization }) => {
  return (
    <div className="uk-container">
      <div className="uk-margin">
        <p>Fecha de admisión: {moment(hospitalization.admission_date).locale('es').format('LL')}</p>
        <p>Motivo de visita: {hospitalization.chief_complaint}</p>
        <p>Diagnóstico: {hospitalization.diagnosis}</p>
        <p>Clínica: {hospitalization.facility_name}</p>
        <p>Observaciones y comentarios: {hospitalization.description}</p>
      </div>
    </div>
  )
}

export default HospitalizationInfo