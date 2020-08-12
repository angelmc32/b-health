import React from 'react'
import { Switch, Route, useRouteMatch } from 'react-router-dom'
import Study from './Study'
import StudyForm from './StudyForm'
import StudyInfo from './StudyInfo'
import NoMatch from '../common/NoMatch'
import UIkit from 'uikit';                                          // Import UIkit for notifications

const StudyIndex = ({ studyType }) => {

  let { path, url } = useRouteMatch();

  return (
    <div className="uk-section">
      <Switch>
        <Route exact path={`${path}/`}>
          <Study studyType={studyType} url={url} />
        </Route>
        <Route path={`${path}/crear`}>  
          <StudyForm studyType={studyType} url={url} action={'create'} />
        </Route>
        <Route path={`${path}/ver`}>  
          <StudyInfo studyType={studyType} url={url} action={'read'} />
        </Route>
        <Route path={`${path}/editar`}>  
          <StudyInfo studyType={studyType} url={url} action={'update'} />
        </Route>
        <Route path={`${path}/eliminar`}>  
          <StudyInfo studyType={studyType} url={url} action={'delete'} />
        </Route>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    </div>
  )
}

export default StudyIndex