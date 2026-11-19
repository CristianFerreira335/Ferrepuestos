
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom'

import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Admin from './pages/Admin.jsx'
import RutaProtegida from './components/RutaProtegida.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

        {/* Tienda principal */}
        <Route path="/" element={<App />} />

        {/* Inicio de sesión */}
        <Route path="/admin" element={<Login />} />

        {/* Panel protegido */}
        <Route element={<RutaProtegida />}>
          <Route
            path="/admin/panel"
            element={<Admin />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
