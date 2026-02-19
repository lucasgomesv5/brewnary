import AlgorithmShell from '../algorithms/AlgorithmShell';
import { DiagramCanvas, DiagramNode, DiagramEdge, DiagramGroup, DiagramBadge, COLORS } from './index';
import { useInteractiveDiagram, type DiagramStepDef } from './useInteractiveDiagram';

const STEPS: DiagramStepDef[] = [
  { description: 'Fase 1 — MVP: aplicação monolítica simples', activeElements: ['monolith'] },
  { description: 'Banco de dados único: PostgreSQL single instance', activeElements: ['pg', 'edge-p1-1'] },
  { description: 'Hospedagem em PaaS + static files servidos pelo app', activeElements: ['paas', 'static', 'edge-p1-2', 'edge-p1-3'] },
  { description: 'Fase 2 — Growth: Load Balancer distribui tráfego', activeElements: ['lb'] },
  { description: 'Réplicas de app + DB com read-replica + cache Redis + CDN', activeElements: ['app1', 'app2', 'primary-db', 'replica', 'redis', 'cdn', 's3', 'edge-p2-1', 'edge-p2-2', 'edge-p2-3', 'edge-p2-4', 'edge-p2-5'] },
  { description: 'Fase 3 — Scale: API Gateway + microsserviços', activeElements: ['apigw', 'auth', 'users', 'orders', 'broker', 'edge-p3-1', 'edge-p3-2', 'edge-p3-3', 'edge-p3-4'] },
  { description: 'Kubernetes orquestra + observabilidade completa', activeElements: ['k8s', 'observability', 'edge-p3-5', 'edge-p3-6'] },
];

export default function ArchitectureEvolutionDiagram() {
  const d = useInteractiveDiagram(STEPS);

  return (
    <AlgorithmShell
      title="Evolução de Arquitetura"
      description="MVP → Growth → Scale: como a arquitetura cresce com a demanda"
      totalSteps={d.totalSteps}
      currentStep={d.currentStep}
      stepDescription={d.stepDescription}
      onStep={d.handleStep}
      onReset={d.handleReset}
      isComplete={d.isComplete}
      color="#22c55e"
    >
      <DiagramCanvas width={1000} height={580}>
        {/* Phase 1: MVP */}
        <DiagramGroup x={20} y={20} width={290} height={520} label="Fase 1 — MVP" color={COLORS.green} opacity={d.getOpacity(0)}>
          <DiagramBadge x={165} y={55} text="0-1K users" type="info" />

          <DiagramNode
            x={80} y={70} label="Monolito" sublabel="Node.js + Express" icon="📦"
            color={COLORS.green} width={160} height={60}
            opacity={d.getOpacity(0)} active={d.isActive('monolith')}
            tooltip="Uma única aplicação com todo o código junto — simples de desenvolver e fazer deploy"
          />
          <DiagramNode
            x={80} y={160} label="PostgreSQL" sublabel="Single instance" icon="🗄️"
            color={COLORS.blue} width={160} height={55}
            opacity={d.getOpacity(1)} active={d.isActive('pg')}
            tooltip="Banco relacional robusto, ideal para MVP por suportar JSON, full-text search e transações ACID"
          />
          <DiagramNode
            x={80} y={240} label="Heroku / Railway" sublabel="PaaS simples" icon="☁️"
            color={COLORS.purple} width={160} height={55}
            opacity={d.getOpacity(2)} active={d.isActive('paas')}
            tooltip="Plataforma-as-a-Service que abstrai infraestrutura — deploy com git push"
          />
          <DiagramNode
            x={80} y={320} label="Static Files" sublabel="Servido pelo app" icon="📁"
            color={COLORS.textMuted} width={160} height={55}
            opacity={d.getOpacity(2)} active={d.isActive('static')}
            tooltip="Arquivos CSS, JS e imagens servidos diretamente pela aplicação monolítica"
          />

          <DiagramEdge from={{ x: 160, y: 130 }} to={{ x: 160, y: 160 }} color="green" opacity={d.getOpacity(1)} />
          <DiagramEdge from={{ x: 160, y: 215 }} to={{ x: 160, y: 240 }} color="purple" opacity={d.getOpacity(2)} />
          <DiagramEdge from={{ x: 160, y: 295 }} to={{ x: 160, y: 320 }} color="textMuted" dashed opacity={d.getOpacity(2)} />

          <g style={{ opacity: d.getOpacity(2), transition: 'opacity 300ms ease' }}>
            <text x={50} y={410} fill={COLORS.green} fontSize={10} fontWeight={600} fontFamily="Inter, system-ui, sans-serif">Prós:</text>
            <text x={50} y={425} fill={COLORS.textMuted} fontSize={9} fontFamily="Inter, system-ui, sans-serif">• Deploy em minutos</text>
            <text x={50} y={438} fill={COLORS.textMuted} fontSize={9} fontFamily="Inter, system-ui, sans-serif">• Time-to-market rápido</text>
            <text x={50} y={451} fill={COLORS.textMuted} fontSize={9} fontFamily="Inter, system-ui, sans-serif">• Custo mínimo ($7-25/mês)</text>
            <text x={50} y={472} fill={COLORS.red} fontSize={10} fontWeight={600} fontFamily="Inter, system-ui, sans-serif">Contras:</text>
            <text x={50} y={487} fill={COLORS.textMuted} fontSize={9} fontFamily="Inter, system-ui, sans-serif">• SPOF (single point of failure)</text>
            <text x={50} y={500} fill={COLORS.textMuted} fontSize={9} fontFamily="Inter, system-ui, sans-serif">• Sem auto-scaling</text>
          </g>
        </DiagramGroup>

        {/* Phase 2: Growth */}
        <DiagramGroup x={340} y={20} width={290} height={520} label="Fase 2 — Growth" color={COLORS.amber} opacity={d.getOpacity(3)}>
          <DiagramBadge x={485} y={55} text="1K-50K users" type="load" opacity={d.getOpacity(3)} />

          <DiagramNode
            x={380} y={70} label="Load Balancer" sublabel="Nginx / ALB" icon="⚖️"
            color={COLORS.amber} width={160} height={55}
            opacity={d.getOpacity(3)} active={d.isActive('lb')}
            tooltip="Distribui tráfego entre réplicas da aplicação — Nginx ou AWS ALB"
          />
          <DiagramNode
            x={370} y={150} label="App 1" icon="📦" color={COLORS.blue} width={70} height={45}
            opacity={d.getOpacity(4)} active={d.isActive('app1')}
            tooltip="Réplica horizontal da aplicação para suportar mais requisições simultâneas"
          />
          <DiagramNode
            x={480} y={150} label="App 2" icon="📦" color={COLORS.blue} width={70} height={45}
            opacity={d.getOpacity(4)} active={d.isActive('app2')}
            tooltip="Segunda réplica da aplicação — redundância e maior capacidade"
          />
          <DiagramNode
            x={380} y={220} label="Primary DB" sublabel="PostgreSQL" icon="🗄️"
            color={COLORS.cyan} width={110} height={55}
            opacity={d.getOpacity(4)} active={d.isActive('primary-db')}
            tooltip="Instância principal do banco que aceita leituras e escritas"
          />
          <DiagramNode
            x={510} y={220} label="Replica" sublabel="Read-only" icon="📖"
            color={COLORS.cyan} width={100} height={55}
            opacity={d.getOpacity(4)} active={d.isActive('replica')}
            tooltip="Cópia read-only do banco para distribuir carga de leituras"
          />
          <DiagramNode
            x={380} y={300} label="Redis" sublabel="Cache + Sessions" icon="⚡"
            color={COLORS.red} width={110} height={55}
            opacity={d.getOpacity(4)} active={d.isActive('redis')}
            tooltip="Cache in-memory para sessões, cache de queries e dados temporários — latência < 1ms"
          />
          <DiagramNode
            x={510} y={300} label="CDN" sublabel="Static assets" icon="🌐"
            color={COLORS.orange} width={100} height={55}
            opacity={d.getOpacity(4)} active={d.isActive('cdn')}
            tooltip="Content Delivery Network para servir assets estáticos mais perto do usuário"
          />
          <DiagramNode
            x={380} y={370} label="S3" sublabel="Upload files" icon="🪣"
            color={COLORS.green} width={230} height={45}
            opacity={d.getOpacity(4)} active={d.isActive('s3')}
            tooltip="Object storage para uploads de arquivos (imagens, PDFs, vídeos)"
          />

          <DiagramEdge from={{ x: 430, y: 125 }} to={{ x: 405, y: 150 }} color="amber" opacity={d.getOpacity(4)} />
          <DiagramEdge from={{ x: 500, y: 125 }} to={{ x: 515, y: 150 }} color="amber" opacity={d.getOpacity(4)} />
          <DiagramEdge from={{ x: 405, y: 195 }} to={{ x: 435, y: 220 }} color="blue" opacity={d.getOpacity(4)} />
          <DiagramEdge from={{ x: 490, y: 247 }} to={{ x: 510, y: 247 }} color="cyan" dashed label="Replica" opacity={d.getOpacity(4)} />
          <DiagramEdge from={{ x: 435, y: 275 }} to={{ x: 435, y: 300 }} color="red" opacity={d.getOpacity(4)} />

          <g style={{ opacity: d.getOpacity(4), transition: 'opacity 300ms ease' }}>
            <text x={370} y={435} fill={COLORS.green} fontSize={10} fontWeight={600} fontFamily="Inter, system-ui, sans-serif">Prós:</text>
            <text x={370} y={450} fill={COLORS.textMuted} fontSize={9} fontFamily="Inter, system-ui, sans-serif">• Redundância horizontal</text>
            <text x={370} y={463} fill={COLORS.textMuted} fontSize={9} fontFamily="Inter, system-ui, sans-serif">• Cache reduz latência 10x</text>
            <text x={370} y={484} fill={COLORS.red} fontSize={10} fontWeight={600} fontFamily="Inter, system-ui, sans-serif">Contras:</text>
            <text x={370} y={499} fill={COLORS.textMuted} fontSize={9} fontFamily="Inter, system-ui, sans-serif">• DB ainda é bottleneck</text>
            <text x={370} y={512} fill={COLORS.textMuted} fontSize={9} fontFamily="Inter, system-ui, sans-serif">• Cache invalidation</text>
          </g>
        </DiagramGroup>

        {/* Phase 3: Scale */}
        <DiagramGroup x={660} y={20} width={320} height={520} label="Fase 3 — Scale" color={COLORS.purple} opacity={d.getOpacity(5)}>
          <DiagramBadge x={820} y={55} text="50K+ users" type="fix" opacity={d.getOpacity(5)} />

          <DiagramNode
            x={700} y={70} label="API Gateway" sublabel="Kong / AWS APIGW" icon="🚪"
            color={COLORS.purple} width={170} height={55}
            opacity={d.getOpacity(5)} active={d.isActive('apigw')}
            tooltip="Ponto de entrada único que roteia, autentica e limita tráfego para microsserviços"
          />
          <DiagramNode
            x={690} y={150} label="Auth" icon="🔐" color={COLORS.amber} width={80} height={45}
            opacity={d.getOpacity(5)} active={d.isActive('auth')}
            tooltip="Microsserviço de autenticação e autorização (JWT, OAuth, RBAC)"
          />
          <DiagramNode
            x={790} y={150} label="Users" icon="👥" color={COLORS.blue} width={80} height={45}
            opacity={d.getOpacity(5)} active={d.isActive('users')}
            tooltip="Microsserviço responsável pelo domínio de usuários e perfis"
          />
          <DiagramNode
            x={890} y={150} label="Orders" icon="📦" color={COLORS.green} width={80} height={45}
            opacity={d.getOpacity(5)} active={d.isActive('orders')}
            tooltip="Microsserviço responsável por pedidos, pagamentos e fulfillment"
          />
          <DiagramNode
            x={700} y={220} label="Message Broker" sublabel="Kafka / SQS" icon="📨"
            color={COLORS.orange} width={170} height={55}
            opacity={d.getOpacity(5)} active={d.isActive('broker')}
            tooltip="Sistema de mensagens assíncronas para comunicação desacoplada entre microsserviços"
          />
          <DiagramNode
            x={700} y={300} label="Kubernetes" sublabel="Orquestração" icon="☸️"
            color={COLORS.cyan} width={170} height={55}
            opacity={d.getOpacity(6)} active={d.isActive('k8s')}
            tooltip="Orquestrador de containers que gerencia deploy, scaling e auto-healing dos serviços"
          />
          <DiagramNode
            x={700} y={370} label="Observabilidade" sublabel="Grafana + Prometheus" icon="📊"
            color={COLORS.amber} width={170} height={50}
            opacity={d.getOpacity(6)} active={d.isActive('observability')}
            tooltip="Stack de monitoramento com métricas, logs, traces e alertas em tempo real"
          />

          <DiagramEdge from={{ x: 740, y: 125 }} to={{ x: 730, y: 150 }} color="purple" opacity={d.getOpacity(5)} />
          <DiagramEdge from={{ x: 800, y: 125 }} to={{ x: 830, y: 150 }} color="purple" opacity={d.getOpacity(5)} />
          <DiagramEdge from={{ x: 860, y: 125 }} to={{ x: 930, y: 150 }} color="purple" opacity={d.getOpacity(5)} />
          <DiagramEdge from={{ x: 785, y: 195 }} to={{ x: 785, y: 220 }} color="orange" label="Events" opacity={d.getOpacity(5)} />
          <DiagramEdge from={{ x: 785, y: 275 }} to={{ x: 785, y: 300 }} color="cyan" opacity={d.getOpacity(6)} />
          <DiagramEdge from={{ x: 785, y: 355 }} to={{ x: 785, y: 370 }} color="amber" dashed opacity={d.getOpacity(6)} />

          <g style={{ opacity: d.getOpacity(6), transition: 'opacity 300ms ease' }}>
            <text x={690} y={440} fill={COLORS.green} fontSize={10} fontWeight={600} fontFamily="Inter, system-ui, sans-serif">Prós:</text>
            <text x={690} y={455} fill={COLORS.textMuted} fontSize={9} fontFamily="Inter, system-ui, sans-serif">• Scale independente por serviço</text>
            <text x={690} y={468} fill={COLORS.textMuted} fontSize={9} fontFamily="Inter, system-ui, sans-serif">• Fault isolation</text>
            <text x={690} y={489} fill={COLORS.red} fontSize={10} fontWeight={600} fontFamily="Inter, system-ui, sans-serif">Contras:</text>
            <text x={690} y={504} fill={COLORS.textMuted} fontSize={9} fontFamily="Inter, system-ui, sans-serif">• Complexidade operacional alta</text>
            <text x={690} y={517} fill={COLORS.textMuted} fontSize={9} fontFamily="Inter, system-ui, sans-serif">• Distributed tracing obrigatório</text>
          </g>
        </DiagramGroup>

        {/* Arrows between phases */}
        <DiagramEdge from={{ x: 310, y: 280 }} to={{ x: 340, y: 280 }} color="amber" opacity={d.getOpacity(3)} />
        <DiagramEdge from={{ x: 630, y: 280 }} to={{ x: 660, y: 280 }} color="purple" opacity={d.getOpacity(5)} />
      </DiagramCanvas>
    </AlgorithmShell>
  );
}
