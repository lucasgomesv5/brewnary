import { useState, useCallback } from 'react';
import AlgorithmShell from '../AlgorithmShell';
import AlgorithmCodeView from '../AlgorithmCodeView';
import { ALGORITHM_CODES } from '../algorithmCodes';

interface SearchStep {
  data: number[];
  low: number;
  high: number;
  mid: number;
  target: number;
  found: boolean | null;
  description: string;
}

function generateSortedArray(): number[] {
  const arr: number[] = [];
  let val = Math.floor(Math.random() * 5) + 1;
  for (let i = 0; i < 15; i++) {
    arr.push(val);
    val += Math.floor(Math.random() * 6) + 1;
  }
  return arr;
}

function computeSteps(arr: number[]): SearchStep[] {
  const target = arr[Math.floor(Math.random() * arr.length)];
  const steps: SearchStep[] = [];

  steps.push({
    data: arr,
    low: 0,
    high: arr.length - 1,
    mid: -1,
    target,
    found: null,
    description: `Buscando ${target} no array ordenado`,
  });

  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    steps.push({
      data: arr,
      low,
      high,
      mid,
      target,
      found: null,
      description: `mid=${mid}, valor=${arr[mid]}. Comparando com ${target}`,
    });

    if (arr[mid] === target) {
      steps.push({
        data: arr,
        low,
        high,
        mid,
        target,
        found: true,
        description: `Encontrado! ${target} está na posição ${mid}`,
      });
      return steps;
    } else if (arr[mid] < target) {
      steps.push({
        data: arr,
        low,
        high,
        mid,
        target,
        found: null,
        description: `${arr[mid]} < ${target}, descartando metade esquerda`,
      });
      low = mid + 1;
    } else {
      steps.push({
        data: arr,
        low,
        high,
        mid,
        target,
        found: null,
        description: `${arr[mid]} > ${target}, descartando metade direita`,
      });
      high = mid - 1;
    }
  }

  steps.push({
    data: arr,
    low,
    high,
    mid: -1,
    target,
    found: false,
    description: `${target} não encontrado no array`,
  });
  return steps;
}

export default function BinarySearchVisualizer() {
  const [steps, setSteps] = useState<SearchStep[]>(() => computeSteps(generateSortedArray()));
  const [currentStep, setCurrentStep] = useState(0);

  const step = steps[currentStep];

  const handleStep = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  }, [steps.length]);

  const handleReset = useCallback(() => {
    const newSteps = computeSteps(generateSortedArray());
    setSteps(newSteps);
    setCurrentStep(0);
  }, []);

  return (
    <AlgorithmShell
      title="Binary Search"
      description="Busca em array ordenado dividindo o espaço pela metade. Complexidade O(log n)."
      totalSteps={steps.length - 1}
      currentStep={currentStep}
      stepDescription={step.description}
      onStep={handleStep}
      onReset={handleReset}
      isComplete={currentStep >= steps.length - 1}
      color="#10B981"
      eli5={`A busca binária funciona em listas ordenadas. Compara o elemento do meio com o alvo: se é igual, encontrou. Se o alvo é menor, descarta a metade direita. Se é maior, descarta a esquerda. Repete até encontrar ou a lista ficar vazia.

Cada comparação elimina metade dos elementos restantes. Por isso a complexidade é O(log n) — para uma lista de 1 milhão de elementos, no máximo 20 comparações bastam.

Pré-requisito fundamental: a lista precisa estar ordenada. Se não estiver, primeiro ordene (O(n log n)) ou use outra estrutura.

Variações importantes: lower_bound (primeiro elemento ≥ alvo), upper_bound (primeiro elemento > alvo), e busca em espaço contínuo (bisection method). É a base para entender árvores binárias de busca, B-trees e muitas otimizações em bancos de dados.`}
      codeView={<AlgorithmCodeView codes={ALGORITHM_CODES['binary-search']} color="#10B981" />}
    >
      <div className="py-4">
        <div className="mb-4 text-center">
          <span className="text-xs text-[var(--color-text-muted)]">
            Alvo: <span className="font-bold text-[var(--color-text)]">{step.target}</span>
          </span>
        </div>
        <div className="flex items-center justify-center gap-1">
          {step.data.map((value, i) => {
            const isLow = i === step.low;
            const isHigh = i === step.high;
            const isMid = i === step.mid;
            const inRange = i >= step.low && i <= step.high;
            const isFound = step.found === true && isMid;

            let bg = 'var(--color-border)';
            let textColor = 'var(--color-text-muted)';

            if (isFound) {
              bg = '#10B981';
              textColor = '#fff';
            } else if (isMid) {
              bg = '#F59E0B';
              textColor = '#fff';
            } else if (inRange) {
              bg = 'var(--color-accent)';
              textColor = '#fff';
            }

            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded font-mono text-xs font-medium transition-all duration-200"
                  style={{ backgroundColor: bg, color: textColor }}
                >
                  {value}
                </div>
                <div className="h-4 font-mono text-[9px] text-[var(--color-text-muted)]">
                  {isMid && 'mid'}
                  {isLow && !isMid && 'low'}
                  {isHigh && !isMid && !isLow && 'high'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AlgorithmShell>
  );
}
