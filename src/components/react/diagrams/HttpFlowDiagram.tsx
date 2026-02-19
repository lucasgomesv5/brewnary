import AlgorithmShell from '../algorithms/AlgorithmShell';
import { DiagramCanvas, DiagramNode, DiagramEdge, DiagramBadge, COLORS } from './index';
import { useInteractiveDiagram, type DiagramStepDef } from './useInteractiveDiagram';

const STEPS: DiagramStepDef[] = [
  { description: 'O usuário digita a URL no browser', activeElements: ['browser'] },
  { description: 'Browser consulta o DNS Resolver para obter o IP', activeElements: ['dns', 'edge-fwd-0'] },
  { description: 'TCP Handshake: SYN → SYN-ACK → ACK', activeElements: ['tcp', 'edge-fwd-1'] },
  { description: 'TLS Handshake: troca de certificados e chaves', activeElements: ['tls', 'edge-fwd-2'] },
  { description: 'Browser envia o HTTP Request ao servidor', activeElements: ['http-req', 'edge-fwd-3'] },
  { description: 'Request chega ao servidor para processamento', activeElements: ['server', 'edge-fwd-4'] },
  { description: 'Load Balancer distribui para o backend', activeElements: ['lb', 'edge-srv-0'] },
  { description: 'Middleware valida auth, CORS, rate limit', activeElements: ['middleware', 'edge-srv-1'] },
  { description: 'Controller processa a lógica de negócio', activeElements: ['controller', 'edge-srv-2'] },
  { description: 'Database retorna os dados solicitados', activeElements: ['database'] },
  { description: 'Response volta: 200 OK com payload', activeElements: ['response', 'ret-edge-0'] },
  { description: 'TLS decifra o payload no browser', activeElements: ['tls-decrypt', 'ret-edge-1'] },
  { description: 'Browser faz parse de HTML/CSS/JS', activeElements: ['parse', 'ret-edge-2'] },
  { description: 'Render: DOM + CSSOM → Layout → Paint', activeElements: ['render', 'ret-edge-3'] },
  { description: 'Pixels renderizados na tela do usuário', activeElements: ['screen'] },
];

const nodeW = 130;
const nodeH = 65;

const FORWARD_NODES = [
  { id: 'browser', step: 0, x: 30, label: 'Browser', sublabel: 'Usuário digita URL', icon: '🌐', color: COLORS.blue, tooltip: 'Software que interpreta HTML, CSS e JS para exibir páginas web ao usuário' },
  { id: 'dns', step: 1, x: 180, label: 'DNS Resolver', sublabel: 'Resolve domínio', icon: '📡', color: COLORS.purple, tooltip: 'Converte nomes de domínio (google.com) em endereços IP numéricos' },
  { id: 'tcp', step: 2, x: 330, label: 'TCP Handshake', sublabel: 'SYN → SYN-ACK → ACK', icon: '🤝', color: COLORS.green, tooltip: 'Estabelece conexão confiável entre cliente e servidor via troca de pacotes SYN/SYN-ACK/ACK' },
  { id: 'tls', step: 3, x: 480, label: 'TLS Handshake', sublabel: 'Certificado + Chaves', icon: '🔒', color: COLORS.amber, tooltip: 'Negocia criptografia: troca certificados e gera chaves de sessão para HTTPS' },
  { id: 'http-req', step: 4, x: 630, label: 'HTTP Request', sublabel: 'GET /api/data', icon: '📤', color: COLORS.orange, tooltip: 'Mensagem do browser ao servidor contendo método, headers e path desejado' },
  { id: 'server', step: 5, x: 780, label: 'Server', sublabel: 'Processa request', icon: '⚙️', color: COLORS.cyan, tooltip: 'Recebe a requisição, executa lógica de negócio e prepara a resposta' },
];

const FORWARD_EDGES = [
  { id: 'edge-fwd-0', step: 1, from: { x: 30 + nodeW, y: 87 }, to: { x: 180, y: 87 } },
  { id: 'edge-fwd-1', step: 2, from: { x: 180 + nodeW, y: 87 }, to: { x: 330, y: 87 } },
  { id: 'edge-fwd-2', step: 3, from: { x: 330 + nodeW, y: 87 }, to: { x: 480, y: 87 } },
  { id: 'edge-fwd-3', step: 4, from: { x: 480 + nodeW, y: 87 }, to: { x: 630, y: 87 } },
  { id: 'edge-fwd-4', step: 5, from: { x: 630 + nodeW, y: 87 }, to: { x: 780, y: 87 } },
];

const SERVER_NODES = [
  { id: 'lb', step: 6, x: 200, label: 'Load Balancer', icon: '⚖️', color: COLORS.green, tooltip: 'Distribui requisições entre múltiplos servidores para evitar sobrecarga' },
  { id: 'middleware', step: 7, x: 380, label: 'Middleware', icon: '🔍', color: COLORS.amber, tooltip: 'Camada intermediária que valida autenticação, CORS e rate limiting antes do controller' },
  { id: 'controller', step: 8, x: 560, label: 'Controller', icon: '📋', color: COLORS.blue, tooltip: 'Componente que executa a lógica de negócio para a rota solicitada' },
  { id: 'database', step: 9, x: 740, label: 'Database', icon: '🗄️', color: COLORS.purple, tooltip: 'Armazena e recupera dados persistentes da aplicação' },
];

const SERVER_EDGES = [
  { id: 'edge-srv-0', step: 6, from: { x: 200 + 120, y: 222 }, to: { x: 380, y: 222 } },
  { id: 'edge-srv-1', step: 7, from: { x: 380 + 120, y: 222 }, to: { x: 560, y: 222 } },
  { id: 'edge-srv-2', step: 8, from: { x: 560 + 120, y: 222 }, to: { x: 740, y: 222 } },
];

const RETURN_NODES = [
  { id: 'response', step: 10, x: 780, label: 'Response', sublabel: '200 OK + JSON', icon: '📥', color: COLORS.cyan, tooltip: 'Resposta do servidor com status code, headers e body (HTML, JSON, etc.)' },
  { id: 'tls-decrypt', step: 11, x: 600, label: 'TLS Decrypt', sublabel: 'Decifra payload', icon: '🔓', color: COLORS.amber, tooltip: 'Browser decifra o payload usando a chave de sessão negociada no handshake' },
  { id: 'parse', step: 12, x: 420, label: 'Parse', sublabel: 'HTML/CSS/JS', icon: '📄', color: COLORS.green, tooltip: 'Browser interpreta HTML, CSS e JavaScript recebidos do servidor' },
  { id: 'render', step: 13, x: 240, label: 'Render', sublabel: 'DOM + CSSOM → Paint', icon: '🎨', color: COLORS.pink, tooltip: 'Constrói DOM + CSSOM, calcula layout e pinta pixels na tela' },
  { id: 'screen', step: 14, x: 60, label: 'Tela', sublabel: 'Pixels renderizados', icon: '🖥️', color: COLORS.blue, tooltip: 'O resultado final: página visível e interativa para o usuário' },
];

const RETURN_EDGES = [
  { id: 'ret-edge-0', step: 10, from: { x: 780, y: 342 }, to: { x: 600 + nodeW, y: 342 } },
  { id: 'ret-edge-1', step: 11, from: { x: 600, y: 342 }, to: { x: 420 + nodeW, y: 342 } },
  { id: 'ret-edge-2', step: 12, from: { x: 420, y: 342 }, to: { x: 240 + nodeW, y: 342 } },
  { id: 'ret-edge-3', step: 13, from: { x: 240, y: 342 }, to: { x: 60 + nodeW, y: 342 } },
];

const TIMINGS = [
  { id: 'timing-dns', step: 1, x: 150, y: 420, text: 'DNS: ~20-120ms' },
  { id: 'timing-tcp', step: 2, x: 350, y: 420, text: 'TCP: ~1-50ms' },
  { id: 'timing-tls', step: 3, x: 550, y: 420, text: 'TLS: ~50-150ms' },
  { id: 'timing-ttfb', step: 5, x: 750, y: 420, text: 'TTFB: ~50-500ms' },
];

export default function HttpFlowDiagram() {
  const d = useInteractiveDiagram(STEPS);

  return (
    <AlgorithmShell
      title="Fluxo de um Request HTTP"
      description="Cada etapa do caminho de uma requisição HTTP"
      totalSteps={d.totalSteps}
      currentStep={d.currentStep}
      stepDescription={d.stepDescription}
      onStep={d.handleStep}
      onReset={d.handleReset}
      isComplete={d.isComplete}
      color="#3b82f6"
    >
      <DiagramCanvas width={960} height={500}>
        {/* Title label — Ida */}
        <g style={{ opacity: d.getOpacity(0), transition: 'opacity 300ms ease' }}>
          <text x={480} y={30} textAnchor="middle" fill={COLORS.text} fontSize={14} fontWeight={700} fontFamily="Inter, system-ui, sans-serif">
            Ida — Request
          </text>
        </g>

        {/* Forward path nodes */}
        {FORWARD_NODES.map((n) => (
          <DiagramNode
            key={n.id}
            x={n.x} y={55} label={n.label} sublabel={n.sublabel} icon={n.icon} color={n.color}
            width={nodeW} height={nodeH}
            opacity={d.getOpacity(n.step)} active={d.isActive(n.id)}
            tooltip={n.tooltip}
          />
        ))}

        {/* Forward path edges */}
        {FORWARD_EDGES.map((e) => (
          <DiagramEdge key={e.id} from={e.from} to={e.to} color="orange" opacity={d.getOpacity(e.step)} />
        ))}

        {/* Step number badges */}
        {FORWARD_NODES.map((n, i) => (
          <DiagramBadge key={`badge-${n.id}`} x={n.x + nodeW / 2} y={45} text={`${i + 1}`} type="info" opacity={d.getOpacity(n.step)} />
        ))}

        {/* Server processing label */}
        <g style={{ opacity: d.getOpacity(6), transition: 'opacity 300ms ease' }}>
          <text x={480} y={180} textAnchor="middle" fill={COLORS.textMuted} fontSize={11} fontFamily="Inter, system-ui, sans-serif">
            Processamento no servidor
          </text>
        </g>

        {/* Server processing nodes */}
        {SERVER_NODES.map((n) => (
          <DiagramNode
            key={n.id}
            x={n.x} y={195} label={n.label} icon={n.icon} color={n.color}
            width={120} height={55}
            opacity={d.getOpacity(n.step)} active={d.isActive(n.id)}
            tooltip={n.tooltip}
          />
        ))}

        {/* Server processing edges */}
        {SERVER_EDGES.map((e) => (
          <DiagramEdge key={e.id} from={e.from} to={e.to} color="blue" opacity={d.getOpacity(e.step)} />
        ))}

        {/* Return path label */}
        <g style={{ opacity: d.getOpacity(10), transition: 'opacity 300ms ease' }}>
          <text x={480} y={295} textAnchor="middle" fill={COLORS.text} fontSize={14} fontWeight={700} fontFamily="Inter, system-ui, sans-serif">
            Volta — Response
          </text>
        </g>

        {/* Return path nodes */}
        {RETURN_NODES.map((n) => (
          <DiagramNode
            key={n.id}
            x={n.x} y={310} label={n.label} sublabel={n.sublabel} icon={n.icon} color={n.color}
            width={nodeW} height={nodeH}
            opacity={d.getOpacity(n.step)} active={d.isActive(n.id)}
            tooltip={n.tooltip}
          />
        ))}

        {/* Return path edges */}
        {RETURN_EDGES.map((e) => (
          <DiagramEdge key={e.id} from={e.from} to={e.to} color="cyan" opacity={d.getOpacity(e.step)} />
        ))}

        {/* Timing annotations */}
        {TIMINGS.map((t) => (
          <g key={t.id} style={{ opacity: d.getOpacity(t.step), transition: 'opacity 300ms ease' }}>
            <rect x={t.x - 60} y={t.y - 10} width={120} height={22} rx={4} fill={COLORS.bg} stroke={COLORS.border} strokeWidth={1} />
            <text x={t.x} y={t.y + 4} textAnchor="middle" fill={COLORS.textMuted} fontSize={9} fontFamily="'JetBrains Mono', monospace">
              {t.text}
            </text>
          </g>
        ))}

        {/* Total timing */}
        <g style={{ opacity: d.getOpacity(14), transition: 'opacity 300ms ease' }}>
          <rect x={340} y={455} width={280} height={28} rx={6} fill={COLORS.bg} stroke={COLORS.green} strokeWidth={1} />
          <text x={480} y={473} textAnchor="middle" fill={COLORS.green} fontSize={11} fontWeight={600} fontFamily="'JetBrains Mono', monospace">
            Total: ~200ms - 2s (típico)
          </text>
        </g>
      </DiagramCanvas>
    </AlgorithmShell>
  );
}
