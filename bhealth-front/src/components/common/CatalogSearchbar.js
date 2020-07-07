import React, { useEffect, useState } from 'react'
import cie10 from '../../catalogs/cie10.json'
import procedures from '../../catalogs/procedimientos.json'
import drugs from '../../catalogs/drugs.json'
import specialties from '../../catalogs/medspecs.json'

const CatalogSearchbar = ({type, form, handleFormInput}) => {

  const [ searchResults, setSearchResults ] = useState([]);
  const [ searchValue, setSearchValue ] = useState('');
  const [ showDrop, setShowDrop ] = useState(true);

  const handleInput = (event) => {
    setSearchValue(event.target.value);
  };

  let results = [];

  useEffect( () => {

    switch (type) {
      case "diagnosis": results = cie10.filter( disease =>
        disease.NOMBRE.toLowerCase().includes(searchValue)
        );
        break;

      case "procedure": results = procedures.filter( disease =>
        disease.PRO_NOMBRE.toLowerCase().includes(searchValue)
        );
        break;

      case "drugs": results = drugs.filter( disease =>
        disease.generic_name.toLowerCase().includes(searchValue)
        );
        break;

      case "doctor_specialty": results = specialties.filter( disease =>
        disease.ESPECIALIDAD.toLowerCase().includes(searchValue)
        );
        break;
    }

    setSearchResults(results);

    if ( results.length <= 100 ) {
      setShowDrop(true);
    }

  }, []);


  return (
      <div className="uk-margin uk-width-1-1">
        {/* <div className="uk-search uk-search-default uk-width-1-1">
          <span className="uk-search-icon-flip" uk-search-icon="true"></span>
          <input
            className="uk-search-input uk-text-center uk-border-pill"
            type="search"
            placeholder={ type === 'diagnosis' ? "Busca padecimiento..." : type === 'drugs' ? "Busca por nombre genérico..." : type === 'procedure' ? "Busca procedimiento..." : "Busca especialidad"}
            value={searchValue}
            onChange={handleInput}
          />
        </div> */}
        { showDrop ? (
            <select className="uk-select uk-border-pill" name={type} onChange={handleFormInput} defaultValue="" required={true} >
              <option value="">Selecciona por favor</option>
              {searchResults.map( (disease, index) => <option key={index} value={ type === "diagnosis" ? disease.NOMBRE : type === "drugs" ? disease.generic_name : disease.PRO_NOMBRE} >{ type === "diagnosis" ? disease.NOMBRE : type === "drugs" ? disease.generic_name : type === "procedure" ? disease.PRO_NOMBRE : disease.ESPECIALIDAD}</option> )}
            </select>
          ) : null 
        }
      </div>
  )
}

export default CatalogSearchbar