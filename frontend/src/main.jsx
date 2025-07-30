import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router'
import routes from "./routes.jsx"

createRoot(document.getElementById('root')).render(
  <>
    <RouterProvider router={routes}>
      <App />
    </RouterProvider>
  </>,
)
