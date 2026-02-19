import AlgorithmShell from '../algorithms/AlgorithmShell';
import { DiagramCanvas, DiagramNode, DiagramEdge, DiagramBadge, DiagramGroup, COLORS } from './index';
import { useInteractiveDiagram, type DiagramStepDef } from './useInteractiveDiagram';

const STEPS: DiagramStepDef[] = [
  { description: 'Usuários acessam a aplicação pela internet', activeElements: ['users'] },
  { description: 'CloudFront distribui conteúdo via CDN + WAF filtra tráfego', activeElements: ['cloudfront', 'edge-cf'] },
  { description: 'VPC isola a rede + Public Subnet expõe ALB e NAT', activeElements: ['alb', 'nat', 'bastion', 'edge-alb'] },
  { description: 'ALB distribui para os targets no ECS', activeElements: ['ecs-task1', 'ecs-task2', 'edge-targets'] },
  { description: 'Serviços acessam RDS (PostgreSQL) e ElastiCache (Redis)', activeElements: ['rds', 'elasticache', 'edge-queries', 'edge-cache'] },
  { description: 'SQS para processamento assíncrono + S3 para object storage', activeElements: ['sqs', 's3', 'edge-async', 'edge-s3'] },
  { description: 'CloudWatch coleta logs e métricas de toda infraestrutura', activeElements: ['cloudwatch', 'edge-metrics'] },
];

