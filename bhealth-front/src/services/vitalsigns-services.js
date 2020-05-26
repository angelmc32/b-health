import axios from 'axios';                      // Import axios to enable API calls to our back-end

// Set URL according to environment
const isProduction = process.env.NODE_ENV === 'production';
const base_url = isProduction ? 'http://54.163.77.88/api/vitalsigns' : 'http://localhost:3000/api/vitalsigns';

// Export get function to retrieve all prescriptions of the current logged in user
export const getVitalSigns = () => {

  const token = localStorage.getItem('token');  // Get token from localStorage

  return axios.get(`${base_url}/`, {
    headers: {
      Authorization: token,                     // Send token in request headers (check api/helpers/auth-helper)
    }
  });

};

// Export create facility function, which receives data as parameters to enable prescription creation
export const createVitalSigns = (data) => {

  const token = localStorage.getItem('token');  // Get token from localStorage

  // Return a call to our /new route, while sending the parameters obtained from the form/front-end
  return axios.post(`${base_url}/`, data, {
    headers: {
      Authorization: token,                     // Send token in request headers (check api/helpers/auth-helper)
    }
  });

};

export const getOneVitalSigns = (vitalSignsID) => {

  const token = localStorage.getItem('token');  // Get token from localStorage

  return axios.get(`${base_url}/${vitalSignsID}`, {
    headers: {
      Authorization: token,                     // Send token in request headers (check api/helpers/auth-helper)
    }
  });

};

export const getOneVitalSignsConsultation = (consultationID) => {

  const token = localStorage.getItem('token');  // Get token from localStorage

  return axios.get(`${base_url}/vitals/${consultationID}`, {
    headers: {
      Authorization: token,                     // Send token in request headers (check api/helpers/auth-helper)
    }
  });

};

export const editVitalSigns = (vitalSignsID, data) => {

  const token = localStorage.getItem('token');  // Get token from localStorage

  return axios.patch(`${base_url}/${vitalSignsID}`, data, {
    headers: {
      Authorization: token,                     // Send token in request headers (check api/helpers/auth-helper)
    }
  });

}