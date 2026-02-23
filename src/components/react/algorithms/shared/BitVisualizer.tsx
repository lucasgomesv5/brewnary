import type { BitStep } from '../types';

interface Props {
  step: BitStep;
  color?: string;
}

export default function BitVisualizer({ step, color = '#8B5CF6' }: Props) {
  const bits = step.binary.padStart(8, '0').split('');

  return (
    <div className="py-2">
      <div className="flex flex-col items-center gap-3">
        <div>
          <div className="mb-1 text-center text-[10px] text-[var(--color-text-muted)]">
            {step.decimal} em binário
          </div>
          <div className="flex gap-1">
            {bits.map((bit, i) => {
              const bitIdx = bits.length - 1 - i;
              const isHighlighted = step.highlightedBits.includes(bitIdx);

              return (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-md border-2 font-mono text-sm font-bold transition-all duration-200"
                    style={{
                      borderColor: isHighlighted ? color : 'var(--color-border)',
                      backgroundColor: isHighlighted ? color : bit === '1' ? 'var(--color-bg-alt)' : 'var(--color-bg)',
                      color: isHighlighted ? '#fff' : 'var(--color-text)',
                    }}
                  >
                    {bit}
                  </div>
                  <span className="text-[8px] text-[var(--color-text-muted)]">{bitIdx}</span>
                </div>
              );
            })}
          </div>
        </div>

        {step.operation && (
          <div className="rounded-md px-3 py-1 text-xs font-bold" style={{ backgroundColor: `${color}20`, color }}>
            {step.operation}
          </div>
        )}

        {step.extra?.binary2 && (
          <div>
            <div className="mb-1 text-center text-[10px] text-[var(--color-text-muted)]">
              {step.extra.decimal2} em binário
            </div>
            <div className="flex gap-1">
              {step.extra.binary2.padStart(8, '0').split('').map((bit, i) => (
                <div
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-md border-2 font-mono text-sm font-bold"
                  style={{
                    borderColor: 'var(--color-border)',
                    backgroundColor: bit === '1' ? 'var(--color-bg-alt)' : 'var(--color-bg)',
                    color: 'var(--color-text)',
                  }}
                >
                  {bit}
                </div>
              ))}
            </div>
          </div>
        )}

        {step.extra?.result && (
          <div>
            <div className="mb-1 text-center text-[10px] font-medium" style={{ color: '#10B981' }}>
              Resultado: {step.extra.resultDecimal}
            </div>
            <div className="flex gap-1">
              {step.extra.result.padStart(8, '0').split('').map((bit, i) => (
                <div
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-md border-2 font-mono text-sm font-bold"
                  style={{
                    borderColor: '#10B981',
                    backgroundColor: bit === '1' ? '#10B98120' : 'var(--color-bg)',
                    color: 'var(--color-text)',
                  }}
                >
                  {bit}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
