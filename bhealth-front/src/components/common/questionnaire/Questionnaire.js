import React, { useState, useContext } from 'react'
import { AppContext } from '../../../AppContext'
import moment from 'moment'
import Stepper from 'react-stepper-horizontal'

const Questionnaire = ({title = 'Cuestionario', questionnaire = [1,2,3], handleSubmit, backButton, isComplete, stepsQty}) => {

  // const { user, setUser, route, setRoute } = useContext(AppContext); // Destructure user state variable
  
  const [ currentStep, setCurrentStep ] = useState(0);
  let formStepper = null;

  if (title === 'Mi Perfil') {
    formStepper = <Stepper 
      steps={ 
        [
          {
            title: 'Datos Personales',
            onClick: (event) => {
              event.preventDefault()
              changeStepState(0)
            }
          },
          {
            title: 'Datos Adicionales',
            onClick: (event) => {
              event.preventDefault()
              changeStepState(1)
            }
          },
          {
            title: 'Datos de mi Cuenta',
            onClick: (event) => {
              event.preventDefault()
              changeStepState(2)
            }
          }
        ]
      } 
      activeStep={currentStep}
      activeColor={'#4F39BF'}
      completeColor={'#4F39BF'} />
  } else if (title === 'Editar Mis Antecedentes' || title === 'Registra tus Antecedentes') {
    formStepper = <Stepper 
      steps={ 
        [
          {
            title: 'Heredo-Familiares',
            onClick: (event) => {
              event.preventDefault()
              changeStepState(0)
            }
          },
          {
            title: 'Personales Patológicos',
            onClick: (event) => {
              event.preventDefault()
              changeStepState(1)
            }
          },
          {
            title: 'Personales No Patológicos',
            onClick: (event) => {
              event.preventDefault()
              changeStepState(2)
            }
          }
        ]
      } 
      activeStep={currentStep}
      activeColor={'#4F39BF'}
      completeColor={'#4F39BF'} />
  }

  const changeStepState = (index) => {
    setCurrentStep(index);
  }

  return (
        <div>
          <h2>{title}</h2>
          { isComplete ? 
            <button onClick={backButton} className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" >
              Regresar
            </button> :
            <h4 className="uk-text-danger">
              Completa tus Antecedentes
            </h4>
            }
          
          <div className="uk-flex uk-flex-center">
            <div className="uk-width-1-2@s">
              {formStepper}
            </div>
            
            {/* <ul className="uk-dotnav">
              {
                questionnaire.map( (section, index) => 
                  <li onClick={() => changeStepState(index)} key={index} className={ index === currentStep ? "uk-active" : null }><a href="#">{index}</a></li>
                )
              }
            </ul> */}
          </div>
          <form onSubmit={handleSubmit} className="uk-form-stacked uk-text-left uk-margin">
            {
              questionnaire.map( (section, index) => 
                <div key={index} className={ index === currentStep ? "uk-visible" : "uk-hidden" }>
                  { section }
                </div>
              )
            }
            <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin-large-top">
              <div className="uk-width-3-5@s uk-width-1-3@m uk-flex uk-flex-between">
                <button className="uk-button uk-button-default uk-border-pill uk-width-1-2 uk-width-1-3@s" disabled={ currentStep === 0 ? true : false } onClick={ (event) => {event.preventDefault(); changeStepState(currentStep-1)}} >
                  <span uk-icon="arrow-left"></span>
                </button>
                <button className="uk-button uk-button-default uk-border-pill uk-width-1-2 uk-width-1-3@s" disabled={ currentStep === stepsQty-1 ? true : false } onClick={ (event) => {event.preventDefault(); changeStepState(currentStep+1)}} >
                  <span uk-icon="arrow-right"></span>
                </button>
              </div>
            </div>

            <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin-top">
              <button type="submit" className="uk-button uk-button-primary uk-border-pill uk-width-3-5 uk-width-1-4@s" >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
  )
}

export default Questionnaire