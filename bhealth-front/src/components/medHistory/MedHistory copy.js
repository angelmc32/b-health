import React, { useEffect, useContext, useState } from 'react';           // Import React and useContext hook
import { useHistory } from 'react-router-dom';                  // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                  // Import AppContext to use created context
import useForm from '../../hooks/useForm';                      // Import useForm custom hook
import UIkit from 'uikit';                                      // Import UIkit for notifications
import moment from 'moment';                                    // Import momentjs for date formatting

import { getMedicalHistory, createMedicalHistory, editMedicalHistory } from '../../services/medhistory-services';  // Import edit API call

const MedHistory = () => {

  const { form, setForm, handleInput, handleFileInput } = useForm();
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(false);
  const [ medHistory, setMedHistory ] = useState({});
  
  const { user, setUser, route, setRoute } = useContext(AppContext); // Destructure user state variable
  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user

  let familyHistoryObj = {
    "Ninguno": true,
    "Autoinmunes": false,
    "Cardiacas": false,
    "Cáncer": false,
    "Convulsiones": false,
    "Diabetes": false,
    "Dislipidemia": false,
    "Eclampsia": false,
    "Hipertensión": false,
    "Psiquiátricas": false,
    "Tiroideas": false,
    "Tuberculosis": false,
  }, healthHistoryObj = {
    "Ninguno": true,
    "Cardiovascular": false,
    "Gastrointestinal": false,
    "Músculo-Esquelético": false,
    "Dolor": false,
    "Génito-Urinario": false,
    "Respiratorio": false,
    "Psiquiátrico": false,
    "Órganos de los Sentidos": false,
    "Otros": false,
    "Dermatológico": false,
    "Síntomas Generales": false,
    "Endócrino": false,
    "Hemato-Linfático": false,
    "Sistema Inmunológico": false,
    "Sistema Nervioso": false,
  }, addictionsObj = {
    "Ninguna": true,
    "Alcoholismo": false,
    "Sustancias Psicotrópicas": false,
    "Tabaquismo": false,
    "Otras": false,
  }, allergiesObj = {
    "Agentes Biológicos": "Ninguno",
    "Alimentos": "Ninguno",
    "Insectos": "Ninguno",
    "Medicamentos": "Ninguno",
  }, weekly_exercise_hours = 0;

  // Hook to update component when user state variable is modified
  useEffect( () => {

    if ( !user._id ) {    // If there is no user logged in, send a notification and "redirect" to login

      // Send UIkit warning notification: User must log in
      UIkit.notification({
        message: `<span uk-icon='close'></span> Por favor inicia sesión.`,
        pos: 'bottom-center',
        status: 'warning'
      });
      
      return push('/login');         // If not logged in, "redirect" user to login

    };

    getMedicalHistory()
    .then( res => {

      const { medicalHistory } = res.data;

      console.log(medicalHistory)
      setMedHistory(medicalHistory);

    });

  }, [user] );

  // Declare function for form submit event
  const handleSubmit = (event) => {

    event.preventDefault();               // Prevent page reloading after submit action
    setIsButtonDisabled(true);

    form['family_history'] = familyHistoryObj;
    form['health_history'] = healthHistoryObj;
    form['addictions'] = addictionsObj;
    form['allergies'] = allergiesObj;
    form['weekly_exercise_hours'] = weekly_exercise_hours;

    console.log(form)
    
    // Call edit service with formData as parameter, which includes form data for user profile information
    if ( route === 'edit' ) {

      editMedicalHistory(form)
      .then( res => {

        const { medicalHistory } = res.data   // Destructure updated user document from response
        
        setMedHistory(medicalHistory);              // Modify user state variable with updated information
        setRoute('none');
        setIsButtonDisabled(false);

        // Send UIkit success notification
        UIkit.notification({
          message: `<span uk-icon='close'></span> '¡Tu historial clínico fue actualizado exitosamente!'`,
          pos: 'bottom-center',
          status: 'success'
        });

      })
      .catch( error => {

        console.log(error);
        setIsButtonDisabled(false);

        // Send UIkit error notification
        UIkit.notification({
          message: `<span uk-icon='close'></span> ${error}`,
          pos: 'bottom-center',
          status: 'danger'
        });

      });

    }

    if ( route !== 'edit' ) {

      createMedicalHistory(form)
      .then( res => {

        const { medicalHistory } = res.data   // Destructure updated user document from response
        
        setMedHistory(medicalHistory);              // Modify user state variable with updated information
        setRoute('none');
        setIsButtonDisabled(false);

        // Send UIkit success notification
        UIkit.notification({
          message: `<span uk-icon='close'></span> '¡Tu historial clínico fue creado exitosamente!'`,
          pos: 'bottom-center',
          status: 'success'
        });

      })
      .catch( error => {

        console.log(error);
        setIsButtonDisabled(false);

        // Send UIkit error notification
        UIkit.notification({
          message: `<span uk-icon='close'></span> ${error}`,
          pos: 'bottom-center',
          status: 'danger'
        });

      });

    }

  };

  const handleMedHistoryInput = (event) => {

    const { name, value, id } = event.target;

    switch ( name ) {
      case 'family_history':
        familyHistoryObj[value] = !familyHistoryObj[value];
        console.log(familyHistoryObj)
        // setForm( prevState => ({...prevState, ['family_history']: familyHistoryObj}) );
        break;
      case 'health_history':
        healthHistoryObj[value] = !healthHistoryObj[value];
        console.log(healthHistoryObj)
        // setForm( prevState => ({...prevState, ['health_history']: healthHistoryObj}) );
        break;
      case 'addictions':
        addictionsObj[value] = !addictionsObj[value];
        console.log(addictionsObj)
        // setForm( prevState => ({...prevState, ['addictions']: addictionsObj}) );
        break;
      case 'allergies':
        allergiesObj[id] = value;
        console.log(allergiesObj)
        // setForm( prevState => ({...prevState, ['allergies']: allergiesObj}) );
        break;
      case 'weekly_exercise_hours':
        weekly_exercise_hours = parseInt(value)
    }

    console.log(familyHistoryObj)
    console.log(healthHistoryObj)
    console.log(addictionsObj)
    console.log(allergiesObj)
  }

  return (
    <div className="content">
      
      { route === 'none' && !medHistory ? (
          <div className="uk-section">
            <h2>Mis Antecedentes</h2>
            <div className="uk-container uk-overflow-auto">
              <form onSubmit={handleSubmit} className="uk-form-stacked uk-text-left">
                <h4 className="uk-margin">Antecedentes Heredo-Familiares</h4>
                <div className="uk-margin">
                  <div className="uk-form-label">Enfermedades o Síntomas:</div>
                  <div className="uk-form-controls uk-flex">
                    <div className="uk-width-1-2 uk-flex uk-flex-column">
                      <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} /> Ninguno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Convulsiones" onChange={handleMedHistoryInput} /> Convulsiones</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Cáncer" onChange={handleMedHistoryInput} /> Cáncer</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Diabetes" onChange={handleMedHistoryInput} /> Diabetes</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Dislipidemia" onChange={handleMedHistoryInput} /> Dislipidemia</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Eclampsia" onChange={handleMedHistoryInput} /> Eclampsia</label>
                    </div>
                    <div className="uk-width-1-2 uk-flex uk-flex-column">
                      <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Autoinmunes" onChange={handleMedHistoryInput} /> Autoinmunes</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Cardiacas" onChange={handleMedHistoryInput} /> Cardiacas</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Psiquiátricas" onChange={handleMedHistoryInput} /> Psiquiátricas</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Tiroideas" onChange={handleMedHistoryInput} /> Tiroideas</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Hipertensión" onChange={handleMedHistoryInput} /> Hipertensión</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Tuberculosis" onChange={handleMedHistoryInput} /> Tuberculosis</label>
                    </div>
                  </div>
                </div>
                <h4 className="uk-margin">Antecedentes Personales Patológicos</h4>
                <div className="uk-margin">
                  <div className="uk-form-label">Sistemas o Aparatos:</div>
                  <div className="uk-form-controls uk-flex">
                    <div className="uk-width-1-2 uk-flex uk-flex-column">
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} /> Ninguno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Cardiovascular" onChange={handleMedHistoryInput} /> Cardiovascular</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Gastrointestinal" onChange={handleMedHistoryInput} /> Gastrointestinal</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Músculo-Esquelético" onChange={handleMedHistoryInput} /> Músculo-esquelético</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Dolor" onChange={handleMedHistoryInput} /> Dolor</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Génito-Urinario" onChange={handleMedHistoryInput} /> Génito-Urinario</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Respiratorio" onChange={handleMedHistoryInput} /> Respiratorio</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Psiquiátrico" onChange={handleMedHistoryInput} /> Psiquiátrico</label>
                    </div>
                    <div className="uk-width-1-2 uk-flex uk-flex-column">
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Órganos de los Sentidos" onChange={handleMedHistoryInput} /> Órganos de Sentidos</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Otros" onChange={handleMedHistoryInput} /> Otros</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Dermatológico" onChange={handleMedHistoryInput} /> Dermatológico</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Síntomas Generales" onChange={handleMedHistoryInput} /> Síntomas Generales</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Endócrino" onChange={handleMedHistoryInput} /> Endócrino</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Hemato-Linfático" onChange={handleMedHistoryInput} /> Hemato-Linfático</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Sistema Inmunológico" onChange={handleMedHistoryInput} /> Sist. Inmunológico</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Sistema Nervioso" onChange={handleMedHistoryInput} /> Sist. Nervioso</label>
                    </div>
                  </div>
                </div>
                <h4 className="uk-margin">Antecedentes Personales No Patológicos</h4>
                <div className="uk-margin">
                  <div className="uk-form-controls">
                    <label className="uk-form-label" htmlFor="date">Horas de Actividad Física a la Semana:</label>
                    <div className="uk-form-controls">
                      <input className="uk-input" type="number" name="weekly_exercise_hours" onChange={handleMedHistoryInput} />
                    </div>
                    <div className="uk-form-label">Adicciones:</div>
                    <div className="uk-flex uk-flex-column">
                      <label><input className="uk-checkbox" type="checkbox" name="addictions" value="Ninguna" defaultChecked={true} onChange={handleMedHistoryInput} /> Ninguna</label>
                      <label><input className="uk-checkbox" type="checkbox" name="addictions" value="Alcoholismo" onChange={handleMedHistoryInput} /> Alcoholismo</label>
                      <label><input className="uk-checkbox" type="checkbox" name="addictions" value="Sustancias Psicotrópicas" onChange={handleMedHistoryInput} /> Sustancias Psicotrópicas</label>
                      <label><input className="uk-checkbox" type="checkbox" name="addictions" value="Tabaquismo" onChange={handleMedHistoryInput} /> Tabaquismo</label>
                      <label><input className="uk-checkbox" type="checkbox" name="addictions" value="Otras" onChange={handleMedHistoryInput} /> Otras</label>
                    </div>
                  </div>
                </div>
                <h4 className="uk-margin">Alergias</h4>
                <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="date">Agentes Biológicos:</label>
                  <div className="uk-form-controls">
                    <input className="uk-input" type="text" name="allergies" id="Agentes Biológicos" onChange={handleMedHistoryInput} placeholder="Introducir alergéno" />
                  </div>
                  <label className="uk-form-label" htmlFor="date">Alimentos:</label>
                  <div className="uk-form-controls">
                    <input className="uk-input" type="text" name="allergies" id="Alimentos" onChange={handleMedHistoryInput} placeholder="Introducir alergéno" />
                  </div>
                  <label className="uk-form-label" htmlFor="date">Insectos:</label>
                  <div className="uk-form-controls">
                    <input className="uk-input" type="text" name="allergies" id="Insectos" onChange={handleMedHistoryInput} placeholder="Introducir alergéno" />
                  </div>
                  <label className="uk-form-label" htmlFor="date">Medicamentos:</label>
                  <div className="uk-form-controls">
                    <input className="uk-input" type="text" name="allergies" id="Medicamentos" onChange={handleMedHistoryInput} placeholder="Introducir alergéno" />
                  </div>
                </div>
                <div className="uk-width-1-1 uk-flex uk-flex-center">
                  <button type="submit" className="uk-button uk-button-primary uk-width-2-3 uk-width-1-4@m uk-border-pill" disabled={isButtonDisabled} onClick={event => setRoute('none')} >
                    Crear Historial
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : route === 'none' ? (
          <div className="uk-section">
            <h2>Mis Antecedentes</h2>
            <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('edit')} >
              Editar historial
            </button>
            <div className="uk-container uk-overflow-auto">
              <div className="uk-margin">
                <h4 className="uk-margin">Antecedentes Heredo-Familiares</h4>
                <ul className="uk-list">
                  { medHistory.family_history ? Object.entries(medHistory.family_history).map( (entry, index) => {
                    if (entry[1] === true) 
                      return (<li key={index}>{entry[0]}</li>) 
                    else 
                      return null
                  }) : 'Cargando' }
                </ul>
                <h4 className="uk-margin">Antecedentes Personales Patológicos</h4>
                <ul className="uk-list">
                  { medHistory.health_history ? Object.entries(medHistory.health_history).map( (entry, index) => {
                    if (entry[1] === true) 
                    return (<li key={index}>{entry[0]}</li>) 
                  else 
                    return null
                }) : 'Cargando' }
                </ul>
                <h4 className="uk-margin">Antecedentes Personales No Patológicos</h4>
                <p>Horas de actividad física a la semana: {medHistory.weekly_exercise_hours}</p>
                <p>Adicciones:</p>
                <ul className="uk-list">
                  { medHistory.addictions ? Object.entries(medHistory.addictions).map( (entry, index) => {
                    if (entry[1] === true) 
                    return (<li key={index}>{entry[0]}</li>) 
                  else 
                    return null
                }) : 'Cargando' }
                </ul>
                <h4 className="uk-margin">Alergias</h4>
                <ul className="uk-list">
                  { medHistory.allergies ? Object.entries(medHistory.allergies).map( (entry, index) => {
                    
                    return (<li key={index}>{entry[0]}: {entry[1]}</li>) 
                  
                }) : 'Cargando' }
                </ul>
              </div>
          </div>
        </div>
        ) : (
          <div className="uk-section">
            <h2>Editar mis Antecedentes</h2>
            <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('none')} >
              Regresar
            </button>
            <div className="uk-container uk-overflow-auto">
              <form onSubmit={handleSubmit} className="uk-form-stacked uk-text-left">
                <h4 className="uk-margin">Antecedentes Heredo-Familiares</h4>
                <div className="uk-margin">
                  <div className="uk-form-label">Enfermedades o Síntomas:</div>
                  <div className="uk-form-controls uk-flex">
                    <div className="uk-width-1-2 uk-flex uk-flex-column">
                      {
                        Object.entries(medHistory.family_history).slice(0,6).map( (entry, index) => (
                          <label key={index}>
                            <input className="uk-checkbox" type="checkbox" name="family_history" defaultValue={entry[0]} defaultChecked={entry[1]} onChange={handleMedHistoryInput} />
                            {entry[0]}
                          </label>
                          )
                        )
                      }
                      {/* <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} /> Ninguno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Convulsiones" onChange={handleMedHistoryInput} /> Convulsiones</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Cáncer" onChange={handleMedHistoryInput} /> Cáncer</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Diabetes" onChange={handleMedHistoryInput} /> Diabetes</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Dislipidemia" onChange={handleMedHistoryInput} /> Dislipidemia</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Eclampsia" onChange={handleMedHistoryInput} /> Eclampsia</label> */}
                    </div>
                    <div className="uk-width-1-2 uk-flex uk-flex-column">
                      {
                        Object.entries(medHistory.family_history).slice(6).map( (entry, index) => (
                          <label key={index}>
                            <input className="uk-checkbox" type="checkbox" name="family_history" defaultValue={entry[0]} defaultChecked={entry[1]} onChange={handleMedHistoryInput} />
                            {entry[0]}
                          </label>
                          )
                        )
                      }
                      {/* 
                      <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Autoinmunes" onChange={handleMedHistoryInput} /> Autoinmunes</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Cardiacas" onChange={handleMedHistoryInput} /> Cardiacas</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Psiquiátricas" onChange={handleMedHistoryInput} /> Psiquiátricas</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Tiroideas" onChange={handleMedHistoryInput} /> Tiroideas</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Hipertensión" onChange={handleMedHistoryInput} /> Hipertensión</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Tuberculosis" onChange={handleMedHistoryInput} /> Tuberculosis</label>
                     */}
                    </div>
                  </div>
                </div>
                <h4 className="uk-margin">Antecedentes Personales Patológicos</h4>
                <div className="uk-margin">
                  <div className="uk-form-label">Sistemas o Aparatos:</div>
                  <div className="uk-form-controls uk-flex">
                    <div className="uk-width-1-2 uk-flex uk-flex-column">
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Ninguno" defaultChecked={true} onChange={handleMedHistoryInput} /> Ninguno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Cardiovascular" onChange={handleMedHistoryInput} /> Cardiovascular</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Gastrointestinal" onChange={handleMedHistoryInput} /> Gastrointestinal</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Músculo-Esquelético" onChange={handleMedHistoryInput} /> Músculo-esquelético</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Dolor" onChange={handleMedHistoryInput} /> Dolor</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Génito-Urinario" onChange={handleMedHistoryInput} /> Génito-Urinario</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Respiratorio" onChange={handleMedHistoryInput} /> Respiratorio</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Psiquiátrico" onChange={handleMedHistoryInput} /> Psiquiátrico</label>
                    </div>
                    <div className="uk-width-1-2 uk-flex uk-flex-column">
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Órganos de los Sentidos" onChange={handleMedHistoryInput} /> Órganos de Sentidos</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Otros" onChange={handleMedHistoryInput} /> Otros</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Dermatológico" onChange={handleMedHistoryInput} /> Dermatológico</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Síntomas Generales" onChange={handleMedHistoryInput} /> Síntomas Generales</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Endócrino" onChange={handleMedHistoryInput} /> Endócrino</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Hemato-Linfático" onChange={handleMedHistoryInput} /> Hemato-Linfático</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Sistema Inmunológico" onChange={handleMedHistoryInput} /> Sist. Inmunológico</label>
                      <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Sistema Nervioso" onChange={handleMedHistoryInput} /> Sist. Nervioso</label>
                    </div>
                  </div>
                </div>
                <h4 className="uk-margin">Antecedentes Personales No Patológicos</h4>
                <div className="uk-margin">
                  <div className="uk-form-controls">
                    <label className="uk-form-label" htmlFor="date">Horas de Actividad Física a la Semana:</label>
                    <div className="uk-form-controls">
                      <input className="uk-input" type="number" name="weekly_exercise_hours" onChange={handleMedHistoryInput} />
                    </div>
                    <div className="uk-form-label">Adicciones:</div>
                    <div className="uk-flex uk-flex-column">
                      <label><input className="uk-checkbox" type="checkbox" name="addictions" value="Ninguna" defaultChecked={true} onChange={handleMedHistoryInput} /> Ninguna</label>
                      <label><input className="uk-checkbox" type="checkbox" name="addictions" value="Alcoholismo" onChange={handleMedHistoryInput} /> Alcoholismo</label>
                      <label><input className="uk-checkbox" type="checkbox" name="addictions" value="Sustancias Psicotrópicas" onChange={handleMedHistoryInput} /> Sustancias Psicotrópicas</label>
                      <label><input className="uk-checkbox" type="checkbox" name="addictions" value="Tabaquismo" onChange={handleMedHistoryInput} /> Tabaquismo</label>
                      <label><input className="uk-checkbox" type="checkbox" name="addictions" value="Otras" onChange={handleMedHistoryInput} /> Otras</label>
                    </div>
                  </div>
                </div>
                <h4 className="uk-margin">Alergias</h4>
                <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="date">Agentes Biológicos:</label>
                  <div className="uk-form-controls">
                    <input className="uk-input" type="text" name="allergies" id="Agentes Biológicos" onChange={handleMedHistoryInput} placeholder="Introducir alergéno" />
                  </div>
                  <label className="uk-form-label" htmlFor="date">Alimentos:</label>
                  <div className="uk-form-controls">
                    <input className="uk-input" type="text" name="allergies" id="Alimentos" onChange={handleMedHistoryInput} placeholder="Introducir alergéno" />
                  </div>
                  <label className="uk-form-label" htmlFor="date">Insectos:</label>
                  <div className="uk-form-controls">
                    <input className="uk-input" type="text" name="allergies" id="Insectos" onChange={handleMedHistoryInput} placeholder="Introducir alergéno" />
                  </div>
                  <label className="uk-form-label" htmlFor="date">Medicamentos:</label>
                  <div className="uk-form-controls">
                    <input className="uk-input" type="text" name="allergies" id="Medicamentos" onChange={handleMedHistoryInput} placeholder="Introducir alergéno" />
                  </div>
                </div>
                <div className="uk-width-1-1 uk-flex uk-flex-center">
                  <button type="submit" className="uk-button uk-button-primary uk-width-2-3 uk-width-1-4@m uk-border-pill" disabled={isButtonDisabled} >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
      </div>)

}

export default MedHistory