import React, { useEffect, useContext, useState } from 'react';           // Import React and useContext hook
import { useHistory } from 'react-router-dom';                  // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                  // Import AppContext to use created context
import useForm from '../../hooks/useForm';                      // Import useForm custom hook
import UIkit from 'uikit';                                      // Import UIkit for notifications
import moment from 'moment';                                    // Import momentjs for date formatting

import { getMedicalHistory, createMedicalHistory, editMedicalHistory } from '../../services/medhistory-services';  // Import edit API call

import Questionnaire from '../common/questionnaire/Questionnaire'
import CatalogSearchbar from '../common/CatalogSearchbar'

const MedHistory = () => {

  const { form, setForm, handleInput, handleFileInput } = useForm();
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(false);
  const [ medHistory, setMedHistory ] = useState({});
  const [ healthHistoryState, setHealthHistoryState ] = useState({
    "Diabetes": false,
    "Hipertensión": false,
    "Asma": false,
    "Alergias": false,
    "Enfermedades del Corazón": false,
    "Enfermedades del Hígado": false,
    "Enfermedades del Riñón": false,
    "Enfermedades Endócrinas": false,
    "Enfermedades del Sist. Digestivo": false,
    "Enfermedades Mentales": false,
    "Cáncer": false,
    "Otras": false
  })
  
  const { user, setUser, route, setRoute } = useContext(AppContext); // Destructure user state variable
  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user

  let healthHistoryObj = {
    "Diabetes": false,
    "Hipertensión": false,
    "Asma": false,
    "Alergias": false,
    "Enfermedades del Corazón": false,
    "Enfermedades del Hígado": false,
    "Enfermedades del Riñón": false,
    "Enfermedades Endócrinas": false,
    "Enfermedades del Sist. Digestivo": false,
    "Enfermedades Mentales": false,
    "Cáncer": false,
    "Otras": false
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

      setMedHistory(medicalHistory);

    });

  }, [user] );

  // Declare function for form submit event
  const handleSubmit = (event) => {

    event.preventDefault();               // Prevent page reloading after submit action
    setIsButtonDisabled(true);

    form['health_history'] = {...healthHistoryState};
    // form['health_history'] = healthHistoryObj;
    // form['allergies'] = allergiesObj;
    form['weekly_exercise_hours'] = parseInt(weekly_exercise_hours);
    
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

    const { name, value, id, checked } = event.target;

    switch ( name ) {
      case 'health_history':
        // healthHistoryObj[value] = !healthHistoryObj[value];
        setHealthHistoryState( prevState => ({...prevState, [value]: checked}))
        // console.log(healthHistoryState)
        // setForm( prevState => ({...prevState, ['health_history']: healthHistoryObj}) );
        break;
      case 'allergies':
        allergiesObj[id] = value;
        // console.log(allergiesObj)
        // setForm( prevState => ({...prevState, ['allergies']: allergiesObj}) );
        break;
      case 'weekly_exercise_hours':
        weekly_exercise_hours = parseInt(value)
    }

    // console.log(healthHistoryObj)
    // console.log(allergiesObj)
  }

  const medHistoryQuestionnaire = [
    <div className="">
      <h4 className="uk-margin">Antecedentes Heredo-Familiares</h4>
      <div className="uk-margin">
        <p>Si seleccionas una casilla, por favor indica el familiar</p>
        <div className="uk-form-controls uk-flex">
          <div className="uk-width-1-1 uk-flex uk-flex-column">
            <div className="uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
              <label><input className="uk-checkbox" type="checkbox" name="family_diabetes" onChange={handleInput} defaultChecked={medHistory ? medHistory.family_diabetes : null}/> Diabetes</label>
              <div className="uk-form-controls">
                <select name="family_diabetes_patient" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={medHistory ? medHistory.family_diabetes_patient : ""}>
                  <option>Ninguno</option>
                  <option>Padre</option>
                  <option>Madre</option>
                  <option>Hermano(a)</option>
                  <option>Abuelo(a) Paterno</option>
                  <option>Abuelo(a) Materno</option>
                  <option>Tío(a) Paterno</option>
                  <option>Tío(a) Materno</option>
                </select>
              </div>
            </div>
            <div className="uk-width-1-1 uk-flex uk-flex-column">
              <div className="uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                <label><input className="uk-checkbox" type="checkbox" name="family_hypertension" onChange={handleInput} defaultChecked={medHistory ? medHistory.family_hypertension : null} /> Hipertensión</label>
                <div className="uk-form-controls">
                  <select name="family_hypertension_patient" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={medHistory ? medHistory.family_hypertension_patient : ""}>
                    <option>Ninguno</option>
                    <option>Padre</option>
                    <option>Madre</option>
                    <option>Hermano(a)</option>
                    <option>Abuelo(a) Paterno</option>
                    <option>Abuelo(a) Materno</option>
                    <option>Tío(a) Paterno</option>
                    <option>Tío(a) Materno</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="uk-width-1-1 uk-flex uk-flex-column">
              <div className="uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                <label><input className="uk-checkbox" type="checkbox" name="family_asthma" onChange={handleInput} defaultChecked={medHistory ? medHistory.family_asthma : null} /> Asma</label>
                <div className="uk-form-controls">
                  <select name="family_asthma_patient" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={medHistory ? medHistory.family_asthma_patient : ""}>
                    <option>Ninguno</option>
                    <option>Padre</option>
                    <option>Madre</option>
                    <option>Hermano(a)</option>
                    <option>Abuelo(a) Paterno</option>
                    <option>Abuelo(a) Materno</option>
                    <option>Tío(a) Paterno</option>
                    <option>Tío(a) Materno</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="uk-width-1-1 uk-flex uk-flex-column">
              <div className="uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                <label><input className="uk-checkbox" type="checkbox" name="family_allergies" onChange={handleInput} defaultChecked={medHistory ? medHistory.family_allergies : null} /> Alergias</label>
                <div className="uk-form-controls">
                  <select name="family_allergies_patient" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={medHistory ? medHistory.family_allergies_patient : ""}>
                    <option>Ninguno</option>
                    <option>Padre</option>
                    <option>Madre</option>
                    <option>Hermano(a)</option>
                    <option>Abuelo(a) Paterno</option>
                    <option>Abuelo(a) Materno</option>
                    <option>Tío(a) Paterno</option>
                    <option>Tío(a) Materno</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="uk-width-1-1 uk-flex uk-flex-column">
              <div className="uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                <label><input className="uk-checkbox" type="checkbox" name="family_heart_disease" onChange={handleInput} defaultChecked={medHistory ? medHistory.family_heart_disease : null} /> Enfermedades del Corazón</label>
                <div className="uk-form-controls">
                  <select name="family_heart_disease_patient" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={medHistory ? medHistory.family_heart_disease_patient : ""}>
                    <option>Ninguno</option>
                    <option>Padre</option>
                    <option>Madre</option>
                    <option>Hermano(a)</option>
                    <option>Abuelo(a) Paterno</option>
                    <option>Abuelo(a) Materno</option>
                    <option>Tío(a) Paterno</option>
                    <option>Tío(a) Materno</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="uk-width-1-1 uk-flex uk-flex-column">
              <div className="uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                <label><input className="uk-checkbox" type="checkbox" name="family_liver_disease" onChange={handleInput} defaultChecked={medHistory ? medHistory.family_liver_disease : null} /> Enfermedades del Hígado</label>
                <div className="uk-form-controls">
                  <select name="family_liver_disease_patient" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={medHistory ? medHistory.family_liver_disease_patient : ""}>
                    <option>Ninguno</option>
                    <option>Padre</option>
                    <option>Madre</option>
                    <option>Hermano(a)</option>
                    <option>Abuelo(a) Paterno</option>
                    <option>Abuelo(a) Materno</option>
                    <option>Tío(a) Paterno</option>
                    <option>Tío(a) Materno</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="uk-width-1-1 uk-flex uk-flex-column">
              <div className="uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                <label><input className="uk-checkbox" type="checkbox" name="family_digestive_disease" onChange={handleInput} defaultChecked={medHistory ? medHistory.family_digestive_disease : null} /> Enfermedades del Sist. Digestivo</label>
                <div className="uk-form-controls">
                  <select name="family_digestive_disease_patient" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={medHistory ? medHistory.family_digestive_disease_patient : ""}>
                    <option>Ninguno</option>
                    <option>Padre</option>
                    <option>Madre</option>
                    <option>Hermano(a)</option>
                    <option>Abuelo(a) Paterno</option>
                    <option>Abuelo(a) Materno</option>
                    <option>Tío(a) Paterno</option>
                    <option>Tío(a) Materno</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="uk-width-1-1 uk-flex uk-flex-column">
              <div className="uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                <label><input className="uk-checkbox" type="checkbox" name="family_kidney_disease" onChange={handleInput} defaultChecked={medHistory ? medHistory.family_kidney_disease : null} /> Enfermedades del Riñón</label>
                <div className="uk-form-controls">
                  <select name="family_kidney_disease_patient" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={medHistory ? medHistory.family_kidney_disease_patient : ""}>
                    <option>Ninguno</option>
                    <option>Padre</option>
                    <option>Madre</option>
                    <option>Hermano(a)</option>
                    <option>Abuelo(a) Paterno</option>
                    <option>Abuelo(a) Materno</option>
                    <option>Tío(a) Paterno</option>
                    <option>Tío(a) Materno</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="uk-width-1-1 uk-flex uk-flex-column">
              <div className="uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                <label><input className="uk-checkbox" type="checkbox" name="family_endocrin_disease" onChange={handleInput} defaultChecked={medHistory ? medHistory.family_diabetes : null} /> Enfermedades Endócrinas</label>
                <div className="uk-form-controls">
                  <select name="family_endocrin_disease_patient" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={medHistory ? medHistory.family_endocrin_disease_patient : ""}>
                    <option>Ninguno</option>
                    <option>Padre</option>
                    <option>Madre</option>
                    <option>Hermano(a)</option>
                    <option>Abuelo(a) Paterno</option>
                    <option>Abuelo(a) Materno</option>
                    <option>Tío(a) Paterno</option>
                    <option>Tío(a) Materno</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="uk-width-1-1 uk-flex uk-flex-column">
              <div className="uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                <label><input className="uk-checkbox" type="checkbox" name="family_mental_disease" onChange={handleInput} defaultChecked={medHistory ? medHistory.family_mental_disease : null} /> Enfermedades Mentales</label>
                <div className="uk-form-controls">
                  <select name="family_mental_disease_patient" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={medHistory ? medHistory.family_mental_disease_patient : ""}>
                    <option>Ninguno</option>
                    <option>Padre</option>
                    <option>Madre</option>
                    <option>Hermano(a)</option>
                    <option>Abuelo(a) Paterno</option>
                    <option>Abuelo(a) Materno</option>
                    <option>Tío(a) Paterno</option>
                    <option>Tío(a) Materno</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="uk-width-1-1 uk-flex uk-flex-column">
              <div className="uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                <label><input className="uk-checkbox" type="checkbox" name="family_cancer" onChange={handleInput} defaultChecked={medHistory ? medHistory.family_cancer : null} /> Cáncer</label>
                <div className="uk-form-controls">
                  <select name="family_cancer_patient" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={medHistory ? medHistory.family_cancer_patient : ""}>
                    <option>Ninguno</option>
                    <option>Padre</option>
                    <option>Madre</option>
                    <option>Hermano(a)</option>
                    <option>Abuelo(a) Paterno</option>
                    <option>Abuelo(a) Materno</option>
                    <option>Tío(a) Paterno</option>
                    <option>Tío(a) Materno</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="uk-width-1-1 uk-flex uk-flex-column">
              <div className="uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                <label><input className="uk-checkbox" type="checkbox" name="family_other_disease" onChange={handleInput} defaultChecked={medHistory ? medHistory.family_other_disease : null} /> Otras</label>
                <div className="uk-form-controls">
                  <select name="family_other_disease_patient" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={medHistory ? medHistory.family_other_disease_patient : ""}>
                    <option>Ninguno</option>
                    <option>Padre</option>
                    <option>Madre</option>
                    <option>Hermano(a)</option>
                    <option>Abuelo(a) Paterno</option>
                    <option>Abuelo(a) Materno</option>
                    <option>Tío(a) Paterno</option>
                    <option>Tío(a) Materno</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    <div className="">
      <h4 className="uk-margin">Antecedentes Personales Patológicos</h4>
      <div className="uk-margin">
        <label className="uk-form-label">Enfermedades Actuales:</label>
        <div className="uk-form-controls uk-flex">
          <div className="uk-width-1-2 uk-flex uk-flex-column">
            <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Diabetes" onChange={handleMedHistoryInput} /> Diabetes</label>
            <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Hipertensión" onChange={handleMedHistoryInput} /> Hipertensión</label>
            <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Asma" onChange={handleMedHistoryInput} /> Asma</label>
            <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Alergias" onChange={handleMedHistoryInput} /> Alergias</label>
            <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Enfermedades del Corazón" onChange={handleMedHistoryInput} /> Enfermedades del Corazón</label>
            <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Enfermedades del Hígado" onChange={handleMedHistoryInput} /> Enfermedades del Hígado</label>
          </div>
          <div className="uk-width-1-2 uk-flex uk-flex-column">
            <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Enfermedades del Riñón" onChange={handleMedHistoryInput} /> Enfermedades del Riñon</label>
            <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Enfermedades Endócrinas" onChange={handleMedHistoryInput} /> Enfermedades del Endócrinas</label>
            <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Enfermedades del Sist. Digestivo" onChange={handleMedHistoryInput} /> Enfermedades del Sist. Digestivo</label>
            <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Enfermedades Mentales" onChange={handleMedHistoryInput} /> Enfermedades Mentales</label>
            <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Cáncer" onChange={handleMedHistoryInput} /> Cáncer</label>
            <label><input className="uk-checkbox" type="checkbox" name="health_history" value="Otras" onChange={handleMedHistoryInput} /> Otras</label>
          </div>
        </div>
      </div>
      <div className="uk-margin">
        <label className="uk-form-label" htmlFor="form-stacked-text">Intervenciones Quirúrgicas:</label>
        <div className="uk-form-controls">
          <CatalogSearchbar type="procedure" form={form} handleFormInput={handleInput}/>
        </div>
      </div>
      <div className="uk-margin">
        <label className="uk-form-label" htmlFor="form-stacked-text">Alergias:</label>
        <div className="uk-form-controls">
          <input className="uk-input uk-border-pill" type="text" name="allergies" onChange={handleInput} placeholder="Introducir alergias..." />
        </div>
      </div>
      <div className="uk-margin">
        <label className="uk-form-label" htmlFor="form-stacked-text">Traumatismos:</label>
        <div className="uk-form-controls">
          <input className="uk-input uk-border-pill" type="text" name="traumatisms" onChange={handleInput} placeholder="Introducir traumatismos..." />
        </div>
      </div>
      <div className="uk-margin">
        <label className="uk-form-label" htmlFor="form-stacked-text">Hospitalizaciones Previas:</label>
        <div className="uk-form-controls">
          <input className="uk-input uk-border-pill" type="text" name="hospitalizations" onChange={handleInput} placeholder="Introducir hospitalizaciones..." />
        </div>
      </div>
      <div className="uk-margin">
        <label className="uk-form-label" htmlFor="form-stacked-text">Adicciones:</label>
        <div className="uk-form-controls">
          <input className="uk-input uk-border-pill" type="text" name="addictions" onChange={handleInput} placeholder="Introducir adicciones..." />
        </div>
      </div>
      <div className="uk-margin">
        <label className="uk-form-label" htmlFor="form-stacked-text">Otros:</label>
        <div className="uk-form-controls">
          <input className="uk-input uk-border-pill" type="text" name="others" onChange={handleInput} defaultValue={medHistory ? medHistory.others : "Introducir otros..."} />
        </div>
      </div>
    </div>,
    <div className="">
      <h4 className="uk-margin">Antecedentes Personales No Patológicos</h4>
      <div className="uk-margin">
        <div className="uk-form-controls uk-flex">
          <div className="uk-width-1-1 uk-flex uk-flex-column">
            <label className="uk-form-label">Tabaquismo:</label>
            <div className="uk-form-controls">
              <select name="smoking_status" onChange={handleInput} className="uk-select uk-border-pill" defaultValue="">
                <option></option>
                <option>No fuma</option>
                <option>Moderado</option>
                <option>Intenso</option>
              </select>
            </div>
            <label className="uk-form-label">Alcoholismo:</label>
            <div className="uk-form-controls">
              <select name="alcoholism" onChange={handleInput} className="uk-select uk-border-pill" defaultValue="">
                <option></option>
                <option>No toma</option>
                <option>Moderado</option>
                <option>Intenso</option>
              </select>
            </div>
            <label className="uk-form-label">Hábitos Alimenticios:</label>
            <div className="uk-form-controls">
              <select name="nutritional_status" onChange={handleInput} className="uk-select uk-border-pill" defaultValue="">
                <option></option>
                <option>Buenos</option>
                <option>Regular</option>
                <option>Malos</option>
              </select>
            </div>
            <label className="uk-form-label">Sueño:</label>
            <div className="uk-form-controls">
              <select name="sleep_status" onChange={handleInput} className="uk-select uk-border-pill" defaultValue="">
                <option></option>
                <option>Duerme bien</option>
                <option>Duerme mal</option>
              </select>
            </div>
            <label className="uk-form-label">Horas de Ejercicio Semanales:</label>
            <div className="uk-form-controls">
              <input className="uk-input uk-border-pill" type="number" name="weekly_exercise_hours" onChange={handleMedHistoryInput} />
            </div>
            <label className="uk-form-label">Higiene Bucal:</label>
            <div className="uk-form-controls">
              <select name="oral_hygiene" onChange={handleInput} className="uk-select uk-border-pill" defaultValue="">
                <option></option>
                <option>1 Vez al día</option>
                <option>2 Veces al día</option>
                <option>3 Veces al día</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>,
  ]

  const backButton = (event) => setRoute('none')

  const [ step, setStep ] = useState(1);

  const changeStep = (index) => {
    setStep(index)
  }

  return (
    <div className="content">
      
      { route === 'none' && !medHistory ? (
          <div className="uk-section">
            <div className="uk-container uk-overflow-auto">
              <Questionnaire title="Registra tus Antecedentes" questionnaire={medHistoryQuestionnaire} handleSubmit={handleSubmit} form={form} backButton={backButton} isComplete={false}/>
            </div>
          </div>
        ) : route === 'none' ? (
          <div className="uk-section">
            <h2>Mis Antecedentes</h2>
            <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('edit')} >
              Editar historial
            </button>
            <div className="uk-container uk-overflow-auto">
              <div className="uk-flex uk-flex-center">
                <ul className="uk-dotnav">
                  <li onClick={() => changeStep(1)} key="1" className={ step === 1 ? "uk-active" : null }><a href="#">1</a></li>
                  <li onClick={() => changeStep(2)} key="2" className={ step === 2 ? "uk-active" : null }><a href="#">2</a></li>
                  <li onClick={() => changeStep(3)} key="3" className={ step === 3 ? "uk-active" : null }><a href="#">3</a></li>
                </ul>
              </div>
              <div className={ step === 1 ? "uk-visible" : "uk-hidden" }>
                <h4 className="uk-margin">Antecedentes Heredo-Familiares</h4>
                <div className="uk-width-1-1 uk-flex uk-flex-column">
                  <div className="uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                    <label> Diabetes: {medHistory ? medHistory.family_diabetes : "Negativo"}</label>
                    <div className="uk-form-controls">
                      <input disabled={true} className="uk-input uk-border-pill" defaultValue={medHistory ? medHistory.family_diabetes_patient : "Ninguno"} />
                    </div>
                  </div>
                  <div className="uk-width-1-1 uk-flex uk-flex-column">
                    <div className="uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                      <label> Hipertensión: {medHistory ? medHistory.family_hypertension : "Negativo"}</label>
                      <div className="uk-form-controls">
                        <input disabled={true} className="uk-input uk-border-pill" defaultValue={medHistory ? medHistory.family_hypertension_patient : "Ninguno"} />
                      </div>
                    </div>
                  </div>
                  <div className="uk-width-1-1 uk-flex uk-flex-column">
                    <div className="uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                      <label> Asma: {medHistory ? medHistory.family_asthma : "Negativo"}</label>
                      <div className="uk-form-controls">
                        <input disabled={true} className="uk-input uk-border-pill" defaultValue={medHistory ? medHistory.family_asthma_patient : "Ninguno"} />
                      </div>
                    </div>
                  </div>
                  <div className="uk-width-1-1 uk-flex uk-flex-column">
                    <div className="uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                      <label> Alergias: {medHistory ? medHistory.family_allergies : "Negativo"}</label>
                      <div className="uk-form-controls">
                        <input disabled={true} className="uk-input uk-border-pill" defaultValue={medHistory ? medHistory.family_allergies_patient : "Ninguno"} />
                      </div>
                    </div>
                  </div>
                  <div className="uk-width-1-1 uk-flex uk-flex-column">
                    <div className="uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                      <label> Enfermedades del Corazón: {medHistory ? medHistory.family_heart_disease : "Negativo"}</label>
                      <div className="uk-form-controls">
                        <input disabled={true} className="uk-input uk-border-pill" defaultValue={medHistory ? medHistory.family_heart_disease_patient : "Ninguno"} />
                      </div>
                    </div>
                  </div>
                  <div className="uk-width-1-1 uk-flex uk-flex-column">
                    <div className="uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                      <label> Enfermedades del Hígado: {medHistory ? medHistory.family_liver_disease : "Negativo"}</label>
                      <div className="uk-form-controls">
                        <input disabled={true} className="uk-input uk-border-pill" defaultValue={medHistory ? medHistory.family_liver_disease_patient : "Ninguno"} />
                      </div>
                    </div>
                  </div>
                  <div className="uk-width-1-1 uk-flex uk-flex-column">
                    <div className="uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                      <label> Enfermedades del Sist. Digestivo: {medHistory ? medHistory.family_digestive_disease : "Negativo"}</label>
                      <div className="uk-form-controls">
                        <input disabled={true} className="uk-input uk-border-pill" defaultValue={medHistory ? medHistory.family_digestive_disease_patient : "Ninguno"} />
                      </div>
                    </div>
                  </div>
                  <div className="uk-width-1-1 uk-flex uk-flex-column">
                    <div className="uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                      <label> Enfermedades del Riñón: {medHistory ? medHistory.family_kidney_disease : "Negativo"}</label>
                      <div className="uk-form-controls">
                        <input disabled={true} className="uk-input uk-border-pill" defaultValue={medHistory ? medHistory.family_kidney_disease_patient : "Ninguno"} />
                      </div>
                    </div>
                  </div>
                  <div className="uk-width-1-1 uk-flex uk-flex-column">
                    <div className="uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                      <label> Enfermedades Endócrinas: {medHistory ? medHistory.family_endocrin_disease : "Negativo"}</label>
                      <div className="uk-form-controls">
                        <input disabled={true} className="uk-input uk-border-pill" defaultValue={medHistory ? medHistory.family_endocrin_disease_patient : "Ninguno"} />
                      </div>
                    </div>
                  </div>
                  <div className="uk-width-1-1 uk-flex uk-flex-column">
                    <div className="uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                      <label> Enfermedades Mentales: {medHistory ? medHistory.family_mental_disease : "Negativo"}</label>
                      <div className="uk-form-controls">
                        <input disabled={true} className="uk-input uk-border-pill" defaultValue={medHistory ? medHistory.family_mental_disease_patient : "Ninguno"} />
                      </div>
                    </div>
                  </div>
                  <div className="uk-width-1-1 uk-flex uk-flex-column">
                    <div className="uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                      <label> Cáncer: {medHistory ? medHistory.family_cancer : "Negativo"}</label>
                      <div className="uk-form-controls">
                        <input disabled={true} className="uk-input uk-border-pill" defaultValue={medHistory ? medHistory.family_cancer_patient : "Ninguno"} />
                      </div>
                    </div>
                  </div>
                  <div className="uk-width-1-1 uk-flex uk-flex-column">
                    <div className="uk-flex uk-flex-middle uk-width-1-1 uk-child-width-1-2">
                      <label> Otras Enfermedades: {medHistory ? medHistory.family_other_disease : "Negativo"}</label>
                      <div className="uk-form-controls">
                        <input disabled={true} className="uk-input uk-border-pill" defaultValue={medHistory ? medHistory.family_other_disease_patient : "Ninguno"} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={ step === 2 ? "uk-visible" : "uk-hidden" }>
                <h4 className="uk-margin">Antecedentes Personales Patológicos</h4>
                <h5>Enfermedades Actuales</h5>
                <ul className="uk-list">
                  { medHistory.health_history ? Object.entries(medHistory.health_history).map( (entry, index) => {
                    if (entry[1] === true) 
                    return (<li key={index}>{entry[0]}</li>) 
                  else 
                    return null
                }) : 'Cargando' }
                </ul>
                <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="form-stacked-text">Intervenciones Quirúrgicas:</label>
                  <div className="uk-form-controls">
                    <input disabled={true} className="uk-input uk-border-pill" defaultValue={medHistory ? medHistory.procedure : "Ninguno"} />
                  </div>
                </div>
                <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="form-stacked-text">Alergias:</label>
                  <div className="uk-form-controls">
                    <input disabled={true} className="uk-input uk-border-pill" defaultValue={medHistory ? medHistory.allergies : "Ninguna"} />
                  </div>
                </div>
                <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="form-stacked-text">Traumatismos:</label>
                  <div className="uk-form-controls">
                    <input disabled={true} className="uk-input uk-border-pill" defaultValue={medHistory ? medHistory.traumatisms : "Ninguno"} />
                  </div>
                </div>
                <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="form-stacked-text">Hospitalizaciones Previas:</label>
                  <div className="uk-form-controls">
                    <input disabled={true} className="uk-input uk-border-pill" defaultValue={medHistory ? medHistory.hospitalizations : "Ninguno"} />
                  </div>
                </div>
                <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="form-stacked-text">Adicciones:</label>
                  <div className="uk-form-controls">
                    <input disabled={true} className="uk-input uk-border-pill" defaultValue={medHistory ? medHistory.addictions : "Ninguno"} />
                  </div>
                </div>
                <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="form-stacked-text">Otros:</label>
                  <div className="uk-form-controls">
                  <input disabled={true} className="uk-input uk-border-pill" defaultValue={medHistory ? medHistory.others : "Ninguno"} />
                  </div>
                </div>
              </div>
              <div className={ step === 3 ? "uk-visible" : "uk-hidden" }>
                <h4 className="uk-margin">Antecedentes Personales No Patológicos</h4>
                <p>Horas de actividad física a la semana: {medHistory.weekly_exercise_hours}</p>
                <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="form-stacked-text">Tabaquismo:</label>
                  <div className="uk-form-controls">
                  <input disabled={true} className="uk-input uk-border-pill" defaultValue={medHistory ? medHistory.smoking_status : "Ninguno"} />
                  </div>
                </div>
                <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="form-stacked-text">Alcoholismo:</label>
                  <div className="uk-form-controls">
                  <input disabled={true} className="uk-input uk-border-pill" defaultValue={medHistory ? medHistory.alcoholism : "Ninguno"} />
                  </div>
                </div>
                <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="form-stacked-text">Hábitos Alimenticios:</label>
                  <div className="uk-form-controls">
                  <input disabled={true} className="uk-input uk-border-pill" defaultValue={medHistory ? medHistory.nutritional_status : "Ninguno"} />
                  </div>
                </div>
                <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="form-stacked-text">Sueño:</label>
                  <div className="uk-form-controls">
                  <input disabled={true} className="uk-input uk-border-pill" defaultValue={medHistory ? medHistory.sleep_status : "Ninguno"} />
                  </div>
                </div>
                <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="form-stacked-text">Higiene Bucal:</label>
                  <div className="uk-form-controls">
                  <input disabled={true} className="uk-input uk-border-pill" defaultValue={medHistory ? medHistory.oral_hygiene : "Ninguno"} />
                  </div>
                </div>
              </div>
          </div>
        </div>
        ) : (
          <div className="uk-section">
          <div className="uk-container uk-overflow-auto">
            <Questionnaire title="Editar mis Antecedentes" questionnaire={medHistoryQuestionnaire} handleSubmit={handleSubmit} form={form} backButton={backButton} isComplete={true}/>
          </div>
            
          </div>
        )
      }
      </div>)

}

export default MedHistory