import type { AlgorithmStep } from '../types';

interface Props {
  step: AlgorithmStep;
  maxValue: number;
}

const COLORS = {
  default: 'var(--color-accent)',
  comparing: '#F59E0B',
  swapping: '#EF4444',
  sorted: '#10B981',
  pivot: '#8B5CF6',
  active: '#3B82F6',
};

export default function SortingVisualizer({ step, maxValue }: Props) {
  const barCount = step.data.length;

  return (
    <div className="flex items-end justify-center gap-1" style={{ height: 220 }}>
      {step.data.map((value, i) => {
        const heightPct = (value / maxValue) * 100;
        const state = step.highlights[i];
        const color = state ? COLORS[state] : COLORS.default;

        return (
          <div key={i} className="flex flex-col items-center gap-1" style={{ flex: `0 1 ${100 / barCount}%` }}>
            <span className="font-mono text-[10px] text-[var(--color-text-muted)]">{value}</span>
            <div
              className="w-full rounded-t-sm transition-all duration-200"
              style={{
                height: `${heightPct}%`,
                backgroundColor: color,
                minHeight: 4,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
