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
     
    <div className="sidebar uk-flex uk-flex-column uk-flex-left uk-flex-top">
      <ul className="uk-nav-default uk-nav-parent-icon uk-width-4-5 uk-text-left uk-margin-left uk-margin-large-top" uk-nav="true">
        <li className="uk-active" onClick={event => handleRoute(event, "myConsultations")} >
          <NavLink to="/home">Mi Salud</NavLink>
        </li>
        <li className="uk-active" onClick={event => handleRoute(event, "myConsultations")} >
          <NavLink to="/historial">Historial</NavLink>
        </li>
        <li className="uk-active" onClick={event => handleRoute(event, "myConsultations")} >
          <NavLink to="/consultas">Consultas</NavLink>
        </li>
        <li className="uk-active">
          <NavLink to="/recetas">Recetas</NavLink>
        </li>
        <li className="uk-active" onClick={event => handleRoute(event, "doctors")} >
          <NavLink to="/estudios">Estudios</NavLink>
        </li>
        <li className="uk-active" onClick={event => handleRoute(event, "doctors")} >
          <NavLink to="/urgencias">Urgencias</NavLink>
        </li>
        <li className="uk-active" onClick={event => handleRoute(event, "doctors")} >
          <NavLink to="/hospitalizaciones">Hospitalizaciones</NavLink>
        </li>
        <li className="uk-active" onClick={event => handleRoute(event, "doctors")} >
          <NavLink to="/agenda">Agenda</NavLink>
        </li>
        <li className="uk-active" onClick={event => handleRoute(event, "doctors")} >
          <NavLink to="/terapias">Otras Terapias</NavLink>
        </li>
        <li className="uk-active" onClick={event => handleRoute(event, "doctors")} >
          <NavLink to="/tienda">Tienda</NavLink>
        </li>
      </ul>
    </div>
        
  );
};

export default Sidebar;