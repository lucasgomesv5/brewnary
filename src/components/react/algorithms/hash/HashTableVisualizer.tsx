import { useState, useCallback } from 'react';
import AlgorithmShell from '../AlgorithmShell';
import AlgorithmCodeView from '../AlgorithmCodeView';
import { ALGORITHM_CODES } from '../algorithmCodes';
import type { ArrayCellStep } from '../types';

const BUCKET_SIZE = 7;

function hashFn(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h + key.charCodeAt(i)) % BUCKET_SIZE;
  return h;
}

interface BucketEntry { key: string; value: string }

function computeSteps(): ArrayCellStep[] {
  const steps: ArrayCellStep[] = [];
  const buckets: BucketEntry[][] = Array.from({ length: BUCKET_SIZE }, () => []);
  const ops: [string, string][] = [['nome', 'Lucas'], ['age', '25'], ['lang', 'TS'], ['city', 'SP'], ['dev', 'true']];

  const bucketToStr = () => buckets.map((b, i) => b.length > 0 ? `[${i}]: ${b.map(e => `${e.key}→${e.value}`).join(' → ')}` : `[${i}]: vazio`).join('\n');

  steps.push({
    data: Array.from({ length: BUCKET_SIZE }, (_, i) => i),
    pointers: {},
    highlights: {},
    description: `Hash table com ${BUCKET_SIZE} buckets vazia`,
    codeLine: { js: 3, py: 3, cpp: 17 },
    extra: { Buckets: bucketToStr() },
  });

  for (const [key, value] of ops) {
    const h = hashFn(key);

    steps.push({
      data: Array.from({ length: BUCKET_SIZE }, (_, i) => i),
      pointers: { hash: h },
      highlights: { [h]: 'comparing' },
      description: `hash("${key}") = ${h}`,
      codeLine: { js: 9, py: 9, cpp: 12 },
      extra: { operação: `insert("${key}", "${value}")`, hash: String(h) },
    });

    const hasCollision = buckets[h].length > 0;
    buckets[h].push({ key, value });

    steps.push({
      data: Array.from({ length: BUCKET_SIZE }, (_, i) => i),
      pointers: { hash: h },
      highlights: { [h]: hasCollision ? 'active' : 'found' },
      description: hasCollision
        ? `Colisão no bucket ${h}! Chaining: adiciona ao final da lista`
        : `Inserido "${key}"→"${value}" no bucket ${h}`,
      codeLine: { js: 19, py: 20, cpp: 25 },
      extra: { Buckets: bucketToStr() },
    });
  }

  steps.push({
    data: Array.from({ length: BUCKET_SIZE }, (_, i) => i),
    pointers: {},
    highlights: {},
    description: 'Hash table populada! Lookup em O(1) no caso médio.',
    codeLine: { js: 25, py: 25, cpp: 31 },
    extra: { Buckets: bucketToStr() },
  });

  return steps;
}

export default function HashTableVisualizer() {
  const [steps, setSteps] = useState<ArrayCellStep[]>(() => computeSteps());
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
      title="Hash Table"
      description="Inserção com função hash e resolução de colisões por chaining."
      totalSteps={steps.length - 1}
      currentStep={currentStep}
      stepDescription={step.description}
      onStep={handleStep}
      onReset={handleReset}
      isComplete={currentStep >= steps.length - 1}
      color="#2563EB"
      eli5={`Uma hash table mapeia chaves a valores usando uma função hash, que transforma a chave num índice do array interno. Inserção, busca e remoção são O(1) na média.

Colisões acontecem quando duas chaves geram o mesmo índice. Existem duas estratégias principais: chaining (cada posição guarda uma lista ligada dos elementos que colidiram) e open addressing (procura a próxima posição livre).

O fator de carga (load factor) é a razão entre elementos e tamanho do array. Quando fica alto demais (geralmente > 0.75), a tabela faz rehashing: cria um array maior e reinsere todos os elementos. Por isso a complexidade amortizada continua O(1).

No pior caso (todas as chaves colidem), degrada para O(n). Uma boa função hash distribui as chaves uniformemente para evitar isso. Na prática, hash tables são a estrutura de dados mais usada — dicionários em Python, objetos/Maps em JavaScript, HashMaps em Java.`}
      codeView={<AlgorithmCodeView codes={ALGORITHM_CODES['hash-table']} color="#2563EB" highlightedLines={step.codeLine} />}
    >
      <div className="py-2">
        <div className="flex flex-wrap justify-center gap-1">
          {step.data.map((val, i) => {
            const highlight = step.highlights[i];
            const colors: Record<string, string> = { comparing: '#F59E0B', found: '#10B981', active: '#EC4899' };
            const bg = highlight ? colors[highlight] || '#2563EB' : 'var(--color-bg)';
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
                <span className="text-[10px] text-[var(--color-text-muted)]">[{i}]</span>
              </div>
            );
          })}
        </div>
        {step.extra && (
          <div className="mt-3 rounded-lg border border-[var(--color-border)] p-2">
            {Object.entries(step.extra).map(([k, v]) => (
              <div key={k} className="font-mono text-[10px] text-[var(--color-text-muted)] whitespace-pre-wrap">{k}: {v}</div>
            ))}
          </div>
        )}
      </div>
    </AlgorithmShell>
  );
}
