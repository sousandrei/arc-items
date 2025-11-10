import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './root.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <title>ARC Raiders Recyclables</title>
      <App />
    </React.StrictMode>,
  );
}
