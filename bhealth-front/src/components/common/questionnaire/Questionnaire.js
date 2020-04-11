import React, { useState, useContext } from 'react'
import { AppContext } from '../../../AppContext'
import moment from 'moment';                                    // Import momentjs for date formatting

const Questionnaire = ({title = 'Cuestionario', questionnaire = [1,2,3], handleSubmit, backButton, isComplete}) => {

  // const { user, setUser, route, setRoute } = useContext(AppContext); // Destructure user state variable
  
  const [ currentStep, setCurrentStep ] = useState(0);

  const changeStepState = (index) => {
    setCurrentStep(index)
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
            <ul className="uk-dotnav">
              {
                questionnaire.map( (section, index) => 
                  <li onClick={() => changeStepState(index)} key={index} className={ index === currentStep ? "uk-active" : null }><a href="#">{index}</a></li>
                )
              }
            </ul>
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
              <button type="submit" className="uk-button uk-button-primary uk-border-pill uk-width-3-5 uk-width-1-4@s" >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
  )
}

export default Questionnaire