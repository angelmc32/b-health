import React, { useContext, useEffect } from 'react';              // Import React and useContext hook
import { useHistory } from 'react-router-dom';          // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';          // Import AppContext to use created context
import { login } from '../../services/auth-services';   // Import login service for API call
import AuthForm from './AuthForm';                      // Import AuthForm react component
import useForm from '../../hooks/useForm';              // Import useForm custom hook
import UIkit from 'uikit';                              // Import UIkit for notifications

// Declare Login functional component
const Login = () => {

  const { form, handleInput } = useForm();                // Destructure form state variable and handleInput function
  const { user, setUser, setRoute } = useContext(AppContext);   // Destructure setUser function for user state manipulation
  const { push } = useHistory();                          // Destructure push method from useHistory to "redirect" user

  useEffect( () => {

    if ( user._id )               // If there is no user logged in, send a notification and "redirect" to login
      return push('/home');       // If not logged in, "redirect" user to login

  })

  // Declare function for form submit event
  const handleSubmit = (event) => {

    event.preventDefault();                     // Prevent page reloading after submit action
    
    // Call signup service with form state variable as parameter, which includes form data for e-mail and password
    login(form)
    .then( res => {
      
      const { user, token } = res.data;         // Destructure user and token from response, sent by API
      
      // Store user and token in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      setUser(user);    // Modify user state variable, setting the user data in the state
      setRoute('');
      if ( !user.gaveConsent )
        push('/consentimiento');    // "Redirect" user to home
      else if ( !user.isProfileComplete )
        push('/perfil')
      else
        push('/home')

    })
    .catch( res => {

      const { msg } = res.response.data;

      // Send UIkit error notification
      UIkit.notification({
        message: `<p class="uk-text-center">${msg}</p>`,
        pos: 'bottom-center',
        status: 'danger'
      });

    });
    
  };

  return (
    <div className="uk-section">
      <div className="uk-container">
        <AuthForm
          submit={handleSubmit}
          action="login"
          handleChange={handleInput}
          setRoute={setRoute}
          {...form}
        />
      </div>
    </div>
  );

};

export default Login;