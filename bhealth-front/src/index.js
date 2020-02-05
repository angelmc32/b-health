import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Import BrowserRouter to allow the user to navigate within the app by setting defined routes. See ./Router.js for more information
import { BrowserRouter } from 'react-router-dom';

// Import the Provider which will allow to pass down the state variables and methods to its descendants
import AppProvider from './AppContext';

// Import UIkit for styles
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import 'uikit/dist/css/uikit.min.css';

UIkit.use(Icons);   // Execute to allow icon use

// Create a component that: Provides state variables and methods AND router functionality for navigation, to the APP
const WithRouterAndProvider = () => (
  <AppProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppProvider>
)

ReactDOM.render(<WithRouterAndProvider />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
