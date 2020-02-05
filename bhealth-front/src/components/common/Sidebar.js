import React, { useContext } from 'react';                // Import React and useContext hook
import { NavLink, Link } from 'react-router-dom';               // Import NavLink for "navigation"
//import { useHistory } from 'react-router-dom';            // Import useHistory for "redirection"
import { AppContext }  from '../../AppContext';           // Import AppContext to use created context

// Declare Sidebar functional component
const Sidebar = () => {
  
  // Destructure user and route state variables from context and setRoute function to change route
  const { user, setRoute } = useContext(AppContext); // Destructure user state variable

  // Declare function to update the route state variable according to the selected link for inner component nav
  const handleRoute = (event, newRoute) => {
    
    event.preventDefault();               // Prevent page reloading after submit action
    setRoute(newRoute);                   // Update route state variable with route sent as parameter
  
  }

  // Destructure push method from useHistory to "redirect" user
  //const { push } = useHistory();

  return (
     
    <div className="sidebar uk-flex uk-flex-column uk-flex-center uk-flex-top">
      <ul className="uk-nav-default uk-nav-parent-icon uk-height-large uk-width-4-5 uk-text-left uk-margin-left" uk-nav="true">
        <li className="uk-active" onClick={event => handleRoute(event, "myConsultations")} >
          <NavLink to="/consultations">Mis Consultas</NavLink>
        </li>
        <li className="uk-active">
          <NavLink to="/prescriptions">Mis Recetas</NavLink>
        </li>
        <li className="uk-active" onClick={event => handleRoute(event, "doctors")} >
          <NavLink to="/doctors">Doctores</NavLink>
        </li>
        <li className="uk-parent uk-active">
          <a href="#">Consultorios</a>
          <ul className="uk-nav-sub">
            <li onClick={event => handleRoute(event, "search")}>
              <NavLink to="/facilities">Buscar</NavLink>
            </li>
            <li onClick={event => handleRoute(event, "myFacilities")}>
              <NavLink to="/facilities">Mis Consultorios</NavLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
        
  );
};

export default Sidebar;