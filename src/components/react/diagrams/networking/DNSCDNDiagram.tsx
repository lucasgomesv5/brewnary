import { DiagramCanvas, DiagramNode, DiagramEdge, DiagramBadge, DiagramGroup, DiagramShell, COLORS } from '../index';
import { useInteractiveDiagram, type DiagramStepDef } from '../useInteractiveDiagram';

const STEPS: DiagramStepDef[] = [
  { description: 'Cache chain: browser (chrome://net-internals) → OS (/etc/hosts) → router → ISP resolver', activeElements: ['cache-chain'] },
  { description: 'Recursive resolver (ISP/Cloudflare/Google): faz as queries iterativas quando cache miss', activeElements: ['recursive'] },
  { description: 'Root Nameservers: 13 clusters anycast (a-m.root-servers.net) espalhados globalmente', activeElements: ['root'] },
  { description: 'TLD Nameserver (.com, .io, .dev): retorna NS autoritativos do domínio', activeElements: ['tld'] },
  { description: 'Authoritative NS: possui os records reais (A, AAAA, CNAME, MX). Resposta final', activeElements: ['authoritative'] },
  { description: 'DNSSEC: cadeia de assinatura criptográfica da raiz até o registro. Previne DNS spoofing', activeElements: ['dnssec'] },
  { description: 'CDN Points of Presence (PoPs): 300+ edge locations globais para cache de conteúdo', activeElements: ['cdn-pop'] },
  { description: 'Cache hierarchy: Edge (L1) → Shield/Mid-tier (L2) → Origin — minimiza requests ao origin', activeElements: ['cache-hierarchy'] },
  { description: 'Cache invalidation: TTL, purge API, stale-while-revalidate, cache tags para granularidade', activeElements: ['invalidation'] },
  { description: 'Fluxo completo: DNS resolve → CDN PoP → cache hit/miss → origin fallback → resposta', activeElements: ['full-flow'] },
];

