import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import UserContextProvider from './context/userContext.jsx'
import AdminContextProvider from './context/AdminContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <AdminContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AdminContextProvider>
    </UserContextProvider>
  </StrictMode>,
)
