export interface AlgorithmStep {
  data: number[];
  highlights: Record<number, 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'active'>;
  description: string;
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
}
