import React, { useEffect, useState } from 'react'
import cie10 from '../../catalogs/cie10.json'
import procedures from '../../catalogs/procedimientos.json'
import drugs from '../../catalogs/drugs.json'

const CatalogSearchbar = ({type, form, handleFormInput}) => {

  const [ searchResults, setSearchResults ] = useState('');
  const [ searchValue, setSearchValue ] = useState('');
  const [ showDrop, setShowDrop ] = useState(false);

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
    }

    setSearchResults(results);

    if ( results.length <= 15 ) {
      setShowDrop(true);
    }
    console.log(searchResults)

  }, [searchValue]);


  return (
      <div className="uk-margin uk-width-1-1">
        <div className="uk-search uk-search-default uk-width-1-1">
          <span className="uk-search-icon-flip" uk-search-icon="true"></span>
          <input
            className="uk-search-input uk-text-center"
            type="search"
            placeholder={ type === 'diagnosis' ? "Busca padecimiento..." : type === 'drugs' ? "Busca por nombre genérico..." : "Busca procedimiento..."}
            value={searchValue}
            onChange={handleInput}
          />
        </div>
        { showDrop ? (
            <select className="uk-select" name="generic_name" onChange={handleFormInput}>
              {searchResults.map( (drug, index) => <option key={index} value={drug.generic_name} >{drug.generic_name}</option> )}
            </select>
          ) : null 
        }
      </div>
  )
}

export default CatalogSearchbar