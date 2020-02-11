import React, { useEffect, useContext, useState } from 'react';           // Import React and useContext hook
import { useHistory } from 'react-router-dom';                  // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                  // Import AppContext to use created context
import useForm from '../../hooks/useForm';                      // Import useForm custom hook
import UIkit from 'uikit';                                      // Import UIkit for notifications
import moment from 'moment';                                    // Import momentjs for date formatting

import { getMedicalHistory, createMedicalHistory, editMedicalHistory } from '../../services/medhistory-services';  // Import edit API call

const MedHistory = () => {

  const { form, handleInput, handleFileInput } = useForm();
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(false);
  const [ medHistory, setMedHistory ] = useState({});
  
  const { user, setUser, route, setRoute } = useContext(AppContext); // Destructure user state variable
  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user

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
      setMedHistory(medicalHistory);

    });

  }, [user] );

  // Declare function for form submit event
  const handleSubmit = (event) => {

    event.preventDefault();               // Prevent page reloading after submit action
    setIsButtonDisabled(true);
    
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

  return (
    <div className="uk-section">
      <h2>Mi Historial Clínico</h2>
      { route === 'none' && !medHistory ? (
          <div className="uk-container">
            <form onSubmit={handleSubmit} className="uk-form-stacked uk-text-left">
              <h4 className="uk-margin">Antecedentes Heredo-Familiares</h4>
              <div className="uk-margin">
                <div className="uk-form-label">Enfermedades o Síntomas:</div>
                <div className="uk-form-controls uk-flex">
                  <div className="uk-width-1-2 uk-flex uk-flex-column">
                    <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleInput} /> Ninguno</label>
                    <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Convulsiones" onChange={handleInput} /> Convulsiones</label>
                    <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Cáncer" onChange={handleInput} /> Cáncer</label>
                    <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Diabetes" onChange={handleInput} /> Diabetes</label>
                    <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Dislipidemia" onChange={handleInput} /> Dislipidemia</label>
                    <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Eclampsia" onChange={handleInput} /> Eclampsia</label>
                  </div>
                  <div className="uk-width-1-2 uk-flex uk-flex-column">
                    <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Autoinmunes" onChange={handleInput} /> Autoinmunes</label>
                    <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Cardiacas" onChange={handleInput} /> Cardiacas</label>
                    <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Psiquiátricas" onChange={handleInput} /> Psiquiátricas</label>
                    <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Tiroideas" onChange={handleInput} /> Tiroideas</label>
                    <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Hipertensión" onChange={handleInput} /> Hipertensión</label>
                    <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Tuberculosis" onChange={handleInput} /> Tuberculosis</label>
                  </div>
                </div>
              </div>
              <h4 className="uk-margin">Antecedentes Personales Patológicos</h4>
              <div className="uk-margin">
                <div className="uk-form-label">Sistemas o Aparatos:</div>
                <div className="uk-form-controls uk-flex">
                  <div className="uk-width-1-2 uk-flex uk-flex-column">
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Ninguno" defaultChecked={true} onChange={handleInput} /> Ninguno</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Cardiovascular" onChange={handleInput} /> Cardiovascular</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Gastrointestinal" onChange={handleInput} /> Gastrointestinal</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Músculo-esquelético" onChange={handleInput} /> Músculo-esquelético</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Dolor" onChange={handleInput} /> Dolor</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Génito-Urinario" onChange={handleInput} /> Génito-Urinario</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Respiratorio" onChange={handleInput} /> Respiratorio</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Psiquiátrico" onChange={handleInput} /> Psiquiátrico</label>
                  </div>
                  <div className="uk-width-1-2 uk-flex uk-flex-column">
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Órganos de Sentidos" onChange={handleInput} /> Órganos de Sentidos</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Otros" onChange={handleInput} /> Otros</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Dermatológico" onChange={handleInput} /> Dermatológico</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Síntomas Generales" onChange={handleInput} /> Síntomas Generales</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Endócrino" onChange={handleInput} /> Endócrino</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Hemato-Linfático" onChange={handleInput} /> Hemato-Linfático</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Sist. Inmunológico" onChange={handleInput} /> Sist. Inmunológico</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Sist. Nervioso" onChange={handleInput} /> Sist. Nervioso</label>
                  </div>
                </div>
              </div>
              <h4 className="uk-margin">Antecedentes Personales No Patológicos</h4>
              <div className="uk-margin">
                <div className="uk-form-controls">
                  <label className="uk-form-label" htmlFor="date">Horas de Actividad Física a la Semana:</label>
                  <div className="uk-form-controls">
                    <input className="uk-input" type="number" name="weekly_exercise_hours" onChange={handleInput} />
                  </div>
                  <div className="uk-form-label">Adicciones:</div>
                  <div className="uk-flex uk-flex-column">
                    <label><input className="uk-checkbox" type="checkbox" name="addictions" value="Ninguna" defaultChecked={true} onChange={handleInput} /> Ninguna</label>
                    <label><input className="uk-checkbox" type="checkbox" name="addictions" value="Alcoholismo" onChange={handleInput} /> Alcoholismo</label>
                    <label><input className="uk-checkbox" type="checkbox" name="addictions" value="Sustancias Psicotrópicas" onChange={handleInput} /> Sustancias Psicotrópicas</label>
                    <label><input className="uk-checkbox" type="checkbox" name="addictions" value="Tabaquismo" onChange={handleInput} /> Tabaquismo</label>
                    <label><input className="uk-checkbox" type="checkbox" name="addictions" value="Otras" onChange={handleInput} /> Otras</label>
                  </div>
                </div>
              </div>
              <h4 className="uk-margin">Alergias</h4>
              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="date">Agentes Biológicos:</label>
                <div className="uk-form-controls">
                  <input className="uk-input" type="text" name="allergies" onChange={handleInput} placeholder="Introducir alergéno" />
                </div>
                <label className="uk-form-label" htmlFor="date">Alimentos:</label>
                <div className="uk-form-controls">
                  <input className="uk-input" type="text" name="allergies" onChange={handleInput} placeholder="Introducir alergéno" />
                </div>
                <label className="uk-form-label" htmlFor="date">Insectos:</label>
                <div className="uk-form-controls">
                  <input className="uk-input" type="text" name="allergies" onChange={handleInput} placeholder="Introducir alergéno" />
                </div>
                <label className="uk-form-label" htmlFor="date">Medicamentos:</label>
                <div className="uk-form-controls">
                  <input className="uk-input" type="text" name="allergies" onChange={handleInput} placeholder="Introducir alergéno" />
                </div>
              </div>
              <div className="uk-width-1-1 uk-flex uk-flex-center">
                <button type="submit" className="uk-button uk-button-primary uk-button-small uk-border-pill" disabled={isButtonDisabled} onClick={event => setRoute('none')} >
                  Crear Historial
                </button>
              </div>
            </form>
          </div>
        ) : route === 'none' ? (
          <div className="uk-container">
            <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m" onClick={event => setRoute('edit')} >
              Editar historial
            </button>
            <div className="uk-margin">
              <h4 className="uk-margin">Antecedentes Heredo-Familiares</h4>
              <ul className="uk-list">
                { medHistory.family_history ? medHistory.family_history.map( (disease, index) => {
                  return (<li key={index}>{disease}</li>)
                }) : 'Cargando' }
              </ul>
              <h4 className="uk-margin">Antecedentes Personales Patológicos</h4>
              <ul className="uk-list">
                { medHistory.health_history ? medHistory.health_history.map( (disease, index) => {
                  return (<li key={index}>{disease}</li>)
                }) : 'Cargando' }
              </ul>
              <h4 className="uk-margin">Antecedentes Personales No Patológicos</h4>
              <p>Horas de actividad física a la semana: {medHistory.weekly_exercise_hours}</p>
              <p>Adicciones:</p>
              <ul className="uk-list">
                { medHistory.addictions ? medHistory.addictions.map( (addiction, index) => {
                  return (<li key={index}>{addiction}</li>)
                }) : 'Cargando' }
              </ul>
              <h4 className="uk-margin">Alergias</h4>
              <ul className="uk-list">
                { medHistory.allergies ? medHistory.allergies.map( (allergy, index) => {
                  return (<li key={index}>{allergy}</li>)
                }) : 'Sin información registrada' }
              </ul>
            </div>
          </div>
        ) : (
          <div className="uk-container">
            <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m" onClick={event => setRoute('none')} >
              Regresar
            </button>
            <form onSubmit={handleSubmit} className="uk-form-stacked uk-text-left uk-margin">
              <h4 className="uk-margin">Antecedentes Heredo-Familiares</h4>
              <div className="uk-margin">
                <div className="uk-form-label">Enfermedades o Síntomas:</div>
                <div className="uk-form-controls uk-flex">
                  <div className="uk-width-1-2 uk-flex uk-flex-column">
                    <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Ninguno" defaultChecked={true} onChange={handleInput} /> Ninguno</label>
                    <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Convulsiones" onChange={handleInput} /> Convulsiones</label>
                    <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Cáncer" onChange={handleInput} /> Cáncer</label>
                    <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Diabetes" onChange={handleInput} /> Diabetes</label>
                    <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Dislipidemia" onChange={handleInput} /> Dislipidemia</label>
                    <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Eclampsia" onChange={handleInput} /> Eclampsia</label>
                  </div>
                  <div className="uk-width-1-2 uk-flex uk-flex-column">
                    <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Autoinmunes" onChange={handleInput} /> Autoinmunes</label>
                    <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Cardiacas" onChange={handleInput} /> Cardiacas</label>
                    <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Psiquiátricas" onChange={handleInput} /> Psiquiátricas</label>
                    <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Tiroideas" onChange={handleInput} /> Tiroideas</label>
                    <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Hipertensión" onChange={handleInput} /> Hipertensión</label>
                    <label><input className="uk-checkbox" type="checkbox" name="family_history" value="Tuberculosis" onChange={handleInput} /> Tuberculosis</label>
                  </div>
                </div>
              </div>
              <h4 className="uk-margin">Antecedentes Personales Patológicos</h4>
              <div className="uk-margin">
                <div className="uk-form-label">Sistemas o Aparatos:</div>
                <div className="uk-form-controls uk-flex">
                  <div className="uk-width-1-2 uk-flex uk-flex-column">
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Ninguno" defaultChecked={true} onChange={handleInput} /> Ninguno</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Cardiovascular" onChange={handleInput} /> Cardiovascular</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Gastrointestinal" onChange={handleInput} /> Gastrointestinal</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Músculo-esquelético" onChange={handleInput} /> Músculo-esquelético</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Dolor" onChange={handleInput} /> Dolor</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Génito-Urinario" onChange={handleInput} /> Génito-Urinario</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Respiratorio" onChange={handleInput} /> Respiratorio</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Psiquiátrico" onChange={handleInput} /> Psiquiátrico</label>
                  </div>
                  <div className="uk-width-1-2 uk-flex uk-flex-column">
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Órganos de Sentidos" onChange={handleInput} /> Órganos de Sentidos</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Otros" onChange={handleInput} /> Otros</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Dermatológico" onChange={handleInput} /> Dermatológico</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Síntomas Generales" onChange={handleInput} /> Síntomas Generales</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Endócrino" onChange={handleInput} /> Endócrino</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Hemato-Linfático" onChange={handleInput} /> Hemato-Linfático</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Sist. Inmunológico" onChange={handleInput} /> Sist. Inmunológico</label>
                    <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Sist. Nervioso" onChange={handleInput} /> Sist. Nervioso</label>
                  </div>
                </div>
              </div>
              <h4 className="uk-margin">Antecedentes Personales No Patológicos</h4>
              <div className="uk-margin">
                <div className="uk-form-controls">
                  <label className="uk-form-label" htmlFor="date">Horas de Actividad Física a la Semana:</label>
                  <div className="uk-form-controls">
                    <input className="uk-input" type="number" name="weekly_exercise_hours" onChange={handleInput} />
                  </div>
                  <div className="uk-form-label">Adicciones:</div>
                  <div className="uk-flex uk-flex-column">
                    <label><input className="uk-checkbox" type="checkbox" name="addictions" value="Ninguna" defaultChecked={true} onChange={handleInput} /> Ninguna</label>
                    <label><input className="uk-checkbox" type="checkbox" name="addictions" value="Alcoholismo" onChange={handleInput} /> Alcoholismo</label>
                    <label><input className="uk-checkbox" type="checkbox" name="addictions" value="Sustancias Psicotrópicas" onChange={handleInput} /> Sustancias Psicotrópicas</label>
                    <label><input className="uk-checkbox" type="checkbox" name="addictions" value="Tabaquismo" onChange={handleInput} /> Tabaquismo</label>
                    <label><input className="uk-checkbox" type="checkbox" name="addictions" value="Otras" onChange={handleInput} /> Otras</label>
                  </div>
                </div>
              </div>
              <h4 className="uk-margin">Alergias</h4>
              <div className="uk-margin">
                <label className="uk-form-label" htmlFor="date">Agentes Biológicos:</label>
                <div className="uk-form-controls">
                  <input className="uk-input" type="text" name="allergies" onChange={handleInput} placeholder="Introducir alergéno" />
                </div>
                <label className="uk-form-label" htmlFor="date">Alimentos:</label>
                <div className="uk-form-controls">
                  <input className="uk-input" type="text" name="allergies" onChange={handleInput} placeholder="Introducir alergéno" />
                </div>
                <label className="uk-form-label" htmlFor="date">Insectos:</label>
                <div className="uk-form-controls">
                  <input className="uk-input" type="text" name="allergies" onChange={handleInput} placeholder="Introducir alergéno" />
                </div>
                <label className="uk-form-label" htmlFor="date">Medicamentos:</label>
                <div className="uk-form-controls">
                  <input className="uk-input" type="text" name="allergies" onChange={handleInput} placeholder="Introducir alergéno" />
                </div>
              </div>
              <div className="uk-width-1-1 uk-flex uk-flex-center">
                <button type="submit" className="uk-button uk-button-primary uk-button-small uk-border-pill" disabled={isButtonDisabled} onClick={event => setRoute('none')} >
                  Crear Historial
                </button>
              </div>
            </form>
          </div>
        )
      }
      </div>)

}

export default MedHistory