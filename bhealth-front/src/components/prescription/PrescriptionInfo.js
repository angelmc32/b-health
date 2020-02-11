import React from 'react';
import moment from 'moment';                                        // Import momentjs for date formatting

const PrescriptionInfo = ({ prescription }) => {
  return (
    <div className="uk-container">
      <div className="uk-margin">
        <p>Fecha de receta: {moment(prescription.date).locale('es').format('LL')}</p>
        <p>Doctor: {prescription.doctor}</p>
        { prescription.generic_name.map( (drug, index) =>
            <div className="uk-margin" key="index">
              <p>Nombre Genérico : {prescription.generic_name}</p>
              <p>Nombre Comercial : {prescription.brand_name}</p>
              <p>Presentación : {prescription.dosage_form}</p>
              <p>Dosis : {prescription.dose}</p>
              <p>Indicaciones : {prescription.directions}</p>
            </div>
          )
        }
        <div uk-lightbox="true">
          <a className="uk-button uk-button-default" href={prescription.image} data-alt="Image">Ver Imagen</a>
        </div>
      </div>
    </div>
  )
}

export default PrescriptionInfo