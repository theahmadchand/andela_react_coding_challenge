import React from 'react';
import ReactDOM from 'react-dom';
import ErrorBoundary from './ErrorBoundary';
import Inventory from './Inventory';

// You can adjust the items web preview uses here.
// This file is not included in the tests; the suite
// will mount the Inventory component directly.
window.fetch = async (...args) => ({
  ok: true,
  status: 200,
  json: async () => ({
    data: [
      { id: 1, name: 'foo', quantity: 1 },
      { id: 2, name: 'bar', quantity: 0 },
      { id: 3, name: 'baz', quantity: 3 },
    ],
  }),
});

const ErrorFallback = ({ error }) => (
  <div>
    <p>Something went wrong:</p>
    <pre data-testid="error-message" style={{ color: 'red' }}>
      {error.message}
    </pre>
  </div>
);


const App = () => (
  <div id="app">
    <ErrorBoundary FallbackComponent={<ErrorFallback />}>
      <Inventory url="http://www.example.com" />
    </ErrorBoundary>
  </div>
);

export default App;
