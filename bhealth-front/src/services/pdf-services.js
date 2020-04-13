import axios from 'axios';                      // Import axios to enable API calls to our back-end

// Set URL according to environment
const isProduction = process.env.NODE_ENV === 'production';
const base_url = isProduction ? 'https://b-health.herokuapp.com/api/pdf' : 'http://localhost:3000/api/pdf';

export const createSummary = () => {

  const token = localStorage.getItem('token');  // Get token from localStorage

  return axios.get(`${base_url}/all`, {
    responseType: 'arraybuffer',
    headers: {
      Authorization: token,                     // Send token in request headers (check api/helpers/auth-helper)
      Accept: 'application/pdf',
    }
  });

}