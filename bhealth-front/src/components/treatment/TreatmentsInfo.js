import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import useForm from '../../hooks/useForm'
import moment from 'moment';                                        // Import momentjs for date formatting
import UIkit from 'uikit';
import 'moment/locale/es'  // without this line it didn't work

import { editTreatment, deleteTreatment } from '../../services/treatment-services'

moment.locale('es')

const TreatmentsInfo = ({url, action}) => {

  const { user, resetUserContext } = useContext(AppContext);
  const { form, resetForm, handleInput } = useForm();
  const { location, push } = useHistory();
  const [ state, setState ] = useState({
    isUserEditingTreatment: false,
    isUserEditingDrugs: false,
    isUserEditingIndications: false,
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
        setState( prevState => ({...prevState, treatment: location.state.treatment, extra_instructions: location.state.treatment.extra_instructions}) );
        console.log(location.state.treatment)
        }
      if ( location.state.treatmentID )
        treatmentID = location.state.treatmentID;
    }
    
  }, [])

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
    console.log(newArray)
    delete form[name]
  }

  const toggleIsUserEditing = (event, editingSection) => {
    event.preventDefault();
    resetForm();

    switch(editingSection) {
      case 'treatment': setState( prevState => ({...prevState, isUserEditingTreatment: !prevState.isUserEditingTreatment, isUserEditingDrugs: false, isUserEditingIndications: false, isUserAdding: false, errorMessage: null, isButtonDisabled: false, treatment: prevState.treatment}))
                    break;
      case 'drugs': setState( prevState => ({...prevState, isUserEditingDrugs: !prevState.isUserEditingDrugs, isUserEditingTreatment: false, isUserEditingIndications: false, isUserAdding: false, errorMessage: null, isButtonDisabled: false, treatment: prevState.treatment}))
                    break;
      case 'indications': setState( prevState => ({...prevState, isUserEditingIndications: !prevState.isUserEditingIndications, isUserEditingTreatment: false, isUserEditingDrugs: false, isUserAdding: false, errorMessage: null, isButtonDisabled: false, treatment: prevState.treatment, extra_instructions: prevState.treatment.extra_instructions}))
                    break;
      default: setState( prevState => ({...prevState, isUserEditingDrugs: false, isUserEditingTreatment: false, isUserEditingIndications: false, isUserAdding: false, errorMessage: null, isButtonDisabled: false, treatment: prevState.treatment}))
    }
    
  }

  const handleUpdate = (event, index, action = null, section) => {
    event.preventDefault();
    let newData = {}

    if ( section === 'treatment' ) {
      if ( form.start_date )
        form.start_date = moment(form.start_date).format()
      if ( form.end_date )
        form.end_date = moment(form.end_date).format()
      newData = form;
    }

    if ( section === 'drugs' ) {

      let { drugs } = state.treatment;

      if ( !form.duration_units )
        form['duration_units'] = 'Uso único'
      if ( form.duration_units === "Uso único" || form.duration_units === "Según sea necesario" )
        form['duration_number'] = 0;
      if ( !form.duration_number && form.duration_units !== "Uso único" && form.duration_units !== "Según sea necesario" )
        form['duration_number'] = 1;

      if ( action !== 'remove') {
        if ( index === -1 ) {
          if ( !form.name ) {
            setState( prevState => ({...prevState, errorMessage: 'El nombre es requerido'}))
            return;
          }
          
            drugs.push(form)
        }
        else {
          if ( Object.keys(form).length < 1 ) {
            setState( prevState => ({...prevState, errorMessage: 'Realiza un cambio para modificar el tratamiento'}))
            return;
          }
          for (let key in form) {
            drugs[index][key] = form[key]
          }
        }
      }
      else if ( action === 'remove' ) {
        drugs.splice(index, 1)
      }

      newData['drugs'] = drugs;
      
    }

    if ( section === 'indications' ) {
      if ( state.extra_instructions === state.treatment.extra_instructions ) {
        setState( prevState => ({...prevState, errorMessage: 'Realiza un cambio para modificar el tratamiento'}))
        return;
      }
      else
        newData['extra_instructions'] = state.extra_instructions;
    }
    
    editTreatment(state.treatment._id, newData)
    .then( res => {

      const { treatment } = res.data   // Destructure updated user document from response
      console.log('TREATMENT', treatment)
      resetForm();
      setState( prevState => ({...prevState, isUserEditingTreatment: false, isUserEditingDrugs: false, isUserEditingIndications: false, isButtonDisabled: false, spinnerState: false, treatment: treatment, errorMessage: null, isUserAdding: false}));
      push({pathname: `${url}/ver`, state: {treatment: treatment}})
      UIkit.notification({
        message: '<p class="uk-text-center">Se ha actualizado el tratamiento.</p>',
        pos: 'bottom-center',
        status: 'success'
      });
    })
    .catch( res => {

      const msg = res.response.data;
      console.log(res.response)

      // const { msg } = res.response.data;
      if ( msg === 'Sesión expirada. Reinicia sesión por favor.' ) {
        localStorage.clear();
        resetUserContext();
        UIkit.notification({
          message: `<p class="uk-text-center">${msg}</p>`,
          pos: 'bottom-center',
          status: 'warning'
        });
        push('/login');
      }
      else 
        UIkit.notification({
          message: `<p class="uk-text-center">${msg}</p>`,
          pos: 'bottom-center',
          status: 'danger'
        });

      setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}))
    });

  }

  const deleteTreatmentBtn = (treatmentID) => {

    setState( prevState => ({...prevState, isButtonDisabled: true, spinnerState: true}))

    deleteTreatment(treatmentID)
    .then( res => {

      const { treatment } = res.data
      setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}))
      // Send UIkit success notification
      UIkit.notification({
        message: '<p class="uk-text-center">Se ha eliminado el tratamiento exitosamente</p>',
        pos: 'bottom-center',
        status: 'success'
      });
      push(url);
    })
    .catch( res => {
      const { msg } = res.response.data
      if (res.response.status === 401) {
        localStorage.clear();
        resetUserContext();
        push('/login');
      }
      else
        UIkit.notification({
          message: `<p class="uk-text-center">${msg}</p>`,
          pos: 'bottom-center',
          status: 'danger'
        });
      setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}))
    })

  }

  return (
    <Fragment>
      <h2>{action !== 'delete' ? 'Ver Tratamiento' : 'Eliminar Tratamiento'}</h2>
      { action !== 'delete' ?
          <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={ event => { push(url) } } >
            Regresar
          </button>
        :
          !state.spinnerState ?
            <div className="uk-width-1-1 uk-flex uk-flex-column uk-flex-middle uk-margin-large-bottom">
              <div className="uk-width-1-1">
                <p>¿Estás seguro que deseas eliminar el siguiente tratamiento?</p>
              </div>
              <div className="uk-width-4-5 uk-width-1-2@s uk-flex uk-flex-around">
                <button className="uk-button uk-button-danger uk-border-pill uk-width-1-3" onClick={event=> deleteTreatmentBtn(state.treatment._id)} disabled={state.isButtonDisabled}>
                  Sí
                </button>
                <button className="uk-button uk-button-default uk-border-pill uk-width-1-3" onClick={ event => { push(url) } } >
                  No
                </button>
              </div>
            </div>
            :
            <button type="submit" className="uk-button uk-button-primary uk-button uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" disabled={state.isButtonDisabled} >
              Eliminando<div className={ state.spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
            </button>
          
      }
      <div className="uk-container uk-flex uk-flex-column uk-flex-middle">
        
        <div className="uk-width-1-1 uk-child-width-1-1 uk-grid-small uk-grid-match" uk-grid="true">
          <div>
            <div className="uk-card uk-card-hover uk-card-body uk-padding-small uk-flex uk-flex-column uk-flex-middle">
              <a className={ state.isUserEditingTreatment ? "uk-text-danger uk-position-top-right uk-position-small" : "eva-edit uk-position-top-right uk-position-small"} href="#" onClick={event => toggleIsUserEditing(event, 'treatment') }>
                <span uk-icon={state.isUserEditingTreatment ? "ban" : "pencil"}></span>
              </a>
              <h4 className="uk-margin-small uk-width-3-5@s">Datos del Tratamiento</h4>
              <label className="uk-form-label uk-text-left uk-margin-small-top uk-width-3-5@s" htmlFor="name">Nombre:</label>
              <div className="uk-form-controls uk-width-3-5@s">
                <input className="uk-input uk-border-pill uk-text-center" type="text" name="name" onChange={handleInput} defaultValue={state.treatment.name} disabled={!state.isUserEditingTreatment} />
              </div>
              <div className="uk-width-3-5@s uk-flex uk-flex-center uk-flex-wrap uk-margin-small-top">
                <div className="uk-flex uk-width-1-2@s uk-margin-small-top">
                  <label className="uk-form-label uk-text-center uk-margin-small-top uk-width-1-4" htmlFor="start_date">Inicio:</label>
                  {state.treatment.start_date ?
                    <div className="uk-form-controls uk-width-3-4">
                      <input className="uk-input uk-border-pill uk-text-center" type="date" name="start_date" onChange={handleInput} defaultValue={moment(state.treatment.start_date).format('YYYY-MM-DD')} disabled={!state.isUserEditingTreatment} />
                    </div> : null
                  }
                </div>
                <div className="uk-flex uk-width-1-2@s uk-margin-small-top">
                  <label className="uk-form-label uk-text-center uk-margin-small-top uk-width-1-4" htmlFor="end_date">Fin:</label>
                  {state.treatment.start_date ?
                    <div className="uk-form-controls uk-width-3-4">
                      <input className="uk-input uk-border-pill uk-text-center" type="date" name="end_date" onChange={handleInput} defaultValue={ moment(state.treatment.end_date).format('YYYY-MM-DD')} disabled={!state.isUserEditingTreatment} />
                    </div>
                    : <div className="uk-form-controls uk-width-3-4">
                        <input className="uk-input uk-border-pill uk-text-center" type="date" name="end_date" onChange={handleInput} disabled={!state.isUserEditingTreatment} />
                      </div> 
                  }
                </div>
              </div>
              <div className="uk-width-1-1 uk-width-3-5@s uk-text-right uk-margin-top" hidden={!state.isUserEditingTreatment}>
                <a className="eva-edit" href="#" onClick={(event) => handleUpdate(event, -1, null, 'treatment')}>
                  Guardar cambios<span className="uk-margin-small-left" uk-icon="check"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
          
          <div className="uk-width-1-1 uk-child-width-1-1 uk-child-width-1-2@s uk-grid-small uk-grid-match uk-flex uk-flex-around"  uk-grid="true">
            <div className="uk-width-1-2@s">
              <div className="uk-card uk-card-hover uk-card-body uk-padding-small uk-flex uk-flex-column uk-flex-middle">
                {/* <a className={ state.isUserEditing ? "uk-text-danger uk-position-top-right uk-position-small" : "eva-edit uk-position-top-right uk-position-small"} href="#" onClick={event => { event.preventDefault(); setState( prevState => ({...prevState, isUserEditingDrugs: !prevState.isUserEditingDrugs, isUserEditingTreatment: false, isUserEditingIndications: false}) )} }>
                  <span uk-icon={state.isUserEditing ? "ban" : "pencil"}></span>
                </a> */}
                <h4 className="uk-margin-small uk-width-3-5@s">Medicamentos</h4>
                <a className="eva-edit uk-position-small uk-position-top-right" uk-icon="icon: info"></a>
                <div className="uk-margin-small" uk-drop="mode: click">
                  <div className="uk-card uk-card-body uk-card-default">Introduce los nombres de los medicamentos a incluir en este tratamiento. Posteriormente podrás agregar recordatorios e información adicional.</div>
                </div>
                <ul className="uk-list uk-list-large uk-text-left uk-width-5-6" uk-accordion="true">
                  { state.treatment.drugs.length > 0 ?
                    state.treatment.drugs.map( (drug, index) =>
                      <li className="uk-flex uk-flex-column" key={index}>
                        <a className="uk-accordion-title uk-text-left uk-text-middle" href="#" onClick={ state.isUserEditingDrugs ? event => toggleIsUserEditing(event, 'drugs') : event => setState(prevState => ({...prevState, isUserAdding: false})) }>
                          <h5 className="uk-margin-remove">{index+1}. {drug.name}</h5>
                        </a>
                        <div className="uk-accordion-content uk-margin-small-top">
                          <div className="uk-width-1-1 uk-flex uk-flex-between">
                            <a className="uk-text-danger uk-margin-small" href="#" onClick={ event => handleUpdate(event, index, 'remove', 'drugs') }>
                              Eliminar<span className="uk-margin-small-left" uk-icon="trash"></span>
                            </a>
                            <a className={ state.isUserEditingDrugs ? "uk-text-danger" : "eva-edit"} href="#" onClick={event => toggleIsUserEditing(event, 'drugs')}>
                              { state.isUserEditingDrugs ? "Cancelar" : "Editar" }<span className="uk-margin-small-left" uk-icon={state.isUserEditingDrugs ? "ban" : "pencil"}></span>
                            </a>
                          </div>
                          <form onSubmit={event => handleUpdate(event, index, null, 'drugs')} className="uk-form-stacked uk-text-left">
                            <label className="uk-margin-remove">Nombre:</label>
                            <div className="uk-form-controls uk-margin-small">
                              <input className="uk-input uk-border-pill uk-text-center" type="text" name="name" onChange={handleInput} value={form.name !== undefined ? form.name : drug.name || ""} disabled={!state.isUserEditingDrugs} required />
                            </div>
                            <label className="uk-margin-remove">Presentación:</label>
                            <div className="uk-form-controls uk-margin-small">
                              <input className="uk-input uk-border-pill uk-text-center" type="text" name="dosage_form" onChange={handleInput} value={ !state.isUserEditingDrugs ? drug.dosage_form || "No registrada" : form.dosage_form || ""} placeholder="Tabletas, jarabe, etc..." disabled={!state.isUserEditingDrugs} />
                            </div>
                            <label className="uk-margin-remove">Duración:</label>
                            { !state.isUserEditingDrugs ? 
                                <div className="uk-form-controls uk-margin-small">
                                  <input className="uk-input uk-border-pill uk-text-center" type="text" name="duration" onChange={handleInput} value={`${drug.duration_number !== 0 ? drug.duration_number : ""} ${drug.duration_number < 2 ? drug.duration_units : drug.duration_units === "Mes" ? drug.duration_units+"es" : drug.duration_units+"s"}`} disabled={!state.isUserEditingDrugs} />
                                </div>
                              :
                              <div className="uk-flex uk-flex-between uk-margin-small">
                                { drug.duration_number || form.duration_units && form.duration_units !== "Uso único" && form.duration_units !== "Según sea necesario" ?
                                  <div className="uk-form-controls uk-width-1-3">
                                    <select name="duration_number" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={drug.duration_number || ""} disabled={!state.isUserEditingDrugs}>
                                      <option value={1}>1</option>
                                      <option value={2}>2</option>
                                      <option value={3}>3</option>
                                      <option value={4}>4</option>
                                      <option value={5}>5</option>
                                      <option value={6}>6</option>
                                    </select>
                                  </div>
                                  : null
                                }
                                <div className="uk-form-controls uk-width-expand">
                                  <select name="duration_units" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={drug.duration_units || " Uso único"} disabled={!state.isUserEditingDrugs}>
                                    <option> Uso único</option>
                                    <option>{ form.duration_number > 1 ? "Días" : "Día" }</option>
                                    <option>{ form.duration_number > 1 ? "Semanas" : "Semana" }</option>
                                    <option>{ form.duration_number > 1 ? "Meses" : "Mes" }</option>
                                    <option>Según sea necesario</option>
                                  </select>
                                </div>
                                
                              </div>
                            }
                            <label className="uk-margin-remove">Indicaciones:</label>
                            <div className="uk-form-controls uk-margin-small">
                              <input className="uk-input uk-border-pill uk-text-center" type="text" name="directions" onChange={handleInput} value={ !state.isUserEditingDrugs ? drug.directions || "No registradas" : form.directions || ""} placeholder="Tomar en ayuno, 2 veces al día, etc..." disabled={!state.isUserEditingDrugs} />
                            </div>
                            <p className="uk-text-center uk-text-danger">{state.errorMessage}</p>
                            <div className="uk-width-1-1 uk-text-right uk-margin" hidden={!state.isUserEditingDrugs}>
                              <button type="submit" className="uk-button uk-button-link eva-edit" href="#">
                                Guardar cambios<span className="uk-margin-small-left" uk-icon="check"></span>
                              </button>
                            </div>
                          </form>
                        </div>
                      </li>
                    )
                    : <li className={state.errorMessage ? "uk-text-danger uk-text-center" : "uk-text-center"}>No has agregado medicamentos</li>
                  }
                  
                </ul>
                <div className="uk-margin-small-top uk-flex uk-flex-column uk-flex-middle uk-width-5-6">
                  <button className="uk-button uk-button-default uk-border-pill uk-width-3-4 uk-width-1-2@m" onClick={ event => setState( prevState => ({...prevState, isUserAdding: !prevState.isUserAdding, isUserEditingTreatment: false, isUserEditingDrugs: false, isUserEditingIndications: false})) }>
                    { !state.isUserAdding ? "Agregar" : "Cancelar" }<span className="uk-margin-small-left" uk-icon={ !state.isUserAdding ? "plus-circle" : "ban" }></span>
                  </button>
                  <form onSubmit={event => handleUpdate(event, -1, 'add', 'drugs')} className="uk-form-stacked uk-text-left uk-margin uk-width-1-1" hidden={!state.isUserAdding}>
                    <h5 className="uk-text-center uk-margin-small">Agregar Medicamento a Tratamiento</h5>
                    <label className="uk-margin-remove">Nombre:</label>
                    <div className="uk-form-controls uk-margin-small">
                      <input className="uk-input uk-border-pill uk-text-center" type="text" name="name" onChange={handleInput} value={form.name || ""} required />
                    </div>
                    <label className="uk-margin-remove">Presentación:</label>
                    <div className="uk-form-controls uk-margin-small">
                      <input className="uk-input uk-border-pill uk-text-center" type="text" name="dosage_form" onChange={handleInput} value={form.dosage_form || ""} />
                    </div>
                    <label className="uk-margin-remove">Duración:</label>
                    <div className="uk-flex uk-flex-between uk-margin-small">
                      { form.duration_units && form.duration_units !== "Uso único" && form.duration_units !== "Según sea necesario" ?
                        <div className="uk-form-controls uk-width-1-3">
                          <select name="duration_number" onChange={handleInput} className="uk-select uk-border-pill" >
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                          </select>
                        </div>
                        : null
                      }
                      <div className="uk-form-controls uk-width-expand">
                        <select name="duration_units" onChange={handleInput} className="uk-select uk-border-pill" value={form.duration_units || "Uso único"} >
                          <option>Uso único</option>
                          <option>{ form.duration_number > 1 ? "Días" : "Día" }</option>
                          <option>{ form.duration_number > 1 ? "Semanas" : "Semana" }</option>
                          <option>{ form.duration_number > 1 ? "Meses" : "Mes" }</option>
                          <option>Según sea necesario</option>
                        </select>
                      </div>
                      
                    </div>
                    <label className="uk-margin-remove">Indicaciones:</label>
                    <div className="uk-form-controls uk-margin-small">
                      <input className="uk-input uk-border-pill uk-text-center" type="text" name="directions" onChange={handleInput} value={form.directions || ""} />
                    </div>
                    <p className="uk-text-center uk-text-danger">{state.errorMessage}</p>
                    <div className="uk-width-1-1 uk-text-right uk-margin">
                      <button type="submit" className="uk-button uk-button-link eva-edit" href="#">
                        Agregar<span className="uk-margin-small-left" uk-icon="plus-circle"></span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="uk-width-1-2@s">
              <div className="uk-card uk-card-hover uk-card-body uk-padding-small uk-flex uk-flex-column uk-flex-middle">
                <h4 className="uk-margin-small uk-width-3-5@s">Otras Indicaciones</h4>
                <a className={ state.isUserEditingIndications ? "uk-text-danger uk-position-small uk-position-top-right" : "eva-edit uk-position-small uk-position-top-right"} href="#" onClick={event => toggleIsUserEditing(event, 'indications') }>
                  <span uk-icon={state.isUserEditingIndications ? "ban" : "pencil"}></span>
                </a>
                <ul className="uk-list uk-list-large uk-text-left uk-width-5-6">
                  { state.extra_instructions.length > 0 ?
                    state.extra_instructions.map( (indication, index) =>
                      <li className="uk-flex" key={index}>
                        <h5 className="uk-width-expand uk-margin-remove">{index+1}. {indication}</h5>
                        <a className="uk-width-1-5 uk-text-danger uk-text-right" uk-icon="trash" hidden={!state.isUserEditingIndications} onClick={ (event) => removeElementFromArray(event, 'extra_instructions', index) }></a>
                      </li>
                    )
                    : <li className="uk-text-center">No has agregado indicaciones</li>
                  }
                  <li className="uk-flex uk-flex-between uk-flex-middle" hidden={!state.isUserEditingIndications}>
                    <input className="uk-input uk-text-center uk-width-5-6 uk-border-pill" onChange={handleInput} name="extra_instructions" type="text" value={ form['extra_instructions'] ? form['extra_instructions'] : ""} placeholder="Reposo, dieta blanda, etc..."/>
                    <a className={ form['extra_instructions'] ? "uk-width-1-6 eva-edit uk-text-right" : "uk-width-1-6 uk-text-muted uk-text-right"} uk-icon="plus-circle" hidden={false /*!state.isUserEditing*/} onClick={ (event) => addElementToArray(event, 'extra_instructions') }></a>
                  </li>
                </ul>
                <div className="uk-width-1-1 uk-text-right" hidden={!state.isUserEditingIndications || !state.arrayModified}>
                  <a className="eva-edit" href="#" onClick={(event) => handleUpdate(event, -1, null, 'indications')}>
                    Guardar cambios<span className="uk-margin-small-left" uk-icon="check"></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        { state.errorMessage ? 
          <p className="uk-text-danger uk-text-center uk-margin-remove-bottom">{state.errorMessage}</p>
          : null 
        }
    </Fragment>
  )
}

export default TreatmentsInfo