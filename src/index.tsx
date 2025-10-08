import React from 'react';
import {createRoot} from 'react-dom/client';
import './assets/scss/index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);

    root.render(
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    );
}
reportWebVitals();