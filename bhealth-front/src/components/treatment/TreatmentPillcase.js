import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

const TreatmentPillcase = ({title, push, url}) => {

  const { drugsArray } = useLocation().state;
  
  const [ buttonState, setButtonState ] = useState([])

  useEffect( () => {

    if (buttonState.length === 0 && drugsArray.length > 0) {
      let initialArray = []
      drugsArray.forEach( (drug, index) => {
        initialArray.push('No')
      })
      setButtonState(initialArray)
    }

  }, [buttonState])

  const checkScheduleTimeOfDay = (scheduleElement) => {
    switch (title) {
      case 'Mañana':  if ( scheduleElement.slice(0,2) >= 4 && scheduleElement.slice(0,2) < 12 )
                        return true
                      else return false
      case 'Tarde':  if ( scheduleElement.slice(0,2) >= 12 && scheduleElement.slice(0,2) < 20 )
                        return true
                      else return false
      case 'Noche':  if ( scheduleElement.slice(0,2) >= 20 || scheduleElement.slice(0,2) < 4 )
                        return true
                      else return false
      case 'Sin Horario':  if ( scheduleElement.slice(0,2) >= 4 && scheduleElement.slice(0,2) < 12 )
                        return true
                      else return false            
    }
  }

  const updateArrayElement = (index) => {
    let newState = [...buttonState];
    buttonState[index] === 'No' ? newState[index] = 'Sí' : newState[index] = 'No';
    setButtonState(newState)
  }

  return (
    <div className="uk-margin">
      <h2>Mis Medicamentos</h2>
      <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => push(`${url}`)} >
        Regresar
      </button>
      <h3 className="uk-margin-small">Periodo: {title}</h3>
      <table className="uk-table uk-table-middle">
        <thead>
          <tr>
            <th className="uk-text-center">Nombre</th>
            <th className="uk-text-center" hidden={title === 'Sin Horario' ? true : false}>Horario</th>
            <th className="uk-text-center">Tomada</th>
          </tr>
        </thead>
        <tbody>
        { drugsArray.length > 0 ?
          drugsArray.map( (drug, index) => 
            <tr key={index}>
              <td className="text-align-middle">{drug.name}</td>
              {
                drug.schedule.map( (scheduleElement, schedIndex) => {
                  if ( checkScheduleTimeOfDay(scheduleElement) ) return <td key={schedIndex}>{scheduleElement}</td>
                  else return null
                  }
                )
              }
              <td>
                <button id={`button-${index}`} uk-toggle={`target: #button-${index}; cls: uk-button-secondary`} className="uk-button uk-button-default uk-border-pill selected uk-width-4-5 uk-width-1-2@s uk-text-center uk-padding-remove" onClick={ event => { updateArrayElement(index) } } >
                  {
                    buttonState[index]
                  }
                </button>
              </td>
            </tr>
          )
          : null
        }
        </tbody>
      </table>
      { drugsArray.length === 0 ? <h4 className="uk-text-danger uk-margin-remove">Sin registros</h4> : null }
      
      
    </div>
  )
}

export default TreatmentPillcase
