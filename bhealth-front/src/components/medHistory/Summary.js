import React, { useEffect, useState } from 'react'
import { Document, Page } from '../../../node_modules/react-pdf/dist/entry.webpack';
import { createSummary } from '../../services/pdf-services'
import FileSaver from 'file-saver';

const Summary = () => {

  const [ isButtonDisabled, setIsButtonDisabled ] = useState(false);
  const [ pdfFile, setPdfFile ] = useState(null);

  useEffect( () => {
    
  }, [pdfFile])

  const onPdfFetched = () => {
    FileSaver.saveAs(
      new Blob([pdfFile], { type: 'application/pdf' }),
      `sample.pdf`
    );
  }

  const handleSummaryClick = () => {

    // event.preventDefault();

    createSummary()
    .then( res => {
      console.log(res)
      setPdfFile(res.data)
    })
    .catch( error => {
      console.log(error)
    })

  }

  return (
    <div className="uk-section">
      <h2>Mi Resumen Clínico</h2>
      <div className="uk-container">
        En esta sección puede crear un PDF para compartir tu resumen clínico.
      </div>
      <button className="uk-button uk-button-primary uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={handleSummaryClick}>
        Crear Resumen
      </button>
      { pdfFile ? 
        <div className="uk-margin">
          <button className="uk-button uk-button-primary uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={onPdfFetched}>
            Descargar
          </button>
          <Document file={{data: pdfFile}} >
            <Page pageNumber={1} />
          </Document> 
        </div>
        : null
      }
      
    </div>
  )
}

export default Summary
