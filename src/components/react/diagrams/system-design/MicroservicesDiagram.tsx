import { DiagramCanvas, DiagramNode, DiagramEdge, DiagramBadge, DiagramGroup, DiagramShell, COLORS } from '../index';
import { useInteractiveDiagram, type DiagramStepDef } from '../useInteractiveDiagram';

const STEPS: DiagramStepDef[] = [
  { description: 'Monolito: tudo num único processo — simples mas acoplado e difícil de escalar', activeElements: ['monolith'] },
  { description: 'Decomposição por Bounded Contexts (DDD) — cada serviço é dono do seu domínio', activeElements: ['decompose'] },
  { description: 'REST (HTTP/JSON) para comunicação síncrona, gRPC (protobuf) para inter-service de alta performance', activeElements: ['rest', 'grpc'] },
  { description: 'API Gateway centraliza autenticação, rate limiting, routing e request aggregation', activeElements: ['api-gw'] },
  { description: 'Service Discovery (Consul/etcd) permite que serviços encontrem uns aos outros dinamicamente', activeElements: ['discovery'] },
  { description: 'Event-driven via Kafka para comunicação assíncrona e desacoplamento temporal', activeElements: ['kafka'] },
  { description: 'Saga Pattern: choreography (eventos) vs orchestration (coordenador central)', activeElements: ['saga'] },
  { description: 'Circuit Breaker previne cascading failures — closed → open → half-open', activeElements: ['circuit'] },
  { description: 'Service Mesh (Envoy/Istio) gerencia mTLS, retries, observability como sidecar', activeElements: ['mesh'] },
  { description: 'Database per service + CQRS separa modelo de leitura e escrita para otimização', activeElements: ['db-service', 'cqrs'] },
];

