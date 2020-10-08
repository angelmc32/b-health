import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import useForm from '../../hooks/useForm'
import moment from 'moment';                                        // Import momentjs for date formatting
import UIkit from 'uikit';

const TreatmentsInfo = ({url, action}) => {

  const { user, resetUserContext } = useContext(AppContext);
  const { form, handleInput } = useForm();
  const { location, push } = useHistory();
  const [ state, setState ] = useState({
    isButtonDisabled: false,
    spinnerState: false,
    errorMessage: null,
    arrayModified: false,
    treatment: {
      name: '',
      start_date: '',
      end_date: '',
      description: '',
      isActive: false,
      drugs: [],
      extra_instructions: []
    },
    drugs: [],
    extra_instructions: []
  });
  let treatmentID;

  if ( !location.state )
    push(url);

  useEffect( () => {
    if ( location.state && !state.treatment._id ) {
      if ( location.state.treatment ){
        setState( prevState => ({...prevState, treatment: location.state.treatment}) );
        }
      if ( location.state.treatmentID )
        treatmentID = location.state.treatmentID;
    }
    console.log(location.state.treatment)
  })

  const removeElementFromArray = (event, name, elementIndex) => {
    event.preventDefault()
    const newArray = [...state[name]]
    newArray.splice(elementIndex,1)
    setState( prevState => ({...prevState, arrayModified: true,  [name]: newArray}))
  }

  const addElementToArray = (event, name) => {
    event.preventDefault()
    const newArray = [...state[name]]
    if ( !form[name] || form[name].length < 1 ) return null
    newArray.push(form[name])
    setState( prevState => ({...prevState, arrayModified: true, [name]: newArray}))
    delete form[name]
  }

  return (
    <Fragment>
      <h2>{action !== 'delete' ? 'Ver Tratamiento' : 'Eliminar Tratamiento'}</h2>
      <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={ event => push(url) } >
        Regresar
      </button>
      <div className="uk-container uk-flex uk-flex-column uk-flex-middle">
        <div className="uk-width-1-1 uk-child-width-1-1 uk-grid-small uk-grid-match uk-margin-bottom" uk-grid="true">
          
          <div>
            <div className="uk-card uk-card-hover uk-card-body uk-padding-small uk-flex uk-flex-column uk-flex-middle">
              <h4 className="uk-margin-small uk-width-3-5@s">Datos del Tratamiento</h4>
              <label className="uk-form-label uk-text-left uk-margin-small-top uk-width-3-5@s" htmlFor="name">Nombre:</label>
              <div className="uk-form-controls uk-width-3-5@s">
                <input className="uk-input uk-border-pill uk-text-center" type="text" name="name" onChange={handleInput} defaultValue={state.treatment.name} required />
              </div>
              <label className="uk-form-label uk-text-left uk-margin-small-top uk-width-3-5@s" htmlFor="start_date">Fecha de inicio:</label>
              <div className="uk-form-controls uk-width-3-5@s">
                <input className="uk-input uk-border-pill uk-text-center" type="date" name="start_date" onChange={handleInput} defaultValue={moment(state.treatment.start_date).format('YYYY-MM-DD')} required />
              </div>
              
            </div>
          </div>

          <div className="uk-width-1-1 uk-child-width-1-1 uk-child-width-1-2@s uk-grid-small uk-grid-match uk-flex uk-flex-around"  uk-grid="true">
            <div className="uk-width-1-2@s">
              <div className="uk-card uk-card-hover uk-card-body uk-padding-small uk-flex uk-flex-column uk-flex-middle">
                <h4 className="uk-margin-small uk-width-3-5@s">Medicamentos</h4>
                <a className="eva-edit uk-position-small uk-position-top-right" uk-icon="icon: info"></a>
                <div className="uk-margin-small" uk-drop="mode: click">
                  <div className="uk-card uk-card-body uk-card-default">Introduce los nombres de los medicamentos a incluir en este tratamiento. Posteriormente podrás agregar recordatorios e información adicional.</div>
                </div>
                <ul className="uk-list uk-list-large uk-text-left uk-width-1-1 uk-width-3-5@s">
                  { state.drugs.length > 0 ?
                    state.drugs.map( (drug, index) =>
                      <li className="uk-margin-left uk-flex" key={index}>
                        <p className="uk-width-4-5 uk-margin-remove">{index+1}. {drug}</p>
                        <a className="uk-width-1-5 uk-text-danger uk-text-right" uk-icon="trash" hidden={false /*!state.isUserEditing*/} onClick={ (event) => removeElementFromArray(event, 'drugs', index) }></a>
                      </li>
                    )
                    : <li className={state.errorMessage ? "uk-text-danger uk-text-center" : "uk-text-center"}>No has agregado medicamentos</li>
                  }
                  <li className="uk-flex uk-flex-between uk-flex-middle" hidden={false /*!state.isUserEditing || state.isButtonDisabled*/}>
                    <input className="uk-input uk-text-center uk-width-5-6 uk-border-pill" onChange={handleInput} name="drugs" type="text" value={ form['drugs'] ? form['drugs'] : ""} placeholder="Nombre del medicamento"/>
                    <a className={ form['drugs'] ? "uk-width-1-6 eva-edit uk-text-right" : "uk-width-1-6 uk-text-muted uk-text-right"} uk-icon="plus-circle" hidden={false /*!state.isUserEditing*/} onClick={ (event) => addElementToArray(event, 'drugs') }></a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="uk-width-1-2@s">
              <div className="uk-card uk-card-hover uk-card-body uk-padding-small uk-flex uk-flex-column uk-flex-middle">
              <h4 className="uk-margin-small uk-width-3-5@s">Otras Indicaciones</h4>
              <a className="eva-edit uk-position-small uk-position-top-right" uk-icon="icon: info"></a>
                <div className="uk-margin-small" uk-drop="mode: click">
                  <div className="uk-card uk-card-body uk-card-default">Introduce cualquier otra indicación de tu médico: dieta, ejercicio, reposo, restricciones, etc.</div>
                </div>
                <ul className="uk-list uk-list-large uk-text-left uk-width-1-1 uk-width-3-5@s">
                  { state.extra_instructions.length > 0 ?
                    state.extra_instructions.map( (indication, index) =>
                      <li className="uk-margin-left uk-flex" key={index}>
                        <p className="uk-width-4-5 uk-margin-remove">{index+1}. {indication}</p>
                        <a className="uk-width-1-5 uk-text-danger uk-text-right" uk-icon="trash" hidden={false /*!state.isUserEditing*/} onClick={ (event) => removeElementFromArray(event, 'drugs', index) }></a>
                      </li>
                    )
                    : <li className="uk-text-center">No has agregado indicaciones</li>
                  }
                  <li className="uk-flex uk-flex-between uk-flex-middle" hidden={false /*!state.isUserEditing || state.isButtonDisabled*/}>
                    <input className="uk-input uk-text-center uk-width-5-6 uk-border-pill" onChange={handleInput} name="extra_instructions" type="text" value={ form['extra_instructions'] ? form['extra_instructions'] : ""} placeholder="Reposo, dieta blanda, etc..."/>
                    <a className={ form['extra_instructions'] ? "uk-width-1-6 eva-edit uk-text-right" : "uk-width-1-6 uk-text-muted uk-text-right"} uk-icon="plus-circle" hidden={false /*!state.isUserEditing*/} onClick={ (event) => addElementToArray(event, 'extra_instructions') }></a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        { state.errorMessage ? 
          <p className="uk-text-danger uk-text-center uk-margin-remove-bottom">{state.errorMessage}</p>
          : null 
        }
      </div>
    </Fragment>
  )
}

export default TreatmentsInfo