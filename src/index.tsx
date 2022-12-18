import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from 'App';
import { ThemeContextProvider } from 'themeContext';

ReactDOM.render(
  <ThemeContextProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ThemeContextProvider>,
  document.getElementById('root')
);
