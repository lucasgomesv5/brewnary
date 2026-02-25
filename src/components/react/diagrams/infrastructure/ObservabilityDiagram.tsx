import { DiagramCanvas, DiagramNode, DiagramEdge, DiagramBadge, DiagramGroup, DiagramShell, COLORS } from '../index';
import { useInteractiveDiagram, type DiagramStepDef } from '../useInteractiveDiagram';

const STEPS: DiagramStepDef[] = [
  { description: 'Os 3 pilares: Metrics (o quê), Logs (por quê), Traces (onde) — correlação entre eles', activeElements: ['pillars'] },
  { description: 'Prometheus: pull-based metrics a cada 15s. PromQL para queries. TSDB local com retention', activeElements: ['prometheus'] },
  { description: 'Tipos de métricas: Counter (monotônico), Gauge (sobe/desce), Histogram (distribuição), Summary', activeElements: ['metric-types'] },
  { description: 'Logs: Fluentd/Fluent Bit coleta → Loki (labels) ou ELK (full-text search) para armazenamento', activeElements: ['logs'] },
  { description: 'Traces: OpenTelemetry SDK instrumenta → exporta spans para Jaeger/Tempo', activeElements: ['traces'] },
  { description: 'Distributed trace: cada request gera trace-id propagado via headers entre serviços', activeElements: ['spans'] },
  { description: 'Golden Signals — USE (Utilization/Saturation/Errors) para infra, RED (Rate/Errors/Duration) para services', activeElements: ['golden'] },
  { description: 'SLI/SLO/SLA: SLI mede, SLO define target (99.9%), SLA é contrato com penalidade', activeElements: ['slo'] },
  { description: 'Alerting: Alertmanager agrupa, deduplica e roteia alertas para PagerDuty/Slack/OpsGenie', activeElements: ['alerting'] },
];

export default function ObservabilityDiagram() {
  const d = useInteractiveDiagram(STEPS);

  return (
    <DiagramShell
      title="Observability Stack"
      description="Stack completo de observabilidade: métricas, logs, traces, SLOs e alerting"
      totalSteps={d.totalSteps}
      currentStep={d.currentStep}
      stepDescription={d.stepDescription}
      onStep={d.handleStep}
      onReset={d.handleReset}
      isComplete={d.isComplete}
      showAll={d.showAll}
      onShowAll={d.handleShowAll}
      color="#f59e0b"
    >
      <DiagramCanvas width={1100} height={620}>
        {/* 3 Pillars */}
        <DiagramGroup x={20} y={20} width={400} height={100} label="3 Pilares da Observabilidade" color={COLORS.amber} opacity={d.getOpacity(0)}>
          <DiagramNode
            x={40} y={50} label="Metrics" sublabel="O quê?" icon="📊"
            color={COLORS.blue} width={100} height={48}
            opacity={d.getOpacity(0)} active={d.isActive('pillars')}
            tooltip="Métricas numéricas ao longo do tempo. Agregáveis. Low cardinality. Ideal para dashboards e alertas. Ex: request_count, cpu_usage"
          />
          <DiagramNode
            x={160} y={50} label="Logs" sublabel="Por quê?" icon="📝"
            color={COLORS.green} width={100} height={48}
            opacity={d.getOpacity(0)} active={d.isActive('pillars')}
            tooltip="Eventos textuais com contexto. High cardinality. Ideal para debugging e audit. Structured logging (JSON) > plain text"
          />
          <DiagramNode
            x={280} y={50} label="Traces" sublabel="Onde?" icon="🔍"
            color={COLORS.purple} width={100} height={48}
            opacity={d.getOpacity(0)} active={d.isActive('pillars')}
            tooltip="Caminho da request entre serviços. Trace = árvore de spans. Cada span: operação, duração, status, tags. Sampling rate varia: 0.1-100% conforme volume"
          />
        </DiagramGroup>

        {/* Prometheus */}
        <DiagramNode
          x={480} y={30} label="Prometheus" sublabel="Pull every 15s" icon="🔥"
          color={COLORS.red} width={140} height={65}
          opacity={d.getOpacity(1)} active={d.isActive('prometheus')}
          tooltip="Pull-based: scrape /metrics endpoint a cada 15s. PromQL para queries. TSDB local com 15 dias de retention. Federation para multi-cluster"
        />
        <DiagramEdge from={{ x: 140, y: 98 }} to={{ x: 480, y: 62 }} color="red" label="scrape" dashed opacity={d.getOpacity(1)} />
        <DiagramBadge x={550} y={22} text="PULL 15s" type="latency" opacity={d.getOpacity(1)} />

        {/* Metric Types */}
        <DiagramGroup x={460} y={130} width={300} height={110} label="Metric Types" color={COLORS.blue} opacity={d.getOpacity(2)}>
          <text x={480} y={165} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={480} dy={0} opacity={d.getOpacity(2)}>Counter   ↑ only (requests_total)</tspan>
            <tspan x={480} dy={16} opacity={d.getOpacity(2)}>Gauge     ↑↓ (temperature, queue_size)</tspan>
            <tspan x={480} dy={16} opacity={d.getOpacity(2)}>Histogram buckets (request_duration)</tspan>
            <tspan x={480} dy={16} opacity={d.getOpacity(2)}>Summary   quantiles (p50, p99)</tspan>
          </text>
        </DiagramGroup>
        <DiagramEdge from={{ x: 550, y: 95 }} to={{ x: 550, y: 130 }} color="blue" opacity={d.getOpacity(2)} />

        {/* Logs */}
        <DiagramGroup x={20} y={160} width={400} height={120} label="Log Pipeline" color={COLORS.green} opacity={d.getOpacity(3)}>
          <DiagramNode
            x={40} y={195} label="App Logs" sublabel="Structured JSON" icon="📝"
            color={COLORS.textMuted} width={100} height={48}
            opacity={d.getOpacity(3)} active={d.isActive('logs')}
            tooltip="Structured logging: JSON com timestamp, level, message, trace_id, span_id. Correlação com traces"
          />
          <DiagramNode
            x={160} y={195} label="Fluentd" sublabel="Collector" icon="🔄"
            color={COLORS.green} width={100} height={48}
            opacity={d.getOpacity(3)} active={d.isActive('logs')}
            tooltip="DaemonSet em cada node. Coleta stdout/stderr dos containers. Parse, filter, enrich (add k8s metadata). Buffer em disco"
          />
          <DiagramNode
            x={280} y={195} label="Loki / ELK" sublabel="Storage" icon="🗄️"
            color={COLORS.cyan} width={110} height={48}
            opacity={d.getOpacity(3)} active={d.isActive('logs')}
            tooltip="Loki: indexa apenas labels (eficiente). ELK: full-text search (poderoso). Retention: 30-90 dias. Custo: ELK >> Loki"
          />
          <DiagramEdge from={{ x: 140, y: 219 }} to={{ x: 160, y: 219 }} color="green" opacity={d.getOpacity(3)} />
          <DiagramEdge from={{ x: 260, y: 219 }} to={{ x: 280, y: 219 }} color="green" opacity={d.getOpacity(3)} />
        </DiagramGroup>

        {/* Traces */}
        <DiagramGroup x={20} y={320} width={400} height={100} label="Trace Pipeline" color={COLORS.purple} opacity={d.getOpacity(4)}>
          <DiagramNode
            x={40} y={350} label="OTel SDK" sublabel="Auto-instrument" icon="📡"
            color={COLORS.purple} width={100} height={48}
            opacity={d.getOpacity(4)} active={d.isActive('traces')}
            tooltip="OpenTelemetry SDK com auto-instrumentation: HTTP, gRPC, DB, Redis automáticos. Manual spans para business logic"
          />
          <DiagramNode
            x={160} y={350} label="OTel Collector" sublabel="Process" icon="⚙️"
            color={COLORS.purple} width={110} height={48}
            opacity={d.getOpacity(4)} active={d.isActive('traces')}
            tooltip="Collector central: recebe, processa (sampling, batching), exporta para backends. Tail-based sampling para decisões melhores"
          />
          <DiagramNode
            x={290} y={350} label="Jaeger" sublabel="Trace Backend" icon="🔍"
            color={COLORS.cyan} width={100} height={48}
            opacity={d.getOpacity(4)} active={d.isActive('traces')}
            tooltip="Backend de traces: storage (Cassandra/Elasticsearch), query API, UI com waterfall view. Tempo (Grafana) como alternativa econômica"
          />
          <DiagramEdge from={{ x: 140, y: 374 }} to={{ x: 160, y: 374 }} color="purple" opacity={d.getOpacity(4)} />
          <DiagramEdge from={{ x: 270, y: 374 }} to={{ x: 290, y: 374 }} color="cyan" opacity={d.getOpacity(4)} />
        </DiagramGroup>

        {/* Distributed Trace */}
        <DiagramGroup x={460} y={270} width={380} height={110} label="Distributed Trace" color={COLORS.purple} opacity={d.getOpacity(5)}>
          <DiagramNode
            x={480} y={300} label="Service A" sublabel="trace-id: abc" icon="1️⃣"
            color={COLORS.blue} width={95} height={45}
            opacity={d.getOpacity(5)} active={d.isActive('spans')}
            tooltip="Root span: gera trace-id único (128-bit). Propaga via headers: traceparent (W3C) ou x-b3-traceid (Zipkin)"
          />
          <DiagramNode
            x={595} y={300} label="Service B" sublabel="span-id: def" icon="2️⃣"
            color={COLORS.green} width={95} height={45}
            opacity={d.getOpacity(5)} active={d.isActive('spans')}
            tooltip="Child span: herda trace-id, cria novo span-id, referencia parent-id. Registra: operation, duration, status, tags"
          />
          <DiagramNode
            x={710} y={300} label="Service C" sublabel="span-id: ghi" icon="3️⃣"
            color={COLORS.purple} width={95} height={45}
            opacity={d.getOpacity(5)} active={d.isActive('spans')}
            tooltip="Leaf span: último serviço na cadeia. Latência total = soma dos spans + network overhead. Waterfall view no Jaeger"
          />
          <DiagramEdge from={{ x: 575, y: 322 }} to={{ x: 595, y: 322 }} color="green" label="header" opacity={d.getOpacity(5)} />
          <DiagramEdge from={{ x: 690, y: 322 }} to={{ x: 710, y: 322 }} color="purple" label="header" opacity={d.getOpacity(5)} />
        </DiagramGroup>

        {/* Golden Signals */}
        <DiagramGroup x={460} y={410} width={380} height={90} label="Golden Signals" color={COLORS.amber} opacity={d.getOpacity(6)}>
          <text x={480} y={445} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={480} dy={0} opacity={d.getOpacity(6)}>USE (infra): Utilization | Saturation | Errors</tspan>
            <tspan x={480} dy={16} opacity={d.getOpacity(6)}>RED (svc):  Rate | Errors | Duration</tspan>
            <tspan x={480} dy={16} opacity={d.getOpacity(6)}>Four Golden: Latency|Traffic|Errors|Saturation</tspan>
          </text>
        </DiagramGroup>

        {/* SLI/SLO/SLA */}
        <DiagramGroup x={20} y={450} width={400} height={80} label="Service Level Objectives" color={COLORS.cyan} opacity={d.getOpacity(7)}>
          <text x={40} y={485} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={40} dy={0} opacity={d.getOpacity(7)}>SLI: p99 latency {'<'} 200ms (medição)</tspan>
            <tspan x={40} dy={16} opacity={d.getOpacity(7)}>SLO: 99.9% dos requests {'<'} 200ms (objetivo)</tspan>
            <tspan x={40} dy={16} opacity={d.getOpacity(7)}>SLA: 99.9% uptime, senão crédito 10% (contrato)</tspan>
          </text>
        </DiagramGroup>
        <DiagramBadge x={220} y={445} text="ERROR BUDGET" type="tradeoff" opacity={d.getOpacity(7)} />

        {/* Alerting */}
        <DiagramGroup x={460} y={530} width={500} height={70} label="Alerting Pipeline" color={COLORS.red} opacity={d.getOpacity(8)}>
          <DiagramNode
            x={480} y={548} label="Alertmanager" sublabel="Group + Dedup" icon="🚨"
            color={COLORS.red} width={120} height={40}
            opacity={d.getOpacity(8)} active={d.isActive('alerting')}
            tooltip="Recebe alerts do Prometheus. Agrupa por service/severity. Deduplica. Silencing e inhibition rules. Rota por severidade"
          />
          <DiagramNode
            x={620} y={548} label="PagerDuty" sublabel="On-call" icon="📟"
            color={COLORS.amber} width={100} height={40}
            opacity={d.getOpacity(8)} active={d.isActive('alerting')}
            tooltip="Critical alerts → PagerDuty → on-call engineer. Escalation policy: 5min → team lead → manager. Schedule rotation semanal"
          />
          <DiagramNode
            x={740} y={548} label="Slack" sublabel="Warning" icon="💬"
            color={COLORS.green} width={90} height={40}
            opacity={d.getOpacity(8)} active={d.isActive('alerting')}
            tooltip="Warning alerts → canal #alerts no Slack. Info alerts → canal #monitoring. Runbook link em cada alert"
          />
          <DiagramNode
            x={850} y={548} label="Grafana" sublabel="Dashboards" icon="📈"
            color={COLORS.orange} width={100} height={40}
            opacity={d.getOpacity(8)} active={d.isActive('alerting')}
            tooltip="Dashboards: Prometheus + Loki + Jaeger em um lugar. Template variables para filtrar por service/namespace. Auto-refresh 30s"
          />
          <DiagramEdge from={{ x: 600, y: 568 }} to={{ x: 620, y: 568 }} color="red" opacity={d.getOpacity(8)} />
          <DiagramEdge from={{ x: 720, y: 568 }} to={{ x: 740, y: 568 }} color="green" opacity={d.getOpacity(8)} />
          <DiagramEdge from={{ x: 830, y: 568 }} to={{ x: 850, y: 568 }} color="orange" opacity={d.getOpacity(8)} />
        </DiagramGroup>
      </DiagramCanvas>
    </DiagramShell>
  );
}
