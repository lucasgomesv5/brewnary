// src/components/Header.tsx
import ThemeToggle from './ThemeToggle'
import LogoIcon from '@/assets/logo.svg'
import { Link } from 'react-router'

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 md:p-6">
      <Link to="/" className="flex items-center gap-2">
        <img src={LogoIcon} alt="Brewnary" className="h-8 w-8" />
        <span className="text-xl font-bold text-primary dark:text-text-dark">Brewnary</span>
      </Link>
      <ThemeToggle />
    </header>
  )
}