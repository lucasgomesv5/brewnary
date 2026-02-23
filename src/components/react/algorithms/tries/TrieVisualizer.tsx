import { useState, useCallback } from 'react';
import AlgorithmShell from '../AlgorithmShell';
import AlgorithmCodeView from '../AlgorithmCodeView';
import { ALGORITHM_CODES } from '../algorithmCodes';
import TreeVisualizer from '../shared/TreeVisualizer';
import type { TreeStep, TreeNode } from '../types';

interface TrieNode {
  char: string;
  children: Map<string, TrieNode>;
  isEnd: boolean;
  id: string;
}

let nodeCounter = 0;

function createTrieNode(char: string): TrieNode {
  return { char, children: new Map(), isEnd: false, id: `t${nodeCounter++}` };
}

function trieToTreeNodes(root: TrieNode): TreeNode[] {
  const nodes: TreeNode[] = [];
  const queue: { node: TrieNode; level: number; posInLevel: number; totalInLevel: number }[] = [];

  function countByLevel(node: TrieNode, level: number, counts: Map<number, number>) {
    counts.set(level, (counts.get(level) || 0) + 1);
    for (const child of node.children.values()) {
      countByLevel(child, level + 1, counts);
    }
  }

  const levelCounts = new Map<number, number>();
  countByLevel(root, 0, levelCounts);

  const levelPositions = new Map<number, number>();

  function assignPositions(node: TrieNode, level: number) {
    const pos = levelPositions.get(level) || 0;
    levelPositions.set(level, pos + 1);

    const total = levelCounts.get(level) || 1;
    const spacing = 380 / (total + 1);
    const x = spacing * (pos + 1) + 10;
    const y = 30 + level * 55;

    const children: string[] = [];
    for (const child of node.children.values()) {
      children.push(child.id);
    }

    const label = node.char === '' ? 'root' : (node.isEnd ? `${node.char}*` : node.char);
    nodes.push({ id: node.id, label, x, y, children });

    for (const child of node.children.values()) {
      assignPositions(child, level + 1);
    }
  }

  assignPositions(root, 0);
  return nodes;
}

function computeSteps(): TreeStep[] {
  const steps: TreeStep[] = [];
  nodeCounter = 0;
  const root = createTrieNode('');
  const words = ['cat', 'car', 'dog'];

  steps.push({
    nodes: trieToTreeNodes(root),
    highlights: {},
    visitOrder: [],
    description: `Inserir palavras: [${words.join(', ')}]`,
    codeLine: { js: 8, py: 6, cpp: 10 },
  });

  for (const word of words) {
    let current = root;

    steps.push({
      nodes: trieToTreeNodes(root),
      highlights: { [root.id]: 'current' },
      visitOrder: [],
      description: `Inserindo "${word}": começa na raiz`,
      codeLine: { js: 12, py: 11, cpp: 17 },
    });

    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      const existed = current.children.has(ch);

      if (!existed) {
        current.children.set(ch, createTrieNode(ch));
      }

      const child = current.children.get(ch)!;

      steps.push({
        nodes: trieToTreeNodes(root),
        highlights: { [child.id]: existed ? 'comparing' : 'inserting' },
        visitOrder: [],
        description: existed
          ? `'${ch}' já existe no nó → segue`
          : `'${ch}' não existe → cria novo nó`,
        codeLine: { js: 16, py: 15, cpp: 21 },
      });

      current = child;
    }

    current.isEnd = true;

    steps.push({
      nodes: trieToTreeNodes(root),
      highlights: { [current.id]: 'endOfWord' },
      visitOrder: [],
      description: `Marca '${current.char}' como fim de palavra "${word}"`,
      codeLine: { js: 24, py: 21, cpp: 29 },
    });
  }

  steps.push({
    nodes: trieToTreeNodes(root),
    highlights: {},
    visitOrder: words,
    description: `Trie construída com ${words.length} palavras!`,
    codeLine: { js: 26, py: 21, cpp: 31 },
  });

  return steps;
}

export default function TrieVisualizer() {
  const [steps, setSteps] = useState<TreeStep[]>(() => computeSteps());
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
      title="Trie Insert"
      description="Insere palavras na Trie (prefix tree). Busca por prefixo em O(m)."
      totalSteps={steps.length - 1}
      currentStep={currentStep}
      stepDescription={step.description}
      onStep={handleStep}
      onReset={handleReset}
      isComplete={currentStep >= steps.length - 1}
      color="#06B6D4"
      eli5={`Uma Trie (prefix tree) é uma árvore onde cada aresta representa um caractere e cada caminho da raiz até um nó marcado forma uma palavra. Palavras com prefixo comum compartilham os mesmos nós iniciais.

Inserção: percorre a trie caractere por caractere. Se o nó-filho para aquele caractere já existe, desce. Se não, cria um novo nó. No final, marca o nó como fim de palavra.

Busca: percorre da mesma forma. Se em algum ponto o caractere não existe como filho, a palavra não está na trie. Se chega ao final e o nó está marcado, encontrou.

Complexidade: inserção e busca são O(m), onde m é o comprimento da palavra — independente de quantas palavras a trie contém. Comparado com hash tables, a trie não precisa de função hash e permite buscas por prefixo naturalmente.

Aplicações: autocomplete (sugestões ao digitar), corretor ortográfico, roteamento IP (longest prefix match), dicionários de jogos como Scrabble, e compressão (radix tree / Patricia tree). É a estrutura por trás da busca por prefixo em muitos sistemas.`}
      codeView={<AlgorithmCodeView codes={ALGORITHM_CODES['trie-insert']} color="#06B6D4" highlightedLines={step.codeLine} />}
    >
      <TreeVisualizer step={step} color="#06B6D4" height={280} />
    </AlgorithmShell>
  );
}
