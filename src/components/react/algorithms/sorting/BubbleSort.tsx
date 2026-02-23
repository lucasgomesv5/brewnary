import { useState, useCallback } from 'react';
import AlgorithmShell from '../AlgorithmShell';
import AlgorithmCodeView from '../AlgorithmCodeView';
import { ALGORITHM_CODES } from '../algorithmCodes';
import SortingVisualizer from './SortingVisualizer';
import type { AlgorithmStep } from '../types';

function generateArray(): number[] {
  return Array.from({ length: 12 }, () => Math.floor(Math.random() * 50) + 5);
}

function computeSteps(arr: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const data = [...arr];
  const n = data.length;

  steps.push({ data: [...data], highlights: {}, description: 'Array inicial' });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      steps.push({
        data: [...data],
        highlights: { [j]: 'comparing', [j + 1]: 'comparing' },
        description: `Comparando ${data[j]} e ${data[j + 1]}`,
      });

      if (data[j] > data[j + 1]) {
        [data[j], data[j + 1]] = [data[j + 1], data[j]];
        steps.push({
          data: [...data],
          highlights: { [j]: 'swapping', [j + 1]: 'swapping' },
          description: `Trocando ${data[j + 1]} e ${data[j]}`,
        });
      }
    }

    const sorted: Record<number, 'sorted'> = {};
    for (let k = n - 1 - i; k < n; k++) sorted[k] = 'sorted';
    steps.push({
      data: [...data],
      highlights: sorted,
      description: `Posição ${n - 1 - i} definida`,
    });
  }

  const allSorted: Record<number, 'sorted'> = {};
  for (let k = 0; k < n; k++) allSorted[k] = 'sorted';
  steps.push({ data: [...data], highlights: allSorted, description: 'Ordenação concluída!' });

  return steps;
}

export default function BubbleSort() {
  const [steps, setSteps] = useState<AlgorithmStep[]>(() => computeSteps(generateArray()));
  const [currentStep, setCurrentStep] = useState(0);

  const step = steps[currentStep];
  const maxValue = Math.max(...steps[0].data);

  const handleStep = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  }, [steps.length]);

  const handleReset = useCallback(() => {
    const newSteps = computeSteps(generateArray());
    setSteps(newSteps);
    setCurrentStep(0);
  }, []);

  return (
    <AlgorithmShell
      title="Bubble Sort"
      description="Compara elementos adjacentes e troca se estiverem fora de ordem. Complexidade O(n²)."
      totalSteps={steps.length - 1}
      currentStep={currentStep}
      stepDescription={step.description}
      onStep={handleStep}
      onReset={handleReset}
      isComplete={currentStep >= steps.length - 1}
      color="#8B5CF6"
      eli5={`O Bubble Sort compara dois elementos vizinhos e troca se estão fora de ordem. Esse processo se repete do início ao fim da lista, e a cada passada completa o maior elemento "borbulha" para sua posição final.

Por que é O(n²)? No pior caso (lista invertida), cada passada move apenas um elemento para o lugar certo. São n passadas, cada uma percorrendo até n elementos. Para listas pequenas funciona bem, mas para milhares de itens fica lento.

Na prática quase nunca é usado em produção — Merge Sort e Quick Sort são muito mais eficientes. Mas o Bubble Sort é útil para entender o conceito de ordenação por comparação e a ideia de invariante de loop: após k passadas, os k maiores elementos já estão na posição correta.`}
      codeView={<AlgorithmCodeView codes={ALGORITHM_CODES['bubble-sort']} color="#8B5CF6" />}
    >
      <SortingVisualizer step={step} maxValue={maxValue} />
    </AlgorithmShell>
  );
}
