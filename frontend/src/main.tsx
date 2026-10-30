import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { routerConfig } from './routing/router'
import './styles/main.css'

const config = createBrowserRouter(routerConfig)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={config} />
  </StrictMode>,
)