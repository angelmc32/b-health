import React, { useState } from 'react'

const VitalSignsCard = ({ vitalsign_name, vitalsign_icon, form_name, handleInputChange }) => {

  const [ showInput, setShowInput ] = useState(false)

  const toggleInput = () => setShowInput(true);

  return (
    <div className={`uk-card uk-card-hover uk-card-body uk-padding-small`} onClick={toggleInput}>
      <h5>{vitalsign_name}</h5>
      <div className="uk-flex uk-flex-center">
        <img className="uk-width-4-5" src={vitalsign_icon} alt=""/>
      </div>
      {
        showInput ? 
          <input className="uk-input uk-width-4-5" type="number" step=".1" name={form_name} onChange={handleInputChange} />
        : null
      }
    </div>
  )
}


export default VitalSignsCard