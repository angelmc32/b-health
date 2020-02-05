import { useState } from 'react';   // Import useState hook to create custom hook

// Declare hook as a React functional component
const useForm = () => {
  
  // Declare form state variable and setForm function to update the form state variable
  const [form, setForm] = useState({});
  const [array, setArray] = useState([]);

  // Declare handleInput function for input data manipulation
  const handleInput = (event) => {
    
    // Validation for map toggling in facility form
    if ( event.target.id === 'toggle-map') form['showMap'] = !form['showMap'];
    
    // Destructure input name and value (data that is being changed by user)
    const { name, value } = event.target;

    // When using checkboxes, store the values in an array
    if ( event.target.type === 'checkbox' && event.target.name === 'zones' ) {
      
      array.push(value);
      setArray(array);
      setForm( prevState => ({...prevState, [name]: array}) );

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