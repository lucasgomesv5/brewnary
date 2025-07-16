import { createBrowserRouter } from 'react-router'
import Layout from '@/layout'
import LandingPage from '@/features/landing/landing-page'
import SetupPage from '@/features/setup/setup-page'
import QuizPage from '@/features/quiz/quiz-page'

export const routes = createBrowserRouter([
  {
    path: '/',
    Component: Layout, 
    children: [
      {
        index: true,
        Component: LandingPage,
      },
      {
        path: 'setup',
        Component: SetupPage,
      },
      {
        path: 'quiz',
        Component: QuizPage
      }
    ],
  },
])