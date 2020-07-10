import React from 'react';
import moment from 'moment';                                        // Import momentjs for date formatting

const PrescriptionInfo = ({ prescription }) => {
  return (
    <div className="uk-container">
      <div className="uk-margin uk-flex uk-flex-column uk-flex-middle">
        <p className="uk-margin-remove">Fecha de receta: {moment(prescription.date).locale('es').format('LL')}</p>
        <p className="uk-margin-remove">Doctor: {prescription.doctor}</p>
        { prescription.image === 'Sin imagen registrada' ? null :
            <div className="uk-margin" uk-lightbox="true">
              <a className="uk-button uk-button-default" href={prescription.image} data-alt="Image">Ver Imagen</a>
            </div>
        }
        <div className="uk-width-1-1 uk-child-width-1-3@m uk-child-width-1-1 uk-grid-small uk-grid-match uk-margin" uk-grid="true">
          { prescription.drugs.map( (drug, index) =>
            <div key={index}>
              <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
                <h4>Medicamento {index+1}: {prescription.drugs[index].name}</h4>
                <p className="uk-margin-remove uk-text-left">Nombre: {prescription.drugs[index].name}</p>
                <p className="uk-margin-remove uk-text-left">Presentación: {prescription.drugs[index].dosage_form}</p>
                <p className="uk-margin-remove uk-text-left">Dosis: {prescription.drugs[index].dose}</p>
                <p className="uk-margin-remove uk-text-left">Horario: {prescription.drugs[index].schedule}</p>
                <p className="uk-margin-remove uk-text-left">Número de días: {prescription.drugs[index].periodicity}</p>
                <p className="uk-margin-remove uk-text-left">Indicaciones : {prescription.drugs[index].directions}</p>
              </div>
            </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default PrescriptionInfo