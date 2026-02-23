import { useState, useCallback } from 'react';
import AlgorithmShell from '../AlgorithmShell';
import AlgorithmCodeView from '../AlgorithmCodeView';
import { ALGORITHM_CODES } from '../algorithmCodes';
import DPTableVisualizer from '../shared/DPTableVisualizer';
import type { DPTableStep } from '../types';

function computeSteps(n: number): DPTableStep[] {
  const steps: DPTableStep[] = [];
  const dp: (number | string)[] = Array(n + 1).fill('');

  steps.push({
    grid: [[...dp]],
    highlights: {},
    description: `Climbing Stairs: quantas formas de subir ${n} degraus? (1 ou 2 passos)`,
    codeLine: { js: 3, py: 3, cpp: 6 },
  });

  dp[0] = 1;
  steps.push({
    grid: [[...dp]],
    highlights: { '0,0': 'current' },
    description: 'dp[0] = 1 (caso base: 1 forma de ficar no degrau 0)',
    codeLine: { js: 6, py: 6, cpp: 9 },
  });

  dp[1] = 1;
  steps.push({
    grid: [[...dp]],
    highlights: { '0,0': 'computed', '0,1': 'current' },
    description: 'dp[1] = 1 (caso base: 1 forma de subir 1 degrau)',
    codeLine: { js: 7, py: 7, cpp: 10 },
  });

  for (let i = 2; i <= n; i++) {
    const prev1 = dp[i - 1] as number;
    const prev2 = dp[i - 2] as number;

    steps.push({
      grid: [[...dp]],
      highlights: {
        [`0,${i - 1}`]: 'dependency',
        [`0,${i - 2}`]: 'dependency',
        [`0,${i}`]: 'active',
      },
      arrows: [
        { from: [0, i - 1], to: [0, i] },
        { from: [0, i - 2], to: [0, i] },
      ],
      description: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${prev1} + ${prev2}`,
      codeLine: { js: 11, py: 11, cpp: 14 },
    });

    dp[i] = prev1 + prev2;

    const highlights: Record<string, string> = { [`0,${i}`]: 'current' };
    for (let j = 0; j < i; j++) highlights[`0,${j}`] = 'computed';

    steps.push({
      grid: [[...dp]],
      highlights,
      description: `dp[${i}] = ${dp[i]}`,
      codeLine: { js: 11, py: 11, cpp: 14 },
    });
  }

  const finalHighlights: Record<string, string> = {};
  for (let i = 0; i <= n; i++) finalHighlights[`0,${i}`] = 'computed';
  finalHighlights[`0,${n}`] = 'result';

  steps.push({
    grid: [[...dp]],
    highlights: finalHighlights,
    description: `Resposta: dp[${n}] = ${dp[n]} formas de subir ${n} degraus!`,
    codeLine: { js: 14, py: 13, cpp: 17 },
  });

  return steps;
}

export default function ClimbingStairsVisualizer() {
  const [steps, setSteps] = useState<DPTableStep[]>(() => computeSteps(6));
  const [currentStep, setCurrentStep] = useState(0);

  const step = steps[currentStep];

  const handleStep = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  }, [steps.length]);

  const handleReset = useCallback(() => {
    setSteps(computeSteps(6));
    setCurrentStep(0);
  }, []);

  return (
    <AlgorithmShell
      title="Climbing Stairs (DP)"
      description="dp[i] = dp[i-1] + dp[i-2]. É Fibonacci! O(n) tempo, O(n) espaço."
      totalSteps={steps.length - 1}
      currentStep={currentStep}
      stepDescription={step.description}
      onStep={handleStep}
      onReset={handleReset}
      isComplete={currentStep >= steps.length - 1}
      color="#8B5CF6"
      eli5={`Climbing Stairs é o problema introdutório de programação dinâmica: de quantas formas distintas você pode subir n degraus, podendo dar passos de 1 ou 2?

A recorrência: dp[i] = dp[i-1] + dp[i-2]. Para chegar ao degrau i, ou veio do degrau i-1 (um passo) ou do i-2 (dois passos). Os casos base são dp[0] = 1 (uma forma de ficar parado) e dp[1] = 1.

Isso é exatamente a sequência de Fibonacci. A solução recursiva ingênua é O(2^n) porque recalcula os mesmos subproblemas muitas vezes. Com memoização ou tabulação (bottom-up), cada subproblema é calculado uma vez — O(n) tempo.

Como otimizar espaço? Só precisamos dos dois valores anteriores, então em vez de um array inteiro, bastam duas variáveis — O(1) de espaço.

Este problema ensina os fundamentos de DP: identificar subproblemas sobrepostos (overlapping subproblems), definir a recorrência, e decidir entre top-down (memoização) e bottom-up (tabulação). A mesma estrutura aparece em coin change, decode ways, e centenas de outros problemas.`}
      codeView={<AlgorithmCodeView codes={ALGORITHM_CODES['climbing-stairs']} color="#8B5CF6" highlightedLines={step.codeLine} />}
    >
      <DPTableVisualizer step={step} color="#8B5CF6" />
    </AlgorithmShell>
  );
}
