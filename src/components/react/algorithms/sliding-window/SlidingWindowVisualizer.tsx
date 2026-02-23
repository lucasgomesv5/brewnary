import { useState, useCallback } from 'react';
import AlgorithmShell from '../AlgorithmShell';
import AlgorithmCodeView from '../AlgorithmCodeView';
import { ALGORITHM_CODES } from '../algorithmCodes';
import ArrayCellVisualizer from '../shared/ArrayCellVisualizer';
import type { ArrayCellStep } from '../types';

function computeSteps(nums: number[], k: number): ArrayCellStep[] {
  const steps: ArrayCellStep[] = [];

  steps.push({
    data: nums,
    pointers: {},
    highlights: {},
    description: `Array: [${nums.join(', ')}] — Janela de tamanho k=${k}`,
    codeLine: { js: 2, py: 2, cpp: 6 },
  });

  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += nums[i];
  }
  let maxSum = windowSum;

  const initHighlights: Record<number, string> = {};
  for (let i = 0; i < k; i++) initHighlights[i] = 'window';

  steps.push({
    data: nums,
    pointers: {},
    highlights: initHighlights,
    windowStart: 0,
    windowEnd: k - 1,
    description: `Primeira janela [0..${k - 1}]: soma = ${windowSum}`,
    codeLine: { js: 6, py: 6, cpp: 10 },
    extra: { soma: String(windowSum), maxSoma: String(maxSum) },
  });

  for (let i = k; i < nums.length; i++) {
    const removed = nums[i - k];
    windowSum = windowSum - removed + nums[i];

    const highlights: Record<number, string> = {};
    highlights[i - k] = 'removed';
    highlights[i] = 'active';
    for (let j = i - k + 1; j < i; j++) highlights[j] = 'window';

    steps.push({
      data: nums,
      pointers: {},
      highlights,
      windowStart: i - k + 1,
      windowEnd: i,
      description: `Desliza: remove ${removed}, adiciona ${nums[i]}. soma = ${windowSum}`,
      codeLine: { js: 13, py: 12, cpp: 17 },
      extra: { soma: String(windowSum), maxSoma: String(Math.max(maxSum, windowSum)) },
    });

    if (windowSum > maxSum) {
      maxSum = windowSum;
      const winHighlights: Record<number, string> = {};
      for (let j = i - k + 1; j <= i; j++) winHighlights[j] = 'found';

      steps.push({
        data: nums,
        pointers: {},
        highlights: winHighlights,
        windowStart: i - k + 1,
        windowEnd: i,
        description: `Nova soma máxima! ${maxSum}`,
        codeLine: { js: 16, py: 15, cpp: 20 },
        extra: { soma: String(windowSum), maxSoma: String(maxSum) },
      });
    }
  }

  steps.push({
    data: nums,
    pointers: {},
    highlights: {},
    description: `Soma máxima de subarray de tamanho ${k}: ${maxSum}`,
    codeLine: { js: 19, py: 17, cpp: 23 },
    extra: { resultado: String(maxSum) },
  });

  return steps;
}

export default function SlidingWindowVisualizer() {
  const [state, setState] = useState(() => {
    const nums = [2, 1, 5, 1, 3, 2, 8, 1, 3];
    const k = 3;
    return { steps: computeSteps(nums, k), currentStep: 0 };
  });

  const step = state.steps[state.currentStep];

  const handleStep = useCallback(() => {
    setState((s) => ({ ...s, currentStep: Math.min(s.currentStep + 1, s.steps.length - 1) }));
  }, []);

  const handleReset = useCallback(() => {
    const nums = [2, 1, 5, 1, 3, 2, 8, 1, 3];
    const k = 3;
    setState({ steps: computeSteps(nums, k), currentStep: 0 });
  }, []);

  return (
    <AlgorithmShell
      title="Sliding Window — Max Sum Subarray"
      description="Janela deslizante de tamanho fixo para encontrar soma máxima. O(n)."
      totalSteps={state.steps.length - 1}
      currentStep={state.currentStep}
      stepDescription={step.description}
      onStep={handleStep}
      onReset={handleReset}
      isComplete={state.currentStep >= state.steps.length - 1}
      color="#06B6D4"
      eli5={`A janela deslizante mantém um subconjunto contíguo do array e o "desliza" da esquerda para a direita. Em vez de recalcular tudo do zero a cada posição, atualiza incrementalmente — remove o que saiu pela esquerda e adiciona o que entrou pela direita.

Janela fixa (como neste exemplo): tamanho k constante. Calcula a soma da primeira janela, depois para cada passo subtrai o elemento que sai e soma o que entra. Transforma O(n×k) em O(n).

Janela variável: a janela expande pela direita e contrai pela esquerda conforme uma condição. Exemplo: menor substring que contém todos os caracteres de um conjunto. Expande até satisfazer, contrai até não satisfazer mais.

O padrão funciona sempre que o problema pede "subarray/substring contíguo ótimo". A chave é manter estado incremental (soma, contagem, hash map de frequências) que pode ser atualizado em O(1) a cada passo.`}
      codeView={<AlgorithmCodeView codes={ALGORITHM_CODES['sliding-window']} color="#06B6D4" highlightedLines={step.codeLine} />}
    >
      <ArrayCellVisualizer step={step} color="#06B6D4" />
    </AlgorithmShell>
  );
}
