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
  const queue: string[] = ['A'];
  const visitedEdges: string[] = [];

  steps.push({
    visited: [],
    current: null,
    queue: ['A'],
    description: 'Início: A adicionado à fila',
    edges: [],
    codeLine: { js: 4, py: 6, cpp: 12 },
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);

    steps.push({
      visited: [...visited],
      current,
      queue: [...queue],
      description: `Visitando ${current} (retirado da fila)`,
      edges: [...visitedEdges],
      codeLine: { js: 12, py: 15, cpp: 21 },
    });

    for (const neighbor of ADJ[current] || []) {
      if (!visited.has(neighbor) && !queue.includes(neighbor)) {
        queue.push(neighbor);
        const edgeKey = EDGES.find(
          (e) => (e.from === current && e.to === neighbor) || (e.from === neighbor && e.to === current),
        );
        if (edgeKey) visitedEdges.push(`${edgeKey.from}-${edgeKey.to}`);

        steps.push({
          visited: [...visited],
          current,
          queue: [...queue],
          description: `${neighbor} adicionado à fila (vizinho de ${current})`,
          edges: [...visitedEdges],
          codeLine: { js: 18, py: 21, cpp: 27 },
        });
      }
    }
  }

  steps.push({
    visited: [...visited],
    current: null,
    queue: [],
    description: 'BFS concluída! Todos os nós foram visitados.',
    edges: [...visitedEdges],
    codeLine: { js: 1, py: 3, cpp: 7 },
  });

  return steps;
}

export default function BFSVisualizer() {
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
      title="BFS — Busca em Largura"
      description="Explora todos os vizinhos antes de avançar para o próximo nível. Usa fila FIFO."
      totalSteps={steps.length - 1}
      currentStep={currentStep}
      stepDescription={step.description}
      onStep={handleStep}
      onReset={handleReset}
      isComplete={currentStep >= steps.length - 1}
      color="#F59E0B"
      eli5={`O BFS (Busca em Largura) explora um grafo nível por nível: primeiro visita todos os vizinhos diretos, depois os vizinhos dos vizinhos, e assim por diante. Usa uma fila (FIFO) para controlar a ordem.

Funcionamento: começa pelo nó inicial, coloca todos os vizinhos na fila. Remove o primeiro da fila, visita, e adiciona seus vizinhos não-visitados. Repete até a fila esvaziar.

Propriedade fundamental: o BFS encontra o caminho mais curto (em número de arestas) entre dois nós em grafos não-ponderados. Isso acontece porque ele sempre visita nós na ordem da distância.

Complexidade: O(V + E), onde V é o número de vértices e E o número de arestas. Cada nó e cada aresta são processados uma vez.

Aplicações: menor caminho em grafos não-ponderados, busca em redes sociais (graus de separação), web crawlers, detecção de componentes conectados, e Level Order Traversal em árvores.`}
      codeView={<AlgorithmCodeView codes={ALGORITHM_CODES['bfs']} color="#F59E0B" highlightedLines={step.codeLine} />}
    >
      <GraphVisualizer nodes={NODES} edges={EDGES} step={step} color="#F59E0B" />
    </AlgorithmShell>
  );
}
