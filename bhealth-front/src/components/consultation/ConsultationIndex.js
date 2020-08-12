import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import Consultation from './Consultation'
import ConsultationForm from './ConsultationForm'
import ConsultationInfo from './ConsultationInfo'
import ConsultationStudies from './ConsultationStudies'
import NoMatch from '../common/NoMatch'
import UIkit from 'uikit';                                          // Import UIkit for notifications

const ConsultationIndex = () => {

  let { path, url } = useRouteMatch();

  return (
    <div className="uk-section">
      <Switch>
        <Route exact path={`${path}/`}>
          <Consultation url={url} />
        </Route>
        <Route path={`${path}/crear`}>  
          <ConsultationForm url={url} action={'create'} />
        </Route>
        <Route path={`${path}/ver`}>  
          <ConsultationInfo url={url} action={'read'} />
        </Route>
        <Route path={`${path}/editar`}>  
          <ConsultationForm url={url} action={'update'} />
        </Route>
        <Route path={`${path}/eliminar`}>  
          <ConsultationInfo url={url} action={'delete'} />
        </Route>
        <Route path={`${path}/estudios`}>  
          <ConsultationStudies url={url} />
        </Route>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    </div>
  )
}

export default ConsultationIndex