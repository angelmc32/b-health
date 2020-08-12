import React, { Fragment, useContext, useEffect, useState } from 'react';           // Import React and useContext hook
import { useHistory } from 'react-router-dom';                  // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                  // Import AppContext to use created context
import { editProfile } from '../../services/profile-services';  // Import edit API call
import useForm from '../../hooks/useForm';                      // Import useForm custom hook
import UIkit from 'uikit';                                      // Import UIkit for notifications
import moment from 'moment';                                    // Import momentjs for date formatting

const ProfileForm = ({ push, url }) => {

  const { form, resetForm, handleInput } = useForm();
  const { user, setUser } = useContext(AppContext); // Destructure user state variable
  const now = moment();
  const maxDate = moment().subtract(18, 'years').format("YYYY-MM-DD")

  const [ state, setState ] = useState({
    isButtonDisabled: true,
    spinnerState: false,
    errorMessage: null
  });

  useEffect( () => {

    if ( !user._id ) {    // If there is no user logged in, send a notification and "redirect" to login

      // Send UIkit warning notification: User must log in
      UIkit.notification({
        message: "<p class='uk-text-center'>Por favor inicia sesión.</p>",
        pos: 'bottom-center',
        status: 'warning'
      });
      
      return push('/login');         // If not logged in, "redirect" user to login

    }

    if ( user.isProfileComplete ) push(url)

    if ( form['first_name'] && form['last_name1'] && form['last_name2'] && form['gender'] && form['first_name'] && form['date_of_birth'] )
      setState( prevState => ({...prevState, isButtonDisabled: false }))

  }, [user, form] );

    // Declare function for form submit event
    const handleSubmit = (event) => {

      event.preventDefault();               // Prevent page reloading after submit action
      setState({ spinnerState: true, isButtonDisabled: true, errorMessage: null });
      form['isProfileComplete'] = true;
      console.log(form)
      const formData = new FormData();      // Declare formData as new instance of FormData class

      // Iterate through every key in form object and append name:value to formData
      for (let key in form) {
        formData.append(key, form[key]);
      }
      // Call edit service with formData as parameter, which includes form data for user profile information
      editProfile(formData)
      .then( res => {

        const { user } = res.data   // Destructure updated user document from response
        
        setUser(user);
        // document.getElementById('gender').value = user.gender
        // document.getElementById('marital_status').value = user.marital_status
        // document.getElementById('education_level').value = user.education_level
        resetForm();
        setState({ spinnerState: false, isButtonDisabled: false, errorMessage: null })

        // Send UIkit success notification
        UIkit.notification({
          message: '<p class="uk-text-center">Tu perfil fue actualizado exitosamente</p>',
          pos: 'bottom-center',
          status: 'success'
        });

        push(url)

      })
      .catch( res => {

        const { msg } = res.response.data;
        setState({ spinnerState: false, isButtonDisabled: false, errorMessage: null })

        // Send UIkit error notification
        UIkit.notification({
          message: `<p class="uk-text-center">${msg}</p>`,
          pos: 'bottom-center',
          status: 'danger'
        });

      });
  
    };
  
    const validateDate = (event) => {
      const { value } = event.target
      if ( now.diff(value, 'years') < 18 ) {
        setState( prevState => ({...prevState, isButtonDisabled: true, errorMessage: 'Debes tener 18 años'}))
      }
      else if ( now.diff(value, 'years') > 99 ) {
        setState( prevState => ({...prevState, isButtonDisabled: true, errorMessage: 'Introduce una fecha menor'}))
      }
      else {
        setState( prevState => ({...prevState, errorMessage: null}))
        form['date_of_birth'] = value
      }
    }

  return (
    <div className="uk-flex uk-flex-column uk-flex-center uk-flex-middle">
      <h2>Completar Información</h2>
      <form onSubmit={handleSubmit} className="uk-form-stacked uk-text-left uk-width-5-6">
        <h5 className="uk-text-center uk-margin-small" htmlFor="date">Nombre(s):</h5>
        <div className="uk-form-controls uk-margin-bottom uk-flex uk-flex-center">
          <input className="uk-input uk-border-pill uk-width-1-1 uk-width-1-2@s uk-text-center" type="text" name="first_name" onChange={handleInput} required />
        </div>
        <h5 className="uk-text-center uk-margin-small" htmlFor="date">Apellido Paterno:</h5>
        <div className="uk-form-controls uk-margin-bottom uk-flex uk-flex-center">
          <input className="uk-input uk-border-pill uk-width-1-1 uk-width-1-2@s uk-text-center" type="text" name="last_name1" onChange={handleInput} required />
        </div>
        <h5 className="uk-text-center uk-margin-small" htmlFor="date">Apellido Materno:</h5>
        <div className="uk-form-controls uk-margin-bottom uk-flex uk-flex-center">
          <input className="uk-input uk-border-pill uk-width-1-1 uk-width-1-2@s uk-text-center" type="text" name="last_name2" onChange={handleInput} required />
        </div>
        <h5 className="uk-text-center uk-margin-small" htmlFor="date">Género:</h5>
        <div className="uk-form-controls uk-margin-bottom uk-flex uk-flex-center">
          <select name="gender" onChange={handleInput} className="uk-select uk-border-pill uk-width-1-1 uk-width-1-2@s" defaultValue="" required>
            <option value="" disabled></option>
            <option>Femenino</option>
            <option>Masculino</option>
            <option value="No especificado">No especificar</option>
          </select>
        </div>
        <h5 className="uk-text-center uk-margin-small" htmlFor="date_of_birth">Fecha de nacimiento:</h5>
        <div className="uk-form-controls uk-margin-bottom uk-flex uk-flex-center">
          <div className="uk-width-1-1 uk-width-1-2@s">
            <input className="uk-input uk-border-pill uk-text-center" type="date" id="date_of_birth" name="date_of_birth" max={maxDate} onChange={validateDate} required />
          </div>
        </div>
        <p className="uk-text-center uk-text-danger">{state.errorMessage}</p>
        <div className="uk-width-1-1 uk-flex uk-flex-center uk-margin-top">
          <button type="submit" className="uk-button uk-button-primary uk-button uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin-top" disabled={state.isButtonDisabled} >
            { !state.spinnerState ? "Guardar" : "Guardando"}  <div className={ state.spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfileForm