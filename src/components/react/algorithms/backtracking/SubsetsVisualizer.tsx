import { useState, useCallback } from 'react';
import AlgorithmShell from '../AlgorithmShell';
import AlgorithmCodeView from '../AlgorithmCodeView';
import { ALGORITHM_CODES } from '../algorithmCodes';
import TreeVisualizer from '../shared/TreeVisualizer';
import type { TreeStep, TreeNode } from '../types';

function computeSteps(): TreeStep[] {
  const steps: TreeStep[] = [];
  const nums = [1, 2, 3];
  const results: string[] = [];

  const treeNodes: TreeNode[] = [
    { id: 'root', label: '[]', x: 200, y: 25, children: ['1', 'skip1'] },
    { id: '1', label: '[1]', x: 100, y: 75, children: ['12', 'skip12'] },
    { id: 'skip1', label: '[]', x: 300, y: 75, children: ['2only', 'skip2only'] },
    { id: '12', label: '[1,2]', x: 50, y: 135, children: ['123', 'skip123'] },
    { id: 'skip12', label: '[1]', x: 150, y: 135, children: ['13', 'skip13'] },
    { id: '2only', label: '[2]', x: 250, y: 135, children: ['23', 'skip23'] },
    { id: 'skip2only', label: '[]', x: 350, y: 135, children: ['3only', 'skip3only'] },
    { id: '123', label: '[1,2,3]', x: 15, y: 200, children: [] },
    { id: 'skip123', label: '[1,2]', x: 75, y: 200, children: [] },
    { id: '13', label: '[1,3]', x: 130, y: 200, children: [] },
    { id: 'skip13', label: '[1]', x: 180, y: 200, children: [] },
    { id: '23', label: '[2,3]', x: 225, y: 200, children: [] },
    { id: 'skip23', label: '[2]', x: 275, y: 200, children: [] },
    { id: '3only', label: '[3]', x: 325, y: 200, children: [] },
    { id: 'skip3only', label: '[]', x: 385, y: 200, children: [] },
  ];

  steps.push({
    nodes: treeNodes,
    highlights: {},
    visitOrder: [],
    description: `Gerar todos os subsets de [${nums.join(', ')}]`,
    codeLine: { js: 1, py: 1, cpp: 4 },
  });

  const paths: { id: string; subset: string }[] = [
    { id: 'root', subset: '[]' },
    { id: '1', subset: '[1]' },
    { id: '12', subset: '[1,2]' },
    { id: '123', subset: '[1,2,3]' },
    { id: 'skip123', subset: '[1,2]' },
    { id: 'skip12', subset: '[1]' },
    { id: '13', subset: '[1,3]' },
    { id: 'skip13', subset: '[1]' },
    { id: 'skip1', subset: '[]' },
    { id: '2only', subset: '[2]' },
    { id: '23', subset: '[2,3]' },
    { id: 'skip23', subset: '[2]' },
    { id: 'skip2only', subset: '[]' },
    { id: '3only', subset: '[3]' },
    { id: 'skip3only', subset: '[]' },
  ];

  const leafIds = new Set(['123', 'skip123', '13', 'skip13', '23', 'skip23', '3only', 'skip3only']);
  const collectedLeafIds: string[] = [];

  for (const path of paths) {
    const isLeaf = leafIds.has(path.id);
    const highlights: Record<string, string> = { [path.id]: 'current' };
    for (const leafId of collectedLeafIds) {
      highlights[leafId] = 'visited';
    }

    if (isLeaf) {
      results.push(path.subset);
      collectedLeafIds.push(path.id);
    }

    steps.push({
      nodes: treeNodes,
      highlights,
      visitOrder: [...results],
      description: isLeaf
        ? `Folha: adiciona ${path.subset}. Subsets: [${results.join(', ')}]`
        : `Explora nó ${path.subset}`,
      codeLine: { js: isLeaf ? 6 : 10, py: isLeaf ? 6 : 10, cpp: isLeaf ? 9 : 13 },
    });
  }

  steps.push({
    nodes: treeNodes,
    highlights: Object.fromEntries(treeNodes.map((n) => [n.id, 'visited'])),
    visitOrder: [...results],
    description: `${results.length} subsets encontrados!`,
    codeLine: { js: 17, py: 15, cpp: 23 },
  });

  return steps;
}

export default function SubsetsVisualizer() {
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
      title="Subsets — Backtracking"
      description="Gera todos os subsets de [1,2,3] usando árvore de decisão."
      totalSteps={steps.length - 1}
      currentStep={currentStep}
      stepDescription={step.description}
      onStep={handleStep}
      onReset={handleReset}
      isComplete={currentStep >= steps.length - 1}
      color="#f97316"
      eli5={`O problema de subsets pede todos os subconjuntos possíveis de um conjunto. Para n elementos, existem 2^n subconjuntos — cada elemento pode estar presente ou ausente.

O backtracking constrói uma árvore de decisão: para cada elemento, ramifica em duas opções (incluir ou não incluir). Cada folha da árvore é um subconjunto completo. A recursão naturalmente explora todas as combinações.

Por que backtracking? É a forma mais intuitiva de gerar combinações. A cada nível da recursão, toma uma decisão e explora as consequências. Se um caminho não leva a solução (em problemas com restrições), volta atrás (backtracks) e tenta outra decisão.

Complexidade: O(n × 2^n) — são 2^n subconjuntos e cada um tem em média n/2 elementos para copiar. Não há como fazer melhor, já que o próprio output tem esse tamanho.

Esse padrão é a base para resolver permutações, combinações, N-Queens, Sudoku, e qualquer problema que explore um espaço de busca com restrições. A otimização chave é podar ramos que não podem levar a soluções válidas (pruning).`}
      codeView={<AlgorithmCodeView codes={ALGORITHM_CODES['subsets']} color="#f97316" highlightedLines={step.codeLine} />}
    >
      <TreeVisualizer step={step} color="#f97316" width={420} height={240} />
    </AlgorithmShell>
  );
}
