import type { StackStep } from '../types';

interface Props {
  step: StackStep;
  color?: string;
  mode?: 'stack' | 'queue';
}

const HIGHLIGHT_COLORS: Record<string, string> = {
  active: '#3B82F6',
  push: '#10B981',
  pop: '#EF4444',
  match: '#10B981',
  mismatch: '#EF4444',
  top: '#8B5CF6',
};

export default function StackQueueVisualizer({ step, color = '#8B5CF6', mode = 'stack' }: Props) {
  const items = mode === 'stack' ? [...step.items].reverse() : step.items;

  return (
    <div className="py-2">
      {mode === 'stack' ? (
        <div className="mx-auto flex w-fit flex-col gap-1">
          {step.operation && (
            <div className="mb-1 text-center text-[10px] font-medium" style={{ color }}>
              {step.operation === 'push' ? `push(${step.operationValue})` : step.operation === 'pop' ? `pop() → ${step.operationValue}` : `peek() → ${step.operationValue}`}
            </div>
          )}
          {items.map((item, i) => {
            const realIdx = step.items.length - 1 - i;
            const highlight = step.highlights[realIdx];
            const bg = highlight ? HIGHLIGHT_COLORS[highlight] || color : 'var(--color-bg)';
            const isHighlighted = !!highlight;
            const isTop = i === 0;

            return (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="flex h-8 w-20 items-center justify-center rounded-md border-2 font-mono text-sm font-bold transition-all duration-200"
                  style={{
                    borderColor: isHighlighted ? bg : 'var(--color-border)',
                    backgroundColor: isHighlighted ? bg : 'var(--color-bg)',
                    color: isHighlighted ? '#fff' : 'var(--color-text)',
                  }}
                >
                  {item}
                </div>
                {isTop && (
                  <span className="text-[10px] font-medium" style={{ color }}>
                    ← topo
                  </span>
                )}
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="flex h-8 w-20 items-center justify-center rounded-md border-2 border-dashed border-[var(--color-border)] text-[10px] text-[var(--color-text-muted)]">
              vazio
            </div>
          )}
        </div>
      ) : (
        <div className="mx-auto flex w-fit items-center gap-1">
          <span className="mr-1 text-[10px] text-[var(--color-text-muted)]">frente →</span>
          {items.map((item, i) => {
            const highlight = step.highlights[i];
            const bg = highlight ? HIGHLIGHT_COLORS[highlight] || color : 'var(--color-bg)';
            const isHighlighted = !!highlight;

            return (
              <div
                key={i}
                className="flex h-8 w-10 items-center justify-center rounded-md border-2 font-mono text-sm font-bold transition-all duration-200"
                style={{
                  borderColor: isHighlighted ? bg : 'var(--color-border)',
                  backgroundColor: isHighlighted ? bg : 'var(--color-bg)',
                  color: isHighlighted ? '#fff' : 'var(--color-text)',
                }}
              >
                {item}
              </div>
            );
          })}
          <span className="ml-1 text-[10px] text-[var(--color-text-muted)]">← final</span>
        </div>
      )}

      {step.extra && Object.keys(step.extra).length > 0 && (
        <div className="mt-3 rounded-lg border border-[var(--color-border)] p-2">
          {Object.entries(step.extra).map(([key, val]) => (
            <div key={key} className="font-mono text-[10px] text-[var(--color-text-muted)]">
              {key}: {val}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
