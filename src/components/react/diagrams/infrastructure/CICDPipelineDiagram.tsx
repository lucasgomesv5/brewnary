import { DiagramCanvas, DiagramNode, DiagramEdge, DiagramBadge, DiagramGroup, DiagramShell, COLORS } from '../index';
import { useInteractiveDiagram, type DiagramStepDef } from '../useInteractiveDiagram';

const STEPS: DiagramStepDef[] = [
  { description: 'Developer faz git push — trigger via webhook para o CI server', activeElements: ['git'] },
  { description: 'Webhook dispara pipeline — GitHub Actions / Jenkins / GitLab CI', activeElements: ['webhook'] },
  { description: 'Build: compilação + Docker image com multi-stage build para tamanho mínimo', activeElements: ['build'] },
  { description: 'Testes automatizados: unit (< 5min) + integration (< 15min) + e2e', activeElements: ['tests'] },
  { description: 'SAST: análise estática (SonarQube) + dependency scan (Snyk) para vulnerabilidades', activeElements: ['sast'] },
  { description: 'DAST: testes dinâmicos de segurança contra a aplicação rodando', activeElements: ['dast'] },
  { description: 'Artifact: push image para registry com image signing (cosign/notary)', activeElements: ['artifact'] },
  { description: 'Deploy strategies: Canary (1% → 5% → 25% → 100%), Blue-Green, Rolling', activeElements: ['deploy'] },
  { description: 'Monitoring gate: error rate < 0.1%, p99 < 200ms por 10min antes de promover', activeElements: ['monitor'] },
  { description: 'Rollback automático + feature flags para desabilitar funcionalidades sem deploy', activeElements: ['rollback'] },
];

