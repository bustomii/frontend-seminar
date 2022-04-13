import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from "react-redux";
import configureStore from './store'
import reportWebVitals from './reportWebVitals';
import axios from 'axios'
const URL = 'http://127.0.0.1:4000/' //local
// const URL = 'http://seminar.astronacci.com:4000/' //server

const REACT_VERSION = React.version;

axios.defaults.baseURL = URL
axios.defaults.headers.common['Authorization'] = "Bearer "+localStorage.getItem('access_token')
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={configureStore()}>
    {/* <div>React version: {REACT_VERSION}</div> */}
    <App/></Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
