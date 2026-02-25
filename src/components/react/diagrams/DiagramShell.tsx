import { Eye, EyeOff } from 'lucide-react';
import AlgorithmShell from '../algorithms/AlgorithmShell';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  description: string;
  totalSteps: number;
  currentStep: number;
  stepDescription: string;
  onStep: () => void;
  onReset: () => void;
  isComplete: boolean;
  children: ReactNode;
  color?: string;
  showAll: boolean;
  onShowAll: () => void;
}

export default function DiagramShell({
  title,
  description,
  totalSteps,
  currentStep,
  stepDescription,
  onStep,
  onReset,
  isComplete,
  children,
  color = '#8B5CF6',
  showAll,
  onShowAll,
}: Props) {
  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={showAll ? onReset : onShowAll}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-alt)] px-3 py-1.5 text-xs font-medium transition-colors hover:border-[var(--color-text-muted)]"
          style={showAll ? { borderColor: color, color } : { color: 'var(--color-text-muted)' }}
          title={showAll ? 'Voltar ao modo passo a passo' : 'Mostrar diagrama completo'}
        >
          {showAll ? <EyeOff size={13} /> : <Eye size={13} />}
          {showAll ? 'Passo a passo' : 'Ver completo'}
        </button>
      </div>
      <AlgorithmShell
        title={title}
        description={description}
        totalSteps={totalSteps}
        currentStep={currentStep}
        stepDescription={showAll ? 'Diagrama completo — todos os elementos visíveis' : stepDescription}
        onStep={onStep}
        onReset={onReset}
        isComplete={isComplete}
        color={color}
      >
        {children}
      </AlgorithmShell>
    </div>
  );
}
