// src/routes/routes.ts
import { createBrowserRouter } from 'react-router'
import Layout from '@/layout'
import LandingPage from '@/features/landing/landing-page'
import SoloPage from '@/features/solo/solo-page'

// ...adicione outras páginas conforme forem criadas

export const routes = createBrowserRouter([
  {
    path: '/',
    Component: Layout, 
    children: [
      {
        path: '',
        Component: LandingPage,
      },
      {
        path: 'solo',
        Component: SoloPage,
      }
    ],
  },
])