import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { Play, Pause, SkipForward, RotateCcw, BarChart3, Columns, Code } from 'lucide-react';

function BalloonIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="9" rx="6" ry="7.5" />
      <polygon points="10.5,16 13.5,16 12,18" />
      <path d="M12 18 Q14 20 11 22 Q13 21 12 23" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </svg>
  );
}

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
  eli5?: string;
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
  eli5,
}: Props) {
  const [viewMode, setViewMode] = useState<'visual' | 'split' | 'code' | 'eli5'>(codeView ? 'split' : 'visual');
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

  const activeStyle = (mode: string) =>
    viewMode === mode ? { backgroundColor: color, color: '#fff' } : { color: 'var(--color-text-muted)' };

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-alt)]">
      <div className="flex items-start justify-between border-b border-[var(--color-border)] p-5">
        <div className="min-w-0 flex-1">
          <h2 className="mb-1 text-lg font-bold">{title}</h2>
          <p className="text-sm text-[var(--color-text-muted)]">{description}</p>
        </div>

        <div className="ml-4 flex shrink-0 items-center gap-2">
          {codeView && (
            <div className="flex gap-1 rounded-lg border border-[var(--color-border)] p-0.5">
              <button
                onClick={() => setViewMode('visual')}
                className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                style={activeStyle('visual')}
                aria-label="Visualização"
              >
                <BarChart3 size={14} />
              </button>
              <button
                onClick={() => setViewMode('split')}
                className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                style={activeStyle('split')}
                aria-label="Dividido"
              >
                <Columns size={14} />
              </button>
              <button
                onClick={() => setViewMode('code')}
                className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                style={activeStyle('code')}
                aria-label="Código"
              >
                <Code size={14} />
              </button>
              {eli5 && (
                <button
                  onClick={() => setViewMode('eli5')}
                  className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                  style={activeStyle('eli5')}
                  aria-label="Como funciona"
                  title="Como funciona?"
                >
                  <BalloonIcon size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        {viewMode === 'visual' && children}
        {viewMode === 'split' && (
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="min-w-0 lg:flex-1">{children}</div>
            <div className="min-w-0 lg:flex-1">{codeView}</div>
          </div>
        )}
        {viewMode === 'code' && codeView}
        {viewMode === 'eli5' && eli5 && (
          <div className="mx-auto max-w-2xl">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold" style={{ color }}>
              <BalloonIcon size={16} />
              Como funciona?
            </div>
            <div className="whitespace-pre-line text-sm leading-relaxed text-[var(--color-text-muted)]">
              {eli5}
            </div>
          </div>
        )}
      </div>

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
    </div>
  );
}
