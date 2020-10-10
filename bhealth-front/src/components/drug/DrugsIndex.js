import React from 'react'
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom'

import Drugs from './Drugs'
import DrugsInfo from './DrugsInfo'
import DrugsTimeDay from './DrugsTimeDay'

const DrugIndex = () => {

  let { path, url } = useRouteMatch();
  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user

  return (
    <div className="uk-section">
      <Switch>
        <Route exact path={`${path}/`}>
          <Drugs push={push} />
        </Route>
        <Route path={`${path}/registrar`}>  
          <DrugsInfo push={push} url={url} />
        </Route>
        <Route path={`${path}/manana`}>
          <DrugsTimeDay title={'Mañana'} push={push} url={url} />
        </Route>
        <Route path={`${path}/tarde`}>
          <DrugsTimeDay title={'Tarde'} push={push} url={url} />
        </Route>
        <Route path={`${path}/noche`}>  
          <DrugsTimeDay title={'Noche'} push={push} url={url} />
        </Route>
        <Route path={`${path}/sin-horario`}>  
          <DrugsTimeDay title={'Sin Horario'} push={push} url={url} />
        </Route>
      </Switch>
    </div>
  )
}

export default DrugIndex