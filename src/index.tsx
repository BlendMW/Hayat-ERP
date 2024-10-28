import React from 'react';
import ReactDOM from 'react-dom/client';
import HayatApp from './HayatApp';

// Create root element if it doesn't exist
const rootElement = document.createElement('div');
rootElement.id = 'root';
document.body.appendChild(rootElement);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <HayatApp />
  </React.StrictMode>
);
