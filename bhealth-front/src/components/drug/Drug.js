import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';                      // Import useHistory for "redirection"
import { AppContext } from '../../AppContext';                      // Import AppContext to use created context
import useForm from '../../hooks/useForm';
import UIkit from 'uikit';                                          // Import UIkit for notifications
import moment from 'moment';                                        // Import momentjs for date formatting

import { getDrugs, createDrug, getDrug, editDrug } from '../../services/drug-services';

import DrugForm from './DrugForm';
import DrugInfo from './DrugInfo';

const Drug = () => {

  // Destructure form state variable, handleInput and handleFileInput functions for form state manipulation
  const { form, handleInput, handleFileInput } = useForm();

  const { push } = useHistory();                    // Destructure push method from useHistory to "redirect" user
  const { user, route, setRoute, objectHandler, setObjectHandler } = useContext(AppContext);
  const [ drug, setDrug] = useState({});
  const [ drugs, setDrugs ] = useState([]);
  const [ showForm, setShowForm ] = useState(false);
  const [ showDrug, setShowDrug ] = useState(false);
  const [ isButtonDisabled, setIsButtonDisabled ] = useState(false);

  useEffect( () => {

    if ( !user._id ) {    // If there is no user logged in, send a notification and "redirect" to login

      // Send UIkit warning notification: User must log in
      UIkit.notification({
        message: `<span uk-icon='close'></span> Por favor inicia sesión.`,
        pos: 'bottom-center',
        status: 'warning'
      });
      
      return push('/login');         // If not logged in, "redirect" user to login

    };

    if ( route !== 'create' && route !== 'read' ) {

      getDrugs()
      .then( res => {
      
        const { drugs } = res.data;
        setDrugs(drugs);
        setRoute('drugs');

      });
    }

    
    
  }, [route]);

  const handleSubmit = (event) => {

    event.preventDefault();               // Prevent page reloading after submit action
    setIsButtonDisabled(true)

    createDrug(form)
    .then( res => {

      const { drug } = res.data    // Destructure updated preferences document from response

      // Send UIkit success notification
      UIkit.notification({
        message: `<span uk-icon='close'></span> '¡El registro de medicamento fue creado exitosamente!'`,
        pos: 'bottom-center',
        status: 'success'
      });

      setRoute('drugs');
      setIsButtonDisabled(false);

    })
    .catch( error => {

      console.log(error);

      // Send UIkit error notification
      UIkit.notification({
        message: `<span uk-icon='close'></span> ${error}`,
        pos: 'bottom-center',
        status: 'danger'
      });
      
      setIsButtonDisabled(false);

    });
    
  };

  const toggleButton = () => setIsButtonDisabled(!isButtonDisabled);
  
  const loadDrug = (drug) => {
    setDrug(drug);
    setRoute('read');
  }

  const deleteDrugObject = () => {
    setObjectHandler(null);
    setRoute('drugs');
  }

  return (

    <div className="content">
      
        { route === 'drugs' ? (
          <div className="uk-section">
            <h2>Mis Medicamentos</h2>
            <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('create')} >
              + Nuevo Medicamento
            </button>
            <div className="uk-overflow-auto">
              { drugs.length < 1 ? (
                  <h4 className="uk-text-danger">No has agregado medicamentos</h4>
                ) : null
              }
              <table className="uk-table uk-table-striped uk-table-hover uk-table-middle">
                <thead>
                  <tr>
                    <th className="uk-text-center">Fecha Agregada</th>
                    <th className="uk-text-center uk-visible">Medicamento</th>
                    <th className="uk-text-center">Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  { drugs ? 
                      drugs.map( (drug, index) => 
                        <tr key={index}>
                          <td className="uk-text-center">{moment(drug.date_added).locale('es').format('LL')}</td>
                          <td className="uk-text-center uk-visible">{drug.brand_name}</td>
                          <td className="uk-text-center">
                            <button className="uk-button uk-button-default uk-button-small uk-border-pill" onClick={event => loadDrug({drug})} >
                              Ver
                            </button>
                          </td>
                        </tr>
                      )
                    : <tr>
                        <td>Cargando</td>
                        <td>Cargando</td>
                        <td>Cargando</td>
                      </tr>
                }
                </tbody>
              </table>
            </div>
          </div>
          ) : (
            route === 'create' ? (
              <div className="uk-section">
                <div className="uk-container">
                  <h2>Nuevo Medicamento</h2>
                  <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={deleteDrugObject} >
                    Regresar
                  </button>
                  <DrugForm handleSubmit={handleSubmit} handleInput={handleInput} handleFileInput={handleFileInput} form={form} isButtonDisabled={isButtonDisabled} objectHandler={objectHandler}/>
                </div>
              </div>
            ) : (
              route === 'read' ? (
                <div className="uk-section">
                  <h2>Ver Medicamento</h2>
                  <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m uk-margin" onClick={event => setRoute('drugs')} >
                    Regresar
                  </button>
                  <DrugInfo {...drug} />
                </div>
              ) : (
                <div className="uk-section">
                  <h2>Cargando...</h2>
                  <button className="uk-button uk-button-default uk-border-pill uk-width-2-3 uk-width-1-4@m" onClick={event => setRoute('drugs')} >
                    Regresar
                  </button>
                </div> 
              )
            )
          )
        }
      
    </div>
    
  )
}

export default Drug