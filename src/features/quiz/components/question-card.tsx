import { cn } from "@/lib/utils";

type QuestionCardProps = {
  selected: boolean
  position: number
  label: string
  onClick: () => void
}

export default function QuestionCard({selected, position, label, onClick}: QuestionCardProps){

  const handleAlternative = () => {
    if(position === 0) return 'A)'
    if(position === 1) return 'B)'
    if(position === 2) return 'C)'
    if(position === 3) return 'D)'
  }

  return(
    <button onClick={onClick} className={cn('flex items-center justify-start gap-2 w-full transition-all group p-3 rounded-xl border shadow-sm',
      'hover:border-accent/50 hover:shadow-md hover:scale-[1.03] active:scale-[0.98]',
      selected
        ? 'bg-accent text-white ring-2 ring-accent'
        : 'bg-[#f9f6f1] dark:bg-[#1f1c18] text-primary dark:text-text-dark border-muted'
    )}>
      <span className="font-medium">{handleAlternative()}</span>
      <span className="font-medium">{label}</span>
    </button>
  )
}