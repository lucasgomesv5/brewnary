import { useState, useCallback } from 'react';
import AlgorithmShell from '../AlgorithmShell';
import AlgorithmCodeView from '../AlgorithmCodeView';
import { ALGORITHM_CODES } from '../algorithmCodes';
import TreeVisualizer from '../shared/TreeVisualizer';
import type { TreeStep, TreeNode } from '../types';

const TREE_NODES: TreeNode[] = [
  { id: '15', label: '15', x: 200, y: 30, children: ['10', '25'] },
  { id: '10', label: '10', x: 110, y: 90, children: ['5', '12'] },
  { id: '25', label: '25', x: 290, y: 90, children: ['20', '30'] },
  { id: '5', label: '5', x: 65, y: 150, children: [] },
  { id: '12', label: '12', x: 155, y: 150, children: [] },
  { id: '20', label: '20', x: 245, y: 150, children: [] },
  { id: '30', label: '30', x: 335, y: 150, children: [] },
];

function computeSteps(): TreeStep[] {
  const steps: TreeStep[] = [];
  const visitOrder: string[] = [];

  steps.push({
    nodes: TREE_NODES,
    highlights: {},
    visitOrder: [],
    description: 'BST com 7 nós. In-order traversal: L → Root → R',
    codeLine: { js: 1, py: 1, cpp: 10 },
  });

  function inOrder(nodeId: string) {
    const node = TREE_NODES.find((n) => n.id === nodeId);
    if (!node) return;

    steps.push({
      nodes: TREE_NODES,
      highlights: { [nodeId]: 'comparing' },
      visitOrder: [...visitOrder],
      description: `Visitando nó ${node.label}: primeiro vai para a esquerda`,
      codeLine: { js: 8, py: 9, cpp: 17 },
    });

    if (node.children[0]) inOrder(node.children[0]);

    visitOrder.push(node.label);
    steps.push({
      nodes: TREE_NODES,
      highlights: { ...Object.fromEntries(visitOrder.map((v) => [v, 'visited'])), [nodeId]: 'current' },
      visitOrder: [...visitOrder],
      description: `Processa ${node.label} → Ordem: [${visitOrder.join(', ')}]`,
      codeLine: { js: 11, py: 12, cpp: 20 },
    });

    if (node.children[1]) inOrder(node.children[1]);
  }

  inOrder('15');

  steps.push({
    nodes: TREE_NODES,
    highlights: Object.fromEntries(visitOrder.map((v) => [v, 'visited'])),
    visitOrder: [...visitOrder],
    description: `In-order completo: [${visitOrder.join(', ')}] — ordenado!`,
    codeLine: { js: 18, py: 18, cpp: 27 },
  });

  return steps;
}

export default function BSTTraversalVisualizer() {
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
      title="BST In-Order Traversal"
      description="Percorre BST em ordem (L → Root → R), produzindo elementos ordenados."
      totalSteps={steps.length - 1}
      currentStep={currentStep}
      stepDescription={step.description}
      onStep={handleStep}
      onReset={handleReset}
      isComplete={currentStep >= steps.length - 1}
      color="#8B5CF6"
      eli5={`Uma BST (Árvore Binária de Busca) organiza dados com uma regra simples: todo nó à esquerda é menor, todo nó à direita é maior. Isso permite busca, inserção e remoção em O(log n) quando a árvore está balanceada.

A travessia in-order (esquerda → nó → direita) visita os elementos em ordem crescente. É a forma natural de extrair dados ordenados de uma BST. Pre-order (nó → esquerda → direita) é útil para serializar/copiar a árvore. Post-order (esquerda → direita → nó) é usada para deletar a árvore ou avaliar expressões.

Por que in-order dá ordem crescente? Pela propriedade da BST: tudo à esquerda é menor, então visitamos os menores primeiro. Depois o nó atual. Depois os maiores à direita.

Complexidade: O(n) para qualquer travessia — cada nó é visitado exatamente uma vez. Espaço O(h) pela recursão, onde h é a altura da árvore.

Na prática, BSTs puras podem degenerar para uma lista (altura n). Por isso existem árvores auto-balanceáveis: AVL, Red-Black (usada em TreeMap do Java e std::map do C++), e B-Trees (usadas em bancos de dados).`}
      codeView={<AlgorithmCodeView codes={ALGORITHM_CODES['bst-traversal']} color="#8B5CF6" highlightedLines={step.codeLine} />}
    >
      <TreeVisualizer step={step} color="#8B5CF6" />
    </AlgorithmShell>
  );
}
