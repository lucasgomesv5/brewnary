import { useState, useCallback } from 'react';
import AlgorithmShell from '../AlgorithmShell';
import AlgorithmCodeView from '../AlgorithmCodeView';
import { ALGORITHM_CODES } from '../algorithmCodes';
import GraphVisualizer from './GraphVisualizer';
import type { GraphNode, GraphEdge, GraphStep } from '../types';

const NODES: GraphNode[] = [
  { id: 'A', label: 'A', x: 200, y: 30 },
  { id: 'B', label: 'B', x: 100, y: 100 },
  { id: 'C', label: 'C', x: 300, y: 100 },
  { id: 'D', label: 'D', x: 50, y: 190 },
  { id: 'E', label: 'E', x: 150, y: 190 },
  { id: 'F', label: 'F', x: 250, y: 190 },
  { id: 'G', label: 'G', x: 350, y: 190 },
  { id: 'H', label: 'H', x: 100, y: 260 },
  { id: 'I', label: 'I', x: 300, y: 260 },
];

const EDGES: GraphEdge[] = [
  { from: 'A', to: 'B' },
  { from: 'A', to: 'C' },
  { from: 'B', to: 'D' },
  { from: 'B', to: 'E' },
  { from: 'C', to: 'F' },
  { from: 'C', to: 'G' },
  { from: 'D', to: 'H' },
  { from: 'F', to: 'I' },
];

const ADJ: Record<string, string[]> = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F', 'G'],
  D: ['B', 'H'],
  E: ['B'],
  F: ['C', 'I'],
  G: ['C'],
  H: ['D'],
  I: ['F'],
};

function computeSteps(): GraphStep[] {
  const steps: GraphStep[] = [];
  const visited = new Set<string>();
  const stack: string[] = ['A'];
  const visitedEdges: string[] = [];

  steps.push({
    visited: [],
    current: null,
    queue: ['A'],
    description: 'Início: A adicionado à pilha',
    edges: [],
  });

  while (stack.length > 0) {
    const current = stack.pop()!;
    if (visited.has(current)) continue;
    visited.add(current);

    steps.push({
      visited: [...visited],
      current,
      queue: [...stack],
      description: `Visitando ${current} (retirado da pilha)`,
      edges: [...visitedEdges],
    });

    const neighbors = (ADJ[current] || []).slice().reverse();
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
        const edgeKey = EDGES.find(
          (e) => (e.from === current && e.to === neighbor) || (e.from === neighbor && e.to === current),
        );
        if (edgeKey) {
          const ek = `${edgeKey.from}-${edgeKey.to}`;
          if (!visitedEdges.includes(ek)) visitedEdges.push(ek);
        }

        steps.push({
          visited: [...visited],
          current,
          queue: [...stack],
          description: `${neighbor} adicionado à pilha (vizinho de ${current})`,
          edges: [...visitedEdges],
        });
      }
    }
  }

  steps.push({
    visited: [...visited],
    current: null,
    queue: [],
    description: 'DFS concluída! Todos os nós foram visitados.',
    edges: [...visitedEdges],
  });

  return steps;
}

export default function DFSVisualizer() {
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
      title="DFS — Busca em Profundidade"
      description="Segue um caminho até o fim antes de voltar. Usa pilha LIFO."
      totalSteps={steps.length - 1}
      currentStep={currentStep}
      stepDescription={step.description}
      onStep={handleStep}
      onReset={handleReset}
      isComplete={currentStep >= steps.length - 1}
      color="#EF4444"
      codeView={<AlgorithmCodeView codes={ALGORITHM_CODES['dfs']} color="#EF4444" />}
    >
      <GraphVisualizer nodes={NODES} edges={EDGES} step={step} color="#EF4444" />
    </AlgorithmShell>
  );
}