export default function DNSCDNDiagram() {
  const d = useInteractiveDiagram(STEPS);

  return (
    <DiagramShell
      title="DNS & CDN Deep Dive"
      description="Resolução DNS hierárquica, DNSSEC, CDN edge caching e invalidação"
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
        {/* DNS Resolution */}
        <DiagramGroup x={20} y={20} width={1050} height={280} label="DNS Resolution" color={COLORS.purple} opacity={d.getOpacity(0)}>
          {/* Cache Chain */}
          <DiagramNode
            x={40} y={60} label="Browser Cache" sublabel="TTL based" icon="🌐"
            color={COLORS.textMuted} width={110} height={50}
            opacity={d.getOpacity(0)} active={d.isActive('cache-chain')}
            tooltip="Primeiro check: browser DNS cache. Chrome: chrome://net-internals/#dns. Respeita TTL do registro. Limpa ao fechar browser"
          />
          <DiagramNode
            x={170} y={60} label="OS Cache" sublabel="/etc/hosts" icon="💻"
            color={COLORS.textMuted} width={100} height={50}
            opacity={d.getOpacity(0)} active={d.isActive('cache-chain')}
            tooltip="OS resolver cache (systemd-resolved, mDNSResponder). /etc/hosts para overrides locais. nscd para caching em Linux"
          />
          <DiagramNode
            x={290} y={60} label="Router" sublabel="Home/Corp DNS" icon="📡"
            color={COLORS.textMuted} width={100} height={50}
            opacity={d.getOpacity(0)} active={d.isActive('cache-chain')}
            tooltip="Router pode ter DNS cache embutido. Redes corporativas: DNS interno para resolução de hostnames internos + cache"
          />
          <DiagramEdge from={{ x: 150, y: 85 }} to={{ x: 170, y: 85 }} color="textMuted" label="miss" opacity={d.getOpacity(0)} />
          <DiagramEdge from={{ x: 270, y: 85 }} to={{ x: 290, y: 85 }} color="textMuted" label="miss" opacity={d.getOpacity(0)} />

          {/* Recursive Resolver */}
          <DiagramNode
            x={430} y={60} label="Recursive Resolver" sublabel="8.8.8.8 / 1.1.1.1" icon="🔄"
            color={COLORS.purple} width={150} height={55}
            opacity={d.getOpacity(1)} active={d.isActive('recursive')}
            tooltip="ISP, Google (8.8.8.8), Cloudflare (1.1.1.1). Faz queries iterativas para root → TLD → authoritative. Cacheia resultados por TTL"
          />
          <DiagramEdge from={{ x: 390, y: 85 }} to={{ x: 430, y: 85 }} color="purple" label="miss" opacity={d.getOpacity(1)} />
          <DiagramBadge x={505} y={52} text="ITERATIVE" type="info" opacity={d.getOpacity(1)} />

          {/* Root NS */}
          <DiagramNode
            x={630} y={55} label="Root NS" sublabel="13 anycast clusters" icon="🌍"
            color={COLORS.red} width={130} height={50}
            opacity={d.getOpacity(2)} active={d.isActive('root')}
            tooltip="13 root server clusters (a-m.root-servers.net). 1500+ instâncias via anycast. Resposta: 'para .com, pergunte a X'. Priming query"
          />
          <DiagramEdge from={{ x: 580, y: 75 }} to={{ x: 630, y: 80 }} color="red" label="1. where is .com?" opacity={d.getOpacity(2)} />

          {/* TLD NS */}
          <DiagramNode
            x={800} y={55} label="TLD NS" sublabel=".com .io .dev" icon="📁"
            color={COLORS.amber} width={120} height={50}
            opacity={d.getOpacity(3)} active={d.isActive('tld')}
            tooltip="TLD nameservers: Verisign (.com/.net), Google (.dev), PIR (.org). Resposta: NS records do domínio. Registrar configura via EPP"
          />
          <DiagramEdge from={{ x: 760, y: 80 }} to={{ x: 800, y: 80 }} color="amber" label="2. NS for example.com?" opacity={d.getOpacity(3)} />

          {/* Authoritative NS */}
          <DiagramNode
            x={960} y={55} label="Authoritative" sublabel="ns1.example.com" icon="📋"
            color={COLORS.green} width={90} height={50}
            opacity={d.getOpacity(4)} active={d.isActive('authoritative')}
            tooltip="Authoritative NS: possui os records (A: 93.184.216.34, AAAA: IPv6, CNAME, MX, TXT, SRV). Managed DNS: Route53, Cloudflare, NS1"
          />
          <DiagramEdge from={{ x: 920, y: 80 }} to={{ x: 960, y: 80 }} color="green" label="3. A record?" opacity={d.getOpacity(4)} />
          <DiagramBadge x={1005} y={47} text="FINAL" type="fix" opacity={d.getOpacity(4)} />

          {/* Record types */}
          <DiagramGroup x={630} y={130} width={420} height={70} label="DNS Record Types" color={COLORS.blue} opacity={d.getOpacity(4)}>
            <text x={650} y={158} fill={COLORS.text} fontSize={9} fontFamily="JetBrains Mono, monospace">
              <tspan x={650} dy={0}>A: IPv4  | AAAA: IPv6  | CNAME: alias  | MX: mail</tspan>
              <tspan x={650} dy={14}>TXT: SPF/DKIM/verify | SRV: service | NS: nameserver</tspan>
              <tspan x={650} dy={14}>CAA: cert authority | SOA: zone info | TTL: 300-86400s</tspan>
            </text>
          </DiagramGroup>

          {/* DNSSEC */}
          <DiagramGroup x={40} y={140} width={550} height={70} label="DNSSEC — Chain of Trust" color={COLORS.red} opacity={d.getOpacity(5)}>
            <text x={60} y={170} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
              <tspan x={60} dy={0} opacity={d.getOpacity(5)}>Root KSK → Root ZSK → .com DS → .com ZSK → example.com DS → RRSIG</tspan>
              <tspan x={60} dy={16} opacity={d.getOpacity(5)}>Previne: DNS spoofing, cache poisoning, MITM. Custo: +2 queries, +pacote</tspan>
            </text>
          </DiagramGroup>
          <DiagramBadge x={315} y={135} text="CRYPTO CHAIN" type="spof" opacity={d.getOpacity(5)} />
        </DiagramGroup>

        {/* CDN Section */}
        <DiagramGroup x={20} y={320} width={1050} height={300} label="CDN (Content Delivery Network)" color={COLORS.cyan} opacity={d.getOpacity(6)}>
          {/* PoPs */}
          <DiagramNode
            x={40} y={365} label="Edge PoP" sublabel="São Paulo" icon="🏢"
            color={COLORS.cyan} width={110} height={50}
            opacity={d.getOpacity(6)} active={d.isActive('cdn-pop')}
            tooltip="Point of Presence mais próximo do usuário. 300+ PoPs globais (Cloudflare: 310+, AWS CF: 450+). Latência: ~5-20ms para conteúdo cacheado"
          />
          <DiagramNode
            x={170} y={365} label="Edge PoP" sublabel="Virginia" icon="🏢"
            color={COLORS.cyan} width={110} height={50}
            opacity={d.getOpacity(6)} active={d.isActive('cdn-pop')}
            tooltip="Cada PoP: cache local, TLS termination, DDoS mitigation, WAF rules. Anycast IP: mesmo IP resolve para PoP mais próximo"
          />
          <DiagramNode
            x={300} y={365} label="Edge PoP" sublabel="Frankfurt" icon="🏢"
            color={COLORS.cyan} width={110} height={50}
            opacity={d.getOpacity(6)} active={d.isActive('cdn-pop')}
            tooltip="PoPs na Europa, Ásia, América. Conteúdo estático cacheado: HTML, CSS, JS, imagens, vídeo. Cache hit ratio: 90-99%"
          />
          <DiagramBadge x={225} y={357} text="300+ PoPs" type="throughput" opacity={d.getOpacity(6)} />

          {/* Cache Hierarchy */}
          <DiagramNode
            x={480} y={365} label="Shield / Mid-tier" sublabel="Regional Cache" icon="🛡️"
            color={COLORS.blue} width={140} height={55}
            opacity={d.getOpacity(7)} active={d.isActive('cache-hierarchy')}
            tooltip="Cache shield: camada intermediária entre edge e origin. Reduz requests ao origin de N edges para 1 shield. Coalesce requests paralelos"
          />
          <DiagramNode
            x={680} y={365} label="Origin Server" sublabel="Backend" icon="🖥️"
            color={COLORS.orange} width={130} height={55}
            opacity={d.getOpacity(7)} active={d.isActive('cache-hierarchy')}
            tooltip="Origin: seu servidor de aplicação. Só recebe request em cache miss no shield. Pode ser S3, ALB, ou qualquer HTTP server. Origin shield: 95% menos requests"
          />

          <DiagramEdge from={{ x: 150, y: 390 }} to={{ x: 480, y: 390 }} color="blue" label="cache miss" dashed opacity={d.getOpacity(7)} />
          <DiagramEdge from={{ x: 620, y: 390 }} to={{ x: 680, y: 390 }} color="orange" label="cache miss" dashed opacity={d.getOpacity(7)} />
          <DiagramBadge x={550} y={357} text="L2 CACHE" type="info" opacity={d.getOpacity(7)} />

          {/* Cache Invalidation */}
          <DiagramGroup x={40} y={450} width={780} height={80} label="Cache Invalidation Strategies" color={COLORS.amber} opacity={d.getOpacity(8)}>
            <DiagramNode
              x={60} y={475} label="TTL" sublabel="Time-based" color={COLORS.amber} width={80} height={38}
              opacity={d.getOpacity(8)} active={d.isActive('invalidation')}
              tooltip="Time-to-Live: Cache-Control max-age=3600. s-maxage para CDN. Simples mas pode servir stale. Imutável para assets com hash"
            />
            <DiagramNode
              x={160} y={475} label="Purge API" sublabel="On-demand" color={COLORS.red} width={95} height={38}
              opacity={d.getOpacity(8)} active={d.isActive('invalidation')}
              tooltip="Purge via API: DELETE /cache?url=... ou por cache tag/prefix. Propagação: 1-5s globalmente. Rate limited"
            />
            <DiagramNode
              x={275} y={475} label="SWR" sublabel="Stale-While-Rev" color={COLORS.green} width={105} height={38}
              opacity={d.getOpacity(8)} active={d.isActive('invalidation')}
              tooltip="stale-while-revalidate: serve stale, revalida em background. stale-if-error: serve stale se origin está down. UX > freshness"
            />
            <DiagramNode
              x={400} y={475} label="Cache Tags" sublabel="Granular Purge" color={COLORS.purple} width={105} height={38}
              opacity={d.getOpacity(8)} active={d.isActive('invalidation')}
              tooltip="Surrogate-Key / Cache-Tag header: categoriza responses. Purge por tag: 'purge product-123' invalida todas as páginas com esse produto"
            />
            <DiagramNode
              x={525} y={475} label="Versioned URLs" sublabel="Immutable" color={COLORS.cyan} width={115} height={38}
              opacity={d.getOpacity(8)} active={d.isActive('invalidation')}
              tooltip="app.abc123.js — hash no filename. Cache forever (max-age=31536000, immutable). Novo deploy = novo hash = novo URL. Zero invalidation"
            />
            <DiagramNode
              x={660} y={475} label="ETag / If-None" sublabel="Conditional" color={COLORS.textMuted} width={110} height={38}
              opacity={d.getOpacity(8)} active={d.isActive('invalidation')}
              tooltip="ETag: hash do conteúdo. 304 Not Modified se não mudou (economia de bandwidth). If-None-Match / If-Modified-Since headers"
            />
          </DiagramGroup>

          {/* Full Flow Summary */}
          <DiagramGroup x={40} y={550} width={780} height={50} label="" color={COLORS.green} opacity={d.getOpacity(9)}>
            <text x={60} y={575} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
              <tspan x={60} dy={0} opacity={d.getOpacity(9)}>User → DNS (cache chain) → Anycast CDN PoP → Cache HIT (~5ms) ou MISS → Shield → Origin → Response cached → TTL</tspan>
            </text>
          </DiagramGroup>
        </DiagramGroup>

        {/* Performance numbers */}
        <DiagramGroup x={860} y={360} width={200} height={100} label="Latências típicas" color={COLORS.green} opacity={d.getOpacity(9)}>
          <text x={880} y={395} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={880} dy={0}>Edge hit:    ~5-20ms</tspan>
            <tspan x={880} dy={14}>Shield hit:  ~30-50ms</tspan>
            <tspan x={880} dy={14}>Origin:      ~100-500ms</tspan>
            <tspan x={880} dy={14}>DNS lookup:  ~20-120ms</tspan>
          </text>
        </DiagramGroup>
      </DiagramCanvas>
    </DiagramShell>
  );
}
