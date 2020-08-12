import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import Prescription from './Prescription'
import PrescriptionForm from './PrescriptionForm'
import PrescriptionInfo from './PrescriptionInfo'
import NoMatch from '../common/NoMatch'
import UIkit from 'uikit';                                          // Import UIkit for notifications

const PrescriptionIndex = () => {

  let { path, url } = useRouteMatch();

  return (
    <div className="uk-section">
      <Switch>
        <Route exact path={`${path}/`}>
          <Prescription url={url} />
        </Route>
        <Route path={`${path}/crear`}>  
          <PrescriptionForm url={url} action={'create'} />
        </Route>
        <Route path={`${path}/ver`}>  
          <PrescriptionInfo url={url} action={'read'} />
        </Route>
        <Route path={`${path}/editar`}>  
          <PrescriptionInfo url={url} action={'update'} />
        </Route>
        <Route path={`${path}/eliminar`}>  
          <PrescriptionInfo url={url} action={'delete'} />
        </Route>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    </div>
  )
}

export default PrescriptionIndex