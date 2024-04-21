import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import "mdbreact/dist/css/mdb.css";
import "semantic-ui-css/semantic.min.css";
import Test from './Test'


ReactDOM.render(
  <React.StrictMode>
    <Test/>
    {/* <App /> */}
  </React.StrictMode>,
  document.getElementById('root')
);