import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import { AppContext } from './AppContext';

// Import Components for navigation
import Landing from './components/landing/Landing';
import Signup from './components/auth/Signup';
import Registration from './components/auth/Registration'
import Activation from './components/auth/Activation'
import RecoverPassword from './components/auth/RecoverPass'
import ResetPassword from './components/auth/ResetPassword'
import Login from './components/auth/Login';
import Profile from './components/profile/Profile';
// import Preferences from './components/profile/Preferences';
import Home from './components/home/Home';
// import DoctorLanding from './components/doctor/DoctorLanding';
// import DoctorHome from './components/doctor/DoctorHome';
// import PatientHome from './components/patient/PatientHome';
// import Patients from './components/doctor/myPatients/Patients'
import Study from './components/study/Study';
import Disease from './components/disease/Disease';
import Consultation from './components/consultation/Consultation';
import Prescription from './components/prescription/Prescription';
import MedHistory from './components/medHistory/MedHistory';
import CatalogSearchbar from './components/common/CatalogSearchbar';
import Hospitalization from './components/hospitalization/Hozpitalization';
import Emergency from './components/emergency/Emergency'
import ConsultationFormSpecial from './components/consultation/ConsultationFormSpecial'
import Drug from './components/drug/Drug'
import Questionnaire from './components/Questionnaire'
import VitalSigns from './components/vitalsigns/VitalSigns'
import Summary from './components/medHistory/Summary'
import Consent from './components/common/Consent'
import Benefits from './components/benefits/Benefits';
import ImgUploader from './components/common/ImgUploader';
// import Calendar from './components/schedule/Calendar';

const Router = () => {

  const { user, setRoute } = useContext(AppContext); // Destructure user state variable

  const handleRoute = (newRoute) => setRoute(newRoute);

  return (
    <Switch>

      <Route exact path="/">
        <Landing />
      </Route>

      <Route path="/registrar">
        <Registration />
      </Route>
      
      <Route path="/login">
        <Login />
      </Route>

      <Route path="/registro">
        <Signup />
      </Route>

      <Route path="/activate/:activationToken">
        <Activation />
      </Route>

      <Route path="/recuperar">
        <RecoverPassword />
      </Route>

      <Route path="/restablecer/:resetPasswordLink">
        <ResetPassword />
      </Route>

      <Route path="/home">
        <Home />
      </Route>

      <Route path="/perfil">
        <Profile />
      </Route>

      <Route path="/antecedentes">
        <MedHistory />
      </Route>

      <Route path="/padecimientos">
        <Disease />
      </Route>

      <Route path="/signosvitales">
        <VitalSigns />
      </Route>

      <Route path="/consultas">
        <Consultation />
      </Route>

      <Route path="/medicamentos">
        <Drug />
      </Route>

      <Route path="/recetas">
        <Prescription />
      </Route>

      <Route path="/laboratorio">
        <Study studyType="lab"/>
      </Route>

      <Route path="/imagenologia">
        <Study studyType="xray"/>
      </Route>

      <Route path="/hospitalizaciones">
        <Hospitalization />
      </Route>

      <Route path="/urgencias">
        <Emergency />
      </Route>

      <Route path="/beneficios">
        <Benefits />
      </Route>

      <Route path="/resumen">
        <Summary />
      </Route>

      <Route path="/consentimiento">
        <Consent />
      </Route>

      <Route path="/test">
        <ImgUploader />
      </Route>
      
    </Switch>
  )
};

export default Router;