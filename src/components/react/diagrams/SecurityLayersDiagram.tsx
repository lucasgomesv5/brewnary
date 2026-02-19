import AlgorithmShell from '../algorithms/AlgorithmShell';
import { DiagramCanvas, DiagramNode, DiagramEdge, DiagramGroup, COLORS } from './index';
import { useInteractiveDiagram, type DiagramStepDef } from './useInteractiveDiagram';

const STEPS: DiagramStepDef[] = [
  { description: 'Camada 1 — Rede: Firewall, WAF, DDoS Protection, CDN, VPN', activeElements: ['layer-0'] },
  { description: 'Camada 2 — Transporte: TLS 1.3, mTLS, Certificate Pinning, HSTS', activeElements: ['layer-1'] },
  { description: 'Camada 3 — Aplicação: Auth, RBAC, Input Validation, CSRF/CORS', activeElements: ['layer-2'] },
  { description: 'Camada 4 — Dados: Encryption at Rest, Hashing, Backup, Data Masking', activeElements: ['layer-3'] },
  { description: 'Camada 5 — Monitoramento: Audit Logs, SIEM, Pen Testing, Incident Response', activeElements: ['layer-4'] },
  { description: 'Defense in Depth: cada camada reduz a superfície de ataque', activeElements: ['attack-label', 'defense-label'] },
];

const layers = [
  {
    y: 30, label: 'Camada 1 — Rede', color: COLORS.red, step: 0,
    nodes: [
      { x: 60, label: 'Firewall / WAF', icon: '🛡️', sublabel: 'Bloqueia tráfego malicioso', tooltip: 'Filtra tráfego malicioso analisando pacotes e bloqueando padrões de ataque como SQL injection e XSS' },
      { x: 260, label: 'DDoS Protection', icon: '🚫', sublabel: 'Rate limiting global', tooltip: 'Absorve picos de tráfego distribuído, mantendo o serviço disponível sob ataque' },
      { x: 460, label: 'CDN Edge', icon: '🌐', sublabel: 'Filtra na borda', tooltip: 'Filtra requisições maliciosas na borda antes de chegarem à infraestrutura principal' },
      { x: 660, label: 'VPN / VPC', icon: '🔒', sublabel: 'Rede privada isolada', tooltip: 'Isola a rede em um perímetro privado, controlando todo acesso de entrada e saída' },
    ],
  },
  {
    y: 150, label: 'Camada 2 — Transporte', color: COLORS.orange, step: 1,
    nodes: [
      { x: 60, label: 'TLS 1.3', icon: '🔐', sublabel: 'Criptografia em trânsito', tooltip: 'Protocolo que criptografa dados em trânsito — versão mais rápida com 1-RTT handshake' },
      { x: 260, label: 'mTLS', icon: '🤝', sublabel: 'Autenticação mútua', tooltip: 'Autenticação mútua: tanto cliente quanto servidor apresentam certificados digitais' },
      { x: 460, label: 'Certificate Pinning', icon: '📌', sublabel: 'Previne MITM', tooltip: 'Vincula o certificado esperado ao app, prevenindo ataques Man-in-the-Middle' },
      { x: 660, label: 'HSTS', icon: '⚡', sublabel: 'Força HTTPS', tooltip: 'Header que força o browser a sempre usar HTTPS, mesmo se o usuário digitar HTTP' },
    ],
  },
  {
    y: 270, label: 'Camada 3 — Aplicação', color: COLORS.amber, step: 2,
    nodes: [
      { x: 60, label: 'Auth (JWT/OAuth)', icon: '🎫', sublabel: 'Identidade verificada', tooltip: 'Verifica identidade do usuário via tokens assinados ou protocolos de delegação como OAuth 2.0' },
      { x: 260, label: 'RBAC / ABAC', icon: '👥', sublabel: 'Controle de acesso', tooltip: 'Controle de acesso por papel (admin, editor) ou atributos (departamento, nível de acesso)' },
      { x: 460, label: 'Input Validation', icon: '✅', sublabel: 'Sanitiza toda entrada', tooltip: 'Sanitiza e valida toda entrada do usuário para prevenir injection, XSS e buffer overflow' },
      { x: 660, label: 'CSRF / CORS', icon: '🔗', sublabel: 'Proteção cross-origin', tooltip: 'Protege contra requisições cross-origin não autorizadas entre domínios diferentes' },
    ],
  },
  {
    y: 390, label: 'Camada 4 — Dados', color: COLORS.green, step: 3,
    nodes: [
      { x: 60, label: 'Encryption at Rest', icon: '💾', sublabel: 'AES-256', tooltip: 'Criptografa dados armazenados em disco com AES-256 para proteger contra acesso físico' },
      { x: 260, label: 'Hashing (bcrypt)', icon: '#️⃣', sublabel: 'Senhas seguras', tooltip: 'Transforma senhas em hashes irreversíveis com salt — inviabiliza rainbow tables' },
      { x: 460, label: 'Backup & Recovery', icon: '📋', sublabel: 'RPO < 1h', tooltip: 'Snapshots regulares com RPO < 1h permitem restaurar dados após incidentes' },
      { x: 660, label: 'Data Masking', icon: '🎭', sublabel: 'PII protegida', tooltip: 'Substitui dados sensíveis (CPF, email) por valores fictícios em ambientes não-prod' },
    ],
  },
  {
    y: 510, label: 'Camada 5 — Monitoramento', color: COLORS.cyan, step: 4,
    nodes: [
      { x: 60, label: 'Audit Logs', icon: '📝', sublabel: 'Toda ação registrada', tooltip: 'Registra toda ação significativa (login, alteração, acesso) para compliance e investigação' },
      { x: 260, label: 'SIEM / Alertas', icon: '🚨', sublabel: 'Detecção de anomalias', tooltip: 'Correlaciona logs de múltiplas fontes para detectar anomalias e ataques em tempo real' },
      { x: 460, label: 'Pen Testing', icon: '🔍', sublabel: 'Testes regulares', tooltip: 'Testes regulares de penetração simulam ataques reais para descobrir vulnerabilidades' },
      { x: 660, label: 'Incident Response', icon: '🚒', sublabel: 'Playbooks prontos', tooltip: 'Playbooks documentados para resposta rápida e coordenada a incidentes de segurança' },
    ],
  },
];

