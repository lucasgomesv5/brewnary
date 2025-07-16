import ThemeToggle from './ThemeToggle'
import LogoWhite from '@/assets/logo-white.svg'
import LogoBlack from '@/assets/logo-black.svg'
import { Link } from 'react-router'
import { useTheme } from '@/hooks/useTheme'

export default function Header() {
  const {theme} = useTheme()
  const logo = theme === 'dark' ? LogoWhite : LogoBlack
  
  return (
    <header className="flex items-center justify-between p-4 md:p-6" >
      <Link to="/" className="flex items-center gap-2" >
        <img  src={logo} alt="Brewnary" className="h-8 w-8" />
        <span className="text-xl font-bold text-primary dark:text-text-dark">Brewnary</span>
      </Link>
      <ThemeToggle />
    </header>
  )
}