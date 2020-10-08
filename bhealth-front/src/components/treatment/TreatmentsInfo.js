import React from 'react'

const TreatmentsInfo = ({url, action}) => {
  return (
    <div>
      <h2>{action !== 'delete' ? 'Ver Receta' : 'Eliminar Receta'}</h2>
    </div>
  )
}

export default TreatmentsInfo