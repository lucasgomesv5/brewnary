export interface AlgorithmStep {
  data: number[];
  highlights: Record<number, 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'active'>;
  description: string;
  codeLine?: Record<'js' | 'py' | 'cpp', number>;
}

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: string;
  to: string;
}

export interface GraphStep {
  visited: string[];
  current: string | null;
  queue: string[];
  description: string;
  edges: string[];
  codeLine?: Record<'js' | 'py' | 'cpp', number>;
}

export interface ArrayCellStep {
  data: (number | string)[];
  pointers: Record<string, number>;
  highlights: Record<number, string>;
  windowStart?: number;
  windowEnd?: number;
  description: string;
  codeLine?: Record<'js' | 'py' | 'cpp', number>;
  extra?: Record<string, string>;
}

export interface LinkedListNode {
  value: number | string;
  id: string;
}

export interface LinkedListStep {
  nodes: LinkedListNode[];
  arrows: [string, string][];
  pointers: Record<string, string>;
  highlights: Record<string, string>;
  description: string;
  codeLine?: Record<'js' | 'py' | 'cpp', number>;
}

export interface TreeNode {
  id: string;
  label: string;
  x: number;
  y: number;
  children: string[];
}

export interface TreeStep {
  nodes: TreeNode[];
  highlights: Record<string, string>;
  visitOrder: string[];
  description: string;
  codeLine?: Record<'js' | 'py' | 'cpp', number>;
}

export interface StackStep {
  items: (string | number)[];
  operation?: 'push' | 'pop' | 'peek';
  operationValue?: string | number;
  highlights: Record<number, string>;
  description: string;
  codeLine?: Record<'js' | 'py' | 'cpp', number>;
  extra?: Record<string, string>;
}

export interface Interval {
  id: string;
  start: number;
  end: number;
  label?: string;
}

export interface IntervalStep {
  intervals: Interval[];
  current?: string;
  selected: string[];
  merged?: Interval[];
  description: string;
  codeLine?: Record<'js' | 'py' | 'cpp', number>;
}

export interface BitStep {
  binary: string;
  decimal: number;
  operation?: string;
  highlightedBits: number[];
  description: string;
  codeLine?: Record<'js' | 'py' | 'cpp', number>;
  extra?: { binary2?: string; decimal2?: number; result?: string; resultDecimal?: number };
}

export interface DPCell {
  value: number | string;
  row: number;
  col: number;
}

export interface DPTableStep {
  grid: (number | string)[][];
  highlights: Record<string, string>;
  arrows?: { from: [number, number]; to: [number, number] }[];
  description: string;
  codeLine?: Record<'js' | 'py' | 'cpp', number>;
}
