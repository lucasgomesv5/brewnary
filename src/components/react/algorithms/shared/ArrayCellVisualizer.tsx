import type { ArrayCellStep } from '../types';

interface Props {
  step: ArrayCellStep;
  color?: string;
}

const HIGHLIGHT_COLORS: Record<string, string> = {
  active: '#3B82F6',
  found: '#10B981',
  comparing: '#F59E0B',
  window: '#06B6D4',
  current: '#8B5CF6',
  left: '#EC4899',
  right: '#F59E0B',
  removed: '#EF4444',
};

export default function ArrayCellVisualizer({ step, color = '#8B5CF6' }: Props) {
  return (
    <div className="py-2">
      <div className="flex flex-wrap justify-center gap-1">
        {step.data.map((val, i) => {
          const highlight = step.highlights[i];
          const bg = highlight ? HIGHLIGHT_COLORS[highlight] || color : 'var(--color-bg)';
          const isHighlighted = !!highlight;
          const isInWindow =
            step.windowStart !== undefined &&
            step.windowEnd !== undefined &&
            i >= step.windowStart &&
            i <= step.windowEnd;

          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-md border-2 font-mono text-sm font-bold transition-all duration-200"
                style={{
                  borderColor: isInWindow ? color : isHighlighted ? bg : 'var(--color-border)',
                  backgroundColor: isHighlighted ? bg : 'var(--color-bg)',
                  color: isHighlighted ? '#fff' : 'var(--color-text)',
                  boxShadow: isInWindow ? `0 0 0 1px ${color}40` : 'none',
                }}
              >
                {val}
              </div>
              <span className="text-[10px] text-[var(--color-text-muted)]">{i}</span>
            </div>
          );
        })}
      </div>

      {step.windowStart !== undefined && step.windowEnd !== undefined && (
        <div className="mt-1 flex justify-center">
          <div
            className="rounded-b-md border-x-2 border-b-2 px-2 py-0.5 text-center text-[10px] font-medium"
            style={{ borderColor: color, color, width: `${(step.windowEnd - step.windowStart + 1) * 44 + (step.windowEnd - step.windowStart) * 4}px` }}
          >
            janela
          </div>
        </div>
      )}

      {Object.keys(step.pointers).length > 0 && (
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          {Object.entries(step.pointers).map(([name, idx]) => {
            const pColor = HIGHLIGHT_COLORS[name] || color;
            return (
              <div key={name} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: pColor }}>
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: pColor }} />
                {name}: {idx}
              </div>
            );
          })}
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