export default function CICDPipelineDiagram() {
  const d = useInteractiveDiagram(STEPS);

  return (
    <DiagramShell
      title="CI/CD Pipeline"
      description="Pipeline completo de integração e entrega contínua: do git push ao rollback automático"
      totalSteps={d.totalSteps}
      currentStep={d.currentStep}
      stepDescription={d.stepDescription}
      onStep={d.handleStep}
      onReset={d.handleReset}
      isComplete={d.isComplete}
      showAll={d.showAll}
      onShowAll={d.handleShowAll}
      color="#06b6d4"
    >
      <DiagramCanvas width={1100} height={620}>
        {/* Git Push */}
        <DiagramNode
          x={20} y={40} label="Git Push" sublabel="Feature Branch" icon="📝"
          color={COLORS.textMuted} width={120} height={60}
          opacity={d.getOpacity(0)} active={d.isActive('git')}
          tooltip="Developer faz push para feature branch. PR triggers CI. Trunk-based: commits direto na main com feature flags"
        />

        {/* Webhook */}
        <DiagramNode
          x={190} y={40} label="Webhook" sublabel="CI Trigger" icon="🔔"
          color={COLORS.cyan} width={120} height={60}
          opacity={d.getOpacity(1)} active={d.isActive('webhook')}
          tooltip="Webhook do GitHub/GitLab dispara pipeline. Event types: push, PR, tag. Filtros por branch e path. Concurrency control"
        />
        <DiagramEdge from={{ x: 140, y: 70 }} to={{ x: 190, y: 70 }} color="cyan" opacity={d.getOpacity(1)} />

        {/* Build */}
        <DiagramNode
          x={360} y={40} label="Build" sublabel="Docker Multi-stage" icon="🏗️"
          color={COLORS.blue} width={140} height={60}
          opacity={d.getOpacity(2)} active={d.isActive('build')}
          tooltip="Multi-stage Docker build: stage 1 (deps + build) → stage 2 (runtime only). Cache de layers. Image final ~50-100MB vs ~1GB"
        />
        <DiagramEdge from={{ x: 310, y: 70 }} to={{ x: 360, y: 70 }} color="blue" opacity={d.getOpacity(2)} />
        <DiagramBadge x={430} y={32} text="~50-100MB" type="info" opacity={d.getOpacity(2)} />

        {/* Tests */}
        <DiagramGroup x={340} y={130} width={350} height={120} label="Test Suite" color={COLORS.green} opacity={d.getOpacity(3)}>
          <DiagramNode
            x={360} y={165} label="Unit Tests" sublabel="< 5 min" icon="🧪"
            color={COLORS.green} width={95} height={50}
            opacity={d.getOpacity(3)} active={d.isActive('tests')}
            tooltip="Testes unitários isolados. Mocking de dependências externas. Coverage mínimo: 80%. Parallelization para velocidade"
          />
          <DiagramNode
            x={475} y={165} label="Integration" sublabel="< 15 min" icon="🔗"
            color={COLORS.green} width={95} height={50}
            opacity={d.getOpacity(3)} active={d.isActive('tests')}
            tooltip="Testes com banco real (testcontainers), API contracts (Pact), e interação entre serviços. Docker Compose para ambiente"
          />
          <DiagramNode
            x={590} y={165} label="E2E" sublabel="< 30 min" icon="🌐"
            color={COLORS.green} width={80} height={50}
            opacity={d.getOpacity(3)} active={d.isActive('tests')}
            tooltip="End-to-end com Playwright/Cypress. Subset crítico dos fluxos. Roda em staging. Flaky test quarantine"
          />
        </DiagramGroup>
        <DiagramEdge from={{ x: 430, y: 100 }} to={{ x: 430, y: 130 }} color="green" opacity={d.getOpacity(3)} />

        {/* SAST */}
        <DiagramNode
          x={550} y={40} label="SAST" sublabel="SonarQube + Snyk" icon="🔍"
          color={COLORS.amber} width={130} height={60}
          opacity={d.getOpacity(4)} active={d.isActive('sast')}
          tooltip="Static Application Security Testing: code smells, bugs, vulnerabilities. Snyk: dependency scan para CVEs conhecidas. Quality gate: 0 critical"
        />
        <DiagramEdge from={{ x: 500, y: 70 }} to={{ x: 550, y: 70 }} color="amber" opacity={d.getOpacity(4)} />
        <DiagramBadge x={615} y={32} text="0 CRITICAL" type="warn" opacity={d.getOpacity(4)} />

        {/* DAST */}
        <DiagramNode
          x={730} y={40} label="DAST" sublabel="Dynamic Scan" icon="🕵️"
          color={COLORS.red} width={120} height={60}
          opacity={d.getOpacity(5)} active={d.isActive('dast')}
          tooltip="Dynamic Application Security Testing: OWASP ZAP, Burp Suite. Testa contra a app rodando. SQLi, XSS, CSRF detection"
        />
        <DiagramEdge from={{ x: 680, y: 70 }} to={{ x: 730, y: 70 }} color="red" opacity={d.getOpacity(5)} />

        {/* Artifact */}
        <DiagramNode
          x={900} y={40} label="Registry" sublabel="Image Signing" icon="📦"
          color={COLORS.purple} width={130} height={60}
          opacity={d.getOpacity(6)} active={d.isActive('artifact')}
          tooltip="Push para ECR/GCR/DockerHub. Image signing com cosign (Sigstore). SBOM gerado (syft). Tag: git SHA + semver"
        />
        <DiagramEdge from={{ x: 850, y: 70 }} to={{ x: 900, y: 70 }} color="purple" opacity={d.getOpacity(6)} />
        <DiagramBadge x={965} y={32} text="SIGNED" type="fix" opacity={d.getOpacity(6)} />

        {/* Deploy Strategies */}
        <DiagramGroup x={30} y={300} width={600} height={130} label="Deploy Strategies" color={COLORS.cyan} opacity={d.getOpacity(7)}>
          <DiagramNode
            x={50} y={340} label="Canary" sublabel="1% → 100%" icon="🐤"
            color={COLORS.cyan} width={110} height={50}
            opacity={d.getOpacity(7)} active={d.isActive('deploy')}
            tooltip="Canary: 1% → 5% → 25% → 100% do tráfego. Rollback automático se métricas degradam. Progressão: 10min cada fase"
          />
          <DiagramNode
            x={180} y={340} label="Blue-Green" sublabel="Instant Switch" icon="🔄"
            color={COLORS.blue} width={120} height={50}
            opacity={d.getOpacity(7)} active={d.isActive('deploy')}
            tooltip="Dois ambientes idênticos. Switch no LB: blue (ativo) → green (novo). Rollback instantâneo. Custo: 2x infraestrutura"
          />
          <DiagramNode
            x={320} y={340} label="Rolling" sublabel="Pod by Pod" icon="🔃"
            color={COLORS.green} width={110} height={50}
            opacity={d.getOpacity(7)} active={d.isActive('deploy')}
            tooltip="Atualiza pods gradualmente: maxSurge=25%, maxUnavailable=0. Sem downtime. Duas versões coexistem temporariamente"
          />
          <DiagramNode
            x={450} y={340} label="A/B Test" sublabel="Feature Flag" icon="🧪"
            color={COLORS.purple} width={110} height={50}
            opacity={d.getOpacity(7)} active={d.isActive('deploy')}
            tooltip="Traffic split baseado em headers/cookies. Ideal para experimentação. Requer feature flag system (LaunchDarkly/Unleash)"
          />
        </DiagramGroup>
        <DiagramEdge from={{ x: 965, y: 100 }} to={{ x: 330, y: 300 }} color="cyan" label="deploy" opacity={d.getOpacity(7)} />

        {/* Monitoring Gate */}
        <DiagramGroup x={680} y={300} width={380} height={130} label="Monitoring Gate (10 min)" color={COLORS.amber} opacity={d.getOpacity(8)}>
          <DiagramNode
            x={700} y={338} label="Error Rate" sublabel="< 0.1%" icon="📉"
            color={COLORS.red} width={100} height={48}
            opacity={d.getOpacity(8)} active={d.isActive('monitor')}
            tooltip="5xx error rate deve ficar abaixo de 0.1% durante bake period de 10 min. Comparação com baseline da versão anterior"
          />
          <DiagramNode
            x={820} y={338} label="Latency p99" sublabel="< 200ms" icon="⏱️"
            color={COLORS.amber} width={100} height={48}
            opacity={d.getOpacity(8)} active={d.isActive('monitor')}
            tooltip="p99 latency não pode exceder 200ms (ou 2x baseline). p50, p95, p99 monitorados. Histograma para detectar bimodal"
          />
          <DiagramNode
            x={940} y={338} label="Saturation" sublabel="CPU/Mem" icon="📊"
            color={COLORS.cyan} width={100} height={48}
            opacity={d.getOpacity(8)} active={d.isActive('monitor')}
            tooltip="CPU < 70%, Memory < 80%. Pod restarts = 0. Connection pool utilization < 80%. Alertas se threshold excedido"
          />
        </DiagramGroup>
        <DiagramEdge from={{ x: 330, y: 430 }} to={{ x: 870, y: 430 }} color="amber" label="bake 10min" dashed opacity={d.getOpacity(8)} />

        {/* Rollback */}
        <DiagramGroup x={250} y={480} width={600} height={110} label="Safety Net" color={COLORS.red} opacity={d.getOpacity(9)}>
          <DiagramNode
            x={270} y={515} label="Auto Rollback" sublabel="< 30s" icon="⏪"
            color={COLORS.red} width={130} height={45}
            opacity={d.getOpacity(9)} active={d.isActive('rollback')}
            tooltip="Rollback automático se monitoring gate falha. Reverte para última imagem stable. Notificação no Slack. Incident ticket criado"
          />
          <DiagramNode
            x={430} y={515} label="Feature Flags" sublabel="LaunchDarkly" icon="🚩"
            color={COLORS.purple} width={130} height={45}
            opacity={d.getOpacity(9)} active={d.isActive('rollback')}
            tooltip="Desabilita funcionalidade sem novo deploy. Kill switch para emergências. Gradual rollout por % de usuários. A/B testing"
          />
          <DiagramNode
            x={590} y={515} label="Runbook" sublabel="Automation" icon="📋"
            color={COLORS.blue} width={130} height={45}
            opacity={d.getOpacity(9)} active={d.isActive('rollback')}
            tooltip="Runbooks automatizados para incidentes comuns. PagerDuty integration. Escalation policy. Post-mortem template"
          />
        </DiagramGroup>
      </DiagramCanvas>
    </DiagramShell>
  );
}
