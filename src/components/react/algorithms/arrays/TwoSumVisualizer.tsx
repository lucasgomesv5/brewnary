import { useState, useCallback } from 'react';
import AlgorithmShell from '../AlgorithmShell';
import AlgorithmCodeView from '../AlgorithmCodeView';
import { ALGORITHM_CODES } from '../algorithmCodes';
import ArrayCellVisualizer from '../shared/ArrayCellVisualizer';
import type { ArrayCellStep } from '../types';

function computeSteps(nums: number[], target: number): ArrayCellStep[] {
  const steps: ArrayCellStep[] = [];
  const map: Record<number, number> = {};

  steps.push({
    data: nums,
    pointers: {},
    highlights: {},
    description: `Array: [${nums.join(', ')}] — Target: ${target}`,
    codeLine: { js: 2, py: 2, cpp: 6 },
    extra: { 'Hash Map': '{}' },
  });

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    steps.push({
      data: nums,
      pointers: { i },
      highlights: { [i]: 'current' },
      description: `i=${i}: nums[${i}]=${nums[i]}, complemento=${complement}`,
      codeLine: { js: 6, py: 6, cpp: 10 },
      extra: { 'Hash Map': JSON.stringify(map), complemento: String(complement) },
    });

    if (complement in map) {
      steps.push({
        data: nums,
        pointers: { i },
        highlights: { [map[complement]]: 'found', [i]: 'found' },
        description: `Encontrado! map[${complement}]=${map[complement]}, retorna [${map[complement]}, ${i}]`,
        codeLine: { js: 10, py: 10, cpp: 14 },
        extra: { resultado: `[${map[complement]}, ${i}]` },
      });
      return steps;
    }

    map[nums[i]] = i;
    steps.push({
      data: nums,
      pointers: { i },
      highlights: { [i]: 'active' },
      description: `Adiciona map[${nums[i]}] = ${i}`,
      codeLine: { js: 14, py: 13, cpp: 18 },
      extra: { 'Hash Map': JSON.stringify(map) },
    });
  }

  return steps;
}

export default function TwoSumVisualizer() {
  const [state, setState] = useState(() => {
    const nums = [2, 7, 11, 15, 1, 8, 3];
    const target = 9;
    return { steps: computeSteps(nums, target), currentStep: 0, nums, target };
  });

  const step = state.steps[state.currentStep];

  const handleStep = useCallback(() => {
    setState((s) => ({ ...s, currentStep: Math.min(s.currentStep + 1, s.steps.length - 1) }));
  }, []);

  const handleReset = useCallback(() => {
    const nums = [2, 7, 11, 15, 1, 8, 3];
    const target = 9;
    setState({ steps: computeSteps(nums, target), currentStep: 0, nums, target });
  }, []);

  return (
    <AlgorithmShell
      title="Two Sum"
      description="Encontra dois números que somam ao target usando hash map. O(n)."
      totalSteps={state.steps.length - 1}
      currentStep={state.currentStep}
      stepDescription={step.description}
      onStep={handleStep}
      onReset={handleReset}
      isComplete={state.currentStep >= state.steps.length - 1}
      color="#8B5CF6"
      eli5={`O Two Sum pergunta: dados um array e um alvo, quais dois elementos somam ao alvo? A solução ingênua testa todos os pares — O(n²). A solução com hash map reduz para O(n).

A ideia: para cada elemento x, o complemento que precisamos é (alvo - x). Se guardarmos cada elemento num hash map conforme percorremos o array, podemos verificar em O(1) se o complemento já apareceu.

Por que funciona? O hash map oferece lookup em tempo constante (amortizado). Percorremos o array uma única vez, e para cada elemento fazemos no máximo uma inserção e uma busca no mapa.

Esse padrão — trocar espaço por tempo usando um hash map — é um dos mais importantes em entrevistas e no dia a dia. Aparece em problemas de frequência, detecção de duplicatas, agrupamento, e muitos outros.`}
      codeView={<AlgorithmCodeView codes={ALGORITHM_CODES['two-sum']} color="#8B5CF6" highlightedLines={step.codeLine} />}
    >
      <ArrayCellVisualizer step={step} color="#8B5CF6" />
    </AlgorithmShell>
  );
}
