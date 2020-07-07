import React from 'react'

const ProfileForm = ({form, handleSubmit, handleInput, isButtonDisabled = false}) => {
  return (
    <div>
      <h2>Completar Información Básica</h2>
      <form onSubmit={handleSubmit} className="uk-form-stacked uk-text-left">
        <h5 className="uk-text-center uk-margin-top-remove" htmlFor="date">Fecha de nacimiento:</h5>
        <div className="uk-form-controls uk-margin-bottom uk-flex uk-flex-center">
          <div className="uk-width-1-1 uk-width-1-2@s">
            <input className="uk-input uk-border-pill" type="date" name="date_of_birth" onChange={handleInput} required={true} />
          </div>
        </div>
        <h5 className="uk-text-center uk-margin-remove-top" htmlFor="date">Nombres:</h5>
        <div className="uk-form-controls uk-margin-bottom uk-flex uk-flex-center">
          <input className="uk-input uk-border-pill uk-width-1-1 uk-width-1-2@s" type="text" name="first_name" onChange={handleInput} placeholder="Nombres..."  required={true}/>
        </div>
        <h5 className="uk-text-center uk-margin-remove-top" htmlFor="date">Apellido Paterno:</h5>
        <div className="uk-form-controls uk-margin-bottom uk-flex uk-flex-center">
          <input className="uk-input uk-border-pill uk-width-1-1 uk-width-1-2@s" type="text" name="last_name1" onChange={handleInput} placeholder="Apellido paterno..."  required={true}/>
        </div>
        <h5 className="uk-text-center uk-margin-remove-top" htmlFor="date">Apellido Materno:</h5>
        <div className="uk-form-controls uk-margin-bottom uk-flex uk-flex-center">
          <input className="uk-input uk-border-pill uk-width-1-1 uk-width-1-2@s" type="text" name="last_name2" onChange={handleInput} placeholder="Apellido materno..."  required={true}/>
        </div>
        <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin-medium-top">
          <button type="submit" className="uk-button uk-button-primary uk-button uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" disabled={isButtonDisabled} >
            Guardar
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfileForm