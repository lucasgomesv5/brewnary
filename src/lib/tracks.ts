export interface Track {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  color: string;
  colorClass: string;
  bgClass: string;
  icon: string;
  lessonCount: number;
  phase: number;
}

export const tracks: Track[] = [
  {
    id: 'cs',
    title: 'Ciência da Computação',
    shortTitle: 'CS',
    description: 'Fundamentos matemáticos, C, estruturas de dados, algoritmos, sistemas operacionais, compiladores, redes, sistemas distribuídos, concorrência avançada e database internals.',
    color: '#8B5CF6',
    colorClass: 'text-[#8B5CF6]',
    bgClass: 'bg-[#8B5CF6]',
    icon: 'brain',
    lessonCount: 17,
    phase: 1,
  },
  {
    id: 'backend',
    title: 'Backend & Banco de Dados',
    shortTitle: 'Backend',
    description: 'Node.js, Go, Java, Rust, SQL, NoSQL, REST, gRPC/tRPC, GraphQL, Kafka, serverless, PostgreSQL internals, API design avançado, cache, filas e arquitetura backend.',
    color: '#2563EB',
    colorClass: 'text-[#2563EB]',
    bgClass: 'bg-[#2563EB]',
    icon: 'settings',
    lessonCount: 25,
    phase: 2,
  },
  {
    id: 'frontend',
    title: 'Frontend & UI/UX',
    shortTitle: 'Frontend',
    description: 'JavaScript core, TypeScript, React, Next.js, CSS moderno, React Compiler/RSC, Web Components, micro-frontends, acessibilidade WCAG e performance web.',
    color: '#EC4899',
    colorClass: 'text-[#EC4899]',
    bgClass: 'bg-[#EC4899]',
    icon: 'palette',
    lessonCount: 17,
    phase: 2,
  },
  {
    id: 'platform',
    title: 'Plataforma & Infra',
    shortTitle: 'Platform',
    description: 'Git avançado, Docker, CI/CD, Kubernetes, AWS, Terraform, observabilidade, segurança de infraestrutura, edge computing e WebAssembly.',
    color: '#F59E0B',
    colorClass: 'text-[#F59E0B]',
    bgClass: 'bg-[#F59E0B]',
    icon: 'rocket',
    lessonCount: 11,
    phase: 3,
  },
  {
    id: 'architecture',
    title: 'Arquitetura & System Design',
    shortTitle: 'Arquitetura',
    description: 'SOLID, design patterns, arquitetura de software, hexagonal, system design e sistemas distribuídos.',
    color: '#10B981',
    colorClass: 'text-[#10B981]',
    bgClass: 'bg-[#10B981]',
    icon: 'building',
    lessonCount: 5,
    phase: 3,
  },
  {
    id: 'ia',
    title: 'Inteligência Artificial',
    shortTitle: 'IA',
    description: 'Fundamentos de IA, redes neurais, deep learning, LLMs, agentes, prompt engineering e AI para desenvolvedores (RAG, agents, MCP).',
    color: '#06B6D4',
    colorClass: 'text-[#06B6D4]',
    bgClass: 'bg-[#06B6D4]',
    icon: 'bot',
    lessonCount: 8,
    phase: 4,
  },
  {
    id: 'career',
    title: 'Carreira & Extras',
    shortTitle: 'Carreira',
    description: 'Documentação técnica, leitura de código, entrevistas técnicas e inglês técnico.',
    color: '#EF4444',
    colorClass: 'text-[#EF4444]',
    bgClass: 'bg-[#EF4444]',
    icon: 'target',
    lessonCount: 5,
    phase: 5,
  },
];

export function getTrack(id: string): Track | undefined {
  return tracks.find((t) => t.id === id);
}

export function getTrackColor(id: string): string {
  return tracks.find((t) => t.id === id)?.color ?? '#8B5CF6';
}

export function toSlug(id: string): string {
  return id.includes('/') ? id.split('/').pop()! : id;
}

export const trackColors: Record<string, string> = {
  cs: '#8B5CF6',
  backend: '#2563EB',
  frontend: '#EC4899',
  platform: '#F59E0B',
  architecture: '#10B981',
  ia: '#06B6D4',
  career: '#EF4444',
};
