import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import 'leaflet/dist/leaflet.css';
import 'semantic-ui-css/semantic.min.css';



const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
