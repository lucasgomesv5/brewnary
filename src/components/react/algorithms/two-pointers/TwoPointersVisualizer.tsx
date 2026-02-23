import { useState, useCallback } from 'react';
import AlgorithmShell from '../AlgorithmShell';
import AlgorithmCodeView from '../AlgorithmCodeView';
import { ALGORITHM_CODES } from '../algorithmCodes';
import ArrayCellVisualizer from '../shared/ArrayCellVisualizer';
import type { ArrayCellStep } from '../types';

function computeSteps(nums: number[], target: number): ArrayCellStep[] {
  const steps: ArrayCellStep[] = [];
  let left = 0;
  let right = nums.length - 1;

  steps.push({
    data: nums,
    pointers: { left, right },
    highlights: { [left]: 'left', [right]: 'right' },
    description: `Array ordenado. Target = ${target}. left=0, right=${right}`,
    codeLine: { js: 2, py: 2, cpp: 5 },
  });

  while (left < right) {
    const sum = nums[left] + nums[right];

    steps.push({
      data: nums,
      pointers: { left, right },
      highlights: { [left]: 'left', [right]: 'right' },
      description: `nums[${left}] + nums[${right}] = ${nums[left]} + ${nums[right]} = ${sum}`,
      codeLine: { js: 6, py: 6, cpp: 9 },
      extra: { soma: String(sum), target: String(target) },
    });

    if (sum === target) {
      steps.push({
        data: nums,
        pointers: { left, right },
        highlights: { [left]: 'found', [right]: 'found' },
        description: `Encontrado! [${left}, ${right}] → ${nums[left]} + ${nums[right]} = ${target}`,
        codeLine: { js: 9, py: 9, cpp: 12 },
      });
      return steps;
    } else if (sum < target) {
      steps.push({
        data: nums,
        pointers: { left, right },
        highlights: { [left]: 'left', [right]: 'right' },
        description: `${sum} < ${target} → left++`,
        codeLine: { js: 12, py: 12, cpp: 15 },
      });
      left++;
    } else {
      steps.push({
        data: nums,
        pointers: { left, right },
        highlights: { [left]: 'left', [right]: 'right' },
        description: `${sum} > ${target} → right--`,
        codeLine: { js: 15, py: 15, cpp: 18 },
      });
      right--;
    }
  }

  return steps;
}

export default function TwoPointersVisualizer() {
  const [state, setState] = useState(() => {
    const nums = [1, 2, 3, 5, 8, 11, 15];
    const target = 13;
    return { steps: computeSteps(nums, target), currentStep: 0 };
  });

  const step = state.steps[state.currentStep];

  const handleStep = useCallback(() => {
    setState((s) => ({ ...s, currentStep: Math.min(s.currentStep + 1, s.steps.length - 1) }));
  }, []);

  const handleReset = useCallback(() => {
    const nums = [1, 2, 3, 5, 8, 11, 15];
    const target = 13;
    setState({ steps: computeSteps(nums, target), currentStep: 0 });
  }, []);

  return (
    <AlgorithmShell
      title="Two Pointers — Two Sum II"
      description="Dois ponteiros convergem em array ordenado para encontrar par com soma alvo. O(n)."
      totalSteps={state.steps.length - 1}
      currentStep={state.currentStep}
      stepDescription={step.description}
      onStep={handleStep}
      onReset={handleReset}
      isComplete={state.currentStep >= state.steps.length - 1}
      color="#EC4899"
      eli5={`A técnica de dois ponteiros usa dois índices que se movem pelo array de formas coordenadas. Na variação clássica com array ordenado, um começa no início (left) e outro no final (right).

Para o Two Sum em array ordenado: soma left + right. Se a soma é menor que o alvo, move left para a direita (aumenta a soma). Se é maior, move right para a esquerda (diminui a soma). Cada passo elimina uma possibilidade, garantindo O(n).

Por que funciona? O array estar ordenado garante que mover left para a direita sempre aumenta a soma, e mover right para a esquerda sempre diminui. Não existe combinação válida que pule essa varredura.

Outras variações: ponteiros na mesma direção (fast/slow para detectar ciclos em linked lists), ponteiros partindo do mesmo ponto (para remover duplicatas in-place), e três ponteiros (3Sum). É um padrão fundamental que evita loops aninhados.`}
      codeView={<AlgorithmCodeView codes={ALGORITHM_CODES['two-pointers']} color="#EC4899" highlightedLines={step.codeLine} />}
    >
      <ArrayCellVisualizer step={step} color="#EC4899" />
    </AlgorithmShell>
  );
}
