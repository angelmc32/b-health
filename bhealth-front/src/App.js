import React, { useContext } from 'react';
import Router from './Router';
import { AppContext } from './AppContext';
import logo from './logo.svg';
import './App.css';
import Navbar from './components/common/Navbar'
import Sidebar from './components/common/Sidebar';

function App() {

  const { user } = useContext(AppContext); // Destructure user state variable

  return (
    <div className="App">
      <Navbar />
      <main>
        { user._id ? (
          <div className="uk-flex">
            <Sidebar />
            <Router />
          </div>
        ) : (
          <Router />
        )}
      </main>
      
      
    </div>
  );
}

export default App;
