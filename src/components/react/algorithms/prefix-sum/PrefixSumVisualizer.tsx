import { useState, useCallback } from 'react';
import AlgorithmShell from '../AlgorithmShell';
import AlgorithmCodeView from '../AlgorithmCodeView';
import { ALGORITHM_CODES } from '../algorithmCodes';
import type { ArrayCellStep } from '../types';

function computeSteps(nums: number[]): ArrayCellStep[] {
  const steps: ArrayCellStep[] = [];
  const prefix: number[] = [0];

  steps.push({
    data: nums,
    pointers: {},
    highlights: {},
    description: `Array original: [${nums.join(', ')}]`,
    codeLine: { js: 2, py: 2, cpp: 5 },
    extra: { prefix: '[0]' },
  });

  for (let i = 0; i < nums.length; i++) {
    prefix.push(prefix[i] + nums[i]);

    const highlights: Record<number, string> = { [i]: 'active' };
    steps.push({
      data: nums,
      pointers: { i },
      highlights,
      description: `prefix[${i + 1}] = prefix[${i}] + nums[${i}] = ${prefix[i]} + ${nums[i]} = ${prefix[i + 1]}`,
      codeLine: { js: 6, py: 6, cpp: 9 },
      extra: { prefix: `[${prefix.join(', ')}]` },
    });
  }

  steps.push({
    data: nums,
    pointers: {},
    highlights: {},
    description: `Prefix sum construído: [${prefix.join(', ')}]`,
    codeLine: { js: 9, py: 8, cpp: 12 },
    extra: { prefix: `[${prefix.join(', ')}]` },
  });

  const l = 2, r = 5;
  const rangeSum = prefix[r + 1] - prefix[l];
  const queryHighlights: Record<number, string> = {};
  for (let i = l; i <= r; i++) queryHighlights[i] = 'found';

  steps.push({
    data: nums,
    pointers: { l, r },
    highlights: queryHighlights,
    windowStart: l,
    windowEnd: r,
    description: `Consulta [${l}..${r}]: prefix[${r + 1}] - prefix[${l}] = ${prefix[r + 1]} - ${prefix[l]} = ${rangeSum}`,
    codeLine: { js: 14, py: 12, cpp: 17 },
    extra: { resultado: String(rangeSum), verificação: nums.slice(l, r + 1).join(' + ') + ' = ' + rangeSum },
  });

  return steps;
}

export default function PrefixSumVisualizer() {
  const [state, setState] = useState(() => {
    const nums = [3, 1, 4, 1, 5, 9, 2, 6];
    return { steps: computeSteps(nums), currentStep: 0 };
  });

  const step = state.steps[state.currentStep];

  const handleStep = useCallback(() => {
    setState((s) => ({ ...s, currentStep: Math.min(s.currentStep + 1, s.steps.length - 1) }));
  }, []);

  const handleReset = useCallback(() => {
    const nums = [3, 1, 4, 1, 5, 9, 2, 6];
    setState({ steps: computeSteps(nums), currentStep: 0 });
  }, []);

  return (
    <AlgorithmShell
      title="Prefix Sum"
      description="Pré-computa somas acumuladas para consultas de range em O(1)."
      totalSteps={state.steps.length - 1}
      currentStep={state.currentStep}
      stepDescription={step.description}
      onStep={handleStep}
      onReset={handleReset}
      isComplete={state.currentStep >= state.steps.length - 1}
      color="#F59E0B"
      eli5={`O prefix sum pré-computa as somas acumuladas de um array. prefix[i] = soma de todos os elementos do índice 0 até i. Essa construção custa O(n), mas depois qualquer soma de intervalo [l, r] pode ser calculada em O(1): prefix[r] - prefix[l-1].

Sem prefix sum, calcular a soma de um intervalo custa O(n) — percorre todos os elementos. Se houver muitas consultas (queries), o custo total seria O(n × q). Com prefix sum, cai para O(n + q).

A construção é simples: prefix[0] = arr[0], e para cada i > 0, prefix[i] = prefix[i-1] + arr[i]. A soma do intervalo [l, r] é prefix[r] - prefix[l-1] porque os termos antes de l se cancelam na subtração.

Variações: prefix sum 2D (para matrizes), difference array (operação inversa — aplica incrementos em intervalos em O(1)), e prefix XOR. É uma técnica de pré-processamento que aparece em muitos problemas de competição e em sistemas reais (tabelas de agregação, OLAP).`}
      codeView={<AlgorithmCodeView codes={ALGORITHM_CODES['prefix-sum']} color="#F59E0B" highlightedLines={step.codeLine} />}
    >
      <div className="py-2">
        <div className="flex flex-wrap justify-center gap-1">
          {step.data.map((val, i) => {
            const highlight = step.highlights[i];
            const colors: Record<string, string> = { active: '#3B82F6', found: '#10B981' };
            const bg = highlight ? colors[highlight] || '#F59E0B' : 'var(--color-bg)';
            const isH = !!highlight;
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-md border-2 font-mono text-sm font-bold transition-all duration-200"
                  style={{
                    borderColor: isH ? bg : 'var(--color-border)',
                    backgroundColor: isH ? bg : 'var(--color-bg)',
                    color: isH ? '#fff' : 'var(--color-text)',
                  }}
                >
                  {val}
                </div>
                <span className="text-[10px] text-[var(--color-text-muted)]">{i}</span>
              </div>
            );
          })}
        </div>
        {step.extra && (
          <div className="mt-3 rounded-lg border border-[var(--color-border)] p-2">
            {Object.entries(step.extra).map(([k, v]) => (
              <div key={k} className="font-mono text-[10px] text-[var(--color-text-muted)]">{k}: {v}</div>
            ))}
          </div>
        )}
      </div>
    </AlgorithmShell>
  );
}
