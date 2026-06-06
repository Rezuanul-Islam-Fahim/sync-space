import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './styles/index.css';
import App from './app/App';
import store from './app/store';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './shared/components';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary fallbackRender={ErrorFallback}>
        <App />
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>
);
