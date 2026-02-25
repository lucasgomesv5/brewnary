import { useState, useCallback } from 'react';
import AlgorithmShell from '../AlgorithmShell';
import AlgorithmCodeView from '../AlgorithmCodeView';
import { ALGORITHM_CODES } from '../algorithmCodes';
import LinkedListVisualizer from '../shared/LinkedListVisualizer';
import type { LinkedListStep, LinkedListNode } from '../types';

function computeSteps(values: number[]): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  const nodes: LinkedListNode[] = values.map((v, i) => ({ value: v, id: `n${i}` }));

  const arrows: [string, string][] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    arrows.push([nodes[i].id, nodes[i + 1].id]);
  }

  steps.push({
    nodes: [...nodes],
    arrows: [...arrows],
    pointers: { curr: nodes[0].id },
    highlights: {},
    description: `Lista original: ${values.join(' → ')}`,
    codeLine: { js: 3, py: 3, cpp: 8 },
  });

  let prevIdx = -1;
  let currIdx = 0;

  while (currIdx < nodes.length) {
    const highlights: Record<string, string> = { [nodes[currIdx].id]: 'current' };
    if (prevIdx >= 0) highlights[nodes[prevIdx].id] = 'prev';
    if (currIdx + 1 < nodes.length) highlights[nodes[currIdx + 1].id] = 'next';

    const pointers: Record<string, string> = { curr: nodes[currIdx].id };
    if (prevIdx >= 0) pointers.prev = nodes[prevIdx].id;
    if (currIdx + 1 < nodes.length) pointers.next = nodes[currIdx + 1].id;

    steps.push({
      nodes: [...nodes],
      arrows: [...arrows],
      pointers,
      highlights,
      description: `curr=${nodes[currIdx].value}${prevIdx >= 0 ? `, prev=${nodes[prevIdx].value}` : ', prev=null'}`,
      codeLine: { js: 7, py: 7, cpp: 12 },
    });

    const newArrows = arrows.filter(([from]) => from !== nodes[currIdx].id);
    if (prevIdx >= 0) {
      newArrows.push([nodes[currIdx].id, nodes[prevIdx].id]);
    }
    arrows.length = 0;
    arrows.push(...newArrows);

    steps.push({
      nodes: [...nodes],
      arrows: [...arrows],
      pointers,
      highlights: { [nodes[currIdx].id]: 'reversed' },
      description: `Inverteu: ${nodes[currIdx].value}.next = ${prevIdx >= 0 ? nodes[prevIdx].value : 'null'}`,
      codeLine: { js: 10, py: 10, cpp: 15 },
    });

    prevIdx = currIdx;
    currIdx++;

    const advPointers: Record<string, string> = { prev: nodes[prevIdx].id };
    if (currIdx < nodes.length) advPointers.curr = nodes[currIdx].id;

    const advHighlights: Record<string, string> = { [nodes[prevIdx].id]: 'prev' };
    if (currIdx < nodes.length) advHighlights[nodes[currIdx].id] = 'current';

    steps.push({
      nodes: [...nodes],
      arrows: [...arrows],
      pointers: advPointers,
      highlights: advHighlights,
      description: `Avança: prev=${nodes[prevIdx].value}, curr=${currIdx < nodes.length ? nodes[currIdx].value : 'null'}`,
      codeLine: { js: 13, py: 13, cpp: 18 },
    });
  }

  const reversedNodes = [...nodes].reverse();
  const reversedArrows: [string, string][] = [];
  for (let i = 0; i < reversedNodes.length - 1; i++) {
    reversedArrows.push([reversedNodes[i].id, reversedNodes[i + 1].id]);
  }

  steps.push({
    nodes: reversedNodes,
    arrows: reversedArrows,
    pointers: { head: reversedNodes[0].id },
    highlights: Object.fromEntries(reversedNodes.map((n) => [n.id, 'reversed'])),
    description: `Lista invertida: ${[...values].reverse().join(' → ')}`,
    codeLine: { js: 18, py: 17, cpp: 23 },
  });

  return steps;
}

export default function ReverseListVisualizer() {
  const [state, setState] = useState(() => {
    const values = [1, 2, 3, 4, 5];
    return { steps: computeSteps(values), currentStep: 0 };
  });

  const step = state.steps[state.currentStep];

  const handleStep = useCallback(() => {
    setState((s) => ({ ...s, currentStep: Math.min(s.currentStep + 1, s.steps.length - 1) }));
  }, []);

  const handleReset = useCallback(() => {
    const values = [1, 2, 3, 4, 5];
    setState({ steps: computeSteps(values), currentStep: 0 });
  }, []);

  return (
    <AlgorithmShell
      title="Reverse Linked List"
      description="Inverte uma linked list iterativamente com 3 ponteiros. O(n)."
      totalSteps={state.steps.length - 1}
      currentStep={state.currentStep}
      stepDescription={step.description}
      onStep={handleStep}
      onReset={handleReset}
      isComplete={state.currentStep >= state.steps.length - 1}
      color="#a855f7"
      eli5={`Reverter uma linked list significa inverter a direção de todos os ponteiros next. O nó que era o último vira a nova cabeça, e o que era o primeiro aponta para null.

O algoritmo usa três ponteiros: prev (inicialmente null), curr (a cabeça) e next (salvo temporariamente). A cada passo: salva curr.next em next, aponta curr.next para prev (inverte), move prev para curr, e move curr para next.

Por que três ponteiros? Ao inverter curr.next para prev, perdemos a referência ao próximo nó. Por isso salvamos em next antes da inversão. É um padrão clássico de manipulação de ponteiros.

Complexidade: O(n) tempo, O(1) espaço — percorre a lista uma vez sem criar nós novos. Existe também a versão recursiva, que é mais elegante mas usa O(n) de espaço na call stack.

Esse problema é fundamental para entender linked lists. Variações: reverter em grupos de k, reverter apenas uma parte da lista (entre posições l e r), e detectar palíndromos em linked lists.`}
      codeView={<AlgorithmCodeView codes={ALGORITHM_CODES['reverse-list']} color="#a855f7" highlightedLines={step.codeLine} />}
    >
      <LinkedListVisualizer step={step} color="#a855f7" />
    </AlgorithmShell>
  );
}
