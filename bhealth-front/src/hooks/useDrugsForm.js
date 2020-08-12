import { useState } from 'react';   // Import useState hook to create custom hook
import moment from 'moment'
import 'moment/locale/es'  // without this line it didn't work
moment.locale('es')

// Declare hook as a React functional component
const useDrugsForm = (drugsArray) => {
  
  // Declare form state variable and setForm function to update the form state variable
  const [ form, setForm ] = useState({});
  const [ array, setArray ] = useState([]);

  // Declare handleInput function for input data manipulation
  const handleInput = (event) => {
    
    // Destructure input name and value (data that is being changed by user)
    const { name, value } = event.target;

    // When using checkboxes, store the values in an array
    if ( event.target.type === 'checkbox' ) {
      
      array.push(value);
      setArray(array);
      setForm( prevState => ({...prevState, [name]: array}) );

    } else if ( name === 'date' ) {
      let date = moment(value).format()
      setForm( prevState => ({...prevState, [name]: date}) );

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

export default useDrugsForm;