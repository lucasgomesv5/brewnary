import { useEffect, useState } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const root = window.document.documentElement
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
    const preferred = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    root.classList.add(preferred)
    setTheme(preferred)
  }, [])

  function toggleTheme() {
    const root = window.document.documentElement
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    root.classList.remove(theme)
    root.classList.add(newTheme)
    localStorage.setItem('theme', newTheme)
    setTheme(newTheme)
  }

  return { theme, toggleTheme }
}