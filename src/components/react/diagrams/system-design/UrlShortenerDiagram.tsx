import { DiagramCanvas, DiagramNode, DiagramEdge, DiagramBadge, DiagramGroup, DiagramShell, COLORS } from '../index';
import { useInteractiveDiagram, type DiagramStepDef } from '../useInteractiveDiagram';

const STEPS: DiagramStepDef[] = [
  { description: 'Cliente envia URL longa para encurtar via POST /shorten', activeElements: ['client'] },
  { description: 'API Gateway aplica rate limiting (100 req/s por IP) e autenticação', activeElements: ['gateway'] },
  { description: 'URL Service gera short code via Base62(Snowflake ID) — 62^7 = 3.5T URLs possíveis', activeElements: ['url-service'] },
  { description: 'Escrita no DB primário com réplicas read — write ~5-20ms', activeElements: ['db-primary', 'db-replica'] },
  { description: 'Bloom Filter (probabilístico) verifica duplicatas sem hit no banco — O(k) constante', activeElements: ['bloom'] },
  { description: 'Cache Redis armazena mapeamento short→long — cache hit ~1-2ms vs DB ~5-10ms', activeElements: ['cache'] },
  { description: 'Redirect 301 (permanente) ou 302 (temporário) para URL original', activeElements: ['redirect'] },
  { description: 'Evento de clique publicado no Kafka para analytics assíncrono', activeElements: ['kafka'] },
  { description: 'ClickHouse processa analytics em tempo real — milhões de eventos/segundo', activeElements: ['analytics'] },
  { description: 'Sistema completo: write path (POST) + read path (GET) com cache hierárquico', activeElements: ['client', 'gateway', 'url-service', 'cache'] },
];

