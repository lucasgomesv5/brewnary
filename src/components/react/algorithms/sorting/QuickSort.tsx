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
  const sortedFlags = new Set<number>();

  steps.push({ data: [...data], highlights: {}, description: 'Array inicial', codeLine: { js: 1, py: 1, cpp: 24 } });

  function partition(low: number, high: number) {
    const pivot = data[high];
    steps.push({
      data: [...data],
      highlights: { [high]: 'pivot' },
      description: `Pivô escolhido: ${pivot} (posição ${high})`,
      codeLine: { js: 15, py: 17, cpp: 3 },
    });

    let i = low - 1;
    for (let j = low; j < high; j++) {
      const hl: Record<number, 'comparing' | 'pivot'> = { [j]: 'comparing', [high]: 'pivot' };
      steps.push({
        data: [...data],
        highlights: hl,
        description: `Comparando ${data[j]} com pivô ${pivot}`,
        codeLine: { js: 20, py: 22, cpp: 8 },
      });

      if (data[j] <= pivot) {
        i++;
        if (i !== j) {
          [data[i], data[j]] = [data[j], data[i]];
          steps.push({
            data: [...data],
            highlights: { [i]: 'swapping', [j]: 'swapping', [high]: 'pivot' },
            description: `Trocando ${data[j]} e ${data[i]}`,
            codeLine: { js: 23, py: 25, cpp: 11 },
          });
        }
      }
    }

    [data[i + 1], data[high]] = [data[high], data[i + 1]];
    sortedFlags.add(i + 1);
    const hl: Record<number, 'sorted' | 'swapping'> = { [i + 1]: 'sorted' };
    steps.push({
      data: [...data],
      highlights: hl,
      description: `Pivô ${pivot} na posição final ${i + 1}`,
      codeLine: { js: 28, py: 28, cpp: 18 },
    });

    return i + 1;
  }

  function quickSort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      quickSort(low, pi - 1);
      quickSort(pi + 1, high);
    } else if (low === high) {
      sortedFlags.add(low);
    }
  }

  quickSort(0, data.length - 1);

  const allSorted: Record<number, 'sorted'> = {};
  for (let k = 0; k < data.length; k++) allSorted[k] = 'sorted';
  steps.push({ data: [...data], highlights: allSorted, description: 'Ordenação concluída!', codeLine: { js: 10, py: 13, cpp: 33 } });

  return steps;
}

export default function QuickSort() {
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
      title="Quick Sort"
      description="Algoritmo divide-and-conquer com partição por pivô. O(n log n) no caso médio."
      totalSteps={steps.length - 1}
      currentStep={currentStep}
      stepDescription={step.description}
      onStep={handleStep}
      onReset={handleReset}
      isComplete={currentStep >= steps.length - 1}
      color="#2563EB"
      eli5={`O Quick Sort escolhe um elemento (pivô) e reorganiza a lista: tudo menor que o pivô vai para a esquerda, tudo maior para a direita. Depois aplica o mesmo processo recursivamente em cada lado.

A partição é feita in-place, sem memória extra significativa. Dois ponteiros percorrem a lista — um buscando elementos maiores que o pivô (da esquerda) e outro buscando menores (da direita). Quando ambos encontram, trocam.

No caso médio é O(n log n), mas no pior caso (pivô sempre o menor ou maior) degrada para O(n²). A escolha do pivô importa: mediana de três, pivô aleatório ou outros métodos ajudam a evitar o pior caso.

Na prática é mais rápido que o Merge Sort para a maioria das entradas — por isso é o sort padrão em C (qsort) e na maioria das implementações de Arrays.sort. Não é estável, então elementos iguais podem trocar de posição relativa.`}
      codeView={<AlgorithmCodeView codes={ALGORITHM_CODES['quick-sort']} color="#2563EB" highlightedLines={step.codeLine} />}
    >
      <SortingVisualizer step={step} maxValue={maxValue} />
    </AlgorithmShell>
  );
}
