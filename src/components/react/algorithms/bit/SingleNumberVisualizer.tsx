import { useState, useCallback } from 'react';
import AlgorithmShell from '../AlgorithmShell';
import AlgorithmCodeView from '../AlgorithmCodeView';
import { ALGORITHM_CODES } from '../algorithmCodes';
import BitVisualizer from '../shared/BitVisualizer';
import type { BitStep } from '../types';

function computeSteps(nums: number[]): BitStep[] {
  const steps: BitStep[] = [];
  let result = 0;

  steps.push({
    binary: '0',
    decimal: 0,
    highlightedBits: [],
    description: `Array: [${nums.join(', ')}]. Encontrar o número único usando XOR.`,
    codeLine: { js: 2, py: 2, cpp: 2 },
  });

  for (let i = 0; i < nums.length; i++) {
    const prev = result;
    result ^= nums[i];

    const changedBits: number[] = [];
    const xorDiff = prev ^ result;
    for (let b = 0; b < 8; b++) {
      if ((xorDiff >> b) & 1) changedBits.push(b);
    }

    steps.push({
      binary: prev.toString(2),
      decimal: prev,
      operation: `${prev} XOR ${nums[i]}`,
      highlightedBits: changedBits,
      description: `resultado ^= ${nums[i]} → ${prev} ^ ${nums[i]} = ${result}`,
      codeLine: { js: 6, py: 6, cpp: 6 },
      extra: {
        binary2: nums[i].toString(2),
        decimal2: nums[i],
        result: result.toString(2),
        resultDecimal: result,
      },
    });
  }

  steps.push({
    binary: result.toString(2),
    decimal: result,
    highlightedBits: [],
    description: `Número único: ${result}! (todos os duplicados se cancelaram com XOR)`,
    codeLine: { js: 11, py: 10, cpp: 11 },
  });

  return steps;
}

export default function SingleNumberVisualizer() {
  const [steps, setSteps] = useState<BitStep[]>(() => computeSteps([4, 1, 2, 1, 2]));
  const [currentStep, setCurrentStep] = useState(0);

  const step = steps[currentStep];

  const handleStep = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  }, [steps.length]);

  const handleReset = useCallback(() => {
    setSteps(computeSteps([4, 1, 2, 1, 2]));
    setCurrentStep(0);
  }, []);

  return (
    <AlgorithmShell
      title="Single Number (XOR)"
      description="XOR de todos: duplicados se cancelam, sobra o único. O(n) tempo, O(1) espaço."
      totalSteps={steps.length - 1}
      currentStep={currentStep}
      stepDescription={step.description}
      onStep={handleStep}
      onReset={handleReset}
      isComplete={currentStep >= steps.length - 1}
      color="#EF4444"
      eli5={`O Single Number encontra o único elemento que aparece uma vez num array onde todos os outros aparecem exatamente duas vezes. A solução usa XOR (ou-exclusivo) — sem memória extra.

Propriedades do XOR que fazem isso funcionar: a XOR a = 0 (qualquer número XOR consigo mesmo é zero), a XOR 0 = a (XOR com zero não muda nada), e XOR é associativo e comutativo (a ordem não importa).

Quando fazemos XOR de todos os elementos, os que aparecem duas vezes se cancelam (viram 0), e sobra apenas o que aparece uma vez. Exemplo: 4 XOR 1 XOR 2 XOR 1 XOR 2 = 4 XOR (1 XOR 1) XOR (2 XOR 2) = 4 XOR 0 XOR 0 = 4.

Complexidade: O(n) tempo, O(1) espaço — uma única passada pelo array com uma variável acumuladora.

Variações: Single Number II (um aparece uma vez, outros três vezes — conta bits módulo 3), Single Number III (dois aparecem uma vez — separa pelo bit diferente). Manipulação de bits é essencial em programação de baixo nível, criptografia, e otimizações de performance.`}
      codeView={<AlgorithmCodeView codes={ALGORITHM_CODES['single-number']} color="#EF4444" highlightedLines={step.codeLine} />}
    >
      <BitVisualizer step={step} color="#EF4444" />
    </AlgorithmShell>
  );
}
