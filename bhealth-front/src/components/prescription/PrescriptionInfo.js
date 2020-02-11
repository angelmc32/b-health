import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';                      // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import useForm from '../../hooks/useForm';                          // Import useForm custom hook
import UIkit from 'uikit';                                          // Import UIkit for notifications
import moment from 'moment';                                        // Import momentjs for date formatting

const PrescriptionInfo = ({ prescription }) => {
  return (
    <div className="uk-container">
      <div className="uk-margin">
        <p>Fecha de receta: {prescription.date}</p>
        <p>Doctor: {prescription.doctor}</p>
        { prescription.generic_name.map( (drug, index) =>
            <div className="uk-margin">
              <p>Nombre Genérico : {prescription.generic_name}</p>
              <p>Nombre Comercial : {prescription.brand_name}</p>
              <p>Presentación : {prescription.dosage_form}</p>
              <p>Dosis : {prescription.dose}</p>
              <p>Indicaciones : {prescription.directions}</p>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default PrescriptionInfo