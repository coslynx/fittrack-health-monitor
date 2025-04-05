import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Locate the root DOM element provided in the index.html file
const rootElement = document.getElementById('root');

// Ensure the root element exists before attempting to create the React root
// This prevents runtime errors if the index.html is misconfigured.
if (!rootElement) {
  throw new Error(
    "Failed to find the root element with ID 'root'. Ensure your index.html file contains a div with id='root'."
  );
}

// Create a React root using the client-side API introduced in React 18
const root = ReactDOM.createRoot(rootElement);

// Render the main application component wrapped in StrictMode
// StrictMode helps identify potential problems in an application during development.
// It activates additional checks and warnings for its descendants.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);