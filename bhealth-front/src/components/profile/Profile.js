import React, { useEffect, useContext, useState } from 'react';           // Import React and useContext hook
import { useHistory } from 'react-router-dom';                  // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                  // Import AppContext to use created context
import { editProfile, editPassword } from '../../services/profile-services';  // Import edit API call
import useForm from '../../hooks/useForm';                      // Import useForm custom hook
import UIkit from 'uikit';                                      // Import UIkit for notifications
import moment from 'moment';                                    // Import momentjs for date formatting

import Questionnaire from '../common/questionnaire/Questionnaire'
import ProfileForm from './ProfileForm'

const Profile = () => {

  const { form, handleInput, handleFileInput } = useForm();
  const [ state, setState ] = useState({ email: '', password: '', newPassword: '', confirm_password: ''});
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(true);
  const [ passwordInputState, setPasswordInputState ] = useState(null)
  const [ confPasswordInputState, setConfPasswordInputState ] = useState(null)
  const [ passwordValidationObj, setPasswordValidationObj ] = useState({minLength: false, oneCap: false, oneLow: false, oneNumber: false})
  const [ spinnerState, setSpinnerState ] = useState(false)
  
  const { user, setUser, route, setRoute } = useContext(AppContext); // Destructure user state variable
  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user

  // Hook to update component when user state variable is modified
  useEffect( () => {

    if ( !user._id ) {    // If there is no user logged in, send a notification and "redirect" to login

      // Send UIkit warning notification: User must log in
      UIkit.notification({
        message: `<span uk-icon='close'></span> Por favor inicia sesión.`,
        pos: 'bottom-center',
        status: 'warning'
      });
      
      return push('/login');         // If not logged in, "redirect" user to login

    };

    if ( route === "password" ) {
      
      if ( passwordInputState === 'uk-form-success' && confPasswordInputState === 'uk-form-success' )
        setIsButtonDisabled(false);
      else
        setIsButtonDisabled(true);

      if ( spinnerState )
        setIsButtonDisabled(true);
      }

  }, [user, isButtonDisabled, passwordInputState, confPasswordInputState] );

  const validatePassword = (password) => {
    const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&-_/]{8,}$/;
    const regEXlowcase = /^(?=.*[a-z])/
    const regEXuppercase = /^(?=.*[A-Z])/
    const regEXnumber = /^(?=.*\d)/
    const regEXminlength = /[A-Za-z\d@$!%*?&-_/]{8,}$/
    setPasswordValidationObj( prevState => ({...prevState, oneLow: regEXlowcase.test(password)}) )
    setPasswordValidationObj( prevState => ({...prevState, oneCap: regEXuppercase.test(password)}) )
    setPasswordValidationObj( prevState => ({...prevState, oneNumber: regEXnumber.test(password)}) )
    setPasswordValidationObj( prevState => ({...prevState, minLength: regEXminlength.test(password)}) )
    return regEx.test(password);
  }

  const inputValidation = (event) => {

    const { name, value } = event.target;

    setState( prevState => ({...prevState, [name]: value}) );

    switch( name ) {
      case 'newPassword': {
        if (  validatePassword(value) )
          setPasswordInputState('uk-form-success');
        else
          setPasswordInputState('uk-form-danger');
        break;
      }
      case 'confirm_password': {
        if ( value === state.newPassword )
          setConfPasswordInputState('uk-form-success')
        else
          setConfPasswordInputState('uk-form-danger')
      }
    }
    
  }

  // Declare function for form submit event
  const handleSubmit = (event) => {

    event.preventDefault();               // Prevent page reloading after submit action
    setIsButtonDisabled(true);

    if ( form.first_name && form.last_name1 && form.last_name2 && form.date_of_birth || user.isProfileComplete ) form['isProfileComplete'] = true

    // if ( form.profile_picture ) {
      
      const formData = new FormData();      // Declare formData as new instance of FormData class
      const { profile_picture } = form;     // Destructure profile_picture from form

      // Iterate through every key in form object and append name:value to formData
      for (let key in form) {

        // If profile_picture, append as first item in array (currently 1 file allowed, index 0)
        if ( key === 'profile_picture' ) formData.append(key, profile_picture[0]);

        else formData.append(key, form[key]);
        
      }
      
      // Call edit service with formData as parameter, which includes form data for user profile information
      editProfile(formData)
      .then( res => {

        const { user } = res.data   // Destructure updated user document from response
        
        setUser(user);              // Modify user state variable with updated information
        setRoute('none');
        setIsButtonDisabled(false);

        // Send UIkit success notification
        UIkit.notification({
          message: `<p class="uk-text-center">¡Tu perfil fue actualizado exitosamente!</p>`,
          pos: 'bottom-center',
          status: 'success'
        });

      })
      .catch( res => {

        const { msg } = res.response.data;
        setIsButtonDisabled(false);

        // Send UIkit error notification
        UIkit.notification({
          message: `<p class="uk-text-center">${msg}</p>`,
          pos: 'bottom-center',
          status: 'danger'
        });

      });

  };

  const submitNewPassword = (event) => {

    state['email'] = user.email
    event.preventDefault();
    setIsButtonDisabled(true)
    setSpinnerState(true)
    editPassword(state)
    .then( res => {

      setState({ email: '', password: '', newPassword: '', confirm_password: ''})
      setConfPasswordInputState(null);
      setPasswordInputState(null);
      setRoute('none');
      setIsButtonDisabled(false);
      setSpinnerState(false)

      // Send UIkit success notification
      UIkit.notification({
        message: `<p class="uk-text-center">¡Tu contraseña fue actualizada exitosamente!</p>`,
        pos: 'bottom-center',
        status: 'success'
      });

    })
    .catch( res => {

      const { msg } = res.response.data;
      setConfPasswordInputState('uk-text-danger');
      setPasswordInputState('uk-text-danger');
      setSpinnerState(false);
      setState({password: '', newPassword: '', confirm_password: ''});
      setPasswordValidationObj({minLength: false, oneCap: false, oneLow: false, oneNumber: false})

      // Send UIkit error notification
      UIkit.notification({
        message: `<p class="uk-text-center">${msg}</p>`,
        pos: 'bottom-center',
        status: 'danger'
      });

    });
  }

  const backButton = (event) => setRoute('none')

  const ProfileQuestionnaire = [
    <div>
      <label className="uk-form-label" htmlFor="date">Nombres:</label>
      <div className="uk-form-controls">
        <input className="uk-input uk-border-pill" type="text" name="first_name" onChange={handleInput} placeholder={user.first_name} />
      </div>
      <label className="uk-form-label" htmlFor="form-stacked-text">Apellido paterno:</label>
      <div className="uk-form-controls">
        <input className="uk-input uk-border-pill" type="text" name="last_name1" onChange={handleInput} placeholder={user.last_name1} />
      </div>
      <label className="uk-form-label" htmlFor="form-stacked-text">Apellido materno:</label>
      <div className="uk-form-controls">
        <input className="uk-input uk-border-pill" type="text" name="last_name2" onChange={handleInput} placeholder={user.last_name2} />
      </div>
      <label className="uk-form-label">Fecha de nacimiento: {moment.utc(user.date_of_birth).format('LL')}</label>
      <div className="uk-inline">
        <input onChange={handleInput} name="date_of_birth" className="uk-input uk-border-pill" type="date" />
      </div>
      <label className="uk-form-label" htmlFor="form-stacked-text">Género: {user.gender === "N" ? "No definido" : user.gender === "F" ? "Femenino" : "Masculino"}</label>
      <div className="uk-margin uk-flex uk-flex-around">
        <label><input onChange={handleInput} className="uk-radio" type="radio" name="gender" value="F" />  Mujer</label>
        <label><input onChange={handleInput} className="uk-radio" type="radio" name="gender" value="M" />  Hombre</label>
        <label><input onChange={handleInput} className="uk-radio" type="radio" name="gender" value="N" />  No binario</label>
      </div>
    </div>
    ,
    <div>
      <label className="uk-form-label">CURP:</label>
      <div className="uk-form-controls">
        <input onChange={handleInput} name="curp" className="uk-input uk-border-pill" type="text" placeholder={user.curp} />
      </div>
      <label className="uk-form-label">Código Postal:</label>
      <div className="uk-form-controls">
        <input onChange={handleInput} name="zip_code" className="uk-input uk-border-pill" type="number" placeholder={user.zip_code ? user.zip_code : 12345} />
      </div>
      <label className="uk-form-label">Estado Civil registrado: {user.marital_status}</label>
      <div className="uk-form-controls">
        <select name="marital_status" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={user.marital_status ? user.marital_status : ""}>
          <option></option>
          <option>Soltero</option>
          <option>Casado</option>
          <option>Viudo</option>
          <option>Divorciado</option>
        </select>
      </div>
      <label className="uk-form-label">Grado Máximo de Estudios: {user.education_level}</label>
      <div className="uk-form-controls">
        <select name="education_level" onChange={handleInput} className="uk-select uk-border-pill" defaultValue={user.education_level ? user.education_level : ""}>
          <option></option>
          <option>Primaria</option>
          <option>Secundaria</option>
          <option>Preparatoria</option>
          <option>Licenciatura</option>
          <option>Posgrado</option>
        </select>
      </div>
    </div>
    ,
    <div>
      <label className="uk-form-label">Teléfono/Whatsapp:</label>
      <div className="uk-form-controls">
        <input onChange={handleInput} name="phone_number" className="uk-input uk-border-pill" type="number" placeholder={user.phone_number ? user.phone_number : 5544332211} />
      </div>
      <label className="uk-form-label">Correo electrónico:</label>
      <div className="uk-form-controls">
        <input onChange={handleInput} name="email" className="uk-input uk-border-pill" type="email" placeholder={user.email} disabled />
      </div>
      <div className="uk-flex uk-flex-center">
      <div className="uk-flex uk-flex-middle uk-flex-around uk-width-2-5@s">
      <p className="uk-text-middle uk-margin-remove">Contraseña:</p>
      <button className="uk-button uk-button-muted uk-border-pill uk-width-1-2 uk-margin" onClick={event => setRoute('password')} >
        Cambiar
      </button>
      </div>
      </div>
    </div>
  ]

  return (
    <div className="content">
      <div className="uk-section">
        
        { route !== 'edit' ? (
          <div>
            
          </div>
          ) : (
            null
          )
        }
        
        <div className="uk-container uk-margin">
          { !user.isProfileComplete ? (
            <div>
              <ProfileForm form={form} handleSubmit={handleSubmit} handleInput={handleInput} isButtonDisabled={isButtonDisabled} />
            </div>
          ) :
            route !== 'edit' && route !== 'password' ? (
              <div>
                <div className="uk-width-auto">
                  <img className="uk-border-circle" width={128} height={128} src={user.profile_picture} alt="User profile" />
                </div>
                <h2>{user.first_name} {user.last_name1}</h2>
                <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m" onClick={event => setRoute('edit')} >
                  Editar mi perfil
                </button>
                <div className="uk-child-width-1-1 uk-hidden@s">
                <div className="card-section-white">
                    <p>Nombres: {user.first_name}</p>
                    <p>Apellidos: {user.last_name1} {user.last_name2}</p>
                    <p>Fecha de nacimiento: {moment.utc(user.date_of_birth).format('LL')}</p>
                    <p>Género: {user.gender === 'N' ? 'No definido' : user.gender === 'F' ? 'Femenino' : 'Masculino'}</p>
                  </div>
                  <div className="card-section-white">
                    <p>CURP: {user.curp ? user.curp : 'Información no registrada'}</p>
                    <p>Estado Civil: {user.marital_status}</p>
                    <p>Código Postal: {user.zip_code}</p>
                    <p>Grado Máximo de Estudios: {user.education_level}</p>
                  </div>
                  <div className="card-section-white">
                    <p>Teléfono: {user.phone_number ? user.phone_number : "No hay número registrado"}</p>
                    <p>Email: {user.email}</p>
                    <p>Contraseña: *********</p>
                  </div>
                </div>
                <div className="uk-flex uk-child-width-1-3 uk-visible@s">
                  <div className="card-section-white">
                    <p>Nombres: {user.first_name}</p>
                    <p>Apellidos: {user.last_name1} {user.last_name2}</p>
                    <p>Fecha de nacimiento: {moment.utc(user.date_of_birth).format('LL')}</p>
                    <p>Género: {user.gender === 'N' ? 'No definido' : user.gender === 'F' ? 'Femenino' : 'Masculino'}</p>
                  </div>
                  <div className="card-section-white">
                    <p>CURP: {user.curp ? user.curp : 'Información no registrada'}</p>
                    <p>Estado Civil: {user.marital_status}</p>
                    <p>Código Postal: {user.zip_code}</p>
                    <p>Grado Máximo de Estudios: {user.education_level}</p>
                  </div>
                  <div className="card-section-white">
                    <p>Teléfono: {user.phone_number ? user.phone_number : "No hay número registrado"}</p>
                    <p>Email: {user.email}</p>
                    <p>Contraseña: *********</p>
                  </div>
                </div>
              </div>
            ) : route === "password" ? 
                <div>
                  <h2>Cambiar Contraseña</h2>
                  <form className="uk-form-stacked" onSubmit={submitNewPassword}>
                    <div className="uk-margin">
                      <label className="uk-form-label">Contraseña Actual:</label>
                      <div className="uk-inline uk-width-4-5 uk-width-1-3@s">
                        <span className="uk-form-icon" uk-icon="icon: lock"></span>
                        <input
                          onChange={event => inputValidation(event)}
                          name="password"
                          value={state.password}
                          className="uk-input uk-width-1-1 uk-border-pill"
                          type="password"
                          required={true}
                        />
                      </div>
                    </div>
                    <div className="uk-margin">
                      <label className="uk-form-label">Nueva Contraseña:</label>
                      <div className="uk-inline uk-width-4-5 uk-width-1-3@s">
                        <span className="uk-form-icon" uk-icon="icon: lock"></span>
                        <input
                          onChange={event => inputValidation(event)}
                          name="newPassword"
                          value={state.newPassword}
                          className={ passwordInputState !== null ? 
                            `${passwordInputState} uk-input uk-width-1-1 uk-border-pill` : "uk-input uk-width-1-1 uk-border-pill"
                          }
                          type="password"
                          required={true}
                        />
                      </div>
                      <div className="uk-margin uk-flex uk-flex-center">
                        <div className="uk-width-1-2@s uk-flex uk-flex-column">
                          <div className="uk-width-1-1 uk-flex">
                              { passwordValidationObj.oneCap ?
                                <div className="uk-width-1-2 uk-flex uk-flex-center@s uk-flex-middle uk-text-success">
                                  <span uk-icon="check" className="uk-width-1-6"></span> Una letra mayúscula
                                </div>
                                : 
                                <div className="uk-width-1-2 uk-flex uk-flex-center@s uk-flex-middle">
                                  <span uk-icon="warning" className="uk-width-1-6"></span>  Una letra mayúscula
                                </div>
                              }
                              { passwordValidationObj.oneNumber ?
                                <div className="uk-width-1-2 uk-flex uk-flex-middle uk-text-success">
                                  <span uk-icon="check" className="uk-width-1-6"></span> Un número
                                </div>
                                : 
                                <div className="uk-width-1-2 uk-flex uk-flex-middle">
                                  <span uk-icon="warning" className="uk-width-1-6"></span>  Un número
                                </div>
                              }
                              
                          </div>
                          <div className="uk-width-1-1 uk-flex">
                            { passwordValidationObj.oneLow ?
                              <div className="uk-width-1-2 uk-flex uk-flex-center@s uk-flex-middle uk-text-success">
                                <span uk-icon="check" className="uk-width-1-6"></span> Una letra minúscula
                              </div>
                              : 
                              <div className="uk-width-1-2 uk-flex uk-flex-center@s uk-flex-middle">
                                <span uk-icon="warning" className="uk-width-1-6"></span>  Una letra minúscula
                              </div>
                            }
                            { passwordValidationObj.minLength ?
                              <div className="uk-width-1-2 uk-flex uk-flex-left uk-flex-middle uk-text-success">
                                <span uk-icon="check" className="uk-width-1-6"></span> Mínimo 8 caracteres
                              </div>
                              : 
                              <div className="uk-width-1-2 uk-flex uk-flex-left uk-flex-middle">
                                <span uk-icon="warning" className="uk-width-1-6"></span> Mínimo 8 caracteres
                              </div>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="uk-margin">
                      <label className="uk-form-label">Confirma tu Nueva Contraseña:</label>
                      <div className="uk-inline uk-width-4-5 uk-width-1-3@s">
                        <span className="uk-form-icon" uk-icon="icon: lock"></span>
                        <input
                          onChange={event => inputValidation(event)}
                          name="confirm_password"
                          value={state.confirm_password}
                          className={passwordInputState !== null ? `${confPasswordInputState} uk-input uk-width-1-1 uk-border-pill` : "uk-input uk-width-1-1 uk-border-pill"}
                          type="password"
                        />
                      </div>
                      { confPasswordInputState === 'uk-form-danger' ?
                          <div>
                            <span className="uk-text-danger">Asegúrate de introducir la misma contraseña</span>
                          </div>
                        : null 
                      }
                    </div>
                    <button disabled={isButtonDisabled} className="uk-button uk-button-primary uk-border-pill uk-width-3-5 uk-width-1-5@s uk-margin" type="submit">
                      {spinnerState ? "Cambiando" : "Cambiar"} <div className={ spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
                    </button>
        
                </form>
                </div>
            : (
                <Questionnaire title="Mi Perfil" isComplete={true} questionnaire={ProfileQuestionnaire} handleSubmit={handleSubmit} form={form} backButton={backButton} stepsQty={3}/>
              )
            }
          
        
        </div>
      </div>
    </div>
  )

}

export default Profile