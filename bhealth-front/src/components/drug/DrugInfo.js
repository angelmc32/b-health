import React from 'react';
import moment from 'moment';                                        // Import momentjs for date formatting

const PrescriptionInfo = ({ drug }) => {
  return (
    <div className="uk-container">
      <div className="uk-margin">
        <p>Fecha de inicio de tratamiento: {moment(drug.date).locale('es').format('LL')}</p>
        <p>Nombre Genérico : {drug.generic_name}</p>
        <p>Nombre Comercial : {drug.brand_name}</p>
        <p>Presentación : {drug.dosage_form}</p>
        <p>Dosis : {drug.dose}</p>
      </div>
      <div className="uk-flex uk-flex-column uk-flex-middle">
        <div className="uk-button uk-button-primary uk-width-2-3 uk-width-1-4@m uk-border-pill uk-margin">
          Terminar
        </div>
        <div className="uk-button uk-button-danger uk-width-2-3 uk-width-1-4@m uk-border-pill">
          Eliminar
        </div>
      </div>
    </div>
  )
}

export default PrescriptionInfo