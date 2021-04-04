import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { GLOBAL_APP_STATUS } from './global'
import App from './App';

// Importing Bootstrap & JQuery
import 'jquery';
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

const devDeployement = false;

if (devDeployement) {
  if (
    localStorage.getItem('_u') === 'xnaskjfjlldlfka@$@#$' && 
    localStorage.getItem('_p') === 'fdhiahsd3294y3298Y(*&(*&kjlhf(*UP(U'
  ) {
    GLOBAL_APP_STATUS.setApplicationReadyStatus(true);
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById('root')
    );
  } else {
    const username = prompt("Enter Username");
    const password = prompt("Enter Password");

    if ((password !== null || password !== '') && (username !== null || username !== '')) {
      if (username === 'xnaskjfjlldlfka@$@#$' && password === 'fdhiahsd3294y3298Y(*&(*&kjlhf(*UP(U') {
        localStorage.setItem('_u', 'xnaskjfjlldlfka@$@#$');
        localStorage.setItem('_p', 'fdhiahsd3294y3298Y(*&(*&kjlhf(*UP(U');

        window.location.reload();
      } else {
        alert('Username or Password is invalid!')
      }
    } else {
      alert('Username or Password is empty.');
    }
  }
} else {
  GLOBAL_APP_STATUS.setApplicationReadyStatus(true);
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
