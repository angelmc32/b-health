import React, { useContext } from 'react'
import { AppContext } from '../../../AppContext'
import useForm from '../../../hooks/useForm';                      // Import useForm custom hook
import moment from 'moment';                                    // Import momentjs for date formatting

const { user, setUser, route, setRoute } = useContext(AppContext); // Destructure user state variable
const { form, handleInput, handleFileInput } = useForm();

export const ProfileQuestionnaire = [
  <div>
    <label className="uk-form-label" htmlFor="date">Nombres:</label>
    <div className="uk-form-controls">
      <input className="uk-input uk-border-pill" type="text" name="first_name" onChange={handleInput} placeholder={user.first_name} />
    </div>
    <label className="uk-form-label" htmlFor="form-stacked-text">Apellido paterno:</label>
    <div className="uk-form-controls">
      <input className="uk-input uk-border-pill" type="text" name="last_name1" onChange={handleInput} placeholder={user.last_name1} />
    </div>
    <label className="uk-form-label" htmlFor="form-stacked-text">Apellido materno:</label>
    <div className="uk-form-controls">
      <input className="uk-input uk-border-pill" type="text" name="last_name2" onChange={handleInput} placeholder={user.last_name2} />
    </div>
    <label className="uk-form-label">Fecha de nacimiento: {moment.utc(user.date_of_birth).format('LL')}</label>
    <div className="uk-inline">
      <input onChange={handleInput} name="date_of_birth" className="uk-input uk-border-pill" type="date" />
    </div>
    <label className="uk-form-label" htmlFor="form-stacked-text">Género</label>
    <div className="uk-margin uk-flex uk-flex-around">
      <label><input onChange={handleInput} className="uk-radio" type="radio" name="gender" value="F" />  Mujer</label>
      <label><input onChange={handleInput} className="uk-radio" type="radio" name="gender" value="M" />  Hombre</label>
      <label><input onChange={handleInput} className="uk-radio" type="radio" name="gender" value="N" />  No binario</label>
    </div>
  </div>
  ,
  <div>
    <label className="uk-form-label">CURP:</label>
    <div className="uk-form-controls">
      <input onChange={handleInput} name="curp" className="uk-input uk-border-pill" type="text" placeholder={user.curp} />
    </div>
    <label className="uk-form-label">Código Postal:</label>
    <div className="uk-form-controls">
      <input onChange={handleInput} name="zip_code" className="uk-input uk-border-pill" type="number" placeholder={user.zip_code ? user.zip_code : 5544332211} />
    </div>
    <label className="uk-form-label">Estado Civil:</label>
    <div className="uk-form-controls">
      <select className="uk-select uk-border-pill">
        <option>Soltero</option>
        <option>Casado</option>
        <option>Viudo</option>
        <option>Divorciado</option>
      </select>
    </div>
    <label className="uk-form-label">Grado Máximo de Estudios:</label>
    <div className="uk-form-controls">
      <select className="uk-select uk-border-pill">
        <option>Primaria</option>
        <option>Secundaria</option>
        <option>Preparatoria</option>
        <option>Licenciatura</option>
        <option>Posgrado</option>
      </select>
    </div>
  </div>,
  <div>
    <label className="uk-form-label">Teléfono/Whatsapp:</label>
    <div className="uk-form-controls">
      <input onChange={handleInput} name="phone_numnber" className="uk-input uk-border-pill" type="number" placeholder={user.phone_number ? user.phone_number : 5544332211} />
    </div>
    <label className="uk-form-label">Correo electrónico:</label>
    <div className="uk-form-controls">
      <input onChange={handleInput} name="email" className="uk-input uk-border-pill" type="email" placeholder={user.email} />
    </div>
  </div>
]

const medHistoryQuestionnaire = [
  <div className="">
    <h4>Antecedentes Heredo-Familiares</h4>
    <label>
      <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
        Ninguno
    </label>
    <label>
      <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
        Diabetes
    </label>
    <label>
      <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
        Hipertensión
    </label>
    <label>
      <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
        Asma
    </label>
    <label>
      <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
        Alergias
    </label>
    <label>
      <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
        Enfermedades del Corazón
    </label>
    <label>
      <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
        Enfermedades del Hígado
    </label>
    <label>
      <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
        Enfermedades del Sist. Digestivo
    </label>
    <label>
      <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
        Enfermedades del Riñón
    </label>
    <label>
      <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
        Enfermedades Endócrinas
    </label>
    <label>
      <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
        Enfermedades Mentales
    </label>
    <label>
      <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
        Cáncer
    </label>
    <label>
      <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
        Otras
    </label>
  </div>,
  <div className="">
  <h4>Antecedentes Personales Patológicos</h4>
  <label>
    <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
      Ninguno
  </label>
  <label>
    <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
      Enfermedades Actuales
  </label>
  <label>
    <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
      Intervenciones Quirúrgicas
  </label>
  <label>
    <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
      Alergias
  </label>
  <label>
    <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
      Traumatismos
  </label>
  <label>
    <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
      Hospitalizaciones Previas
  </label>
  <label>
    <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
      Adicciones
  </label>
  <label>
    <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
      Otras
  </label>
</div>,
<div className="">
    <h4>Antecedentes Personales No Patológicos</h4>
    <label>
      <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
        Tabaquismo
    </label>
    <label>
      <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
        Alcoholismo
    </label>
    <label>
      <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
        Hábitos Alimenticios
    </label>
    <label>
      <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
        Sueño
    </label>
    <label>
      <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
        Ejercicio
    </label>
    <label>
      <input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} />
        Higiene Bucal
    </label>
  </div>,
]