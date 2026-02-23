import { useState, useCallback } from 'react';
import AlgorithmShell from '../AlgorithmShell';
import AlgorithmCodeView from '../AlgorithmCodeView';
import { ALGORITHM_CODES } from '../algorithmCodes';
import IntervalVisualizer from '../shared/IntervalVisualizer';
import type { IntervalStep, Interval } from '../types';

function computeSteps(): IntervalStep[] {
  const steps: IntervalStep[] = [];
  const intervals: Interval[] = [
    { id: 'i0', start: 1, end: 3, label: '[1,3]' },
    { id: 'i1', start: 2, end: 6, label: '[2,6]' },
    { id: 'i2', start: 8, end: 12, label: '[8,12]' },
    { id: 'i3', start: 10, end: 11, label: '[10,11]' },
    { id: 'i4', start: 13, end: 18, label: '[13,18]' },
  ];

  const sorted = [...intervals].sort((a, b) => a.start - b.start);

  steps.push({
    intervals: sorted,
    selected: [],
    description: `${sorted.length} intervalos ordenados por start.`,
    codeLine: { js: 3, py: 3, cpp: 8 },
  });

  const merged: Interval[] = [{ ...sorted[0] }];
  let mergedIdx = 0;

  steps.push({
    intervals: sorted,
    current: sorted[0].id,
    selected: [sorted[0].id],
    merged: merged.map((m, i) => ({ ...m, id: `m${i}`, label: `[${m.start},${m.end}]` })),
    description: `Começa com ${sorted[0].label}`,
    codeLine: { js: 5, py: 5, cpp: 10 },
  });

  for (let i = 1; i < sorted.length; i++) {
    const curr = sorted[i];
    const last = merged[merged.length - 1];

    steps.push({
      intervals: sorted,
      current: curr.id,
      selected: sorted.slice(0, i).map((s) => s.id),
      merged: merged.map((m, j) => ({ ...m, id: `m${j}`, label: `[${m.start},${m.end}]` })),
      description: `Compara ${curr.label} com último merged [${last.start},${last.end}]: ${curr.start <= last.end ? 'overlap!' : 'sem overlap'}`,
      codeLine: { js: 11, py: 11, cpp: 16 },
    });

    if (curr.start <= last.end) {
      last.end = Math.max(last.end, curr.end);
      last.label = `[${last.start},${last.end}]`;

      steps.push({
        intervals: sorted,
        current: curr.id,
        selected: sorted.slice(0, i + 1).map((s) => s.id),
        merged: merged.map((m, j) => ({ ...m, id: `m${j}`, label: `[${m.start},${m.end}]` })),
        description: `Merge! → [${last.start},${last.end}]`,
        codeLine: { js: 13, py: 13, cpp: 18 },
      });
    } else {
      merged.push({ ...curr });

      steps.push({
        intervals: sorted,
        current: curr.id,
        selected: sorted.slice(0, i + 1).map((s) => s.id),
        merged: merged.map((m, j) => ({ ...m, id: `m${j}`, label: `[${m.start},${m.end}]` })),
        description: `Sem overlap. Novo intervalo: ${curr.label}`,
        codeLine: { js: 16, py: 16, cpp: 21 },
      });
    }
  }

  steps.push({
    intervals: sorted,
    selected: sorted.map((s) => s.id),
    merged: merged.map((m, j) => ({ ...m, id: `m${j}`, label: `[${m.start},${m.end}]` })),
    description: `Resultado: [${merged.map((m) => `[${m.start},${m.end}]`).join(', ')}]`,
    codeLine: { js: 20, py: 18, cpp: 25 },
  });

  return steps;
}

export default function MergeIntervalsVisualizer() {
  const [steps, setSteps] = useState<IntervalStep[]>(() => computeSteps());
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
      title="Merge Intervals"
      description="Ordena por start e merge intervalos sobrepostos. O(n log n)."
      totalSteps={steps.length - 1}
      currentStep={currentStep}
      stepDescription={step.description}
      onStep={handleStep}
      onReset={handleReset}
      isComplete={currentStep >= steps.length - 1}
      color="#a855f7"
      eli5={`Merge Intervals combina intervalos sobrepostos em intervalos maiores. Dado [[1,3], [2,6], [8,10], [15,18]], o resultado é [[1,6], [8,10], [15,18]] porque [1,3] e [2,6] se sobrepõem.

O algoritmo: ordene por início. Pegue o primeiro intervalo como "atual". Para cada próximo, se o início é menor ou igual ao fim do atual, estenda o fim do atual (max dos dois fins). Senão, feche o atual e comece um novo.

Por que ordenar por início? Garante que ao processar cada intervalo, já vimos todos os que poderiam se sobrepor com ele pela esquerda. Se o próximo começa depois do atual terminar, não há sobreposição possível com nenhum anterior.

Complexidade: O(n log n) pela ordenação, O(n) para o merge linear. Espaço O(n) para o resultado.

Aplicações práticas: mesclar horários em calendários, consolidar ranges de IP, simplificar intervalos de cobertura de testes, e merge de segmentos em bancos de dados. Variações incluem insert interval (inserir um novo intervalo numa lista já ordenada e mergida) e interval intersection.`}
      codeView={<AlgorithmCodeView codes={ALGORITHM_CODES['merge-intervals']} color="#a855f7" highlightedLines={step.codeLine} />}
    >
      <IntervalVisualizer step={step} color="#a855f7" />
    </AlgorithmShell>
  );
}
