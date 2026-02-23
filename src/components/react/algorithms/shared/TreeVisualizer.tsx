import type { TreeStep } from '../types';

interface Props {
  step: TreeStep;
  color?: string;
  width?: number;
  height?: number;
}

const HIGHLIGHT_COLORS: Record<string, string> = {
  current: '#8B5CF6',
  visited: '#10B981',
  active: '#3B82F6',
  found: '#10B981',
  inserting: '#F59E0B',
  comparing: '#F59E0B',
  endOfWord: '#EC4899',
};

export default function TreeVisualizer({ step, color = '#8B5CF6', width = 400, height = 260 }: Props) {
  const nodeRadius = 18;

  return (
    <div className="py-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto w-full max-w-md">
        {step.nodes.map((node) =>
          node.children
            .map((childId) => {
              const child = step.nodes.find((n) => n.id === childId);
              if (!child) return null;
              return (
                <line
                  key={`${node.id}-${childId}`}
                  x1={node.x}
                  y1={node.y}
                  x2={child.x}
                  y2={child.y}
                  stroke="var(--color-border)"
                  strokeWidth={1.5}
                  className="transition-all duration-200"
                />
              );
            }),
        )}

        {step.nodes.map((node) => {
          const highlight = step.highlights[node.id];
          const bg = highlight ? HIGHLIGHT_COLORS[highlight] || color : 'var(--color-bg-alt)';
          const isHighlighted = !!highlight;

          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={nodeRadius}
                fill={bg}
                stroke={isHighlighted ? bg : 'var(--color-border)'}
                strokeWidth={2}
                className="transition-all duration-200"
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-xs font-bold"
                fill={isHighlighted ? '#fff' : 'var(--color-text)'}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {step.visitOrder.length > 0 && (
        <div className="mt-2 rounded-lg border border-[var(--color-border)] p-2 text-center">
          <span className="font-mono text-[10px] text-[var(--color-text-muted)]">
            Ordem: [{step.visitOrder.join(', ')}]
          </span>
        </div>
      )}

      <div className="mt-2 flex items-center justify-center gap-4 text-[10px] text-[var(--color-text-muted)]">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: HIGHLIGHT_COLORS.current }} />
          Atual
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: HIGHLIGHT_COLORS.visited }} />
          Visitado
        </div>
      </div>
    </div>
  );
}
