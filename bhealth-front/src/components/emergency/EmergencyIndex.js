import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import Emergency from './Emergency'
import EmergencyForm from './EmergencyForm'
import EmergencyInfo from './EmergencyInfo'
import NoMatch from '../common/NoMatch'
import UIkit from 'uikit';                                          // Import UIkit for notifications

const ConsultationIndex = () => {

  let { path, url } = useRouteMatch();

  return (
    <div className="uk-section">
      <Switch>
        <Route exact path={`${path}/`}>
          <Emergency url={url} />
        </Route>
        <Route path={`${path}/crear`}>  
          <EmergencyForm url={url} action={'create'} />
        </Route>
        <Route path={`${path}/ver`}>  
          <EmergencyInfo url={url} action={'read'} />
        </Route>
        <Route path={`${path}/editar`}>  
          <EmergencyForm url={url} action={'update'} />
        </Route>
        <Route path={`${path}/eliminar`}>  
          <EmergencyInfo url={url} action={'delete'} />
        </Route>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    </div>
  )
}

export default ConsultationIndex