import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { RouterProvider } from 'react-router'
import { routes } from './routes/routes'
import { ThemeProvider } from './contexts/theme-provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={routes}/>
    </ThemeProvider>
  </StrictMode>,
)
