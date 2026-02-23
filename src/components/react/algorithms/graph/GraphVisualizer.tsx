import type { GraphNode, GraphEdge, GraphStep } from '../types';

interface Props {
  nodes: GraphNode[];
  edges: GraphEdge[];
  step: GraphStep;
  color?: string;
  directed?: boolean;
  nodeLabels?: Record<string, string>;
}

export default function GraphVisualizer({ nodes, edges, step, color = '#8B5CF6', directed = false, nodeLabels }: Props) {
  return (
    <div className="py-2">
      <svg viewBox="0 0 400 280" className="mx-auto w-full max-w-md">
        {directed && (
          <defs>
            <marker id="arrowhead-default" markerWidth="8" markerHeight="6" refX="28" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="var(--color-border)" />
            </marker>
            <marker id="arrowhead-active" markerWidth="8" markerHeight="6" refX="28" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill={color} />
            </marker>
          </defs>
        )}

        {edges.map((edge) => {
          const from = nodes.find((n) => n.id === edge.from)!;
          const to = nodes.find((n) => n.id === edge.to)!;
          const edgeKey = `${edge.from}-${edge.to}`;
          const isActive = step.edges.includes(edgeKey);

          return (
            <line
              key={edgeKey}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={isActive ? color : 'var(--color-border)'}
              strokeWidth={isActive ? 2.5 : 1.5}
              markerEnd={directed ? (isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead-default)') : undefined}
              className="transition-all duration-200"
            />
          );
        })}

        {nodes.map((node) => {
          const isVisited = step.visited.includes(node.id);
          const isCurrent = step.current === node.id;
          const inQueue = step.queue.includes(node.id);

          let fill = 'var(--color-bg-alt)';
          let stroke = 'var(--color-border)';

          if (isCurrent) {
            fill = color;
            stroke = color;
          } else if (isVisited) {
            fill = '#10B981';
            stroke = '#10B981';
          } else if (inQueue) {
            fill = '#F59E0B';
            stroke = '#F59E0B';
          }

          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={20}
                fill={fill}
                stroke={stroke}
                strokeWidth={2}
                className="transition-all duration-200"
              />
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-xs font-bold"
                fill={isCurrent || isVisited || inQueue ? '#fff' : 'var(--color-text)'}
              >
                {node.label}
              </text>
              {nodeLabels?.[node.id] && (
                <text
                  x={node.x}
                  y={node.y + 30}
                  textAnchor="middle"
                  className="text-[9px]"
                  fill="var(--color-text-muted)"
                >
                  {nodeLabels[node.id]}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-[var(--color-text-muted)]">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
          Atual
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
          Visitado
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
          Na fila/pilha
        </div>
      </div>

      {step.queue.length > 0 && (
        <div className="mt-3 rounded-lg border border-[var(--color-border)] p-2 text-center">
          <span className="font-mono text-[10px] text-[var(--color-text-muted)]">
            {step.description.includes('pilha') ? 'Pilha' : 'Fila'}: [{step.queue.join(', ')}]
          </span>
        </div>
      )}
    </div>
  );
}
