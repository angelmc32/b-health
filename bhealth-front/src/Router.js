import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { AppContext } from './AppContext';

// Import Components for navigation
// import Landing from './components/landing/Landing';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
// import Profile from './components/profile/Profile';
// import Preferences from './components/profile/Preferences';
// import Doctors from './components/doctor/Doctors';
// import DoctorLanding from './components/doctor/DoctorLanding';
// import DoctorHome from './components/doctor/DoctorHome';
// import PatientHome from './components/patient/PatientHome';
// import Patients from './components/doctor/myPatients/Patients'
// import Facility from './components/facility/Facility';
// import Consultation from './components/consultation/Consultation';
// import Prescription from './components/prescription/Prescription';
// import Map from './components/common/Mapbox';
// import AppLoader from './components/common/Loader';
// import Calendar from './components/schedule/Calendar';

const Router = () => {

  const { user, setRoute } = useContext(AppContext); // Destructure user state variable

  const handleRoute = (newRoute) => setRoute(newRoute);

  return (
    <Switch>
      <Route path="/signup">
        <Signup />
      </Route>
      
      <Route path="/login">
        <Login />
      </Route>
    </Switch>
  )
};

export default Router;