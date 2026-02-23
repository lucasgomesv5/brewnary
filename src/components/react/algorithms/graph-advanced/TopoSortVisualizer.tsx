import { useState, useCallback } from 'react';
import AlgorithmShell from '../AlgorithmShell';
import AlgorithmCodeView from '../AlgorithmCodeView';
import { ALGORITHM_CODES } from '../algorithmCodes';
import type { GraphNode, GraphEdge, GraphStep } from '../types';

const NODES: GraphNode[] = [
  { id: '0', label: '0', x: 60, y: 50 },
  { id: '1', label: '1', x: 200, y: 50 },
  { id: '2', label: '2', x: 60, y: 180 },
  { id: '3', label: '3', x: 200, y: 180 },
  { id: '4', label: '4', x: 340, y: 115 },
];

const EDGES: GraphEdge[] = [
  { from: '0', to: '1' },
  { from: '0', to: '2' },
  { from: '1', to: '3' },
  { from: '2', to: '3' },
  { from: '3', to: '4' },
];

const ADJ: Record<string, string[]> = {
  '0': ['1', '2'],
  '1': ['3'],
  '2': ['3'],
  '3': ['4'],
  '4': [],
};

function computeSteps(): GraphStep[] {
  const steps: GraphStep[] = [];
  const inDegree: Record<string, number> = { '0': 0, '1': 1, '2': 1, '3': 2, '4': 1 };
  const queue: string[] = [];
  const order: string[] = [];

  steps.push({
    visited: [],
    current: null,
    queue: [],
    description: `Kahn's Topological Sort. In-degrees: ${JSON.stringify(inDegree)}`,
    edges: [],
    codeLine: { js: 4, py: 6, cpp: 9 },
  });

  for (const [node, deg] of Object.entries(inDegree)) {
    if (deg === 0) queue.push(node);
  }

  steps.push({
    visited: [],
    current: null,
    queue: [...queue],
    description: `Nós com in-degree 0: [${queue.join(', ')}] → enfileira`,
    edges: [],
    codeLine: { js: 14, py: 16, cpp: 19 },
  });

  while (queue.length > 0) {
    const node = queue.shift()!;
    order.push(node);

    steps.push({
      visited: [...order],
      current: node,
      queue: [...queue],
      description: `Processa nó ${node}. Ordem: [${order.join(', ')}]`,
      edges: [],
      codeLine: { js: 21, py: 22, cpp: 27 },
    });

    for (const neighbor of ADJ[node]) {
      inDegree[neighbor]--;
      const activeEdges = [`${node}-${neighbor}`];

      steps.push({
        visited: [...order],
        current: node,
        queue: [...queue],
        description: `${node}→${neighbor}: in-degree[${neighbor}] = ${inDegree[neighbor]}`,
        edges: activeEdges,
        codeLine: { js: 25, py: 26, cpp: 31 },
      });

      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);

        steps.push({
          visited: [...order],
          current: node,
          queue: [...queue],
          description: `in-degree[${neighbor}]=0 → enfileira ${neighbor}`,
          edges: activeEdges,
          codeLine: { js: 28, py: 29, cpp: 34 },
        });
      }
    }
  }

  steps.push({
    visited: [...order],
    current: null,
    queue: [],
    description: `Ordem topológica: [${order.join(', ')}]`,
    edges: [],
    codeLine: { js: 33, py: 31, cpp: 39 },
  });

  return steps;
}

