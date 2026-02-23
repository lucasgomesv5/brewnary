import { useState, useCallback } from 'react';
import AlgorithmShell from '../AlgorithmShell';
import AlgorithmCodeView from '../AlgorithmCodeView';
import { ALGORITHM_CODES } from '../algorithmCodes';
import StackQueueVisualizer from '../shared/StackQueueVisualizer';
import type { StackStep } from '../types';

const PAIRS: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
const OPEN = new Set(['(', '[', '{']);

function computeSteps(input: string): StackStep[] {
  const steps: StackStep[] = [];
  const stack: string[] = [];

  steps.push({
    items: [],
    highlights: {},
    description: `Validar: "${input}"`,
    codeLine: { js: 2, py: 2, cpp: 7 },
    extra: { input, posição: '0' },
  });

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];

    if (OPEN.has(ch)) {
      stack.push(ch);
      steps.push({
        items: [...stack],
        operation: 'push',
        operationValue: ch,
        highlights: { [stack.length - 1]: 'push' },
        description: `'${ch}' é abertura → push na stack`,
        codeLine: { js: 8, py: 8, cpp: 15 },
        extra: { input, posição: String(i), caractere: ch },
      });
    } else if (ch in PAIRS) {
      const expected = PAIRS[ch];

      if (stack.length === 0 || stack[stack.length - 1] !== expected) {
        steps.push({
          items: [...stack],
          highlights: stack.length > 0 ? { [stack.length - 1]: 'mismatch' } : {},
          description: `'${ch}' não combina! ${stack.length === 0 ? 'Stack vazia' : `Topo: '${stack[stack.length - 1]}' ≠ '${expected}'`}`,
          codeLine: { js: 12, py: 12, cpp: 19 },
          extra: { resultado: 'false' },
        });
        return steps;
      }

      const popped = stack.pop()!;
      steps.push({
        items: [...stack],
        operation: 'pop',
        operationValue: popped,
        highlights: stack.length > 0 ? { [stack.length - 1]: 'top' } : {},
        description: `'${ch}' combina com '${popped}' → pop`,
        codeLine: { js: 15, py: 14, cpp: 22 },
        extra: { input, posição: String(i), par: `${popped}${ch}` },
      });
    }
  }

  steps.push({
    items: [...stack],
    highlights: {},
    description: stack.length === 0 ? 'Stack vazia → válido!' : `Stack não vazia (${stack.length} restantes) → inválido`,
    codeLine: { js: 20, py: 17, cpp: 27 },
    extra: { resultado: stack.length === 0 ? 'true' : 'false' },
  });

  return steps;
}

export default function ValidParenthesesVisualizer() {
  const [state, setState] = useState(() => {
    const input = '({[]})';
    return { steps: computeSteps(input), currentStep: 0 };
  });

  const step = state.steps[state.currentStep];

  const handleStep = useCallback(() => {
    setState((s) => ({ ...s, currentStep: Math.min(s.currentStep + 1, s.steps.length - 1) }));
  }, []);

  const handleReset = useCallback(() => {
    const input = '({[]})';
    setState({ steps: computeSteps(input), currentStep: 0 });
  }, []);

  return (
    <AlgorithmShell
      title="Valid Parentheses"
      description="Valida parênteses usando stack. Push aberturas, pop e compare fechamentos."
      totalSteps={state.steps.length - 1}
      currentStep={state.currentStep}
      stepDescription={step.description}
      onStep={handleStep}
      onReset={handleReset}
      isComplete={state.currentStep >= state.steps.length - 1}
      color="#f97316"
      eli5={`O problema de parênteses válidos usa uma pilha (stack) para verificar se cada símbolo de abertura tem um correspondente de fechamento na ordem correta.

Regra: ao encontrar (, [ ou {, empilha. Ao encontrar ), ] ou }, desempilha e verifica se o topo corresponde. Se não corresponde ou a pilha está vazia quando precisa desempilhar, é inválido. No final, a pilha deve estar vazia.

Por que uma pilha? Parênteses seguem a regra LIFO — o último que abre é o primeiro que precisa fechar. Isso é exatamente o que uma pilha modela. Não funciona com uma fila porque a ordem de fechamento seria invertida.

Complexidade: O(n) tempo e O(n) espaço no pior caso (string só de aberturas). Na prática, se o tamanho for ímpar, já pode retornar falso imediatamente.

Esse conceito se aplica a parsers de compiladores, validação de HTML/XML, avaliação de expressões matemáticas, e em qualquer contexto onde há estruturas aninhadas que precisam ser balanceadas.`}
      codeView={<AlgorithmCodeView codes={ALGORITHM_CODES['valid-parentheses']} color="#f97316" highlightedLines={step.codeLine} />}
    >
      <StackQueueVisualizer step={step} color="#f97316" mode="stack" />
    </AlgorithmShell>
  );
}
