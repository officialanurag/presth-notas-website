import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { GLOBAL_APP_STATUS } from './global'

// Importing Bootstrap & JQuery
import 'jquery';
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/css/bootstrap.css';

const devDeployement = true;

if (devDeployement) {
  const username = prompt("Enter Username");
  const password = prompt("Enter Password");

  if ((password !== null || password !== '') && (username !== null || username !== '')) {
    if (username === 'xnaskjfjlldlfka@$@#$' && password === 'fdhiahsd3294y3298Y(*&(*&kjlhf(*UP(U') {
      GLOBAL_APP_STATUS.setApplicationReadyStatus(true);
      ReactDOM.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
        document.getElementById('root')
      );
    } else {
      alert('Username or Password is invalid!')
    }
  } else {
    alert('Username or Password is empty.');
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
