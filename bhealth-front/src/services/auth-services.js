import axios from 'axios';                      // Import axios to enable API calls to our back-end

// Set URL according to environment
const isProduction = process.env.NODE_ENV === 'production';
const base_url = isProduction ? 'http://54.163.77.88/api' : process.env.REACT_APP_API_URL;

// Export signup function, which receives data as parameters to enable signup
export const signup = (data) => {
  
  // Return a call to our /signup route, while sending the parameters obtained from the form/front-end
  return axios.post(`${base_url}/signup`, data);

};

// Export activate account function, which receives data as parameters to activate account
export const activate = (data) => {
  
  // Return a call to our /signup route, while sending the parameters obtained from the form/front-end
  return axios.post(`${base_url}/activate/${data}`);

};

// Export login function, which receives data as parameters to enable login
export const login = (data) => {

  // Return a call to our /login route, while sending the parameters obtained from the form/front-end
  return axios.post(`${base_url}/login`, data);

};

// Export logout function, which "erases" the token from the localStorage, and without a token any user
// that is not logged in will not be able to access the routes that require authentication/token
export const logout = () => {

  localStorage.clear();

};