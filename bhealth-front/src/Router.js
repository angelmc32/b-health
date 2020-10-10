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
import ProfileIndex from './components/profile/ProfileIndex';
// import Preferences from './components/profile/Preferences';
import Home from './components/home/Home';
// import DoctorLanding from './components/doctor/DoctorLanding';
// import DoctorHome from './components/doctor/DoctorHome';
// import PatientHome from './components/patient/PatientHome';
// import Patients from './components/doctor/myPatients/Patients'
import StudyIndex from './components/study/StudyIndex';
import Disease from './components/disease/Disease';
import TreatmentsIndex from './components/treatment/TreatmentsIndex';
import ConsultationIndex from './components/consultation/ConsultationIndex';
import PrescriptionIndex from './components/prescription/PrescriptionIndex';
import MedHistoryIndex from './components/medHistory/MedHistoryIndex'
import CatalogSearchbar from './components/common/CatalogSearchbar';
import Hospitalization from './components/hospitalization/Hozpitalization';
import EmergencyIndex from './components/emergency/EmergencyIndex'
import DrugsIndex from './components/drug/DrugsIndex'
import Questionnaire from './components/Questionnaire'
import VitalSignsIndex from './components/vitales/VitalSignsIndex'
import Summary from './components/medHistory/Summary'
import Consent from './components/common/Consent'
import Benefits from './components/benefits/Benefits';

import NoMatch from './components/common/NoMatch'
// import Calendar from './components/schedule/Calendar';
import drugs from './catalogs/drugs.json'
import diseases from './catalogs/cie10.json'
import DrugsForm from './components/drug/DrugsFormPrev';

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
        <ProfileIndex />
      </Route>

      <Route path="/tratamientos">
        <TreatmentsIndex />
      </Route>

      <Route path="/antecedentes">
        <MedHistoryIndex />
      </Route>

      <Route path="/padecimientos">
        <Disease />
      </Route>

      <Route path="/signosvitales">
        <VitalSignsIndex />
      </Route>

      <Route path="/consultas">
        <ConsultationIndex />
      </Route>

      <Route path="/medicamentos">
        <DrugsIndex />
      </Route>

      <Route path="/recetas">
        <PrescriptionIndex />
      </Route>

      <Route path="/laboratorio">
        <StudyIndex studyType="lab"/>
      </Route>

      <Route path="/imagenologia">
        <StudyIndex studyType="xray"/>
      </Route>

      <Route path="/hospitalizaciones">
        <Hospitalization />
      </Route>

      <Route path="/urgencias">
        <EmergencyIndex />
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
        <DrugsForm />
      </Route>
      
      <Route path="*">
        <NoMatch />
      </Route>

    </Switch>
  )
};

export default Router;