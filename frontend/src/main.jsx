import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import routes from "./routes.jsx"
import { store } from "./store.js"
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={routes}>
    </RouterProvider>
    <Toaster position='top-right' />
  </Provider>
)
