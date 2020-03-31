import React from 'react'

const ProfileCard = ({ user }) => {
  return (
    <div className="uk-card uk-card-hover uk-flex uk-grid-collapse uk-margin uk-padding-small" uk-grid>
      <div className="uk-card-media-left uk-width-1-6 uk-flex uk-flex-center uk-flex-middle">
        <div className="uk-width-1-1">
          <img className="uk-border-circle" width={128} height={128} src={user.profile_picture} alt="User profile" />
        </div>
      </div>
      <div className="uk-width-3-4 uk-flex uk-flex-column uk-flex-center uk-flex-middle">
        <div className="uk-width-1-1 uk-flex uk-flex-left">
          <h3 className="uk-hidden@s">Hola {user.first_name}</h3>
          <h3 className="uk-visible@s">Hola {user.first_name} {user.last_name1} {user.last_name2}</h3>
        </div>
        <div className="uk-width-1-1 uk-flex uk-visible@s uk-child-width-auto">
          <div className="uk-card uk-card-primary">
            Diabetes
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
