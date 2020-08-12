import React, { useContext } from 'react'
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom'

import Profile from './Profile'
import ProfileForm from './ProfileForm'
import ProfilePassword from './ProfilePassword'

const ProfileIndex = () => {

  let { path, url } = useRouteMatch();
  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user

  return (
    <div className="uk-section">
      <div className="uk-container">
        <Switch>
          <Route exact path={`${path}/`}>
            <Profile push={push} url={url} />
          </Route>
          <Route path={`${path}/completar`}>  
            <ProfileForm push={push} url={url} />
          </Route>
          <Route path={`${path}/contrasena`}>  
            <ProfilePassword push={push} url={url} />
          </Route>
        </Switch>
      </div>
      
    </div>
  )
}

export default ProfileIndex