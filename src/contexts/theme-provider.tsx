import { ReactNode, useEffect, useState } from "react";
import { ThemeContext } from "./theme-context";

type Theme = 'light' | 'dark'

export function ThemeProvider({children}: {children: ReactNode}){
  const [theme, setTheme] = useState<Theme>('light')

  const toggleTheme = () => {
    const root = window.document.documentElement
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    root.classList.remove(theme)
    root.classList.add(newTheme)
    localStorage.setItem('theme', newTheme)
    setTheme(newTheme)
  }

  useEffect(()=>{
    const root = window.document.documentElement
    const storaged = localStorage.getItem('theme') as Theme | null
    const preferred = storaged || (window.matchMedia('(prefers-color-schema:dark').matches ? 'dark' : 'light')
    root.classList.add(preferred)
    setTheme(preferred)
  },[])

  return(
    <ThemeContext value={{theme, toggleTheme}}>
      {children}
    </ThemeContext>
  )
}