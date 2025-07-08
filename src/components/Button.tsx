// src/components/Button.tsx
import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'outline'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export default function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  const base = 'px-4 py-2 rounded-md font-medium transition-colors duration-200'

  const variants: Record<Variant, string> = {
    primary: 'bg-accent text-white hover:bg-primary',
    secondary: 'bg-primary text-white hover:bg-accent',
    outline: 'border border-accent text-accent hover:bg-accent hover:text-white',
  }

  return (
    <button className={cn(base, variants[variant], className)} {...props} />
  )
}