import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { Play, Pause, SkipForward, RotateCcw, BarChart3, Code } from 'lucide-react';

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
  codeView?: ReactNode;
}

export default function AlgorithmShell({
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
  codeView,
}: Props) {
  const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPlaying = useCallback(() => {
    setPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isComplete) stopPlaying();
  }, [isComplete, stopPlaying]);

  useEffect(() => {
    if (playing && !isComplete) {
      intervalRef.current = setInterval(onStep, 1000 / speed);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [playing, speed, isComplete, onStep]);

  function handlePlayPause() {
    if (isComplete) return;
    setPlaying((p) => !p);
  }

  function handleReset() {
    stopPlaying();
    onReset();
  }

  function handleStep() {
    if (isComplete) return;
    stopPlaying();
    onStep();
  }

  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)]">
      <div className="flex items-start justify-between border-b border-[var(--color-border)] p-5">
        <div>
          <h2 className="mb-1 text-lg font-bold">{title}</h2>
          <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
        </div>

        {codeView && (
          <div className="ml-4 flex shrink-0 gap-1 rounded-lg border border-[var(--color-border)] p-0.5">
            <button
              onClick={() => setViewMode('visual')}
              className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
              style={
                viewMode === 'visual' ? { backgroundColor: color, color: '#fff' } : { color: 'var(--color-text-muted)' }
              }
              aria-label="Visualização"
            >
              <BarChart3 size={14} />
            </button>
            <button
              onClick={() => setViewMode('code')}
              className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
              style={
                viewMode === 'code' ? { backgroundColor: color, color: '#fff' } : { color: 'var(--color-text-muted)' }
              }
              aria-label="Código"
            >
              <Code size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="p-5">{viewMode === 'visual' ? children : codeView}</div>

      {viewMode === 'visual' && (
        <div className="border-t border-[var(--color-border)] p-4">
          <div className="mb-3 h-1.5 w-full rounded-full bg-[var(--color-border)]">
            <div
              className="h-1.5 rounded-full transition-all duration-200"
              style={{ width: `${progress}%`, backgroundColor: color }}
            />
          </div>

          <div className="mb-3 min-h-[1.25rem]">
            <p className="text-xs text-[var(--color-text-muted)]">
              {stepDescription || (isComplete ? 'Concluído!' : 'Pressione Play para iniciar')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayPause}
              disabled={isComplete}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] transition-colors hover:bg-[var(--color-border)]/30 disabled:opacity-40"
              aria-label={playing ? 'Pausar' : 'Reproduzir'}
            >
              {playing ? <Pause size={14} /> : <Play size={14} />}
            </button>

            <button
              onClick={handleStep}
              disabled={isComplete}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] transition-colors hover:bg-[var(--color-border)]/30 disabled:opacity-40"
              aria-label="Próximo passo"
            >
              <SkipForward size={14} />
            </button>

            <button
              onClick={handleReset}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] transition-colors hover:bg-[var(--color-border)]/30"
              aria-label="Reiniciar"
            >
              <RotateCcw size={14} />
            </button>

            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="ml-auto h-8 rounded-lg border border-[var(--color-border)] bg-transparent px-2 text-xs"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={4}>4x</option>
            </select>

            <span className="font-mono text-xs text-[var(--color-text-muted)]">
              {currentStep}/{totalSteps}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
