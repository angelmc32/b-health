import React, { useEffect, useState } from 'react';
import moment from 'moment';                                        // Import momentjs for date formatting
import { getOneVitalSignsConsultation } from '../../services/vitalsigns-services'

import 'moment/locale/es'  // without this line it didn't work
moment.locale('es')

const ConsultationInfo = ({ consultation }) => {

  const [ vitals, setVitals ] = useState({});

  useEffect( () => {

    getOneVitalSignsConsultation(consultation._id)
    .then( res => {

      const { vitalsigns } = res.data;
      console.log(vitalsigns)
      setVitals(vitalsigns)
    })

  }, [])

  return (
    <div className="uk-container">
      <div className="uk-margin">
        <p>Fecha de consulta: {moment(consultation.date).locale('es').format('LL')}</p>
        <p>Doctor: {consultation.doctor}</p>
        <p>Motivo de consulta: {consultation.chief_complaint}</p>
        <p>Diagnóstico: {consultation.diagnosis}</p>
        <p>Temperatura: {vitals.temperature ? vitals.temperature : 'No registrada'}</p>
        <p>Presión Arterial: {vitals.blood_pressure_sys ? `${vitals.blood_pressure_sys} / ${vitals.blood_pressure_dias}` : 'No registrada'}</p>
        <p>Frecuencia Cardiaca: {vitals.heart_rate ? vitals.heart_rate : 'No registrada'}</p>
        <p>Nivel de Glucosa: {vitals.glucose ? vitals.glucose : 'No registrada'}</p>
        <p>Peso: {vitals.weight ? vitals.weight : 'No registrado'}</p>
      </div>
    </div>
  )
}

export default ConsultationInfo