export default function AwsArchitectureDiagram() {
  const d = useInteractiveDiagram(STEPS);

  return (
    <AlgorithmShell
      title="Arquitetura AWS de Produção"
      description="Build-up de infraestrutura AWS: do usuário ao banco de dados"
      totalSteps={d.totalSteps}
      currentStep={d.currentStep}
      stepDescription={d.stepDescription}
      onStep={d.handleStep}
      onReset={d.handleReset}
      isComplete={d.isComplete}
      color="#f97316"
    >
      <DiagramCanvas width={1100} height={650}>
        <DiagramNode
          x={480} y={20} label="Usuários" icon="🌐" color={COLORS.textMuted} width={140} height={55}
          opacity={d.getOpacity(0)} active={d.isActive('users')}
          tooltip="Tráfego externo vindo de browsers e apps mobile ao redor do mundo"
        />

        <DiagramNode
          x={480} y={110} label="CloudFront" sublabel="CDN + WAF" icon="🛡️"
          color={COLORS.orange} width={140} height={65}
          opacity={d.getOpacity(1)} active={d.isActive('cloudfront')}
          tooltip="CDN global da AWS com WAF integrado — cache na borda + proteção contra DDoS"
        />
        <DiagramEdge from={{ x: 550, y: 75 }} to={{ x: 550, y: 110 }} color="orange" opacity={d.getOpacity(1)} />

        <DiagramGroup x={40} y={210} width={1020} height={400} label="VPC 10.0.0.0/16" color={COLORS.blue} opacity={d.getOpacity(2)}>
          <DiagramGroup x={60} y={240} width={460} height={150} label="Public Subnet (10.0.1.0/24)" color={COLORS.green} opacity={d.getOpacity(2)}>
            <DiagramNode
              x={80} y={270} label="ALB" sublabel="Application LB" icon="⚖️"
              color={COLORS.green} width={130} height={60}
              opacity={d.getOpacity(2)} active={d.isActive('alb')}
              tooltip="Application Load Balancer que distribui tráfego HTTP/HTTPS entre targets do ECS"
            />
            <DiagramNode
              x={250} y={270} label="NAT Gateway" sublabel="Saída Internet" icon="🔀"
              color={COLORS.green} width={130} height={60}
              opacity={d.getOpacity(2)} active={d.isActive('nat')}
              tooltip="Permite que recursos na subnet privada acessem a internet sem exposição direta"
            />
            <DiagramNode
              x={400} y={270} label="Bastion Host" sublabel="SSH Jump" icon="🔑"
              color={COLORS.amber} width={100} height={60}
              opacity={d.getOpacity(2)} active={d.isActive('bastion')}
              tooltip="Servidor jump para acesso SSH seguro aos recursos na subnet privada"
            />
          </DiagramGroup>

          <DiagramGroup x={60} y={410} width={980} height={180} label="Private Subnet (10.0.2.0/24)" color={COLORS.purple} opacity={d.getOpacity(3)}>
            <DiagramGroup x={80} y={440} width={320} height={130} label="ECS Cluster" color={COLORS.blue} opacity={d.getOpacity(3)}>
              <DiagramNode
                x={100} y={470} label="Task 1" sublabel="API Service" icon="📦"
                color={COLORS.blue} width={120} height={55}
                opacity={d.getOpacity(3)} active={d.isActive('ecs-task1')}
                tooltip="Container ECS rodando a API — auto-scaled com Fargate ou EC2"
              />
              <DiagramNode
                x={260} y={470} label="Task 2" sublabel="API Service" icon="📦"
                color={COLORS.blue} width={120} height={55}
                opacity={d.getOpacity(3)} active={d.isActive('ecs-task2')}
                tooltip="Segunda task do ECS — réplica para alta disponibilidade e distribuição de carga"
              />
            </DiagramGroup>

            <DiagramNode
              x={440} y={470} label="RDS" sublabel="PostgreSQL" icon="🗄️"
              color={COLORS.cyan} width={120} height={60}
              opacity={d.getOpacity(4)} active={d.isActive('rds')}
              tooltip="Banco relacional gerenciado (PostgreSQL) com backups automáticos e failover"
            />
            <DiagramBadge x={500} y={460} text="SPOF" type="spof" opacity={d.getOpacity(4)} />

            <DiagramNode
              x={600} y={470} label="ElastiCache" sublabel="Redis" icon="⚡"
              color={COLORS.red} width={120} height={60}
              opacity={d.getOpacity(4)} active={d.isActive('elasticache')}
              tooltip="Redis gerenciado para cache, sessions e pub/sub — reduz latência de queries"
            />

            <DiagramNode
              x={760} y={470} label="SQS" sublabel="Message Queue" icon="📨"
              color={COLORS.orange} width={120} height={60}
              opacity={d.getOpacity(5)} active={d.isActive('sqs')}
              tooltip="Fila de mensagens gerenciada para processamento assíncrono e desacoplamento"
            />

            <DiagramNode
              x={920} y={470} label="S3" sublabel="Object Storage" icon="🪣"
              color={COLORS.green} width={100} height={60}
              opacity={d.getOpacity(5)} active={d.isActive('s3')}
              tooltip="Object storage virtualmente ilimitado para arquivos, backups e data lake"
            />
          </DiagramGroup>
        </DiagramGroup>

        <DiagramNode
          x={940} y={130} label="CloudWatch" sublabel="Logs & Metrics" icon="📊"
          color={COLORS.amber} width={130} height={60}
          opacity={d.getOpacity(6)} active={d.isActive('cloudwatch')}
          tooltip="Centraliza logs, métricas e alertas de toda a infraestrutura AWS"
        />

        <DiagramEdge from={{ x: 550, y: 175 }} to={{ x: 145, y: 270 }} color="orange" label="HTTPS" opacity={d.getOpacity(2)} />
        <DiagramEdge from={{ x: 145, y: 330 }} to={{ x: 160, y: 470 }} color="green" label="Targets" opacity={d.getOpacity(3)} />
        <DiagramEdge from={{ x: 220, y: 497 }} to={{ x: 440, y: 500 }} color="blue" label="Queries" opacity={d.getOpacity(4)} />
        <DiagramEdge from={{ x: 220, y: 497 }} to={{ x: 600, y: 500 }} color="blue" label="Cache" curved opacity={d.getOpacity(4)} />
        <DiagramEdge from={{ x: 380, y: 497 }} to={{ x: 760, y: 500 }} color="blue" dashed label="Async" opacity={d.getOpacity(5)} />
        <DiagramEdge from={{ x: 820, y: 470 }} to={{ x: 970, y: 470 }} color="orange" opacity={d.getOpacity(5)} />
        <DiagramEdge from={{ x: 1005, y: 190 }} to={{ x: 1005, y: 410 }} color="amber" dashed label="Metrics" opacity={d.getOpacity(6)} />

        <DiagramBadge x={145} y={260} text="LOAD 70%" type="load" opacity={d.getOpacity(2)} />
      </DiagramCanvas>
    </AlgorithmShell>
  );
}
