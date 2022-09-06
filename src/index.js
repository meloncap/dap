import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Providers from "./Providers";
import './polyfill'
// import { store } from './app/store.js';

ReactDOM.render(
    <React.StrictMode>
        <Providers >
            <App />
        </Providers>
    </React.StrictMode>,
    document.getElementById('root')
);