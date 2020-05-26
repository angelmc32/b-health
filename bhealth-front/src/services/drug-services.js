import axios from 'axios';                      // Import axios to enable API calls to our back-end

// Set URL according to environment
const isProduction = process.env.NODE_ENV === 'production';
const base_url = isProduction ? 'http://54.163.77.88/api/drugs' : 'http://localhost:3000/api/drugs';

// Export get function to retrieve all prescriptions of the current logged in user
export const getDrugs = () => {

  const token = localStorage.getItem('token');  // Get token from localStorage

  return axios.get(`${base_url}/`, {
    headers: {
      Authorization: token,                     // Send token in request headers (check api/helpers/auth-helper)
    }
  });

};

// Export create facility function, which receives data as parameters to enable prescription creation
export const createDrug = (data) => {

  const token = localStorage.getItem('token');  // Get token from localStorage

  // Return a call to our /new route, while sending the parameters obtained from the form/front-end
  return axios.post(`${base_url}/`, data, {
    headers: {
      Authorization: token,                     // Send token in request headers (check api/helpers/auth-helper)
    }
  });

};

export const getDrug = (drugID) => {

  const token = localStorage.getItem('token');  // Get token from localStorage

  return axios.get(`${base_url}/${drugID}`, {
    headers: {
      Authorization: token,                     // Send token in request headers (check api/helpers/auth-helper)
    }
  });

};

export const editDrug = (drugID, data) => {

  const token = localStorage.getItem('token');  // Get token from localStorage

  return axios.patch(`${base_url}/${drugID}`, data, {
    headers: {
      Authorization: token,                     // Send token in request headers (check api/helpers/auth-helper)
    }
  });

}