export default function UrlShortenerDiagram() {
  const d = useInteractiveDiagram(STEPS);

  return (
    <DiagramShell
      title="URL Shortener"
      description="Arquitetura completa de um encurtador de URLs com cache, analytics e bilhões de registros"
      totalSteps={d.totalSteps}
      currentStep={d.currentStep}
      stepDescription={d.stepDescription}
      onStep={d.handleStep}
      onReset={d.handleReset}
      isComplete={d.isComplete}
      showAll={d.showAll}
      onShowAll={d.handleShowAll}
      color="#3b82f6"
    >
      <DiagramCanvas width={1100} height={620}>
        {/* Client */}
        <DiagramNode
          x={20} y={260} label="Client" sublabel="POST /shorten" icon="🌐"
          color={COLORS.textMuted} width={120} height={65}
          opacity={d.getOpacity(0)} active={d.isActive('client')}
          tooltip="Cliente envia URL longa via API REST. Pode ser browser, app mobile ou integração M2M"
        />

        {/* API Gateway */}
        <DiagramNode
          x={190} y={260} label="API Gateway" sublabel="Rate Limit" icon="🛡️"
          color={COLORS.orange} width={130} height={65}
          opacity={d.getOpacity(1)} active={d.isActive('gateway')}
          tooltip="Rate limiting por IP (100 req/s), autenticação via API key, validação de URL, proteção contra abuse"
        />
        <DiagramEdge from={{ x: 140, y: 292 }} to={{ x: 190, y: 292 }} color="orange" opacity={d.getOpacity(1)} />
        <DiagramBadge x={255} y={252} text="100 req/s" type="load" opacity={d.getOpacity(1)} />

        {/* URL Service */}
        <DiagramNode
          x={370} y={260} label="URL Service" sublabel="Base62 + Snowflake" icon="⚙️"
          color={COLORS.blue} width={140} height={65}
          opacity={d.getOpacity(2)} active={d.isActive('url-service')}
          tooltip="Gera short code único via Base62(Snowflake ID). Snowflake: timestamp(41b) + worker(10b) + seq(12b). Sem colisões"
        />
        <DiagramEdge from={{ x: 320, y: 292 }} to={{ x: 370, y: 292 }} color="blue" opacity={d.getOpacity(2)} />

        {/* DB Group */}
        <DiagramGroup x={350} y={380} width={280} height={130} label="Database Cluster" color={COLORS.cyan} opacity={d.getOpacity(3)}>
          <DiagramNode
            x={370} y={415} label="Primary" sublabel="PostgreSQL" icon="🗄️"
            color={COLORS.cyan} width={110} height={55}
            opacity={d.getOpacity(3)} active={d.isActive('db-primary')}
            tooltip="Write master — insert ~5-20ms. Schema: (short_code PK, long_url, created_at, expires_at, user_id)"
          />
          <DiagramNode
            x={500} y={415} label="Replica" sublabel="Read-only" icon="📋"
            color={COLORS.cyan} width={110} height={55}
            opacity={d.getOpacity(3)} active={d.isActive('db-replica')}
            tooltip="Read replicas para distribuir queries de leitura. Replicação assíncrona com lag < 100ms"
          />
        </DiagramGroup>
        <DiagramEdge from={{ x: 440, y: 325 }} to={{ x: 440, y: 380 }} color="cyan" label="write ~5-20ms" opacity={d.getOpacity(3)} />
        <DiagramBadge x={555} y={405} text="ASYNC REPL" type="info" opacity={d.getOpacity(3)} />

        {/* Bloom Filter */}
        <DiagramNode
          x={560} y={260} label="Bloom Filter" sublabel="Dedup check" icon="🎯"
          color={COLORS.purple} width={130} height={65}
          opacity={d.getOpacity(4)} active={d.isActive('bloom')}
          tooltip="Filtro probabilístico: false positives ~1%, zero false negatives. Evita queries desnecessárias ao DB. Memória: ~1GB para 1B URLs"
        />
        <DiagramEdge from={{ x: 510, y: 292 }} to={{ x: 560, y: 292 }} color="purple" opacity={d.getOpacity(4)} />
        <DiagramBadge x={625} y={252} text="O(k)" type="latency" opacity={d.getOpacity(4)} />

        {/* Cache */}
        <DiagramNode
          x={740} y={260} label="Redis Cache" sublabel="short → long" icon="⚡"
          color={COLORS.red} width={130} height={65}
          opacity={d.getOpacity(5)} active={d.isActive('cache')}
          tooltip="Cache LRU com TTL. Hit rate ~95% em produção. Latência: cache hit ~1-2ms vs DB read ~5-10ms. Cluster com 3+ nós"
        />
        <DiagramEdge from={{ x: 690, y: 292 }} to={{ x: 740, y: 292 }} color="red" opacity={d.getOpacity(5)} />
        <DiagramBadge x={805} y={252} text="~1-2ms" type="latency" opacity={d.getOpacity(5)} />

        {/* Redirect */}
        <DiagramNode
          x={920} y={260} label="301 Redirect" sublabel="GET /:code" icon="↩️"
          color={COLORS.green} width={130} height={65}
          opacity={d.getOpacity(6)} active={d.isActive('redirect')}
          tooltip="301 Moved Permanently: browser cacheia, menos requests. 302 Found: cada acesso gera analytics. Trade-off: SEO vs métricas"
        />
        <DiagramEdge from={{ x: 870, y: 292 }} to={{ x: 920, y: 292 }} color="green" opacity={d.getOpacity(6)} />

        {/* Kafka */}
        <DiagramNode
          x={660} y={130} label="Kafka" sublabel="Click Events" icon="📨"
          color={COLORS.orange} width={130} height={65}
          opacity={d.getOpacity(7)} active={d.isActive('kafka')}
          tooltip="Topic particionado por short_code. Retenção 7 dias. Throughput: 100K+ eventos/segundo por partition"
        />
        <DiagramEdge from={{ x: 805, y: 260 }} to={{ x: 725, y: 195 }} color="orange" label="async" dashed opacity={d.getOpacity(7)} />

        {/* Analytics */}
        <DiagramNode
          x={860} y={130} label="ClickHouse" sublabel="Analytics OLAP" icon="📊"
          color={COLORS.amber} width={140} height={65}
          opacity={d.getOpacity(8)} active={d.isActive('analytics')}
          tooltip="OLAP columnar DB. Queries agregadas em ms sobre bilhões de linhas. Métricas: clicks/hora, geo, referrer, device"
        />
        <DiagramEdge from={{ x: 790, y: 162 }} to={{ x: 860, y: 162 }} color="amber" opacity={d.getOpacity(8)} />
        <DiagramBadge x={930} y={122} text="M events/s" type="throughput" opacity={d.getOpacity(8)} />

        {/* Numbers summary */}
        <DiagramGroup x={20} y={30} width={300} height={100} label="Números-chave" color={COLORS.blue} opacity={d.getOpacity(9)}>
          <text x={40} y={65} fill={COLORS.textMuted} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={40} dy={0} opacity={d.getOpacity(9)}>62^7 = 3.5 trilhões de URLs únicas</tspan>
            <tspan x={40} dy={16} opacity={d.getOpacity(9)}>Cache hit: ~1-2ms | DB read: ~5-10ms</tspan>
            <tspan x={40} dy={16} opacity={d.getOpacity(9)}>Write: ~5-20ms | Bloom: false+ ~1%</tspan>
            <tspan x={40} dy={16} opacity={d.getOpacity(9)}>Read:Write ratio ≈ 100:1</tspan>
          </text>
        </DiagramGroup>
      </DiagramCanvas>
    </DiagramShell>
  );
}
