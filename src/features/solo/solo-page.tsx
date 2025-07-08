import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Flame, Code2, CloudCog, Layers3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from '@/components/Button'

const stacks = [
  { id: 'frontend', label: 'Frontend', icon: Code2 },
  { id: 'backend', label: 'Backend', icon: Layers3 },
  { id: 'devops', label: 'DevOps', icon: CloudCog },
  { id: 'general', label: 'Geral', icon: Flame },
]

const difficulties = [
  { id: 'easy', label: 'Fácil' },
  { id: 'medium', label: 'Médio' },
  { id: 'hard', label: 'Difícil' },
]

export default function SoloPage() {
  const [selectedStack, setSelectedStack] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleStart = () => {
    if (selectedStack && selectedDifficulty) {
      navigate(`/solo/play?stack=${selectedStack}&difficulty=${selectedDifficulty}`)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10 bg-background-light dark:bg-background-dark transition-colors">
      <div className="w-full max-w-3xl space-y-10 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-text-dark tracking-tight">
            ☕ Modo Solo
          </h1>
          <p className="text-lg text-primary/70 dark:text-text-dark/70">
            Escolha sua stack e dificuldade para enfrentar o desafio do dia.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-left text-primary dark:text-text-dark">Qual sua stack?</h2>
          <div className="grid grid-cols-2 gap-4">
            {stacks.map(({ id, label, icon: Icon }) => {
              const selected = selectedStack === id
              return (
                <button
                  key={id}
                  onClick={() => setSelectedStack(id)}
                  className={cn(
                    'group p-5 rounded-xl border shadow-sm flex flex-col items-center justify-center gap-2 transition-all',
                    'hover:border-accent/50 hover:shadow-md hover:scale-[1.03] active:scale-[0.98]',
                    selected
                      ? 'bg-accent text-white ring-2 ring-accent'
                      : 'bg-[#f9f6f1] dark:bg-[#1f1c18] text-primary dark:text-text-dark border-muted'
                  )}
                >
                  <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-left text-primary dark:text-text-dark">Qual dificuldade?</h2>
          <div className="grid grid-cols-3 gap-4">
            {difficulties.map(({ id, label }) => {
              const selected = selectedDifficulty === id
              return (
                <button
                  key={id}
                  onClick={() => setSelectedDifficulty(id)}
                  className={cn(
                    'py-3 rounded-xl border font-medium transition-all shadow-sm',
                    'hover:border-accent/40 hover:shadow hover:scale-[1.02] active:scale-[0.98]',
                    selected
                      ? 'bg-accent text-white ring-2 ring-accent'
                      : 'bg-[#f9f6f1] dark:bg-[#1f1c18] text-primary dark:text-text-dark border-muted'
                  )}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="pt-2">
          <Button
            onClick={handleStart}
            disabled={!selectedStack || !selectedDifficulty}
            variant="primary"
            className="w-full max-w-sm mx-auto disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition"
          >
            ☕ Iniciar desafio
          </Button>
        </div>
      </div>
    </section>
  )
}