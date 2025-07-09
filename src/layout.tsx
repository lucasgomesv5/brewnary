import { Outlet } from 'react-router'
import Header from '@/components/Header'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark transition-colors">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="text-center text-xs text-primary/50 dark:text-text-dark/50 pb-4">
        © {new Date().getFullYear()} Brewnary — Feito com ☕
      </footer>
    </div>
  )
}