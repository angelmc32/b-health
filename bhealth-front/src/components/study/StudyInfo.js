import React from 'react';
import moment from 'moment';                                        // Import momentjs for date formatting

const StudyInfo = ({ study }) => {
  return (
    <div className="uk-container">
      <div className="uk-margin">
        <p>Fecha de Estudio: {moment(study.date).locale('es').format('LL')}</p>
        <p>Doctor: {study.doctor}</p>
        { study.image ?
            <div uk-lightbox="true">
              <a className="uk-button uk-button-default" href={study.image} data-alt="Image">Ver Imagen</a>
            </div>
          : null
        }
        <div className="uk-margin" key="index">
          <p>Nombre del Estudio : {study.study_name}</p>
          <p>Nombre de Laboratorio : {study.facility_name}</p>
        </div>
        
      </div>
    </div>
  )
}

export default StudyInfo