export default function MicroservicesDiagram() {
  const d = useInteractiveDiagram(STEPS);

  return (
    <DiagramShell
      title="Microservices Communication"
      description="Evolução de monolito para microserviços: padrões de comunicação, resiliência e dados"
      totalSteps={d.totalSteps}
      currentStep={d.currentStep}
      stepDescription={d.stepDescription}
      onStep={d.handleStep}
      onReset={d.handleReset}
      isComplete={d.isComplete}
      showAll={d.showAll}
      onShowAll={d.handleShowAll}
      color="#a855f7"
    >
      <DiagramCanvas width={1100} height={650}>
        {/* Monolith */}
        <DiagramGroup x={20} y={30} width={180} height={130} label="Antes: Monolito" color={COLORS.red} opacity={d.getOpacity(0)}>
          <DiagramNode
            x={40} y={65} label="Monolith" sublabel="Tudo junto" icon="📦"
            color={COLORS.red} width={140} height={55}
            opacity={d.getOpacity(0)} active={d.isActive('monolith')}
            tooltip="Monolito: um único deploy, um banco. Vantagens: simplicidade, debugging fácil. Desvantagens: deploy lento, scaling granular impossível, team coupling"
          />
        </DiagramGroup>
        <DiagramBadge x={110} y={170} text="COUPLED" type="spof" opacity={d.getOpacity(0)} />

        {/* DDD Decomposition */}
        <DiagramGroup x={240} y={30} width={450} height={130} label="Bounded Contexts (DDD)" color={COLORS.purple} opacity={d.getOpacity(1)}>
          <DiagramNode
            x={260} y={65} label="User Service" icon="👤"
            color={COLORS.purple} width={120} height={55}
            opacity={d.getOpacity(1)} active={d.isActive('decompose')}
            tooltip="Domínio: registro, auth, perfil. Dono do User DB. Equipe independente com deploy autônomo"
          />
          <DiagramNode
            x={400} y={65} label="Order Service" icon="🛒"
            color={COLORS.purple} width={120} height={55}
            opacity={d.getOpacity(1)} active={d.isActive('decompose')}
            tooltip="Domínio: pedidos, checkout, pagamento. Comunica com User e Product via APIs"
          />
          <DiagramNode
            x={540} y={65} label="Product Service" icon="📦"
            color={COLORS.purple} width={120} height={55}
            opacity={d.getOpacity(1)} active={d.isActive('decompose')}
            tooltip="Domínio: catálogo, estoque, preços. Dono do Product DB. Publica eventos de estoque"
          />
        </DiagramGroup>

        {/* REST vs gRPC */}
        <DiagramNode
          x={260} y={200} label="REST" sublabel="HTTP/JSON" icon="🌐"
          color={COLORS.blue} width={120} height={55}
          opacity={d.getOpacity(2)} active={d.isActive('rest')}
          tooltip="REST: texto (JSON), human-readable, tooling rico. Latência: ~10-50ms. Ideal para APIs públicas e front-end"
        />
        <DiagramNode
          x={420} y={200} label="gRPC" sublabel="Protobuf" icon="⚡"
          color={COLORS.cyan} width={120} height={55}
          opacity={d.getOpacity(2)} active={d.isActive('grpc')}
          tooltip="gRPC: binário (protobuf), HTTP/2, streaming, code-gen. Serialização menor e mais rápida que JSON — vantagem cresce com payload. Ideal para inter-service"
        />
        <DiagramBadge x={390} y={240} text="vs" type="tradeoff" opacity={d.getOpacity(2)} />

        {/* API Gateway */}
        <DiagramNode
          x={20} y={280} label="API Gateway" sublabel="Kong / Envoy" icon="🛡️"
          color={COLORS.orange} width={140} height={65}
          opacity={d.getOpacity(3)} active={d.isActive('api-gw')}
          tooltip="Single entry point: auth, rate limit (token bucket), request routing, response aggregation, SSL termination, request/response transformation"
        />
        <DiagramBadge x={90} y={272} text="SINGLE ENTRY" type="info" opacity={d.getOpacity(3)} />

        {/* Service Discovery */}
        <DiagramNode
          x={20} y={400} label="Service Discovery" sublabel="Consul / etcd" icon="🔍"
          color={COLORS.green} width={150} height={65}
          opacity={d.getOpacity(4)} active={d.isActive('discovery')}
          tooltip="Service registry: cada instância registra IP:port no startup. Health check periódico. DNS-based ou client-side discovery"
        />
        <DiagramEdge from={{ x: 90, y: 345 }} to={{ x: 95, y: 400 }} color="green" dashed opacity={d.getOpacity(4)} />

        {/* Kafka */}
        <DiagramNode
          x={580} y={200} label="Kafka" sublabel="Event Bus" icon="📨"
          color={COLORS.orange} width={130} height={55}
          opacity={d.getOpacity(5)} active={d.isActive('kafka')}
          tooltip="Event-driven: serviços publicam domain events (OrderCreated, PaymentProcessed). Desacoplamento temporal e espacial. Replay de eventos"
        />
        <DiagramEdge from={{ x: 540, y: 227 }} to={{ x: 580, y: 227 }} color="orange" label="events" opacity={d.getOpacity(5)} />

        {/* Saga */}
        <DiagramGroup x={580} y={290} width={280} height={120} label="Saga Pattern" color={COLORS.amber} opacity={d.getOpacity(6)}>
          <DiagramNode
            x={600} y={325} label="Choreography" sublabel="Eventos" icon="💃"
            color={COLORS.amber} width={110} height={50}
            opacity={d.getOpacity(6)} active={d.isActive('saga')}
            tooltip="Cada serviço reage a eventos e emite próximo. Simples mas difícil de debugar. Ideal para < 5 steps"
          />
          <DiagramNode
            x={730} y={325} label="Orchestrator" sublabel="Coordenador" icon="🎭"
            color={COLORS.amber} width={110} height={50}
            opacity={d.getOpacity(6)} active={d.isActive('saga')}
            tooltip="Coordenador central controla o fluxo. Mais complexo mas visível. Compensating transactions para rollback. Ideal para > 5 steps"
          />
        </DiagramGroup>
        <DiagramBadge x={720} y={286} text="DISTRIBUTED TX" type="tradeoff" opacity={d.getOpacity(6)} />

        {/* Circuit Breaker */}
        <DiagramGroup x={220} y={340} width={320} height={120} label="Circuit Breaker" color={COLORS.red} opacity={d.getOpacity(7)}>
          <DiagramNode
            x={240} y={375} label="Closed" sublabel="Normal" icon="✅"
            color={COLORS.green} width={80} height={45}
            opacity={d.getOpacity(7)} active={d.isActive('circuit')}
            tooltip="Estado normal: requests passam. Conta falhas. Threshold: 5 falhas em 10s → abre o circuito"
          />
          <DiagramNode
            x={340} y={375} label="Open" sublabel="Rejecting" icon="🚫"
            color={COLORS.red} width={80} height={45}
            opacity={d.getOpacity(7)} active={d.isActive('circuit')}
            tooltip="Circuito aberto: requests rejeitados imediatamente (fail fast). Timeout de 30s antes de testar recovery"
          />
          <DiagramNode
            x={440} y={375} label="Half-Open" sublabel="Testing" icon="🔄"
            color={COLORS.amber} width={80} height={45}
            opacity={d.getOpacity(7)} active={d.isActive('circuit')}
            tooltip="Permite 1 request de teste. Se sucesso → Closed. Se falha → Open novamente. Previne thundering herd"
          />
          <DiagramEdge from={{ x: 320, y: 397 }} to={{ x: 340, y: 397 }} color="red" opacity={d.getOpacity(7)} />
          <DiagramEdge from={{ x: 420, y: 397 }} to={{ x: 440, y: 397 }} color="amber" opacity={d.getOpacity(7)} />
        </DiagramGroup>

        {/* Service Mesh */}
        <DiagramGroup x={220} y={490} width={320} height={110} label="Service Mesh (Envoy)" color={COLORS.cyan} opacity={d.getOpacity(8)}>
          <DiagramNode
            x={240} y={525} label="App" icon="📱"
            color={COLORS.blue} width={80} height={40}
            opacity={d.getOpacity(8)} active={d.isActive('mesh')}
            tooltip="Aplicação sem awareness de rede. Toda complexidade de comunicação delegada ao sidecar proxy"
          />
          <DiagramNode
            x={350} y={525} label="Sidecar" sublabel="Envoy" icon="🔀"
            color={COLORS.cyan} width={90} height={40}
            opacity={d.getOpacity(8)} active={d.isActive('mesh')}
            tooltip="Proxy sidecar: mTLS automático, retries com jitter, circuit breaking, load balancing, distributed tracing (headers)"
          />
          <DiagramNode
            x={460} y={525} label="Control Plane" sublabel="Istio" icon="🎛️"
            color={COLORS.purple} width={60} height={40}
            opacity={d.getOpacity(8)} active={d.isActive('mesh')}
            tooltip="Istiod: configura todos os sidecars, gerencia certificados, define traffic policies e AuthorizationPolicy"
          />
          <DiagramEdge from={{ x: 320, y: 545 }} to={{ x: 350, y: 545 }} color="cyan" opacity={d.getOpacity(8)} />
        </DiagramGroup>

        {/* DB per service + CQRS */}
        <DiagramGroup x={600} y={440} width={470} height={160} label="Data Patterns" color={COLORS.blue} opacity={d.getOpacity(9)}>
          <DiagramNode
            x={620} y={480} label="User DB" sublabel="PostgreSQL" icon="🗄️"
            color={COLORS.purple} width={100} height={45}
            opacity={d.getOpacity(9)} active={d.isActive('db-service')}
            tooltip="Cada serviço é dono exclusivo do seu banco. Nenhum outro serviço acessa diretamente. API como contrato"
          />
          <DiagramNode
            x={740} y={480} label="Order DB" sublabel="PostgreSQL" icon="🗄️"
            color={COLORS.purple} width={100} height={45}
            opacity={d.getOpacity(9)} active={d.isActive('db-service')}
            tooltip="Banco do Order Service. Schema independente. Referencia userId como ID opaco, não FK direta"
          />
          <DiagramNode
            x={860} y={480} label="Product DB" sublabel="MongoDB" icon="🗄️"
            color={COLORS.purple} width={100} height={45}
            opacity={d.getOpacity(9)} active={d.isActive('db-service')}
            tooltip="Document store para catálogo flexível. Schema-less permite variação de produtos sem migrations"
          />
          <DiagramBadge x={790} y={475} text="DB PER SERVICE" type="info" opacity={d.getOpacity(9)} />

          <DiagramNode
            x={750} y={545} label="CQRS" sublabel="Read ≠ Write Model" icon="📊"
            color={COLORS.cyan} width={140} height={45}
            opacity={d.getOpacity(9)} active={d.isActive('cqrs')}
            tooltip="Command (write) → normalized DB. Query (read) → denormalized view. Event sourcing opcional. Eventual consistency ~100ms"
          />
          <DiagramBadge x={820} y={540} text="EVENTUAL" type="tradeoff" opacity={d.getOpacity(9)} />
        </DiagramGroup>
      </DiagramCanvas>
    </DiagramShell>
  );
}