export default function TopoSortVisualizer() {
  const [steps, setSteps] = useState<GraphStep[]>(() => computeSteps());
  const [currentStep, setCurrentStep] = useState(0);

  const step = steps[currentStep];

  const handleStep = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  }, [steps.length]);

  const handleReset = useCallback(() => {
    setSteps(computeSteps());
    setCurrentStep(0);
  }, []);

  return (
    <AlgorithmShell
      title="Topological Sort (Kahn's)"
      description="Ordena nós de um DAG respeitando dependências. BFS com in-degree."
      totalSteps={steps.length - 1}
      currentStep={currentStep}
      stepDescription={step.description}
      onStep={handleStep}
      onReset={handleReset}
      isComplete={currentStep >= steps.length - 1}
      color="#F59E0B"
      eli5={`A ordenação topológica (topological sort) organiza os vértices de um grafo dirigido acíclico (DAG) de forma que para toda aresta u→v, u aparece antes de v. É a "ordem válida" para executar tarefas com dependências.

Algoritmo de Kahn (BFS): calcula o in-degree (número de arestas entrando) de cada nó. Coloca todos com in-degree 0 numa fila (não dependem de ninguém). Remove um da fila, adiciona ao resultado, e reduz o in-degree dos vizinhos. Se algum vizinho chega a 0, entra na fila. Repete até a fila esvaziar.

Detecção de ciclo: se ao final nem todos os nós foram processados, o grafo tem ciclo — e ordenação topológica é impossível. O algoritmo de Kahn detecta isso naturalmente.

Complexidade: O(V + E) — cada vértice e aresta são processados uma vez.

Aplicações: resolução de dependências (npm, pip, apt), ordem de compilação (Makefile), scheduling de tarefas, ordem de execução em spreadsheets (células que referenciam outras), e pré-requisitos de disciplinas numa grade curricular.`}
      codeView={<AlgorithmCodeView codes={ALGORITHM_CODES['topo-sort']} color="#F59E0B" highlightedLines={step.codeLine} />}
    >
      <div className="py-2">
        <svg viewBox="0 0 400 240" className="mx-auto w-full max-w-md">
          <defs>
            <marker id="arrow-topo" markerWidth="8" markerHeight="6" refX="28" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="var(--color-text-muted)" />
            </marker>
            <marker id="arrow-topo-active" markerWidth="8" markerHeight="6" refX="28" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#F59E0B" />
            </marker>
          </defs>

          {EDGES.map((edge) => {
            const from = NODES.find((n) => n.id === edge.from)!;
            const to = NODES.find((n) => n.id === edge.to)!;
            const edgeKey = `${edge.from}-${edge.to}`;
            const isActive = step.edges.includes(edgeKey);

            return (
              <line
                key={edgeKey}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isActive ? '#F59E0B' : 'var(--color-border)'}
                strokeWidth={isActive ? 2.5 : 1.5}
                markerEnd={isActive ? 'url(#arrow-topo-active)' : 'url(#arrow-topo)'}
                className="transition-all duration-200"
              />
            );
          })}

          {NODES.map((node) => {
            const isVisited = step.visited.includes(node.id);
            const isCurrent = step.current === node.id;
            const inQueue = step.queue.includes(node.id);

            let fill = 'var(--color-bg-alt)';
            let stroke = 'var(--color-border)';
            if (isCurrent) { fill = '#F59E0B'; stroke = '#F59E0B'; }
            else if (isVisited) { fill = '#10B981'; stroke = '#10B981'; }
            else if (inQueue) { fill = '#3B82F6'; stroke = '#3B82F6'; }

            return (
              <g key={node.id}>
                <circle cx={node.x} cy={node.y} r={20} fill={fill} stroke={stroke} strokeWidth={2} className="transition-all duration-200" />
                <text x={node.x} y={node.y} textAnchor="middle" dominantBaseline="central" className="text-xs font-bold" fill={isCurrent || isVisited || inQueue ? '#fff' : 'var(--color-text)'}>
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="mt-2 flex items-center justify-center gap-4 text-[10px] text-[var(--color-text-muted)]">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />Atual
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />Processado
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#3B82F6]" />Na fila
          </div>
        </div>

        {step.queue.length > 0 && (
          <div className="mt-2 rounded-lg border border-[var(--color-border)] p-2 text-center">
            <span className="font-mono text-[10px] text-[var(--color-text-muted)]">Fila: [{step.queue.join(', ')}]</span>
          </div>
        )}
      </div>
    </AlgorithmShell>
  );
}
