import type { DPTableStep } from '../types';

interface Props {
  step: DPTableStep;
  color?: string;
}

const HIGHLIGHT_COLORS: Record<string, string> = {
  current: '#8B5CF6',
  computed: '#10B981',
  dependency: '#F59E0B',
  active: '#3B82F6',
  result: '#EC4899',
};

export default function DPTableVisualizer({ step, color = '#8B5CF6' }: Props) {
  const is1D = step.grid.length === 1;

  if (is1D) {
    const row = step.grid[0];
    return (
      <div className="py-2">
        <div className="flex flex-wrap justify-center gap-1">
          {row.map((val, i) => {
            const key = `0,${i}`;
            const highlight = step.highlights[key];
            const bg = highlight ? HIGHLIGHT_COLORS[highlight] || color : 'var(--color-bg)';
            const isHighlighted = !!highlight;

            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-md border-2 font-mono text-sm font-bold transition-all duration-200"
                  style={{
                    borderColor: isHighlighted ? bg : 'var(--color-border)',
                    backgroundColor: isHighlighted ? bg : 'var(--color-bg)',
                    color: isHighlighted ? '#fff' : val === '' ? 'var(--color-text-muted)' : 'var(--color-text)',
                  }}
                >
                  {val === '' ? '—' : val}
                </div>
                <span className="text-[10px] text-[var(--color-text-muted)]">{i}</span>
              </div>
            );
          })}
        </div>

        {step.arrows && step.arrows.length > 0 && (
          <div className="mt-2 flex justify-center gap-2 text-[10px] text-[var(--color-text-muted)]">
            {step.arrows.map((arrow, i) => (
              <span key={i}>
                dp[{arrow.from[1]}] → dp[{arrow.to[1]}]
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="py-2 overflow-x-auto">
      <table className="mx-auto border-collapse">
        <tbody>
          {step.grid.map((row, r) => (
            <tr key={r}>
              {row.map((val, c) => {
                const key = `${r},${c}`;
                const highlight = step.highlights[key];
                const bg = highlight ? HIGHLIGHT_COLORS[highlight] || color : 'var(--color-bg)';
                const isHighlighted = !!highlight;

                return (
                  <td
                    key={c}
                    className="h-9 w-9 border border-[var(--color-border)] text-center font-mono text-xs font-bold transition-all duration-200"
                    style={{
                      backgroundColor: isHighlighted ? bg : 'var(--color-bg)',
                      color: isHighlighted ? '#fff' : val === '' ? 'var(--color-text-muted)' : 'var(--color-text)',
                    }}
                  >
                    {val === '' ? '—' : val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
