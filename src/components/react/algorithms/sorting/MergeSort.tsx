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

  steps.push({ data: [...data], highlights: {}, description: 'Array inicial' });

  function merge(left: number, mid: number, right: number) {
    const hl: Record<number, 'comparing'> = {};
    for (let k = left; k <= right; k++) hl[k] = 'comparing';
    steps.push({
      data: [...data],
      highlights: hl,
      description: `Merge: posições ${left} a ${right} (divisão em ${mid})`,
    });

    const leftArr = data.slice(left, mid + 1);
    const rightArr = data.slice(mid + 1, right + 1);
    let i = 0,
      j = 0,
      k = left;

    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] <= rightArr[j]) {
        data[k] = leftArr[i];
        i++;
      } else {
        data[k] = rightArr[j];
        j++;
      }
      steps.push({
        data: [...data],
        highlights: { [k]: 'swapping' },
        description: `Posicionando ${data[k]} na posição ${k}`,
      });
      k++;
    }

    while (i < leftArr.length) {
      data[k] = leftArr[i];
      steps.push({
        data: [...data],
        highlights: { [k]: 'swapping' },
        description: `Copiando ${data[k]} da metade esquerda`,
      });
      i++;
      k++;
    }

    while (j < rightArr.length) {
      data[k] = rightArr[j];
      steps.push({
        data: [...data],
        highlights: { [k]: 'swapping' },
        description: `Copiando ${data[k]} da metade direita`,
      });
      j++;
      k++;
    }

    const sorted: Record<number, 'sorted'> = {};
    for (let m = left; m <= right; m++) sorted[m] = 'sorted';
    steps.push({
      data: [...data],
      highlights: sorted,
      description: `Subarray ${left}-${right} ordenado`,
    });
  }

  function mergeSort(left: number, right: number) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      mergeSort(left, mid);
      mergeSort(mid + 1, right);
      merge(left, mid, right);
    }
  }

  mergeSort(0, data.length - 1);

  const allSorted: Record<number, 'sorted'> = {};
  for (let k = 0; k < data.length; k++) allSorted[k] = 'sorted';
  steps.push({ data: [...data], highlights: allSorted, description: 'Ordenação concluída!' });

  return steps;
}

export default function MergeSort() {
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
      title="Merge Sort"
      description="Divide recursivamente e combina metades ordenadas. O(n log n) garantido."
      totalSteps={steps.length - 1}
      currentStep={currentStep}
      stepDescription={step.description}
      onStep={handleStep}
      onReset={handleReset}
      isComplete={currentStep >= steps.length - 1}
      color="#EC4899"
      eli5={`O Merge Sort usa a estratégia dividir para conquistar: divide a lista ao meio recursivamente até ter sublistas de 1 elemento (que já estão ordenadas por definição), e depois combina (merge) essas sublistas de volta em ordem.

A etapa de merge é a chave: com duas sublistas já ordenadas, basta comparar o primeiro elemento de cada uma e pegar o menor. Isso garante O(n) por nível de recursão.

Complexidade: sempre O(n log n), independente da entrada. O log n vem dos níveis de divisão (dividir n ao meio repetidamente) e o n vem do merge em cada nível. A desvantagem é usar O(n) de memória extra para as sublistas temporárias.

É estável (mantém a ordem relativa de elementos iguais) e previsível — por isso é a base do TimSort, usado no Python e Java.`}
      codeView={<AlgorithmCodeView codes={ALGORITHM_CODES['merge-sort']} color="#EC4899" />}
    >
      <SortingVisualizer step={step} maxValue={maxValue} />
    </AlgorithmShell>
  );
}
