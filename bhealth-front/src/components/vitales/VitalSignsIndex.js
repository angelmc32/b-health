import React, { Fragment, useContext } from 'react'
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom'
import { AppContext } from '../../AppContext';

import VitalSigns from './VitalSigns'
import VitalSignsForm from './VitalSignsForm'

const VitalSignsIndex = () => {

  let { path, url } = useRouteMatch();

  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user
  const { user, route, setRoute, objectHandler, setObjectHandler, resetUserContext } = useContext(AppContext);

  const Index = () => (
    <Fragment>
      <h2>Signos Vitales</h2>
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
            <VitalSigns push={push} url={url} />
          </Route>
          <Route path={`${path}/registrar`}>
            <VitalSignsForm push={push} url={url} />
          </Route>
        </Switch>
      </div>
      
    </div>
  )
}

export default VitalSignsIndex
