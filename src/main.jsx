import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ShowProfileProvider } from './context/showProfile.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ShowProfileProvider>

    <App />
    </ShowProfileProvider>
  </React.StrictMode>,
)
