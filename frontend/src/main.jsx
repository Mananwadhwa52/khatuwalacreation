import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="top-center" toastOptions={{
        style: { fontFamily: 'Montserrat', fontSize: '13px', background: '#FAF6F0', color: '#570000', border: '1px solid #D4AF37' },
        success: { iconTheme: { primary: '#570000', secondary: '#FAF6F0' } },
      }}/>
    </BrowserRouter>
  </React.StrictMode>
)
