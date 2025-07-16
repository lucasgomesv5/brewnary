import { useTheme } from '@/hooks/useTheme'
import LightIcon from '@/assets/light-mode.svg'
import DarkIcon from '@/assets/dark-mode.svg'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const icon = theme === 'dark' ? LightIcon : DarkIcon

  return (
    <button
      onClick={toggleTheme}
      className="text-roast dark:text-latte  dark:border-latte px-4 py-2 rounded-full hover:bg-roast hover:text-white transition"
    >
      <img src={icon} alt="Theme" className="h-6 w-6" />

    </button>
  )
}