import { useState, useCallback } from 'react';
import AlgorithmShell from '../AlgorithmShell';
import AlgorithmCodeView from '../AlgorithmCodeView';
import { ALGORITHM_CODES } from '../algorithmCodes';
import IntervalVisualizer from '../shared/IntervalVisualizer';
import type { IntervalStep, Interval } from '../types';

function computeSteps(): IntervalStep[] {
  const steps: IntervalStep[] = [];
  const intervals: Interval[] = [
    { id: 'A', start: 0, end: 3, label: 'A' },
    { id: 'B', start: 1, end: 5, label: 'B' },
    { id: 'C', start: 0, end: 2, label: 'C' },
    { id: 'D', start: 3, end: 5, label: 'D' },
    { id: 'E', start: 5, end: 7, label: 'E' },
    { id: 'F', start: 6, end: 8, label: 'F' },
    { id: 'G', start: 8, end: 10, label: 'G' },
  ];

  const sorted = [...intervals].sort((a, b) => a.end - b.end);

  steps.push({
    intervals: sorted,
    selected: [],
    description: `${sorted.length} atividades ordenadas por fim. Greedy: escolha a que termina primeiro.`,
    codeLine: { js: 3, py: 3, cpp: 8 },
  });

  const selected: string[] = [];
  let lastEnd = -Infinity;

  for (const interval of sorted) {
    steps.push({
      intervals: sorted,
      current: interval.id,
      selected: [...selected],
      description: `Atividade ${interval.label} [${interval.start},${interval.end}]: ${interval.start >= lastEnd ? 'não conflita' : `conflita (start ${interval.start} < lastEnd ${lastEnd})`}`,
      codeLine: { js: 10, py: 10, cpp: 16 },
    });

    if (interval.start >= lastEnd) {
      selected.push(interval.id);
      lastEnd = interval.end;

      steps.push({
        intervals: sorted,
        current: interval.id,
        selected: [...selected],
        description: `Seleciona ${interval.label}! Total: ${selected.length}. Último fim: ${lastEnd}`,
        codeLine: { js: 12, py: 12, cpp: 18 },
      });
    }
  }

  steps.push({
    intervals: sorted,
    selected: [...selected],
    description: `Máximo de atividades não-conflitantes: ${selected.length} [${selected.join(', ')}]`,
    codeLine: { js: 17, py: 15, cpp: 23 },
  });

  return steps;
}

export default function IntervalSchedulingVisualizer() {
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
      title="Interval Scheduling (Greedy)"
      description="Seleciona máximo de atividades não-conflitantes. Ordena por fim."
      totalSteps={steps.length - 1}
      currentStep={currentStep}
      stepDescription={step.description}
      onStep={handleStep}
      onReset={handleReset}
      isComplete={currentStep >= steps.length - 1}
      color="#10B981"
      eli5={`O Interval Scheduling Maximization pergunta: dado um conjunto de intervalos (tarefas com início e fim), qual o número máximo de intervalos não-sobrepostos que podemos selecionar?

O algoritmo greedy: ordene os intervalos por tempo de término. Selecione o primeiro. Para cada próximo, selecione apenas se seu início é maior ou igual ao fim do último selecionado. Essa simples regra garante a solução ótima.

Por que funciona? Escolher o intervalo que termina mais cedo maximiza o tempo restante disponível. Pode-se provar por troca (exchange argument): se a solução ótima não inclui o intervalo que termina primeiro, podemos trocá-lo sem perder soluções — nunca fica pior.

Complexidade: O(n log n) pela ordenação, mais O(n) para a seleção linear.

Esse é um dos exemplos clássicos de algoritmo greedy com prova de corretude. Variações: interval scheduling com pesos (precisa de DP), interval partitioning (quantas salas/máquinas são necessárias para acomodar tudo), e job scheduling com deadlines e penalidades.`}
      codeView={<AlgorithmCodeView codes={ALGORITHM_CODES['interval-scheduling']} color="#10B981" highlightedLines={step.codeLine} />}
    >
      <IntervalVisualizer step={step} color="#10B981" />
    </AlgorithmShell>
  );
}
