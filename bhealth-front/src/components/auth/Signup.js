import React, { useContext, useEffect } from 'react';                // Import React and useContext hook
import { useHistory } from 'react-router-dom';            // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';            // Import AppContext to use created context
import { signup } from '../../services/auth-services';    // Import signup service for API call
import AuthForm from './AuthForm';                        // Import AuthForm react component
import useForm from '../../hooks/useForm';                // Import useForm custom hook
import UIkit from 'uikit';                                // Import UIkit for notifications

// Declare Signup functional component
const Signup = () => {

  const { form, handleInput } = useForm();      // Destructure form state variable and handleInput function
  const { user, setUser, setRoute } = useContext(AppContext);   // Destructure setUser function for user state manipulation
  const { push } = useHistory();                // Destructure push method from useHistory to "redirect" user

  useEffect( () => {

    if ( user._id ) {    // If there is no user logged in, send a notification and "redirect" to login
      
      return push('/home');         // If not logged in, "redirect" user to login

    };
  })

  // Declare function for form submit event
  const handleSubmit = (event) => {

    event.preventDefault();                     // Prevent page reloading after submit action
    
    // Call signup service with form state variable as parameter, which includes form data for e-mail and password
    signup(form)
    .then( res => {

      const { msg } = res.data;
      
      //const { user, token } = res.data;         // Destructure user and token from response, sent by API
      
      // // Store user and token in localStorage
      // localStorage.setItem('user', JSON.stringify(user));
      // localStorage.setItem('token', token);

      // setUser(user);    // Modify user state variable, setting the user data in the state
      // setRoute('none');
      push('/registrar');    // "Redirect" user to home

      // Send UIkit success notification
      UIkit.notification({
        message: `<span uk-icon='check'></span> ${msg}`,
        pos: 'bottom-center',
        status: 'success'
      });

    })
    .catch( res => {

      const { msg } = res.response.data;
      
      // Send UIkit error notification
      UIkit.notification({
        message: `<span uk-icon='close'></span> ${msg}`,
        pos: 'bottom-center',
        status: 'danger'
      });

    });
    
  };

  const validateEmail = (email) => {
    const regEx = /\S+@\S+\.\S+/;
    return regEx.test(email);
  }

  return (
    <div className="uk-section">
      <div className="uk-container">
        <AuthForm
          submit={handleSubmit}
          action="signup"
          handleChange={handleInput}
          validateEmail={validateEmail}
          {...form}
        />
      </div>
    </div>
  );

};

export default Signup;