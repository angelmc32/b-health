import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import moment from 'moment';                                        // Import momentjs for date formatting
import UIkit from 'uikit';                                          // Import UIkit for notifications
import { getConsultation, deleteConsultation } from '../../services/consultation-services';
import 'moment/locale/es'  // without this line it didn't work
moment.locale('es')

const ConsultationInfo = ({ url, action }) => {

  const { user, resetUserContext } = useContext(AppContext);
  const { location, push } = useHistory();
  const [ state, setState ] = useState({
    isButtonDisabled: false,
    spinnerState: false,
    errorMsg: 'Ha ocurrido un error, intenta de nuevo',
    consultation: {
      doctor: '',
      doctor_specialty: '',
      date: '',
      chief_complaint: '',
      diagnosis: '',
      doctor_specialty: '',
      treatment: '',
      studies: []
    }
  });
  let consultationID;

  if ( !location.state )
    push(url);
  
  useEffect( () => {

    if ( !user._id ) {    // If there is no user logged in, send a notification and "redirect" to login
      // Send UIkit warning notification: User must log in
      UIkit.notification({
        message: '<p class="uk-text-center">Por favor inicia sesión',
        pos: 'bottom-center',
        status: 'warning'
      });
      return push('/login');         // If not logged in, "redirect" user to login

    };

    
    if ( location.state ) {
      if ( location.state.consultation ){
        setState( prevState => ({...prevState, consultation: location.state.consultation}) );}
      if ( location.state.consultationID )
        consultationID = location.state.consultationID;
    }
    if ( consultationID ) {
      getConsultation(consultationID)
      .then( res => {
        const { consultation } = res.data;
        setState( prevState => ({...prevState, consultation: consultation}) );
      })
      .catch( res => {
        let status;
        if ( res.response ) {
          setState( prevState => ({...prevState, errorMsg: res.response.data.msg}))
          status = res.response.status;
        }
        if (status === 401) {
          localStorage.clear();
          resetUserContext();
          UIkit.notification({
            message: `<p class="uk-text-center">${state.errorMsg}</p>`,
            pos: 'bottom-center',
            status: 'warning'
          });
          return push('/login');
        }
        else
          UIkit.notification({
            message: `<p class="uk-text-center">${state.errorMsg}</p>`,
            pos: 'bottom-center',
            status: 'danger'
          });
      });
    }

  }, [])

  const deleteConsultationBtn = (consultationID) => {

    setState( prevState => ({...prevState, isButtonDisabled: true, spinnerState: true}) )

    deleteConsultation(consultationID)
    .then( consultation => {
      setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}) )
      // Send UIkit success notification
      UIkit.notification({
        message: '<p class="uk-text-center">Se ha eliminado la consulta exitosamente</p>',
        pos: 'bottom-center',
        status: 'success'
      });
      push(url)
    })
    .catch( res => {
      
      let status;
      if ( res.response ) {
        setState( prevState => ({...prevState, errorMsg: res.response.data.msg}))
        status = res.response.status;
      }
      if (status === 401) {
        localStorage.clear();
        resetUserContext();
        UIkit.notification({
          message: `<p class="uk-text-center">${state.errorMsg}</p>`,
          pos: 'bottom-center',
          status: 'warning'
        });
        return push('/login');
      }
      else
        UIkit.notification({
          message: `<p class="uk-text-center">${state.errorMsg}</p>`,
          pos: 'bottom-center',
          status: 'danger'
        });

      setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}) )
      
    });

  }

  return (
    <div className="uk-container">
      <h2>{action === 'read' ? 'Ver Consulta' : 'Eliminar Consulta'}</h2>
      { action === 'read' ?
          <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={ event => { push(url) } } >
            Regresar
          </button>
        :
          !state.spinnerState ?
            <div className="uk-width-1-1 uk-flex uk-flex-column uk-flex-middle uk-margin-large-bottom">
              <div className="uk-width-1-1">
                <p>¿Estás seguro que deseas eliminar la siguiente consulta?</p>
              </div>
              <div className="uk-width-4-5 uk-width-1-2@s uk-flex uk-flex-around">
                <button className="uk-button uk-button-danger uk-border-pill uk-width-1-3" onClick={event=> deleteConsultationBtn(state.consultation._id)} disabled={state.isButtonDisabled}>
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
      <div className="uk-child-width-1-3@m uk-child-width-1-1 uk-grid-small uk-grid-match uk-margin" uk-grid="true">
        <div>
          <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
            <h4>Información</h4>
            <p>Doctor: {state.consultation.doctor}</p>
            <p>Especialidad: {state.consultation.doctor_specialty}</p>
            <p>Fecha de consulta: {moment(state.consultation.date).locale('es').format('LL')}</p>
            <p>Hora de consulta:  {moment(state.consultation.date).format('h')}:{moment(state.consultation.date).format('mm')}  {moment(state.consultation.date).format('A')}</p>
            
          </div>
        </div>
        <div>
          <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
            <h4>Consulta</h4>
            <p>Síntomas indicados por paciente: {state.consultation.chief_complaint}</p>
            <p>Diagnóstico: {state.consultation.diagnosis}</p>
          </div>
        </div>
        <div>
          <div className="uk-card uk-card-hover uk-card-body uk-padding-small">
            <h4>Tratamiento</h4>
            <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
              { state.consultation.treatment ? (
                  <button className="uk-modal-close uk-button uk-button-default uk-border-pill uk-margin-small uk-width-4-5 uk-width-2-3@s" onClick={event => push({ pathname: '/recetas/ver', state: {prescriptionID: state.consultation.treatment} }) } >
                    Ver Receta
                  </button>
                ) : (
                  <Fragment>
                    <p className="uk-margin-remove">Agregar:</p>
                    <button className="uk-modal-close uk-button uk-button-default uk-border-pill uk-margin-small uk-width-4-5 uk-width-2-3@s" onClick={event => push({ pathname: '/recetas/crear', state: {consultation: state.consultation} }) } >
                      Receta
                    </button>
                  </Fragment>
                )
              }
              { state.consultation.studies && state.consultation.studies.length > 0 ? (
                  <button className="uk-modal-close uk-button uk-button-default uk-border-pill uk-margin-small uk-width-4-5 uk-width-2-3@s" onClick={event => push({ pathname: `${url}/estudios`, state: {consultation: state.consultation} }) } >
                    Ver Estudios
                  </button>
                ) : (
                  <div className="uk-width-1-1 uk-flex uk-flex-column uk-flex-middle uk-flex-center">
                    <p className="uk-margin-remove">{ !state.consultation.treatment ? "o Estudio:" : "Agregar Estudio:"}</p>
                    <button className="uk-modal-close uk-button uk-button-default uk-border-pill uk-margin-small uk-width-4-5 uk-width-2-3@s" onClick={event => push({ pathname: '/laboratorio/crear', state: {consultation: state.consultation} }) } >
                      Laboratorio
                    </button>
                    <button className="uk-modal-close uk-button uk-button-default uk-border-pill uk-margin-small uk-width-4-5 uk-width-2-3@s" onClick={event => push({ pathname: '/imagenologia/crear', state: {consultation: state.consultation} }) } >
                      Imagen y/o Rayos X
                    </button>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
      {/* <button className="uk-button uk-button-primary uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin-small"  onClick={event => push({pathname: `${url}/editar`, state: {consultation: consultation}}) } >
        Modificar Consulta
      </button> */}
    </div>
  )
}

export default ConsultationInfo