import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import UIkit from 'uikit';
import { Document, Page } from '../../../node_modules/react-pdf/dist/entry.webpack';
import { createSummary } from '../../services/pdf-services'
import FileSaver from 'file-saver';
import moment from 'moment';
import 'moment/locale/es'

const Summary = () => {

  const { user, resetUserContext } = useContext(AppContext);
  const { push } = useHistory();
  const [ state, setState ] = useState({
    isButtonDisabled: false,
    spinnerState: false,
    action: 'create'
  });
  const [ pdfFile, setPdfFile ] = useState(null);

  useEffect( () => {
    
  }, [pdfFile])

  const onPdfFetched = () => {
    // window.open(new Blob([pdfFile], { type: 'application/pdf' }),`sample.pdf`)
    const now = moment().format('YYYY-MM-DD');
    const pdfName = now+`_HistorialClinico_${user.last_name1}${user.last_name2}_${user.first_name[0]}`
    FileSaver.saveAs(
      new Blob([pdfFile], { type: 'application/pdf' }),
      pdfName
    );
    // var file = new Blob([pdfFile], { type: 'application/pdf' });
    // var fileURL = URL.createObjectURL(file);
    // window.open(fileURL);
  }

  const handleSummaryClick = (event) => {

    event.preventDefault();
    setState( prevState => ({...prevState, isButtonDisabled: true, spinnerState: true}))

    createSummary()
    .then( res => {
      setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}));
      setPdfFile(res.data)
      // var file = new Blob([res.data], { type: 'application/pdf' });
      // var fileURL = URL.createObjectURL(file);
      // window.open(fileURL);
    })
    .catch( res => {
      console.log(res.response)
      let { msg } = res.response.data;
      if ( msg === 'Sesión expirada. Reinicia sesión por favor.' || res.response.status === 401 ) {
        if (msg === undefined) msg = 'Sesión expirada. Reinicia sesión por favor.';
        localStorage.clear();
        resetUserContext();
        UIkit.notification({
          message: `<p class="uk-text-center">${msg}</p>`,
          pos: 'bottom-center',
          status: 'warning'
        });
        push('/login');
      }
      else 
        UIkit.notification({
          message: `<p class="uk-text-center">${msg}</p>`,
          pos: 'bottom-center',
          status: 'danger'
        });

      setState( prevState => ({...prevState, isButtonDisabled: false, spinnerState: false}))
    })

  }

  return (
    <div className="uk-section">
      <h2>Mi Resumen Clínico</h2>
      <div className="uk-container">
        En esta sección puede crear un PDF para compartir tu resumen clínico.
      </div>
      <button className="uk-button uk-button-primary uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" disabled={state.isButtonDisabled}  onClick={handleSummaryClick} >
        { !state.spinnerState ? "Crear Resumen" : "Creando"}  <div className={ state.spinnerState ? 'uk-visible' : 'uk-hidden'} uk-spinner="true"></div>
      </button>
      { pdfFile ? 
        <div className="uk-margin uk-flex uk-flex-column uk-flex-center uk-flex-middle">
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
