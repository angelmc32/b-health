import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';                      // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import useForm from '../../hooks/useForm';                          // Import useForm custom hook
import UIkit from 'uikit';                                          // Import UIkit for notifications
import moment from 'moment';                                        // Import momentjs for date formatting

const ConsultationInfo = ({ consultation }) => {
  return (
    <div className="uk-container">
      <div className="uk-margin">
        <p>Fecha de consulta: {consultation.date}</p>
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