import { Outlet } from 'react-router'
import Header from '@/components/Header'
import Footer from './components/Footer'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark transition-colors">
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer/>
    </div>
  )
}