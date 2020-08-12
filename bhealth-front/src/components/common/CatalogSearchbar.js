import React, { Fragment, useEffect, useState } from 'react'

const Autocomplete = ({ suggestions, propertyName, type, form, inputValue = null, inputClass = null, handleSearchbarInput }) => {

  const [ state, setState ] = useState({
    // The active selection's index
    activeSuggestion: 0,
    // The suggestions that match the user's input
    filteredSuggestions: [],
    // Whether or not the suggestion list is shown
    showSuggestions: false,
    // What the user has entered
    userInput: inputValue || ""
  })

  const shortDiagnosis = [
    {"CONSECUTIVO":"114","LETRA":"A","CATALOG_KEY":"A20","NOMBRE":"PESTE"},
    {"CONSECUTIVO":"360","LETRA":"A","CATALOG_KEY":"A75","NOMBRE":"TIFUS"},
    {"CONSECUTIVO":"392","LETRA":"A","CATALOG_KEY":"A82","NOMBRE":"RABIA"},
    {"CONSECUTIVO":"393","LETRA":"A","CATALOG_KEY":"A820","NOMBRE":"RABIA SELVATICA"},
    {"CONSECUTIVO":"394","LETRA":"A","CATALOG_KEY":"A821","NOMBRE":"RABIA URBANA"},
    {"CONSECUTIVO":"395","LETRA":"A","CATALOG_KEY":"A829","NOMBRE":"RABIA, SIN OTRA ESPECIFICACION"},
    {"CONSECUTIVO":"4340","LETRA":"J","CATALOG_KEY":"J45","NOMBRE":"ASMA"},
    {"CONSECUTIVO":"4341","LETRA":"J","CATALOG_KEY":"J450","NOMBRE":"ASMA PREDOMINANTEMENTE ALERGICA"},
    {"CONSECUTIVO":"4342","LETRA":"J","CATALOG_KEY":"J451","NOMBRE":"ASMA NO ALERGICA"},
    {"CONSECUTIVO":"4343","LETRA":"J","CATALOG_KEY":"J458","NOMBRE":"ASMA MIXTA"},
    {"CONSECUTIVO":"4344","LETRA":"J","CATALOG_KEY":"J459","NOMBRE":"ASMA, NO ESPECIFICADO"},
    {"CONSECUTIVO":"4345","LETRA":"J","CATALOG_KEY":"J46X","NOMBRE":"ESTADO ASMATICO"},
    {"CONSECUTIVO":"5235","LETRA":"L","CATALOG_KEY":"L70","NOMBRE":"ACNE"},
    {"CONSECUTIVO":"5236","LETRA":"L","CATALOG_KEY":"L700","NOMBRE":"ACNE VULGAR"},
    {"CONSECUTIVO":"5237","LETRA":"L","CATALOG_KEY":"L701","NOMBRE":"ACNE CONGLOBADO"},
    {"CONSECUTIVO":"5238","LETRA":"L","CATALOG_KEY":"L702","NOMBRE":"ACNE VARIOLIFORME"},
    {"CONSECUTIVO":"5239","LETRA":"L","CATALOG_KEY":"L703","NOMBRE":"ACNE TROPICAL"},
    {"CONSECUTIVO":"5240","LETRA":"L","CATALOG_KEY":"L704","NOMBRE":"ACNE INFANTIL"},
    {"CONSECUTIVO":"5241","LETRA":"L","CATALOG_KEY":"L705","NOMBRE":"ACNE EXCORIADO DE LA MUJER JOVEN"},
    {"CONSECUTIVO":"5242","LETRA":"L","CATALOG_KEY":"L708","NOMBRE":"OTROS ACNES"},
    {"CONSECUTIVO":"5243","LETRA":"L","CATALOG_KEY":"L709","NOMBRE":"ACNE, NO ESPECIFICADO"},
    {"CONSECUTIVO":"8186","LETRA":"R","CATALOG_KEY":"R232","NOMBRE":"RUBOR"},
    {"CONSECUTIVO":"5429","LETRA":"M","CATALOG_KEY":"M10","NOMBRE":"GOTA"},
    {"CONSECUTIVO":"5430","LETRA":"M","CATALOG_KEY":"M100","NOMBRE":"GOTA IDIOPATICA"},
    {"CONSECUTIVO":"5431","LETRA":"M","CATALOG_KEY":"M101","NOMBRE":"GOTA SATURNINA"},
    {"CONSECUTIVO":"5432","LETRA":"M","CATALOG_KEY":"M102","NOMBRE":"GOTA INDUCIDA POR DROGAS"},
    {"CONSECUTIVO":"5433","LETRA":"M","CATALOG_KEY":"M103","NOMBRE":"GOTA DEBIDA A ALTERACION DE LA FUNCION RENAL"},
    {"CONSECUTIVO":"5434","LETRA":"M","CATALOG_KEY":"M104","NOMBRE":"OTRAS GOTAS SECUNDARIAS"},
    {"CONSECUTIVO":"5435","LETRA":"M","CATALOG_KEY":"M109","NOMBRE":"GOTA, NO ESPECIFICADA"},
    {"CONSECUTIVO":"8119","LETRA":"R","CATALOG_KEY":"R05X","NOMBRE":"TOS"},
    {"CONSECUTIVO":"8127","LETRA":"R","CATALOG_KEY":"R066","NOMBRE":"HIPO"},
  ]

  const onChange = e => {

    const userInput = e.currentTarget.value;

    if ( e.currentTarget.value.length > 5 ){
        
      // Filter our suggestions that don't contain the user's input
      const filteredSuggestions = suggestions.filter(
        suggestion =>
          suggestion[propertyName].toLowerCase().indexOf(userInput.toLowerCase()) >
          -1
      );
      
      setState({
        activeSuggestion: 0,
        filteredSuggestions,
        showSuggestions: true,
        userInput: e.currentTarget.value
      });
    }
    else if ( type === 'diagnosis' && e.currentTarget.value.length > 2 && e.currentTarget.value.length < 6 ) {
      const filteredSuggestions = shortDiagnosis.filter(
        suggestion =>
          suggestion[propertyName].toLowerCase().indexOf(userInput.toLowerCase()) >
          -1
      );
      setState({
        activeSuggestion: 0,
        filteredSuggestions,
        showSuggestions: true,
        userInput: e.currentTarget.value
      });
    }
    else {
      setState({
        activeSuggestion: 0,
        filteredSuggestions,
        showSuggestions: false,
        userInput: e.currentTarget.value
      });
    }

    
  };

  const onClick = e => {
    setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText
    });
    form[type] = e.currentTarget.innerText
    handleSearchbarInput(type, e.currentTarget.innerText)
    inputClass = null
  };

  const onKeyDown = e => {
    const { activeSuggestion, filteredSuggestions } = state;

    // User pressed the enter key
    if (e.keyCode === 13) {
      let selection = filteredSuggestions[activeSuggestion]
      setState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: selection[propertyName]
      });
      inputClass = null
      form[type] = selection[propertyName]
    }
    // User pressed the up arrow
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }
      setState( (prevState) => ({ ...prevState, activeSuggestion: activeSuggestion -1 }));
    }
    // User pressed the down arrow
    else if (e.keyCode === 40) {
      if (activeSuggestion + 1 === filteredSuggestions.length) {
        return;
      }
      else
        setState( (prevState) => ({ ...prevState, activeSuggestion: activeSuggestion + 1 }));
    }
  };

  const { activeSuggestion, filteredSuggestions, showSuggestions, userInput } = state;

  let suggestionsListComponent;

  if (showSuggestions && userInput) {
    
    if (filteredSuggestions.length) {
      suggestionsListComponent = (
        <ul className="suggestions uk-height-small uk-border-rounded">
          {filteredSuggestions.map((suggestion, index) => {
            let className;

            // Flag the active suggestion with a class
            if (index === activeSuggestion) {
              className = "suggestion-active";
            }

            return (
              <li className={className} key={index} onClick={onClick}>
                {suggestion[propertyName]}
              </li>
            );
          })}
        </ul>
      );
    } else {
      if ( userInput.length < 8) {
        suggestionsListComponent = (
          <div className="no-suggestions uk-text-center">
            <em>Buscando, continua escribiendo...</em>
          </div>
        );
      }
      else {
        suggestionsListComponent = (
          <div className="no-suggestions uk-text-center">
            <em>No se encuentra en el catálogo, intenta otra palabra...</em>
          </div>
        );
      }
      
    }

  }

  return (
    <Fragment>
      {/* <div className="uk-search uk-search-default uk-width-1-1" uk-toggle="target: #search" hidden>
        <span className="uk-search-icon-flip" uk-search-icon="true"></span>
        <input
          className="uk-search-input uk-text-center uk-border-pill"
          type="search"
          placeholder={ type === 'diagnosis' ? "Busca padecimiento..." : type === 'drugs' ? "Busca por nombre genérico..." : type === 'procedure' ? "Busca procedimiento..." : "Busca especialidad"}
          value={userInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      </div>
      <div id="search" className="uk-modal-full" uk-modal="true" hidden>
        <div className="uk-modal-dialog uk-modal-body uk-height-1-1">
        <div className="uk-section">
          <button className="uk-modal-close-default" type="button" uk-close="true" />
            <div className="uk-search uk-search-default uk-width-1-1 uk-margin">
              <span className="uk-search-icon-flip" uk-search-icon="true"></span>
              <input
                className="uk-search-input uk-text-center uk-border-pill"
                type="search"
                name={type}
                placeholder={ type === 'diagnosis' ? "Busca padecimiento..." : type === 'drugs' ? "Busca por nombre genérico..." : type === 'procedure' ? "Busca procedimiento..." : "Busca especialidad"}
                value={userInput}
                onChange={onChange}
                onKeyDown={onKeyDown}
              />
            </div>
            {suggestionsListComponent}
          </div>
        </div>
      </div> */}
      <div className="uk-width-1-1">
        <div className="uk-search uk-search-default uk-width-1-1">
          <span className="uk-search-icon-flip" uk-search-icon="true"></span>
              <input
                className={`uk-input uk-search-input uk-text-center uk-border-pill ${inputClass}`}
                type="search"
                name={type}
                placeholder={ type === 'diagnosis' ? "Busca padecimiento..." : type === 'drugs' ? "Busca por nombre genérico..." : type === 'procedure' ? "Busca procedimiento..." : "Busca especialidad"}
                value={userInput}
                onChange={onChange}
                onKeyDown={onKeyDown}
                required
              />
        </div>
        {suggestionsListComponent}
      </div>
    </Fragment>
  );
}

export default Autocomplete;