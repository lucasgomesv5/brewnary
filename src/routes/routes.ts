import { createBrowserRouter } from 'react-router'
import Layout from '@/layout'
import LandingPage from '@/features/landing/landing-page'
import SoloPage from '@/features/solo/solo-page'

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