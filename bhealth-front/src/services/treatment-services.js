import axios from 'axios';                      // Import axios to enable API calls to our back-end

// Set URL according to environment
const isProduction = process.env.NODE_ENV === 'production';
const base_url = isProduction ? 'http://54.163.77.88/api/treatments' : `${process.env.REACT_APP_API_URL}/treatments`;

// Export get function to retrieve all treatments of the current logged in user
export const getTreatments = () => {

  const token = localStorage.getItem('token');  // Get token from localStorage

  return axios.get(`${base_url}/`, {
    headers: {
      Authorization: token,                     // Send token in request headers (check api/helpers/auth-helper)
    }
  });

};

// Export create facility function, which receives data as parameters to enable treatment creation
export const createTreatment = (data) => {

  const token = localStorage.getItem('token');  // Get token from localStorage

  // Return a call to our /new route, while sending the parameters obtained from the form/front-end
  return axios.post(`${base_url}/`, data, {
    headers: {
      Authorization: token,                     // Send token in request headers (check api/helpers/auth-helper)
    }
  });

};

export const getTreatment = (treatmentID) => {

  const token = localStorage.getItem('token');  // Get token from localStorage

  return axios.get(`${base_url}/${treatmentID}`, {
    headers: {
      Authorization: token,                     // Send token in request headers (check api/helpers/auth-helper)
    }
  });

};

export const editTreatment = (treatmentID, data) => {

  const token = localStorage.getItem('token');  // Get token from localStorage

  return axios.patch(`${base_url}/${treatmentID}`, data, {
    headers: {
      Authorization: token,                     // Send token in request headers (check api/helpers/auth-helper)
    }
  });

}

export const deleteTreatment = (treatmentID) => {

  const token = localStorage.getItem('token');  // Get token from localStorage

  return axios.delete(`${base_url}/${treatmentID}`, {
    headers: {
      Authorization: token,                     // Send token in request headers (check api/helpers/auth-helper)
    }
  });

}