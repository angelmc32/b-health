import React, { Fragment, useContext } from 'react'
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom'
import { AppContext } from '../../AppContext';

import Drugs from './Drugs'
import DrugsForm from './DrugsForm'

const DrugIndex = () => {

  let { path, url } = useRouteMatch();

  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user
  const { user, route, setRoute, objectHandler, setObjectHandler, resetUserContext } = useContext(AppContext);

  const Index = () => (
    <Fragment>
      <h2>Mis Medicamentos</h2>
      <p>Aqui va lo principal</p>
    </Fragment>
  )
  const Create = () => (
    <Fragment>
      <h2>Signos Vitales</h2>
      <p>Aqui va para crear</p>
    </Fragment>
  )

  return (
    <div className="uk-section">
      <div className="uk-container">
        <Switch>
          <Route exact path={`${path}/`}>
            <Drugs push={push} url={url} />
          </Route>
          <Route path={`${path}/registrar`}>
            
            <DrugsForm push={push} url={url} />
          </Route>
        </Switch>
      </div>
      
    </div>
  )
}

export default DrugIndex