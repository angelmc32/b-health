import React, { useEffect, useContext, useState } from 'react';           // Import React and useContext hook
import { useHistory } from 'react-router-dom';                  // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                  // Import AppContext to use created context
import { editProfile } from '../../services/profile-services';  // Import edit API call
import useForm from '../../hooks/useForm';                      // Import useForm custom hook
import UIkit from 'uikit';                                      // Import UIkit for notifications
import moment from 'moment';                                    // Import momentjs for date formatting

import Questionnaire from '../common/questionnaire/Questionnaire'

const Profile = () => {

  const { form, handleInput, handleFileInput } = useForm();
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(false);
  
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

    console.log(user)

  }, [user] );

  // Declare function for form submit event
  const handleSubmit = (event) => {

    event.preventDefault();               // Prevent page reloading after submit action
    setIsButtonDisabled(true);

    console.log(form)

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
          message: `<span uk-icon='close'></span> '¡Tu perfil fue actualizado exitosamente!'`,
          pos: 'bottom-center',
          status: 'success'
        });

      })
      .catch( error => {

        console.log(error);
        setIsButtonDisabled(false);

        // Send UIkit error notification
        UIkit.notification({
          message: `<span uk-icon='close'></span> ${error}`,
          pos: 'bottom-center',
          status: 'danger'
        });

      });

  };

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
    </div>,
    <div>
      <label className="uk-form-label">Teléfono/Whatsapp:</label>
      <div className="uk-form-controls">
        <input onChange={handleInput} name="phone_number" className="uk-input uk-border-pill" type="number" placeholder={user.phone_number ? user.phone_number : 5544332211} />
      </div>
      <label className="uk-form-label">Correo electrónico:</label>
      <div className="uk-form-controls">
        <input onChange={handleInput} name="email" className="uk-input uk-border-pill" type="email" placeholder={user.email} />
      </div>
    </div>
  ]

  return (
    <div className="uk-section">
      <div className="uk-container">
        
        { route !== 'edit' ? (
          <div>
            <div className="uk-width-auto">
              <img className="uk-border-circle" width={128} height={128} src={user.profile_picture} alt="User profile" />
            </div>
            <h2>{user.first_name} {user.last_name1}</h2>
            <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m" onClick={event => setRoute('edit')} >
              Editar mi perfil
            </button>
          </div>
          ) : (
            null
          )}
        
        <div className="uk-container uk-margin">
          { route !== 'edit' ? (
            <div>
              <div className="uk-child-width-1-1 uk-hidden@s">
              <div className="card-section-white">
                  <h4>Información Personal</h4>
                  <p>Nombres: {user.first_name}</p>
                  <p>Apellidos: {user.last_name1} {user.last_name2}</p>
                  <p>Fecha de nacimiento: {moment.utc(user.date_of_birth).format('LL')}</p>
                  <p>Género: {user.gender === 'N' ? 'No definido' : user.gender === 'F' ? 'Femenino' : 'Masculino'}</p>
                </div>
                <div className="card-section-white">
                  <h4>Información Social</h4>
                  <p>CURP: {user.curp ? user.curp : 'Información no registrada'}</p>
                  <p>Estado Civil: {user.marital_status}</p>
                  <p>Código Postal: {user.zip_code}</p>
                  <p>Grado Máximo de Estudios: {user.education_level}</p>
                </div>
                <div className="card-section-white">
                  <h4>Información Plataforma</h4>
                  <p>Teléfono: {user.phone_number ? user.phone_number : "No hay número registrado"}</p>
                  <p>Email: {user.email}</p>
                  <p>Contraseña: *********</p>
                </div>
              </div>
              <div className="uk-flex uk-child-width-1-3 uk-visible@s">
                <div className="card-section-white">
                  <h4>Información Personal</h4>
                  <p>Nombres: {user.first_name}</p>
                  <p>Apellidos: {user.last_name1} {user.last_name2}</p>
                  <p>Fecha de nacimiento: {moment.utc(user.date_of_birth).format('LL')}</p>
                  <p>Género: {user.gender === 'N' ? 'No definido' : user.gender === 'F' ? 'Femenino' : 'Masculino'}</p>
                </div>
                <div className="card-section-white">
                  <h4>Información Social</h4>
                  <p>CURP: {user.curp ? user.curp : 'Información no registrada'}</p>
                  <p>Estado Civil: {user.marital_status}</p>
                  <p>Código Postal: {user.zip_code}</p>
                  <p>Grado Máximo de Estudios: {user.education_level}</p>
                </div>
                <div className="card-section-white">
                  <h4>Información Plataforma</h4>
                  <p>Teléfono: {user.phone_number ? user.phone_number : "No hay número registrado"}</p>
                  <p>Email: {user.email}</p>
                  <p>Contraseña: *********</p>
                </div>
              </div>
            </div>
          ) : (
            <Questionnaire title="Mi Perfil" questionnaire={ProfileQuestionnaire} handleSubmit={handleSubmit} form={form} backButton={backButton}/>
            // <form onSubmit={handleSubmit} className="uk-form-stacked uk-text-left">
            //   <div className="uk-margin">
            //     <label className="uk-form-label" htmlFor="date">Nombres:</label>
            //     <div className="uk-form-controls">
            //       <input className="uk-input uk-border-pill" type="text" name="first_name" onChange={handleInput} placeholder={user.first_name} />
            //     </div>
            //     <label className="uk-form-label" htmlFor="form-stacked-text">Apellido paterno:</label>
            //     <div className="uk-form-controls">
            //       <input className="uk-input uk-border-pill" type="text" name="last_name1" onChange={handleInput} placeholder={user.last_name1} />
            //     </div>
            //     <label className="uk-form-label" htmlFor="form-stacked-text">Apellido materno:</label>
            //     <div className="uk-form-controls">
            //       <input className="uk-input uk-border-pill" type="text" name="last_name2" onChange={handleInput} placeholder={user.last_name2} />
            //     </div>
            //     <label className="uk-form-label">Fecha de nacimiento: {moment.utc(user.date_of_birth).format('LL')}</label>
            //     <div className="uk-inline">
            //       <input onChange={handleInput} name="date_of_birth" className="uk-input uk-border-pill" type="date" />
            //     </div>
            //     <label className="uk-form-label" htmlFor="form-stacked-text">Género</label>
            //     <div className="uk-margin uk-flex uk-flex-around">
            //       <label><input onChange={handleInput} className="uk-radio" type="radio" name="gender" value="F" />  Mujer</label>
            //       <label><input onChange={handleInput} className="uk-radio" type="radio" name="gender" value="M" />  Hombre</label>
            //       <label><input onChange={handleInput} className="uk-radio" type="radio" name="gender" value="N" />  No binario</label>
            //     </div>
            //     <label className="uk-form-label">CURP:</label>
            //     <div className="uk-form-controls">
            //       <input onChange={handleInput} name="curp" className="uk-input uk-border-pill" type="text" placeholder={user.curp} />
            //     </div>
            //     <label className="uk-form-label">Código Postal:</label>
            //     <div className="uk-form-controls">
            //       <input onChange={handleInput} name="zip_code" className="uk-input uk-border-pill" type="number" placeholder={user.zip_code ? user.zip_code : 5544332211} />
            //     </div>
            //     <label className="uk-form-label">Estado Civil:</label>
            //     <div className="uk-form-controls">
            //       <select className="uk-select uk-border-pill">
            //         <option>Soltero</option>
            //         <option>Casado</option>
            //         <option>Viudo</option>
            //         <option>Divorciado</option>
            //       </select>
            //     </div>
            //     <label className="uk-form-label">Grado Máximo de Estudios:</label>
            //     <div className="uk-form-controls">
            //       <select className="uk-select uk-border-pill">
            //         <option>Primaria</option>
            //         <option>Secundaria</option>
            //         <option>Preparatoria</option>
            //         <option>Licenciatura</option>
            //         <option>Posgrado</option>
            //       </select>
            //     </div>
            //     <label className="uk-form-label">Teléfono/Whatsapp:</label>
            //     <div className="uk-form-controls">
            //       <input onChange={handleInput} name="phone_numnber" className="uk-input uk-border-pill" type="number" placeholder={user.phone_number ? user.phone_number : 5544332211} />
            //     </div>
            //     <label className="uk-form-label">Correo electrónico:</label>
            //     <div className="uk-form-controls">
            //       <input onChange={handleInput} name="email" className="uk-input uk-border-pill" type="email" placeholder={user.email} />
            //     </div>
            //   </div>
            //   <div className="uk-width-1-1 uk-flex uk-flex-center">
            //     <button type="submit" className="uk-button uk-button-primary uk-border-pill uk-width-3-5 uk-width-1-4@s uk-margin" disabled={isButtonDisabled} >
            //       Guardar cambios
            //     </button>
            //   </div>
            // </form>
          )}
          
        </div>
      </div>
      
    </div>
  )

}

export default Profile