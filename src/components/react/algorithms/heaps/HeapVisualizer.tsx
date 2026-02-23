import { useState, useCallback } from 'react';
import AlgorithmShell from '../AlgorithmShell';
import AlgorithmCodeView from '../AlgorithmCodeView';
import { ALGORITHM_CODES } from '../algorithmCodes';
import TreeVisualizer from '../shared/TreeVisualizer';
import type { TreeStep, TreeNode } from '../types';

function buildTreeNodes(heap: number[]): TreeNode[] {
  const nodes: TreeNode[] = [];
  const levels = Math.ceil(Math.log2(heap.length + 1));
  const width = 380;

  for (let i = 0; i < heap.length; i++) {
    const level = Math.floor(Math.log2(i + 1));
    const posInLevel = i - (Math.pow(2, level) - 1);
    const nodesInLevel = Math.pow(2, level);
    const spacing = width / (nodesInLevel + 1);
    const x = spacing * (posInLevel + 1) + 10;
    const y = 30 + level * 60;

    const children: string[] = [];
    const leftChild = 2 * i + 1;
    const rightChild = 2 * i + 2;
    if (leftChild < heap.length) children.push(`h${leftChild}`);
    if (rightChild < heap.length) children.push(`h${rightChild}`);

    nodes.push({ id: `h${i}`, label: String(heap[i]), x, y, children });
  }
  return nodes;
}

function computeSteps(): TreeStep[] {
  const steps: TreeStep[] = [];
  const heap: number[] = [];
  const values = [5, 3, 8, 1, 4, 7, 2];

  steps.push({
    nodes: [],
    highlights: {},
    visitOrder: [],
    description: `Inserindo valores: [${values.join(', ')}] em min-heap`,
    codeLine: { js: 2, py: 3, cpp: 6 },
  });

  for (const val of values) {
    heap.push(val);
    let nodes = buildTreeNodes(heap);

    steps.push({
      nodes,
      highlights: { [`h${heap.length - 1}`]: 'inserting' },
      visitOrder: [...heap].map(String),
      description: `Insere ${val} no final do array. Array: [${heap.join(', ')}]`,
      codeLine: { js: 6, py: 7, cpp: 11 },
    });

    let idx = heap.length - 1;
    while (idx > 0) {
      const parent = Math.floor((idx - 1) / 2);
      if (heap[parent] <= heap[idx]) break;

      steps.push({
        nodes: buildTreeNodes(heap),
        highlights: { [`h${idx}`]: 'comparing', [`h${parent}`]: 'comparing' },
        visitOrder: [...heap].map(String),
        description: `Compara ${heap[idx]} com pai ${heap[parent]}: ${heap[idx]} < ${heap[parent]} → troca`,
        codeLine: { js: 12, py: 13, cpp: 17 },
      });

      [heap[parent], heap[idx]] = [heap[idx], heap[parent]];
      idx = parent;

      steps.push({
        nodes: buildTreeNodes(heap),
        highlights: { [`h${idx}`]: 'current' },
        visitOrder: [...heap].map(String),
        description: `Bubble up: array = [${heap.join(', ')}]`,
        codeLine: { js: 14, py: 16, cpp: 19 },
      });
    }

    steps.push({
      nodes: buildTreeNodes(heap),
      highlights: { [`h${idx}`]: 'visited' },
      visitOrder: [...heap].map(String),
      description: `${val} na posição correta. Min = ${heap[0]}`,
      codeLine: { js: 12, py: 14, cpp: 17 },
    });
  }

  steps.push({
    nodes: buildTreeNodes(heap),
    highlights: { h0: 'visited' },
    visitOrder: [...heap].map(String),
    description: `Min-heap completo! Mínimo = ${heap[0]}. Array: [${heap.join(', ')}]`,
    codeLine: { js: 17, py: 17, cpp: 22 },
  });

  return steps;
}

export default function HeapVisualizer() {
  const [steps, setSteps] = useState<TreeStep[]>(() => computeSteps());
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
      title="Min-Heap Insert"
      description="Insere elementos no min-heap com bubble up. O(log n) por inserção."
      totalSteps={steps.length - 1}
      currentStep={currentStep}
      stepDescription={step.description}
      onStep={handleStep}
      onReset={handleReset}
      isComplete={currentStep >= steps.length - 1}
      color="#EF4444"
      eli5={`Um heap (min-heap) é uma árvore binária completa onde todo pai é menor ou igual aos filhos. O menor elemento sempre está na raiz — acesso em O(1).

Inserção: o novo elemento entra na última posição (mantém a árvore completa) e "sobe" (bubble up / sift up) trocando com o pai enquanto for menor. No máximo percorre a altura da árvore — O(log n).

Remoção do mínimo: remove a raiz, coloca o último elemento no topo, e "desce" (sift down) trocando com o menor filho enquanto for maior. Também O(log n).

Implementação com array: o heap é armazenado num array simples. Para o nó no índice i: pai = (i-1)/2, filho esquerdo = 2i+1, filho direito = 2i+2. Não precisa de ponteiros — é eficiente em memória e cache-friendly.

Aplicações: priority queues (fila de prioridade), Dijkstra para menor caminho, Huffman coding para compressão, encontrar os K maiores/menores elementos, e heapsort (O(n log n) in-place). Em Python é o módulo heapq, em Java é PriorityQueue.`}
      codeView={<AlgorithmCodeView codes={ALGORITHM_CODES['heap-insert']} color="#EF4444" highlightedLines={step.codeLine} />}
    >
      <TreeVisualizer step={step} color="#EF4444" height={220} />
    </AlgorithmShell>
  );
}
