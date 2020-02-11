import { useState } from 'react';   // Import useState hook to create custom hook

// Declare hook as a React functional component
const useForm = () => {
  
  // Declare form state variable and setForm function to update the form state variable
  const [ form, setForm ] = useState({});
  const [ array, setArray ] = useState([]);
  const [ genericName, setGenericName ] = useState([]);
  const [ brandName, setBrandName ] = useState([]);
  const [ dosageForm, setDosageForm ] = useState([]);
  const [ dose, setDose ] = useState([]);
  const [ indications, setIndications ] = useState([]);

  // Declare handleInput function for input data manipulation
  const handleInput = (event) => {
    
    // Destructure input name and value (data that is being changed by user)
    const { name, value } = event.target;

    // When using checkboxes, store the values in an array
    if ( event.target.type === 'checkbox' ) {
      
      array.push(value);
      setArray(array);
      setForm( prevState => ({...prevState, [name]: array}) );

    } 
    if ( event.target.name === 'generic_name' || event.target.name === 'brand_name' || event.target.name === 'dosage_form' || event.target.name === 'dose' || event.target.name === 'indications' ) {

      switch (event.target.name) {
        case 'generic_name':
          genericName.push(value);
          setGenericName(genericName);
          setForm( prevState => ({...prevState, [name]: genericName}) );
          break;
        case 'brand_name':
          brandName.push(value);
          setBrandName(brandName);
          setForm( prevState => ({...prevState, [name]: brandName}) );
          break;
        case 'dosage_form':
          dosageForm.push(value);
          setDosageForm(dosageForm);
          setForm( prevState => ({...prevState, [name]: dosageForm}) );
          break;
        case 'dose':
          dose.push(value);
          setDose(dose);
          setForm( prevState => ({...prevState, [name]: dose}) );
          break;
        case 'indications':
          indications.push(value);
          setIndications(indications);
          setForm( prevState => ({...prevState, [name]: indications}) );
          break;
      }

    } else {

      // Update the form state without erasing previos values (with prevState)
      setForm( prevState => ({...prevState, [name]: value}) );

    }

  };

  // Declare handleInputFile function for files manipulation
  const handleFileInput = (event) => {

    // Destructure input name and files (data that is being changed by user)
    const { name, files } = event.target;

    // Update the form state without erasing previos values (with prevState)
    setForm( prevState => ({...prevState, [name]: files}) );

  };

  // Return the form state variable and input handling functions
  return { form, setForm, handleInput, handleFileInput };

};

export default useForm;