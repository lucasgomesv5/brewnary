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
    description: 'Matemática, C/C++, estruturas de dados, algoritmos, sistemas operacionais, redes e design de sistemas.',
    color: '#8B5CF6',
    colorClass: 'text-[#8B5CF6]',
    bgClass: 'bg-[#8B5CF6]',
    icon: 'brain',
    lessonCount: 20,
    phase: 1,
  },
  {
    id: 'backend',
    title: 'Backend & Banco de Dados',
    shortTitle: 'Backend',
    description: 'Node.js, Go, Java, PHP, SQL, NoSQL, APIs REST, autenticação, cache, filas e arquitetura.',
    color: '#2563EB',
    colorClass: 'text-[#2563EB]',
    bgClass: 'bg-[#2563EB]',
    icon: 'settings',
    lessonCount: 22,
    phase: 2,
  },
  {
    id: 'frontend',
    title: 'Frontend & UI/UX',
    shortTitle: 'Frontend',
    description: 'JavaScript, TypeScript, React, Next.js, Vue.js, Angular, CSS avançado e performance.',
    color: '#EC4899',
    colorClass: 'text-[#EC4899]',
    bgClass: 'bg-[#EC4899]',
    icon: 'palette',
    lessonCount: 19,
    phase: 2,
  },
  {
    id: 'devops',
    title: 'DevOps & Fullstack',
    shortTitle: 'DevOps',
    description: 'Git avançado, Docker, CI/CD, VPS, AWS, monitoramento e arquitetura de produção.',
    color: '#F59E0B',
    colorClass: 'text-[#F59E0B]',
    bgClass: 'bg-[#F59E0B]',
    icon: 'rocket',
    lessonCount: 8,
    phase: 3,
  },
  {
    id: 'infra',
    title: 'Cloud & Infraestrutura',
    shortTitle: 'Infra',
    description: 'Virtualização, Docker deep dive, Kubernetes, AWS avançado, Terraform, observabilidade e segurança.',
    color: '#10B981',
    colorClass: 'text-[#10B981]',
    bgClass: 'bg-[#10B981]',
    icon: 'cloud',
    lessonCount: 9,
    phase: 4,
  },
  {
    id: 'ia',
    title: 'Inteligência Artificial',
    shortTitle: 'IA',
    description: 'Fundamentos de IA, redes neurais, deep learning, LLMs, agentes e prompt engineering.',
    color: '#06B6D4',
    colorClass: 'text-[#06B6D4]',
    bgClass: 'bg-[#06B6D4]',
    icon: 'bot',
    lessonCount: 9,
    phase: 5,
  },
  {
    id: 'career',
    title: 'Carreira & Extras',
    shortTitle: 'Carreira',
    description: 'Documentação, code review, SOLID, entrevistas, inglês técnico e open source.',
    color: '#EF4444',
    colorClass: 'text-[#EF4444]',
    bgClass: 'bg-[#EF4444]',
    icon: 'target',
    lessonCount: 8,
    phase: 6,
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
  devops: '#F59E0B',
  infra: '#10B981',
  ia: '#06B6D4',
  career: '#EF4444',
};
