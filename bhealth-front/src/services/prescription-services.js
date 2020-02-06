import axios from 'axios';                      // Import axios to enable API calls to our back-end

// Set URL according to environment
const isProduction = process.env.NODE_ENV === 'production';
const base_url = isProduction ? 'https://nubiomed-iron.herokuapp.com/api/prescriptions' : 'http://localhost:3000/api/prescriptions';

// Export get function to retrieve all prescriptions of the current logged in user
export const getprescriptions = () => {

  const token = localStorage.getItem('token');  // Get token from localStorage

  return axios.get(`${base_url}/`, {
    headers: {
      Authorization: token,                     // Send token in request headers (check api/helpers/auth-helper)
    }
  });

};

// Export create facility function, which receives data as parameters to enable prescription creation
export const createPrescription = (data) => {

  const token = localStorage.getItem('token');  // Get token from localStorage

  // Return a call to our /new route, while sending the parameters obtained from the form/front-end
  return axios.post(`${base_url}/`, data, {
    headers: {
      Authorization: token,                     // Send token in request headers (check api/helpers/auth-helper)
    }
  });

};

export const getPrescription = (prescriptionID) => {

  const token = localStorage.getItem('token');  // Get token from localStorage

  return axios.get(`${base_url}/${prescriptionID}`, {
    headers: {
      Authorization: token,                     // Send token in request headers (check api/helpers/auth-helper)
    }
  });

};

export const editPrescription = (prescriptionID, data) => {

  const token = localStorage.getItem('token');  // Get token from localStorage

  return axios.patch(`${base_url}/${prescriptionID}`, data, {
    headers: {
      Authorization: token,                     // Send token in request headers (check api/helpers/auth-helper)
    }
  });

}