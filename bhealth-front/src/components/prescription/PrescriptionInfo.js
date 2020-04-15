import React from 'react';
import moment from 'moment';                                        // Import momentjs for date formatting

const PrescriptionInfo = ({ prescription }) => {
  return (
    <div className="uk-container">
      <div className="uk-margin">
        <p>Fecha de receta: {moment(prescription.date).locale('es').format('LL')}</p>
        <p>Doctor: {prescription.doctor}</p>
        { prescription.image === 'Sin imagen registrada' ? null :
            <div uk-lightbox="true">
              <a className="uk-button uk-button-default" href={prescription.image} data-alt="Image">Ver Imagen</a>
            </div>
        }
        
        { prescription.drugs.map( (drug, index) =>
            <div className="uk-margin" key={index}>
              <h4>Medicamento {index+1}</h4>
              <p>Nombre: {prescription.drugs[index].name}</p>
              <p>Presentación: {prescription.drugs[index].dosage_form}</p>
              <p>Dosis: {prescription.drugs[index].dose}</p>
              <p>Horario: {prescription.drugs[index].schedule}</p>
              <p>Número de días: {prescription.drugs[index].periodicity}</p>
              <p>Indicaciones : {prescription.drugs[index].directions}</p>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default PrescriptionInfo