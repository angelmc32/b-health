import axios from 'axios';                      // Import axios to enable API calls to our back-end

// Set URL according to environment
const isProduction = process.env.NODE_ENV === 'production';
const base_url = isProduction ? 'http://54.163.77.88/api/pdf' : `${process.env.REACT_APP_API_URL}/pdf`;

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