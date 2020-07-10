import React from 'react'
import { useHistory } from 'react-router-dom';

const NoMatch = () => {

  const { push } = useHistory();

  return (
    <div className="uk-section">
      <div className="uk-container">
        <h2>Esta página no existe</h2>
        <button className="uk-button uk-button-primary uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin-small" onClick={event => push('/home')} >
          Ir a Inicio
        </button>
      </div>
    </div>
  )
}

export default NoMatch
