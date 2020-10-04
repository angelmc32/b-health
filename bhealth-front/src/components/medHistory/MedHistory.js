import React, { Fragment, useEffect, useContext, useState } from 'react';           // Import React and useContext hook
import { useHistory } from 'react-router-dom';                  // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                  // Import AppContext to use created context
import useForm from '../../hooks/useForm';                      // Import useForm custom hook
import UIkit from 'uikit';                                      // Import UIkit for notifications
import moment from 'moment';                                    // Import momentjs for date formatting


import { getMedicalHistory, createMedicalHistory, editMedicalHistory } from '../../services/medhistory-services';  // Import edit API call
import { logout } from '../../services/auth-services';    // Import logout service for logout functionality

import Questionnaire from '../common/questionnaire/Questionnaire'
import CatalogSearchbar from '../common/CatalogSearchbar'

const MedHistory = () => {

  const { form, resetForm, handleInput, handleFileInput } = useForm();
  const [ state, setState ] = useState({
    isUserEditing: false,
    isButtonDisabled: true,
    spinnerState: false,
    errorMessage: null,
    arrayModified: false
  });
  const [ medHistory, setMedHistory ] = useState({})
  const initializeFamilyHistory = [false, false, false, false, false, false, false];
  const initializeHealthHistory = {
    "Diabetes": false,
    "Hipertensión": false,
    "Asma": false,
    "Alergias": false,
    "Enfermedades del Corazón": false,
    "Enfermedades del Hígado": false,
    "Enfermedades del Riñón": false,
    "Enfermedades Endócrinas": false,
    "Enfermedades del Sistema Digestivo": false,
    "Enfermedades Mentales": false,
    "Cáncer": false,
    "Otras": false
  }
  const [ familyHistoryState, setFamilyHistoryState ] = useState({
    family_diabetes: initializeFamilyHistory,
    family_hypertension: initializeFamilyHistory,
    family_asthma: initializeFamilyHistory,
    family_allergies: initializeFamilyHistory,
    family_cancer: initializeFamilyHistory,
    family_heart_disease: initializeFamilyHistory,
    family_liver_disease: initializeFamilyHistory,
    family_digestive_disease: initializeFamilyHistory,
    family_kidney_disease: initializeFamilyHistory,
    family_endocrin_disease: initializeFamilyHistory,
    family_mental_disease: initializeFamilyHistory,
    family_other_disease: initializeFamilyHistory,
    health_history: initializeHealthHistory
  });
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(false)
  
  const [ healthHistoryState, setHealthHistoryState ] = useState({
    "Diabetes": false,
    "Hipertensión": false,
    "Asma": false,
    "Alergias": false,
    "Enfermedades del Corazón": false,
    "Enfermedades del Hígado": false,
    "Enfermedades del Riñón": false,
    "Enfermedades Endócrinas": false,
    "Enfermedades del Sistema Digestivo": false,
    "Enfermedades Mentales": false,
    "Cáncer": false,
    "Otras": false
  })
  
  const { user, setUser, resetUserContext} = useContext(AppContext); // Destructure user state variable
  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user

  // Hook to update component when user state variable is modified
  useEffect( () => {
    
    if ( !user._id ) {    // If there is no user logged in, send a notification and "redirect" to login

      // Send UIkit warning notification: User must log in
      UIkit.notification({
        message: '<p class="uk-text-center">Por favor inicia sesión</>',
        pos: 'bottom-center',
        status: 'warning'
      });
      
      return push('/login');         // If not logged in, "redirect" user to login

    };

    getMedicalHistory()
    .then( res => {

      const { medicalHistory } = res.data;
      setMedHistory(medicalHistory);
      // setFamilyHistoryState( prevState => ({...prevState, family_diabetes: medicalHistory.family_diabetes}))
      setFamilyHistoryState(medicalHistory)
      setHealthHistoryState(medicalHistory.health_history)
    })
    .catch( res => {
      console.log(res)
      const { msg } = res.response.data
      if (res.response.status === 401) {
        localStorage.clear();
        resetUserContext();
        push('/login');
      }
      UIkit.notification({
        message: `<p class="uk-text-center>${msg}</p>`,
        pos: 'bottom-center',
        status: 'danger'
      });

    });

    if ( form['smoking_status'] || form['alcoholism'] || form['weekly_exercise_hours'] || form['nutritional_status'] || form['sleep_status'] || form['oral_hygiene'] ) {
      setState( prevState => ({...prevState, errorMessage: null}))
    }

  }, [] );

  // Declare function for form submit event
  const handleSubmit = (event, name = null) => {

    event.preventDefault();               // Prevent page reloading after submit action
    setState( prevState => ({...prevState, isButtonDisabled: true}))

    if (name && name !== 'personal_habits') {
      form[name] = familyHistoryState[name]
      console.log(name, form[name])
    }
    else if (name === 'personal_habits') {
      if ( !form['smoking_status'] && !form['alcoholism'] && !form['weekly_exercise_hours'] && !form['nutritional_status'] && !form['sleep_status'] && !form['oral_hygiene'] ) {
        setState( prevState => ({...prevState, errorMessage: 'No has realizado cambios'}))
        return null
      }
    }

    editMedicalHistory(form)
    .then( res => {

      const { medicalHistory } = res.data   // Destructure updated user document from response
      
      setMedHistory(medicalHistory);              // Modify user state variable with updated information
      setIsButtonDisabled(false);
      resetForm();
      setState( prevState => ({...prevState, isUserEditing: !prevState.isUserEditing, errorMessage: null, isButtonDisabled: false}))

      // Send UIkit success notification
      UIkit.notification({
        message: '<p class="uk-text-center">Tu historial clínico fue actualizado exitosamente</p>',
        pos: 'bottom-center',
        status: 'success'
      });

    })
    .catch( res => {

      const { msg } = res.response.data
      setState( prevState => ({...prevState, isButtonDisabled: false}))
      // Send UIkit error notification
      if (res.response.status === 401) {
        localStorage.clear();
        resetUserContext();
        push('/login');
      } 
      else {
        UIkit.notification({
          message: `<p class="uk-text-center">${msg}</p>`,
          pos: 'bottom-center',
          status: 'danger'
        });
      }

    });

  };

  const handleCheckbox = (event) => {
    const { name, value, checked  } = event.target;
    if (name !== 'health_history') {
      const historyObject = [...familyHistoryState[name]];
      historyObject[value] = !historyObject[value];
      setFamilyHistoryState( prevState => ({...prevState, [name]: historyObject}))
    }
    else {
      const historyObject = {...familyHistoryState[name]};
      historyObject[value] = !historyObject[value];
      setFamilyHistoryState( prevState => ({...prevState, [name]: historyObject}))
    }
    
    
  }

  const toggleIsUserEditing = (event) => {
    event.preventDefault();
    resetForm();
    setState( prevState => ({...prevState, isUserEditing: !prevState.isUserEditing, errorMessage: null, isButtonDisabled: false}))
    setFamilyHistoryState(medHistory)
    document.getElementById('weekly_exercise_hours').value = familyHistoryState.weekly_exercise_hours
  }

  const toggleArrayEditing = (event, name) => {
    event.preventDefault()
    if (state.isUserEditing) {
      delete form[name]
      setFamilyHistoryState( prevState => ({...prevState, [name]: medHistory[name]}))
      setState( prevState => ({...prevState, isUserEditing: !prevState.isUserEditing, errorMessage: null, isButtonDisabled: true}))
    }
    else
      setState( prevState => ({...prevState, isUserEditing: !prevState.isUserEditing, errorMessage: null, isButtonDisabled: false, arrayModified: false}))
  }

  const removeElementFromArray = (event, name, elementIndex) => {
    event.preventDefault()
    const newArray = [...familyHistoryState[name]]
    newArray.splice(elementIndex,1)
    setFamilyHistoryState( prevState => ({...prevState, [name]: newArray}))
    setState( prevState => ({...prevState, arrayModified: true}))
  }

  const addElementToArray = (event, name) => {
    event.preventDefault()
    const newArray = [...familyHistoryState[name]]
    if ( !form[name] || form[name].length < 1 ) return null
    newArray.push(form[name])
    setFamilyHistoryState( prevState => ({...prevState, [name]: newArray}))
    setState( prevState => ({...prevState, arrayModified: true}))
    delete form[name]
  }

  return (
    <Fragment>
      <h2>Mis Antecedentes</h2>
      <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin-small-top">
        <ul className="uk-flex uk-flex-center uk-width-1-1 uk-margin-remove@s" uk-tab="connect: #my-id" >
          <li><a href="#" onClick={ state.isUserEditing ? toggleIsUserEditing : null }>Familiares</a></li>
          <li className="uk-active"><a href="#" onClick={ state.isUserEditing ? toggleIsUserEditing : null }>Personales</a></li>
        </ul>
      </div>
      <div id="my-id" className="uk-switcher" uk-switcher="true">
        <div className="uk-card uk-card-hover uk-card-body uk-padding-medium uk-padding@s">
          <h4 className="uk-margin-remove-bottom">Antecedentes Familiares</h4>
          <span className="uk-text-meta">Selecciona los familiares que han sido diagnosticados</span>
          <ul uk-accordion="true">
            <li>
              <a className="uk-accordion-title uk-text-left" href="#" onClick={ state.isUserEditing ? toggleIsUserEditing : null }><p className="uk-text-purple">Diabetes</p><span className="uk-text-meta uk-margin-left">{familyHistoryState.family_diabetes.filter(Boolean).length} {familyHistoryState.family_diabetes.filter(Boolean).length === 1 ? "familiar" : "familiares"}</span></a>
              <div className="uk-accordion-content uk-margin-remove-top">
                <div className="uk-width-1-1 uk-text-right">
                  <a className={ state.isUserEditing ? "uk-text-danger uk-margin-small" : "eva-edit"} href="#" onClick={toggleIsUserEditing}>
                    { state.isUserEditing ? "Cancelar cambios" : "Editar" }<span className="uk-margin-small-left" uk-icon={state.isUserEditing ? "ban" : "pencil"}></span>
                  </a>
                </div>
                <div className="uk-grid uk-child-width-1-2@s uk-grid-small uk-margin-small uk-text-left" uk-grid="true">
                  <label><input className="uk-checkbox" type="checkbox" name="family_diabetes" value={0} checked={familyHistoryState.family_diabetes[0] || false} onChange={handleCheckbox} disabled={!state.isUserEditing}/> Madre</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_diabetes" value={1} checked={familyHistoryState.family_diabetes[1] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Padre</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_diabetes" value={2} checked={familyHistoryState.family_diabetes[2] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Hermano(a)</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_diabetes" value={3} checked={familyHistoryState.family_diabetes[3] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Abuelo(a) Materno</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_diabetes" value={4} checked={familyHistoryState.family_diabetes[4] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Abuelo(a) Paterno</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_diabetes" value={5} checked={familyHistoryState.family_diabetes[5] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Tío(a) Materno</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_diabetes" value={6} checked={familyHistoryState.family_diabetes[6] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Tío(a) Paterno</label>
                </div>
                <div className="uk-width-1-1 uk-text-right" hidden={!state.isUserEditing}>
                  <a className="eva-edit" href="#" onClick={(event) => handleSubmit(event, 'family_diabetes')}>
                    Guardar cambios<span className="uk-margin-small-left" uk-icon="check"></span>
                  </a>
                </div>
              </div>
            </li>
            <li>
              <a className="uk-accordion-title uk-text-left" href="#" onClick={ state.isUserEditing ? toggleIsUserEditing : null }><p className="uk-text-purple">Hipertensión</p><span className="uk-text-meta uk-margin-left">{familyHistoryState.family_hypertension.filter(Boolean).length} {familyHistoryState.family_hypertension.filter(Boolean).length === 1 ? "familiar" : "familiares"}</span></a>
              <div className="uk-accordion-content uk-margin-small-top">
                <div className="uk-width-1-1 uk-text-right">
                  <a className={ state.isUserEditing ? "uk-text-danger uk-margin-small" : "eva-edit"} href="#" onClick={toggleIsUserEditing}>
                    { state.isUserEditing ? "Cancelar cambios" : "Editar" }<span className="uk-margin-small-left" uk-icon={state.isUserEditing ? "ban" : "pencil"}></span>
                  </a>
                </div>
                <div className="uk-grid uk-child-width-1-2@s uk-grid-small uk-margin-small uk-text-left" uk-grid="true">
                  <label><input className="uk-checkbox" type="checkbox" name="family_hypertension" value={0} checked={familyHistoryState.family_hypertension[0] || false} onChange={handleCheckbox} disabled={!state.isUserEditing}/> Madre</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_hypertension" value={1} checked={familyHistoryState.family_hypertension[1] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Padre</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_hypertension" value={2} checked={familyHistoryState.family_hypertension[2] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Hermano(a)</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_hypertension" value={3} checked={familyHistoryState.family_hypertension[3] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Abuelo(a) Materno</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_hypertension" value={4} checked={familyHistoryState.family_hypertension[4] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Abuelo(a) Paterno</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_hypertension" value={5} checked={familyHistoryState.family_hypertension[5] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Tío(a) Materno</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_hypertension" value={6} checked={familyHistoryState.family_hypertension[6] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Tío(a) Paterno</label>
                </div>
                <div className="uk-width-1-1 uk-text-right" hidden={!state.isUserEditing}>
                  <a className="eva-edit" href="#" onClick={(event) => handleSubmit(event, 'family_hypertension')}>
                    Guardar cambios<span className="uk-margin-small-left" uk-icon="check"></span>
                  </a>
                </div>
              </div>
            </li>
            <li>
              <a className="uk-accordion-title uk-text-left" href="#" onClick={ state.isUserEditing ? toggleIsUserEditing : null }><p className="uk-text-purple">Asma</p><span className="uk-text-meta uk-margin-left">{familyHistoryState.family_asthma.filter(Boolean).length} {familyHistoryState.family_asthma.filter(Boolean).length === 1 ? "familiar" : "familiares"}</span></a>
              <div className="uk-accordion-content uk-margin-small-top">
                <div className="uk-width-1-1 uk-text-right">
                  <a className={ state.isUserEditing ? "uk-text-danger uk-margin-small" : "eva-edit"} href="#" onClick={toggleIsUserEditing}>
                    { state.isUserEditing ? "Cancelar cambios" : "Editar" }<span className="uk-margin-small-left" uk-icon={state.isUserEditing ? "ban" : "pencil"}></span>
                  </a>
                </div>
                <div className="uk-grid uk-child-width-1-2@s uk-grid-small uk-margin-small uk-text-left" uk-grid="true">
                  <label><input className="uk-checkbox" type="checkbox" name="family_asthma" value={0} checked={familyHistoryState.family_asthma[0] || false} onChange={handleCheckbox} disabled={!state.isUserEditing}/> Madre</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_asthma" value={1} checked={familyHistoryState.family_asthma[1] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Padre</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_asthma" value={2} checked={familyHistoryState.family_asthma[2] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Hermano(a)</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_asthma" value={3} checked={familyHistoryState.family_asthma[3] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Abuelo(a) Materno</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_asthma" value={4} checked={familyHistoryState.family_asthma[4] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Abuelo(a) Paterno</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_asthma" value={5} checked={familyHistoryState.family_asthma[5] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Tío(a) Materno</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_asthma" value={6} checked={familyHistoryState.family_asthma[6] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Tío(a) Paterno</label>
                </div>
                <div className="uk-width-1-1 uk-text-right" hidden={!state.isUserEditing}>
                  {/* <button className="uk-button uk-button-primary uk-border-pill uk-button-small">
                    guardar cambios
                  </button> */}
                  <a className="eva-edit" href="#" onClick={(event) => handleSubmit(event, 'family_asthma')}>
                    Guardar cambios<span className="uk-margin-small-left" uk-icon="check"></span>
                  </a>
                </div>
              </div>
            </li>
            <li>
              <a className="uk-accordion-title uk-text-left" href="#" onClick={ state.isUserEditing ? toggleIsUserEditing : null }><p className="uk-text-purple">Alergias</p><span className="uk-text-meta uk-margin-left">{familyHistoryState.family_allergies.filter(Boolean).length} {familyHistoryState.family_allergies.filter(Boolean).length === 1 ? "familiar" : "familiares"}</span></a>
              <div className="uk-accordion-content uk-margin-small-top">
                <div className="uk-width-1-1 uk-text-right">
                  <a className={ state.isUserEditing ? "uk-text-danger uk-margin-small" : "eva-edit"} href="#" onClick={toggleIsUserEditing}>
                    { state.isUserEditing ? "Cancelar cambios" : "Editar" }<span className="uk-margin-small-left" uk-icon={state.isUserEditing ? "ban" : "pencil"}></span>
                  </a>
                </div>
                <div className="uk-grid uk-child-width-1-2@s uk-grid-small uk-margin-small uk-text-left" uk-grid="true">
                  <label><input className="uk-checkbox" type="checkbox" name="family_allergies" value={0} checked={familyHistoryState.family_allergies[0] || false} onChange={handleCheckbox} disabled={!state.isUserEditing}/> Madre</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_allergies" value={1} checked={familyHistoryState.family_allergies[1] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Padre</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_allergies" value={2} checked={familyHistoryState.family_allergies[2] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Hermano(a)</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_allergies" value={3} checked={familyHistoryState.family_allergies[3] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Abuelo(a) Materno</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_allergies" value={4} checked={familyHistoryState.family_allergies[4] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Abuelo(a) Paterno</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_allergies" value={5} checked={familyHistoryState.family_allergies[5] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Tío(a) Materno</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_allergies" value={6} checked={familyHistoryState.family_allergies[6] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Tío(a) Paterno</label>
                </div>
                <div className="uk-width-1-1 uk-text-right" hidden={!state.isUserEditing}>
                  <a className="eva-edit" href="#" onClick={(event) => handleSubmit(event, 'family_allergies')}>
                    Guardar cambios<span className="uk-margin-small-left" uk-icon="check"></span>
                  </a>
                </div>
              </div>
            </li>
            <li>
              <a className="uk-accordion-title uk-text-left" href="#" onClick={ state.isUserEditing ? toggleIsUserEditing : null }><p className="uk-text-purple">Cáncer</p><span className="uk-text-meta uk-margin-left">{familyHistoryState.family_cancer.filter(Boolean).length} {familyHistoryState.family_cancer.filter(Boolean).length === 1 ? "familiar" : "familiares"}</span></a>
              <div className="uk-accordion-content uk-margin-small-top">
                <div className="uk-width-1-1 uk-text-right">
                  <a className={ state.isUserEditing ? "uk-text-danger uk-margin-small" : "eva-edit"} href="#" onClick={toggleIsUserEditing}>
                    { state.isUserEditing ? "Cancelar cambios" : "Editar" }<span className="uk-margin-small-left" uk-icon={state.isUserEditing ? "ban" : "pencil"}></span>
                  </a>
                </div>
                <div className="uk-grid uk-child-width-1-2@s uk-grid-small uk-margin-small uk-text-left" uk-grid="true">
                  <label><input className="uk-checkbox" type="checkbox" name="family_cancer" value={0} checked={familyHistoryState.family_cancer[0] || false} onChange={handleCheckbox} disabled={!state.isUserEditing}/> Madre</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_cancer" value={1} checked={familyHistoryState.family_cancer[1] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Padre</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_cancer" value={2} checked={familyHistoryState.family_cancer[2] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Hermano(a)</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_cancer" value={3} checked={familyHistoryState.family_cancer[3] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Abuelo(a) Materno</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_cancer" value={4} checked={familyHistoryState.family_cancer[4] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Abuelo(a) Paterno</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_cancer" value={5} checked={familyHistoryState.family_cancer[5] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Tío(a) Materno</label>
                  <label><input className="uk-checkbox" type="checkbox" name="family_cancer" value={6} checked={familyHistoryState.family_cancer[6] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Tío(a) Paterno</label>
                </div>
                <div className="uk-width-1-1 uk-text-right" hidden={!state.isUserEditing}>
                  <a className="eva-edit" href="#" onClick={(event) => handleSubmit(event, 'family_cancer')}>
                    Guardar cambios<span className="uk-margin-small-left" uk-icon="check"></span>
                  </a>
                </div>
              </div>
            </li>
            
            <li>
              <h4 className="uk-accordion-title uk-text-left uk-text-light uk-margin-large-top">Enfermedades...</h4>
              <div className="uk-accordion-content">
              <ul uk-accordion="true">
                <li>
                  <a className="uk-accordion-title uk-text-left" href="#" onClick={ state.isUserEditing ? toggleIsUserEditing : null }><p className="uk-text-purple">del Corazón</p><span className="uk-text-meta uk-margin-left">{familyHistoryState.family_heart_disease.filter(Boolean).length} {familyHistoryState.family_heart_disease.filter(Boolean).length === 1 ? "familiar" : "familiares"}</span></a>
                  <div className="uk-accordion-content uk-margin-small-top">
                    <div className="uk-width-1-1 uk-text-right">
                      <a className={ state.isUserEditing ? "uk-text-danger uk-margin-small" : "eva-edit"} href="#" onClick={toggleIsUserEditing}>
                        { state.isUserEditing ? "Cancelar cambios" : "Editar" }<span className="uk-margin-small-left" uk-icon={state.isUserEditing ? "ban" : "pencil"}></span>
                      </a>
                    </div>
                    <div className="uk-grid uk-child-width-1-2@s uk-grid-small uk-margin-small uk-text-left" uk-grid="true">
                      <label><input className="uk-checkbox" type="checkbox" name="family_heart_disease" value={0} checked={familyHistoryState.family_heart_disease[0] || false} onChange={handleCheckbox} disabled={!state.isUserEditing}/> Madre</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_heart_disease" value={1} checked={familyHistoryState.family_heart_disease[1] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Padre</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_heart_disease" value={2} checked={familyHistoryState.family_heart_disease[2] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Hermano(a)</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_heart_disease" value={3} checked={familyHistoryState.family_heart_disease[3] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Abuelo(a) Materno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_heart_disease" value={4} checked={familyHistoryState.family_heart_disease[4] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Abuelo(a) Paterno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_heart_disease" value={5} checked={familyHistoryState.family_heart_disease[5] || false}  onChange={handleCheckbox} disabled={!state.isUserEditing} /> Tío(a) Materno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_heart_disease" value={6} checked={familyHistoryState.family_heart_disease[6] || false}  onChange={handleCheckbox} disabled={!state.isUserEditing} /> Tío(a) Paterno</label>
                    </div>
                    <div className="uk-width-1-1 uk-text-right" hidden={!state.isUserEditing}>
                      <a className="eva-edit" href="#" onClick={(event) => handleSubmit(event, 'family_heart_disease')}>
                        Guardar cambios<span className="uk-margin-small-left" uk-icon="check"></span>
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <a className="uk-accordion-title uk-text-left" href="#" onClick={ state.isUserEditing ? toggleIsUserEditing : null }><p className="uk-text-purple">del Hígado</p><span className="uk-text-meta uk-margin-left">{familyHistoryState.family_liver_disease.filter(Boolean).length} {familyHistoryState.family_liver_disease.filter(Boolean).length === 1 ? "familiar" : "familiares"}</span></a>
                  <div className="uk-accordion-content uk-margin-small-top">
                    <div className="uk-width-1-1 uk-text-right">
                      <a className={ state.isUserEditing ? "uk-text-danger uk-margin-small" : "eva-edit"} href="#" onClick={toggleIsUserEditing}>
                        { state.isUserEditing ? "Cancelar cambios" : "Editar" }<span className="uk-margin-small-left" uk-icon={state.isUserEditing ? "ban" : "pencil"}></span>
                      </a>
                    </div>
                    <div className="uk-grid uk-child-width-1-2@s uk-grid-small uk-margin-small uk-text-left" uk-grid="true">
                      <label><input className="uk-checkbox" type="checkbox" name="family_liver_disease" value={0} checked={familyHistoryState.family_liver_disease[0] || false} onChange={handleCheckbox} disabled={!state.isUserEditing}/> Madre</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_liver_disease" value={1} checked={familyHistoryState.family_liver_disease[1] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Padre</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_liver_disease" value={2} checked={familyHistoryState.family_liver_disease[2] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Hermano(a)</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_liver_disease" value={3} checked={familyHistoryState.family_liver_disease[3] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Abuelo(a) Materno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_liver_disease" value={4} checked={familyHistoryState.family_liver_disease[4] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Abuelo(a) Paterno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_liver_disease" value={5} checked={familyHistoryState.family_liver_disease[5] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Tío(a) Materno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_liver_disease" value={6} checked={familyHistoryState.family_liver_disease[6] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Tío(a) Paterno</label>
                    </div>
                    <div className="uk-width-1-1 uk-text-right" hidden={!state.isUserEditing}>
                      <a className="eva-edit" href="#" onClick={(event) => handleSubmit(event, 'family_liver_disease')}>
                        Guardar cambios<span className="uk-margin-small-left" uk-icon="check"></span>
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <a className="uk-accordion-title uk-text-left" href="#" onClick={ state.isUserEditing ? toggleIsUserEditing : null }><p className="uk-text-purple">del Sist. Digestivo</p><span className="uk-text-meta uk-margin-left">{familyHistoryState.family_digestive_disease.filter(Boolean).length} {familyHistoryState.family_digestive_disease.filter(Boolean).length === 1 ? "familiar" : "familiares"}</span></a>
                  <div className="uk-accordion-content uk-margin-small-top">
                    <div className="uk-width-1-1 uk-text-right">
                      <a className={ state.isUserEditing ? "uk-text-danger uk-margin-small" : "eva-edit"} href="#" onClick={toggleIsUserEditing}>
                        { state.isUserEditing ? "Cancelar cambios" : "Editar" }<span className="uk-margin-small-left" uk-icon={state.isUserEditing ? "ban" : "pencil"}></span>
                      </a>
                    </div>
                    <div className="uk-grid uk-child-width-1-2@s uk-grid-small uk-margin-small uk-text-left" uk-grid="true">
                      <label><input className="uk-checkbox" type="checkbox" name="family_digestive_disease" value={0} checked={familyHistoryState.family_digestive_disease[0] || false} onChange={handleCheckbox} disabled={!state.isUserEditing}/> Madre</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_digestive_disease" value={1} checked={familyHistoryState.family_digestive_disease[1] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Padre</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_digestive_disease" value={2} checked={familyHistoryState.family_digestive_disease[2] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Hermano(a)</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_digestive_disease" value={3} checked={familyHistoryState.family_digestive_disease[3] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Abuelo(a) Materno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_digestive_disease" value={4} checked={familyHistoryState.family_digestive_disease[4] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Abuelo(a) Paterno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_digestive_disease" value={5} checked={familyHistoryState.family_digestive_disease[5] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Tío(a) Materno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_digestive_disease" value={6} checked={familyHistoryState.family_digestive_disease[6] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Tío(a) Paterno</label>
                    </div>
                    <div className="uk-width-1-1 uk-text-right" hidden={!state.isUserEditing}>
                      <a className="eva-edit" href="#" onClick={(event) => handleSubmit(event, 'family_digestive_disease')}>
                        Guardar cambios<span className="uk-margin-small-left" uk-icon="check"></span>
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <a className="uk-accordion-title uk-text-left" href="#" onClick={ state.isUserEditing ? toggleIsUserEditing : null }><p className="uk-text-purple">del Riñón</p><span className="uk-text-meta uk-margin-left">{familyHistoryState.family_kidney_disease.filter(Boolean).length} {familyHistoryState.family_kidney_disease.filter(Boolean).length === 1 ? "familiar" : "familiares"}</span></a>
                  <div className="uk-accordion-content uk-margin-small-top">
                    <div className="uk-width-1-1 uk-text-right">
                      <a className={ state.isUserEditing ? "uk-text-danger uk-margin-small" : "eva-edit"} href="#" onClick={toggleIsUserEditing}>
                        { state.isUserEditing ? "Cancelar cambios" : "Editar" }<span className="uk-margin-small-left" uk-icon={state.isUserEditing ? "ban" : "pencil"}></span>
                      </a>
                    </div>
                    <div className="uk-grid uk-child-width-1-2@s uk-grid-small uk-margin-small uk-text-left" uk-grid="true">
                      <label><input className="uk-checkbox" type="checkbox" name="family_kidney_disease" value={0} checked={familyHistoryState.family_kidney_disease[0] || false} onChange={handleCheckbox} disabled={!state.isUserEditing}/> Madre</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_kidney_disease" value={1} checked={familyHistoryState.family_kidney_disease[1] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Padre</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_kidney_disease" value={2} checked={familyHistoryState.family_kidney_disease[2] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Hermano(a)</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_kidney_disease" value={3} checked={familyHistoryState.family_kidney_disease[3] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Abuelo(a) Materno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_kidney_disease" value={4} checked={familyHistoryState.family_kidney_disease[4] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Abuelo(a) Paterno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_kidney_disease" value={5} checked={familyHistoryState.family_kidney_disease[5] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Tío(a) Materno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_kidney_disease" value={6} checked={familyHistoryState.family_kidney_disease[6] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Tío(a) Paterno</label>
                    </div>
                    <div className="uk-width-1-1 uk-text-right" hidden={!state.isUserEditing}>
                      <a className="eva-edit" href="#" onClick={(event) => handleSubmit(event, 'family_kidney_disease')}>
                        Guardar cambios<span className="uk-margin-small-left" uk-icon="check"></span>
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <a className="uk-accordion-title uk-text-left" href="#" onClick={ state.isUserEditing ? toggleIsUserEditing : null }><p className="uk-text-purple">Endócrinas</p><span className="uk-text-meta uk-margin-left">{familyHistoryState.family_endocrin_disease.filter(Boolean).length} {familyHistoryState.family_endocrin_disease.filter(Boolean).length === 1 ? "familiar" : "familiares"}</span></a>
                  <div className="uk-accordion-content uk-margin-small-top">
                    <div className="uk-width-1-1 uk-text-right">
                      <a className={ state.isUserEditing ? "uk-text-danger uk-margin-small" : "eva-edit"} href="#" onClick={toggleIsUserEditing}>
                        { state.isUserEditing ? "Cancelar cambios" : "Editar" }<span className="uk-margin-small-left" uk-icon={state.isUserEditing ? "ban" : "pencil"}></span>
                      </a>
                    </div>
                    <div className="uk-grid uk-child-width-1-2@s uk-grid-small uk-margin-small uk-text-left" uk-grid="true">
                      <label><input className="uk-checkbox" type="checkbox" name="family_endocrin_disease" value={0} checked={familyHistoryState.family_endocrin_disease[0] || false} onChange={handleCheckbox} disabled={!state.isUserEditing}/> Madre</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_endocrin_disease" value={1} checked={familyHistoryState.family_endocrin_disease[1] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Padre</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_endocrin_disease" value={2} checked={familyHistoryState.family_endocrin_disease[2] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Hermano(a)</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_endocrin_disease" value={3} checked={familyHistoryState.family_endocrin_disease[3] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Abuelo(a) Materno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_endocrin_disease" value={4} checked={familyHistoryState.family_endocrin_disease[4] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Abuelo(a) Paterno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_endocrin_disease" value={5} checked={familyHistoryState.family_endocrin_disease[5] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Tío(a) Materno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_endocrin_disease" value={6} checked={familyHistoryState.family_endocrin_disease[6] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Tío(a) Paterno</label>
                    </div>
                    <div className="uk-width-1-1 uk-text-right" hidden={!state.isUserEditing}>
                      <a className="eva-edit" href="#" onClick={(event) => handleSubmit(event, 'family_endocrin_disease')}>
                        Guardar cambios<span className="uk-margin-small-left" uk-icon="check"></span>
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <a className="uk-accordion-title uk-text-left" href="#" onClick={ state.isUserEditing ? toggleIsUserEditing : null }><p className="uk-text-purple">Mentales</p><span className="uk-text-meta uk-margin-left">{familyHistoryState.family_mental_disease.filter(Boolean).length} {familyHistoryState.family_mental_disease.filter(Boolean).length === 1 ? "familiar" : "familiares"}</span></a>
                  <div className="uk-accordion-content uk-margin-small-top">
                    <div className="uk-width-1-1 uk-text-right">
                      <a className={ state.isUserEditing ? "uk-text-danger uk-margin-small" : "eva-edit"} href="#" onClick={toggleIsUserEditing}>
                        { state.isUserEditing ? "Cancelar cambios" : "Editar" }<span className="uk-margin-small-left" uk-icon={state.isUserEditing ? "ban" : "pencil"}></span>
                      </a>
                    </div>
                    <div className="uk-grid uk-child-width-1-2@s uk-grid-small uk-margin-small uk-text-left" uk-grid="true">
                      <label><input className="uk-checkbox" type="checkbox" name="family_mental_disease" value={0} checked={familyHistoryState.family_mental_disease[0] || false} onChange={handleCheckbox} disabled={!state.isUserEditing}/> Madre</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_mental_disease" value={1} checked={familyHistoryState.family_mental_disease[1] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Padre</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_mental_disease" value={2} checked={familyHistoryState.family_mental_disease[2] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Hermano(a)</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_mental_disease" value={3} checked={familyHistoryState.family_mental_disease[3] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Abuelo(a) Materno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_mental_disease" value={4} checked={familyHistoryState.family_mental_disease[4] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Abuelo(a) Paterno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_mental_disease" value={5} checked={familyHistoryState.family_mental_disease[5] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Tío(a) Materno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_mental_disease" value={6} checked={familyHistoryState.family_mental_disease[6] || false} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Tío(a) Paterno</label>
                    </div>
                    <div className="uk-width-1-1 uk-text-right" hidden={!state.isUserEditing}>
                      <a className="eva-edit" href="#" onClick={(event) => handleSubmit(event, 'family_mental_disease')}>
                        Guardar cambios<span className="uk-margin-small-left" uk-icon="check"></span>
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <a className="uk-accordion-title uk-text-left" href="#" onClick={ state.isUserEditing ? toggleIsUserEditing : null }><p className="uk-text-purple">Otras</p><span className="uk-text-meta uk-margin-left">{familyHistoryState.family_other_disease.filter(Boolean).length} {familyHistoryState.family_other_disease.filter(Boolean).length === 1 ? "familiar" : "familiares"}</span></a>
                  <div className="uk-accordion-content uk-margin-small-top">
                    <div className="uk-width-1-1 uk-text-right">
                      <a className={ state.isUserEditing ? "uk-text-danger uk-margin-small" : "eva-edit"} href="#" onClick={toggleIsUserEditing}>
                        { state.isUserEditing ? "Cancelar cambios" : "Editar" }<span className="uk-margin-small-left" uk-icon={state.isUserEditing ? "ban" : "pencil"}></span>
                      </a>
                    </div>
                    <div className="uk-grid uk-child-width-1-2@s uk-grid-small uk-margin-small uk-text-left" uk-grid="true">
                      <label><input className="uk-checkbox" type="checkbox" name="family_other_disease" value={0} checked={medHistory.family_other_disease && !state.isUserEditing ? medHistory.family_other_disease[0] : familyHistoryState.family_other_disease[0]} onChange={handleCheckbox} disabled={!state.isUserEditing}/> Madre</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_other_disease" value={1} checked={medHistory.family_other_disease && !state.isUserEditing ? medHistory.family_other_disease[1] : familyHistoryState.family_other_disease[1]} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Padre</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_other_disease" value={2} checked={medHistory.family_other_disease && !state.isUserEditing ? medHistory.family_other_disease[2] : familyHistoryState.family_other_disease[2]} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Hermano(a)</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_other_disease" value={3} checked={medHistory.family_other_disease && !state.isUserEditing ? medHistory.family_other_disease[3] : familyHistoryState.family_other_disease[3]} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Abuelo(a) Materno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_other_disease" value={4} checked={medHistory.family_other_disease && !state.isUserEditing ? medHistory.family_other_disease[4] : familyHistoryState.family_other_disease[4]} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Abuelo(a) Paterno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_other_disease" value={5} checked={medHistory.family_other_disease && !state.isUserEditing ? medHistory.family_other_disease[5] : familyHistoryState.family_other_disease[5]} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Tío(a) Materno</label>
                      <label><input className="uk-checkbox" type="checkbox" name="family_other_disease" value={6} checked={medHistory.family_other_disease && !state.isUserEditing ? medHistory.family_other_disease[6] : familyHistoryState.family_other_disease[6]} onChange={handleCheckbox} disabled={!state.isUserEditing} /> Tío(a) Paterno</label>
                    </div>
                    <div className="uk-width-1-1 uk-text-right" hidden={!state.isUserEditing}>
                      <a className="eva-edit" href="#" onClick={(event) => handleSubmit(event, 'family_other_disease')}>
                        Guardar cambios<span className="uk-margin-small-left" uk-icon="check"></span>
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            </li>
          </ul>
        </div>
        <div className="uk-card uk-card-hover uk-card-body uk-padding-medium uk-padding@s">
          <h4 className="uk-margin-remove-bottom">Antecedentes Personales</h4>
          <ul uk-accordion="true">
            <li>
              <a className="uk-accordion-title uk-text-left" href="#" onClick={ state.isUserEditing ? toggleIsUserEditing : null }><p className="uk-text-purple">Padecimientos actuales</p><span className="uk-text-meta uk-margin-left">{ familyHistoryState.health_history ? Object.values(familyHistoryState.health_history).filter(Boolean).length : 'Cargando'} { familyHistoryState.health_history ? Object.values(familyHistoryState.health_history).filter(Boolean).length === 1 ? "padecimiento registrado" : "padecimientos registrados" : null}</span></a>
              <div className="uk-accordion-content uk-margin-small-top">
                <div className="uk-width-1-1 uk-text-right">
                  <a className={ state.isUserEditing ? "uk-text-danger uk-margin-small" : "eva-edit"} href="#" onClick={toggleIsUserEditing}>
                    { state.isUserEditing ? "Cancelar cambios" : "Editar" }<span className="uk-margin-small-left" uk-icon={state.isUserEditing ? "ban" : "pencil"}></span>
                  </a>
                </div>
                
                <div className="uk-grid uk-child-width-1-2@s uk-grid-small uk-margin-small uk-text-left" uk-grid="true">
                  {familyHistoryState.health_history ?
                    Object.entries(familyHistoryState.health_history).map( (keyValueArray, index) => 
                      <label key={index}>
                        <input className="uk-checkbox" type="checkbox" name="health_history" id={keyValueArray[0]} 
                          value={keyValueArray[0]}
                          checked={keyValueArray[1]} 
                          onChange={handleCheckbox} disabled={!state.isUserEditing} />
                        {` ${keyValueArray[0]}`}
                      </label>
                    ) : "Ocurrió un error"
                  }
                </div>
                <div className="uk-width-1-1 uk-text-right" hidden={!state.isUserEditing}>
                  <a className="eva-edit" href="#" onClick={(event) => handleSubmit(event, 'health_history')}>
                    Guardar cambios<span className="uk-margin-small-left" uk-icon="check"></span>
                  </a>
                </div>
              </div>
            </li>
            <li>
              <a className="uk-accordion-title uk-text-left" href="#" onClick={ state.isUserEditing ? toggleIsUserEditing : null }><p className="uk-text-purple uk-margin-remove">Alergias</p><span className="uk-text-meta uk-margin-left">{ familyHistoryState.allergies ? Object.values(familyHistoryState.allergies).length : 'Cargando'} { familyHistoryState.allergies ? Object.values(familyHistoryState.allergies).length === 1 ? "alergia registrada" : "alergias registradas" : null}</span></a>
              <div className="uk-accordion-content uk-margin-small">
                <div className="uk-width-1-1 uk-text-right">
                  <a className={ state.isUserEditing ? "uk-text-danger uk-margin-small" : "eva-edit"} href="#" onClick={ (event) => toggleArrayEditing(event, 'allergies') }>
                    { state.isUserEditing ? "Cancelar cambios" : "Editar" }<span className="uk-margin-small-left" uk-icon={state.isUserEditing ? "ban" : "pencil"}></span>
                  </a>
                </div>
                <ul className="uk-list uk-list-large uk-list-disc uk-text-left">
                  { familyHistoryState.allergies ?
                    familyHistoryState.allergies.map( (allergy, index) =>
                      <li className="uk-margin-left uk-flex" key={index}>
                        <span className="uk-width-4-5">{allergy}</span>
                        <a className="uk-width-1-5 uk-text-danger" uk-icon="trash" hidden={!state.isUserEditing} onClick={ (event) => removeElementFromArray(event, 'allergies', index) }></a>
                      </li>
                    )
                    : null
                  }
                  <li className="uk-margin-left uk-flex uk-flex-between uk-flex-middle" hidden={!state.isUserEditing || state.isButtonDisabled}>
                    <input className="uk-input uk-text uk-width-4-5 uk-border-pill" onChange={handleInput} name="allergies" type="text" value={ form['allergies'] ? form['allergies'] : ""}/>
                    <a className={ form['allergies'] ? "uk-width-1-5 eva-edit" : "uk-width-1-5 uk-text-muted"} uk-icon="plus-circle" hidden={!state.isUserEditing} onClick={ (event) => addElementToArray(event, 'allergies') }></a>
                  </li>
                </ul>
                <div className="uk-width-1-1 uk-text-right" hidden={!state.isUserEditing || !state.arrayModified}>
                  <a className="eva-edit" href="#" onClick={(event) => handleSubmit(event, 'allergies')}>
                    Guardar cambios<span className="uk-margin-small-left" uk-icon="check"></span>
                  </a>
                </div>
              </div>
            </li>
            <li>
              <a className="uk-accordion-title uk-text-left" href="#" onClick={ state.isUserEditing ? toggleIsUserEditing : null }><p className="uk-text-purple">Hábitos Personales</p></a>
              <div className="uk-accordion-content uk-margin-small-top">
                <a className={ state.isUserEditing ? "uk-text-danger uk-text-right" : "eva-edit uk-text-right"} href="#" onClick={toggleIsUserEditing}>
                  <p className="uk-margin-small">{state.isUserEditing ? "Cancelar cambios" : "Editar"}<span uk-icon={state.isUserEditing ? "ban" : "pencil"}></span></p>
                </a>
                <p className="uk-margin-remove">Horas de Actividad Física Semanal:</p>
                <div className="uk-form-controls uk-margin-small">
                  <input name="weekly_exercise_hours" onChange={handleInput} className="uk-input uk-border-pill uk-text-center" type="number" id="weekly_exercise_hours" defaultValue={familyHistoryState.weekly_exercise_hours ? familyHistoryState.weekly_exercise_hours : null } disabled={!state.isUserEditing} />
                </div>
                <p className="uk-margin-remove">Tabaquismo:</p>
                <div className="uk-form-controls uk-margin-small">
                  <input className="uk-input uk-border-pill uk-text-center" type="text" name="smoking_status" defaultValue={familyHistoryState.smoking_status} disabled={!state.isUserEditing} hidden={state.isUserEditing}/>
                  <select name="smoking_status" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={familyHistoryState.smoking_status ? familyHistoryState.smoking_status : ""} disabled={!state.isUserEditing} hidden={!state.isUserEditing}>
                    <option disabled></option>
                    <option>No fuma</option>
                    <option>Moderado</option>
                    <option>Intenso</option>
                  </select>
                </div>
                <p className="uk-margin-remove">Alcoholismo:</p>
                <div className="uk-form-controls uk-margin-small">
                  <input className="uk-input uk-border-pill uk-text-center" type="text" name="alcoholism" defaultValue={familyHistoryState.alcoholism} disabled={!state.isUserEditing} hidden={state.isUserEditing}/>
                  <select name="alcoholism" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={familyHistoryState.alcoholism ? familyHistoryState.alcoholism : ""} disabled={!state.isUserEditing} hidden={!state.isUserEditing}>
                    <option disabled></option>
                    <option>No bebe</option>
                    <option>Moderado</option>
                    <option>Intenso</option>
                  </select>
                </div>
                <p className="uk-margin-remove">Hábitos Alimenticios:</p>
                <div className="uk-form-controls uk-margin-small">
                  <input className="uk-input uk-border-pill uk-text-center" type="text" name="nutritional_status" defaultValue={familyHistoryState.nutritional_status} disabled={!state.isUserEditing} hidden={state.isUserEditing}/>
                  <select name="nutritional_status" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={familyHistoryState.nutritional_status ? familyHistoryState.nutritional_status : ""} disabled={!state.isUserEditing} hidden={!state.isUserEditing}>
                    <option disabled></option>
                    <option>Buenos</option>
                    <option>Regulares</option>
                    <option>Malos</option>
                  </select>
                </div>
                <p className="uk-margin-remove">Sueño:</p>
                <div className="uk-form-controls uk-margin-small">
                  <input className="uk-input uk-border-pill uk-text-center" type="text" name="sleep_status" defaultValue={familyHistoryState.sleep_status} disabled={!state.isUserEditing} hidden={state.isUserEditing}/>
                  <select name="sleep_status" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={familyHistoryState.sleep_status ? familyHistoryState.sleep_status : ""} disabled={!state.isUserEditing} hidden={!state.isUserEditing}>
                    <option disabled></option>
                    <option>Duerme bien</option>
                    <option>Duerme mal</option>
                  </select>
                </div>
                <p className="uk-margin-remove">Higiene Bucal:</p>
                <div className="uk-form-controls uk-margin-small">
                  <input className="uk-input uk-border-pill uk-text-center" type="text" name="oral_hygiene" defaultValue={familyHistoryState.oral_hygiene} disabled={!state.isUserEditing} hidden={state.isUserEditing}/>
                  <select name="oral_hygiene" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={familyHistoryState.oral_hygiene ? familyHistoryState.oral_hygiene : ""} disabled={!state.isUserEditing} hidden={!state.isUserEditing}>
                    <option disabled value=""></option>
                    <option>1 vez al día</option>
                    <option>2 veces al día</option>
                    <option>3 veces al día</option>
                  </select>
                </div>
                <p className="uk-text-danger uk-text-center uk-margin-small">{state.errorMessage}</p>
                <div className="uk-width-1-1 uk-text-right uk-margin-small" hidden={!state.isUserEditing}>
                  <a className="eva-edit" href="#" onClick={(event) => handleSubmit(event, 'personal_habits')}>
                    Guardar cambios<span className="uk-margin-small-left" uk-icon="check"></span>
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Fragment>
  )
}

export default MedHistory