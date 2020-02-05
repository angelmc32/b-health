import React, { useContext } from 'react';                // Import React and useContext hook
import { Link, NavLink } from 'react-router-dom';         // Import NavLink for "navigation"
import { useHistory } from 'react-router-dom';            // Import useHistory for "redirection"
import { AppContext }  from '../../AppContext';           // Import AppContext to use created context
import { logout } from '../../services/auth-services';    // Import logout service for logout functionality
import logo from '../../images/health-check.svg'


// Declare Nav functional component (Navigation Bar)
const Navbar = () => {
  
  // Destructure user state variable and resetUserContext function from context
  const { user, route, setRoute, resetUserContext } = useContext(AppContext);
  // Destructure push method from useHistory to "redirect" user
  const { push } = useHistory();

  // Declare function for handling logout button
  const handleLogout = () => {

    logout();                   // Execute logout function (clear localStorage)
    push('/login');             // Redirect user to login
    resetUserContext();         // delete user data from context to an empty object

  };

  const closeMenu = () => {
    const toggle = document.getElementById('toggle');
    toggle.checked = !toggle.checked;
  }

  return (

    <nav className="uk-navbar uk-navbar-container uk-flex uk-flex-between uk-flex-middle uk-flex-wrap">
      
      <ul className="uk-navbar-nav uk-height-1-1">
          <li className="uk-active uk-flex uk-flex-middle">
            <NavLink to="/">
              <div className="uk-margin-left">
                  <img src={logo} alt="logo" width="48px" height="48px" className="uk-img" />
              </div>
            </NavLink>
          </li>
          <li className="uk-active uk-flex uk-flex-middle uk-height-1-1">
              <NavLink to="/#slideshow">
                B-Health
              </NavLink>
          </li>
      </ul>

      <label htmlFor="toggle" className="uk-margin-right uk-height-1-1"><span uk-icon="menu"></span></label>
      <input type="checkbox" id="toggle"/>
      
      <ul className="menu uk-navbar-nav">
          <li className="uk-active uk-width-1-1 uk-flex uk-flex-center uk-flex-middle" onClick={closeMenu} ><Link to="/servicios">Servicios</Link></li>
          <li className="uk-active uk-width-1-1 uk-flex uk-flex-center uk-flex-middle" onClick={closeMenu} ><Link to="/nosotros">Nosotros</Link></li>
          <li className="uk-active uk-width-1-1 uk-flex uk-flex-center uk-flex-middle" onClick={closeMenu} >
            <Link to="/login">
              <button className="uk-button uk-button-primary uk-button-small">
                Ingresar
              </button>
            </Link>
          </li>
          { user._id ? 
            <li className="uk-active uk-width-1-1 uk-flex uk-flex-center uk-flex-middle"><button className="uk-button uk-button-primary uk-border-pill" onClick={handleLogout} >Logout</button></li>
            :
            <div></div>
          }
      </ul>

    </nav>
    
  );

};

export default Navbar;