export default function SecurityLayersDiagram() {
  const d = useInteractiveDiagram(STEPS);

  return (
    <AlgorithmShell
      title="Segurança em 5 Camadas"
      description="Defense in Depth: cada camada protege contra diferentes vetores de ataque"
      totalSteps={d.totalSteps}
      currentStep={d.currentStep}
      stepDescription={d.stepDescription}
      onStep={d.handleStep}
      onReset={d.handleReset}
      isComplete={d.isComplete}
      color="#ef4444"
    >
      <DiagramCanvas width={900} height={640}>
        {layers.map((layer, li) => (
          <g key={li}>
            <DiagramGroup
              x={20} y={layer.y} width={860} height={100}
              label={layer.label} color={layer.color}
              opacity={d.getOpacity(layer.step)}
            >
              {layer.nodes.map((node, ni) => (
                <DiagramNode
                  key={ni}
                  x={node.x} y={layer.y + 28}
                  label={node.label} sublabel={node.sublabel} icon={node.icon}
                  color={layer.color} width={160} height={55}
                  opacity={d.getOpacity(layer.step)} active={d.isActive(`layer-${li}`)}
                  tooltip={node.tooltip}
                />
              ))}
            </DiagramGroup>

            {li < layers.length - 1 && (
              <DiagramEdge
                from={{ x: 450, y: layer.y + 100 }}
                to={{ x: 450, y: layers[li + 1].y }}
                color="textMuted" dashed
                opacity={d.getOpacity(layer.step + 1)}
              />
            )}
          </g>
        ))}

        <g style={{ opacity: d.getOpacity(5), transition: 'opacity 300ms ease' }}>
          <text
            x={12} y={340} textAnchor="middle" fill={COLORS.red}
            fontSize={10} fontWeight={600} fontFamily="Inter, system-ui, sans-serif"
            transform="rotate(-90, 12, 340)"
          >
            ATAQUE PENETRA →
          </text>
        </g>

        <g style={{ opacity: d.getOpacity(5), transition: 'opacity 300ms ease' }}>
          <text
            x={888} y={340} textAnchor="middle" fill={COLORS.green}
            fontSize={10} fontWeight={600} fontFamily="Inter, system-ui, sans-serif"
            transform="rotate(90, 888, 340)"
          >
            ← DEFESA EM PROFUNDIDADE
          </text>
        </g>
      </DiagramCanvas>
    </AlgorithmShell>
  );
}
