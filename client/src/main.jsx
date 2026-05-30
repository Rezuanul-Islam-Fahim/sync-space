import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import './styles/index.css'
import App, { store } from './app'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
