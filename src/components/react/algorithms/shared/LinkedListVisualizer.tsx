import type { LinkedListStep } from '../types';

interface Props {
  step: LinkedListStep;
  color?: string;
}

const HIGHLIGHT_COLORS: Record<string, string> = {
  current: '#8B5CF6',
  prev: '#3B82F6',
  next: '#F59E0B',
  reversed: '#10B981',
  active: '#EC4899',
};

export default function LinkedListVisualizer({ step, color = '#8B5CF6' }: Props) {
  const nodeWidth = 56;
  const nodeHeight = 32;
  const gap = 36;
  const totalWidth = step.nodes.length * nodeWidth + (step.nodes.length - 1) * gap;
  const svgWidth = Math.max(totalWidth + 40, 200);
  const svgHeight = 90;

  return (
    <div className="py-2">
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="mx-auto w-full max-w-lg">
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="var(--color-text-muted)" />
          </marker>
          <marker id="arrowhead-colored" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={color} />
          </marker>
        </defs>

        {step.arrows.map(([fromId, toId], i) => {
          const fromIdx = step.nodes.findIndex((n) => n.id === fromId);
          const toIdx = step.nodes.findIndex((n) => n.id === toId);
          if (fromIdx === -1 || toIdx === -1) return null;

          const fromX = 20 + fromIdx * (nodeWidth + gap) + nodeWidth;
          const toX = 20 + toIdx * (nodeWidth + gap);
          const y = 35;
          const isReverse = toIdx < fromIdx;

          return (
            <g key={i}>
              {isReverse ? (
                <path
                  d={`M${fromX},${y} C${fromX + 20},${y + 30} ${toX - 20},${y + 30} ${toX},${y}`}
                  fill="none"
                  stroke={color}
                  strokeWidth={1.5}
                  markerEnd="url(#arrowhead-colored)"
                />
              ) : (
                <line
                  x1={fromX}
                  y1={y}
                  x2={toX}
                  y2={y}
                  stroke="var(--color-border)"
                  strokeWidth={1.5}
                  markerEnd="url(#arrowhead)"
                />
              )}
            </g>
          );
        })}

        {step.nodes.map((node, i) => {
          const x = 20 + i * (nodeWidth + gap);
          const y = 19;
          const highlight = step.highlights[node.id];
          const bg = highlight ? HIGHLIGHT_COLORS[highlight] || color : 'var(--color-bg-alt)';
          const isHighlighted = !!highlight;

          return (
            <g key={node.id}>
              <rect
                x={x}
                y={y}
                width={nodeWidth}
                height={nodeHeight}
                rx={6}
                fill={bg}
                stroke={isHighlighted ? bg : 'var(--color-border)'}
                strokeWidth={2}
                className="transition-all duration-200"
              />
              <text
                x={x + nodeWidth / 2}
                y={y + nodeHeight / 2}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-xs font-bold"
                fill={isHighlighted ? '#fff' : 'var(--color-text)'}
              >
                {node.value}
              </text>
            </g>
          );
        })}

        {Object.entries(step.pointers).map(([name, nodeId]) => {
          const idx = step.nodes.findIndex((n) => n.id === nodeId);
          if (idx === -1) return null;
          const x = 20 + idx * (nodeWidth + gap) + nodeWidth / 2;
          const pColor = HIGHLIGHT_COLORS[name] || color;

          return (
            <text
              key={name}
              x={x}
              y={72}
              textAnchor="middle"
              className="text-[10px] font-bold"
              fill={pColor}
            >
              {name}
            </text>
          );
        })}
      </svg>

      <div className="mt-2 flex flex-wrap justify-center gap-3">
        {Object.entries(step.pointers).map(([name]) => {
          const pColor = HIGHLIGHT_COLORS[name] || color;
          return (
            <div key={name} className="flex items-center gap-1.5 text-[10px] font-medium" style={{ color: pColor }}>
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: pColor }} />
              {name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
