import React from 'react'
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom'

import Treatments from './Treatments'
import TreatmentsForm from './TreatmentsForm'
import TreatmentsInfo from './TreatmentsInfo'
import TreatmentPillcase from './TreatmentPillcase'

const TreatmentsIndex = () => {

  let { path, url } = useRouteMatch();
  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user

  return (
    <div className="uk-section">
      <Switch>
        <Route exact path={`${path}/`}>
          <Treatments push={push} />
        </Route>
        <Route path={`${path}/registrar`}>  
          <TreatmentsForm push={push} url={url} />
        </Route>
        <Route path={`${path}/ver`}>  
          <TreatmentsInfo url={url} action={'read'} />
        </Route>
        <Route path={`${path}/editar`}>  
          <TreatmentsInfo url={url} action={'update'} />
        </Route>
        <Route path={`${path}/eliminar`}>  
          <TreatmentsInfo url={url} action={'delete'} />
        </Route>
        <Route path={`${path}/manana`}>
          <TreatmentPillcase title={'Mañana'} push={push} url={url} />
        </Route>
        <Route path={`${path}/tarde`}>
          <TreatmentPillcase title={'Tarde'} push={push} url={url} />
        </Route>
        <Route path={`${path}/noche`}>  
          <TreatmentPillcase title={'Noche'} push={push} url={url} />
        </Route>
        <Route path={`${path}/sin-horario`}>  
          <TreatmentPillcase title={'Sin Horario'} push={push} url={url} />
        </Route>
      </Switch>
    </div>
  )
}

export default TreatmentsIndex