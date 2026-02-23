import type { IntervalStep } from '../types';

interface Props {
  step: IntervalStep;
  color?: string;
}

export default function IntervalVisualizer({ step, color = '#8B5CF6' }: Props) {
  const allIntervals = [...step.intervals, ...(step.merged || [])];
  const maxEnd = Math.max(...allIntervals.map((i) => i.end), 1);
  const minStart = Math.min(...allIntervals.map((i) => i.start), 0);
  const range = maxEnd - minStart || 1;

  const svgWidth = 400;
  const svgHeight = step.intervals.length * 28 + 40;
  const barHeight = 20;
  const leftPad = 10;
  const rightPad = 10;
  const usableWidth = svgWidth - leftPad - rightPad;

  function toX(val: number) {
    return leftPad + ((val - minStart) / range) * usableWidth;
  }

  return (
    <div className="py-2">
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="mx-auto w-full max-w-md">
        <line x1={leftPad} y1={svgHeight - 15} x2={svgWidth - rightPad} y2={svgHeight - 15} stroke="var(--color-border)" strokeWidth={1} />
        {Array.from({ length: Math.min(range + 1, 20) }, (_, i) => {
          const val = minStart + Math.round((i / Math.min(range, 19)) * range);
          const x = toX(val);
          return (
            <g key={i}>
              <line x1={x} y1={svgHeight - 18} x2={x} y2={svgHeight - 12} stroke="var(--color-border)" strokeWidth={1} />
              <text x={x} y={svgHeight - 4} textAnchor="middle" className="text-[8px]" fill="var(--color-text-muted)">
                {val}
              </text>
            </g>
          );
        })}

        {step.intervals.map((interval, i) => {
          const x1 = toX(interval.start);
          const x2 = toX(interval.end);
          const y = 10 + i * 28;
          const isCurrent = step.current === interval.id;
          const isSelected = step.selected.includes(interval.id);

          let fill = 'var(--color-border)';
          if (isCurrent) fill = color;
          else if (isSelected) fill = '#10B981';

          return (
            <g key={interval.id}>
              <rect x={x1} y={y} width={Math.max(x2 - x1, 2)} height={barHeight} rx={4} fill={fill} opacity={0.8} className="transition-all duration-200" />
              <text x={(x1 + x2) / 2} y={y + barHeight / 2} textAnchor="middle" dominantBaseline="central" className="text-[9px] font-bold" fill="#fff">
                {interval.label || `[${interval.start},${interval.end}]`}
              </text>
            </g>
          );
        })}
      </svg>

      {step.merged && step.merged.length > 0 && (
        <div className="mt-2 rounded-lg border border-[var(--color-border)] p-2 text-center">
          <span className="font-mono text-[10px] text-[var(--color-text-muted)]">
            Resultado: [{step.merged.map((i) => `[${i.start},${i.end}]`).join(', ')}]
          </span>
        </div>
      )}
    </div>
  );
}
