import React, { Fragment, useContext } from 'react'
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom'
import { AppContext } from '../../AppContext';

import VitalSigns from './VitalSigns'
import VitalSignsForm from './VitalSignsForm'
import VitalSignsInfo from './VitalSignsInfo'
import NoMatch from '../common/NoMatch'

const VitalSignsIndex = () => {

  let { path, url } = useRouteMatch();

  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user
  const { user, route, setRoute, objectHandler, setObjectHandler, resetUserContext } = useContext(AppContext);

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
          <Route path={`${path}/ver`}>  
            <VitalSignsInfo url={url} action={'read'} />
          </Route>
          <Route path={`${path}/editar`}>  
            <VitalSignsInfo url={url} action={'update'} />
          </Route>
          <Route path={`${path}/eliminar`}>  
            <VitalSignsInfo url={url} action={'delete'} />
          </Route>
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </div>
      
    </div>
  )
}

export default VitalSignsIndex
