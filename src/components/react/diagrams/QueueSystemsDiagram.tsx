import AlgorithmShell from '../algorithms/AlgorithmShell';
import { DiagramCanvas, DiagramNode, DiagramEdge, DiagramGroup, DiagramBadge, COLORS } from './index';
import { useInteractiveDiagram, type DiagramStepDef } from './useInteractiveDiagram';

const STEPS: DiagramStepDef[] = [
  { description: 'Producers: API Server, Cron Jobs e Webhooks geram eventos', activeElements: ['api-server', 'cron', 'webhooks'] },
  { description: 'Broker recebe mensagens e distribui por topics/partitions', activeElements: ['topic-p0', 'topic-p1', 'topic-p2', 'edge-prod-0', 'edge-prod-1', 'edge-prod-2'] },
  { description: 'Dead Letter Queue armazena mensagens com erro + Broker Cluster replica 3x', activeElements: ['dlq', 'broker-cluster', 'edge-dlq'] },
  { description: 'Consumer Offsets rastreiam posição + Retention define TTL das mensagens', activeElements: ['offsets', 'retention'] },
  { description: 'Consumer Groups processam mensagens em paralelo', activeElements: ['email', 'inventory', 'analytics', 'search', 'edge-cons-0', 'edge-cons-1', 'edge-cons-2', 'edge-cons-3'] },
  { description: 'Padrões de entrega: At-Most-Once, At-Least-Once, Exactly-Once', activeElements: ['at-most', 'at-least', 'exactly'] },
  { description: 'Padrões adicionais: Fan-Out para broadcast + FIFO para ordem garantida', activeElements: ['fan-out', 'fifo'] },
];

export default function QueueSystemsDiagram() {
  const d = useInteractiveDiagram(STEPS);

  return (
    <AlgorithmShell
      title="Sistemas de Filas"
      description="Producers → Brokers → Consumers: comunicação assíncrona entre serviços"
      totalSteps={d.totalSteps}
      currentStep={d.currentStep}
      stepDescription={d.stepDescription}
      onStep={d.handleStep}
      onReset={d.handleReset}
      isComplete={d.isComplete}
      color="#f97316"
    >
      <DiagramCanvas width={1050} height={600}>
        <DiagramGroup x={20} y={20} width={200} height={280} label="Producers" color={COLORS.blue} opacity={d.getOpacity(0)}>
          <DiagramNode
            x={40} y={55} label="API Server" sublabel="HTTP requests" icon="🌐"
            color={COLORS.blue} width={150} height={55}
            opacity={d.getOpacity(0)} active={d.isActive('api-server')}
            tooltip="Servidor HTTP que produz eventos quando processa requisições dos usuários"
          />
          <DiagramNode
            x={40} y={130} label="Cron Jobs" sublabel="Scheduled tasks" icon="⏰"
            color={COLORS.purple} width={150} height={55}
            opacity={d.getOpacity(0)} active={d.isActive('cron')}
            tooltip="Tarefas agendadas que geram eventos periodicamente (relatórios, limpeza, sync)"
          />
          <DiagramNode
            x={40} y={205} label="Webhooks" sublabel="External events" icon="🔔"
            color={COLORS.cyan} width={150} height={55}
            opacity={d.getOpacity(0)} active={d.isActive('webhooks')}
            tooltip="Eventos externos de serviços third-party como Stripe, GitHub e Twilio"
          />
        </DiagramGroup>

        <DiagramGroup x={280} y={20} width={480} height={400} label="Message Broker (Kafka / RabbitMQ / SQS)" color={COLORS.orange} opacity={d.getOpacity(1)}>
          <DiagramGroup x={300} y={55} width={200} height={250} label="Topics / Partitions" color={COLORS.amber} opacity={d.getOpacity(1)}>
            <DiagramNode
              x={315} y={85} label="orders.created" sublabel="Partition 0" icon="📋"
              color={COLORS.orange} width={160} height={50}
              opacity={d.getOpacity(1)} active={d.isActive('topic-p0')}
              tooltip="Partição 0 do topic — distribuição por hash da key garante ordem por pedido"
            />
            <DiagramNode
              x={315} y={150} label="orders.created" sublabel="Partition 1" icon="📋"
              color={COLORS.orange} width={160} height={50}
              opacity={d.getOpacity(1)} active={d.isActive('topic-p1')}
              tooltip="Partição 1 — paralelismo horizontal: cada partição processada independentemente"
            />
            <DiagramNode
              x={315} y={215} label="orders.created" sublabel="Partition 2" icon="📋"
              color={COLORS.orange} width={160} height={50}
              opacity={d.getOpacity(1)} active={d.isActive('topic-p2')}
              tooltip="Partição 2 — mais partições = maior throughput possível"
            />
          </DiagramGroup>

          <DiagramGroup x={540} y={55} width={200} height={130} label="Dead Letter Queue" color={COLORS.red} opacity={d.getOpacity(2)}>
            <DiagramNode
              x={560} y={85} label="DLQ" sublabel="Mensagens com erro" icon="💀"
              color={COLORS.red} width={160} height={55}
              opacity={d.getOpacity(2)} active={d.isActive('dlq')}
              tooltip="Armazena mensagens que falharam após todas as tentativas de retry — requer monitoramento"
            />
            <DiagramBadge x={640} y={75} text="MONITOR!" type="spof" opacity={d.getOpacity(2)} />
          </DiagramGroup>

          <DiagramNode
            x={540} y={210} label="Broker Cluster" sublabel="Replicação: 3x" icon="🔄"
            color={COLORS.green} width={180} height={55}
            opacity={d.getOpacity(2)} active={d.isActive('broker-cluster')}
            tooltip="3 instâncias replicadas para alta disponibilidade e tolerância a falhas de nó"
          />
          <DiagramBadge x={630} y={200} text="HA" type="fix" opacity={d.getOpacity(2)} />

          <DiagramNode
            x={300} y={330} label="Consumer Offsets" sublabel="__consumer_offsets" icon="📍"
            color={COLORS.textMuted} width={180} height={55}
            opacity={d.getOpacity(3)} active={d.isActive('offsets')}
            tooltip="Rastreia qual mensagem cada consumer group já processou — permite retomar de onde parou"
          />
          <DiagramNode
            x={540} y={330} label="Retention" sublabel="7 dias (default)" icon="📅"
            color={COLORS.textMuted} width={180} height={55}
            opacity={d.getOpacity(3)} active={d.isActive('retention')}
            tooltip="Mensagens ficam armazenadas por 7 dias (configurável) para replay e reprocessamento"
          />
        </DiagramGroup>

        <DiagramGroup x={820} y={20} width={210} height={340} label="Consumer Groups" color={COLORS.green} opacity={d.getOpacity(4)}>
          <DiagramNode
            x={840} y={55} label="Email Service" sublabel="Notificações" icon="📧"
            color={COLORS.green} width={160} height={50}
            opacity={d.getOpacity(4)} active={d.isActive('email')}
            tooltip="Envia notificações por email quando um pedido é criado ou atualizado"
          />
          <DiagramNode
            x={840} y={125} label="Inventory" sublabel="Atualiza estoque" icon="📦"
            color={COLORS.cyan} width={160} height={50}
            opacity={d.getOpacity(4)} active={d.isActive('inventory')}
            tooltip="Atualiza o estoque automaticamente quando um pedido é confirmado"
          />
          <DiagramNode
            x={840} y={195} label="Analytics" sublabel="Event tracking" icon="📊"
            color={COLORS.amber} width={160} height={50}
            opacity={d.getOpacity(4)} active={d.isActive('analytics')}
            tooltip="Registra eventos para análises de negócio, dashboards e tomada de decisão"
          />
          <DiagramNode
            x={840} y={265} label="Search Index" sublabel="Reindexação" icon="🔍"
            color={COLORS.purple} width={160} height={50}
            opacity={d.getOpacity(4)} active={d.isActive('search')}
            tooltip="Atualiza o índice de busca (Elasticsearch) com os novos dados do pedido"
          />
        </DiagramGroup>

        <DiagramEdge from={{ x: 190, y: 82 }} to={{ x: 315, y: 110 }} color="blue" label="Produce" opacity={d.getOpacity(1)} />
        <DiagramEdge from={{ x: 190, y: 157 }} to={{ x: 315, y: 175 }} color="purple" opacity={d.getOpacity(1)} />
        <DiagramEdge from={{ x: 190, y: 232 }} to={{ x: 315, y: 240 }} color="cyan" opacity={d.getOpacity(1)} />

        <DiagramEdge from={{ x: 475, y: 110 }} to={{ x: 840, y: 80 }} color="green" opacity={d.getOpacity(4)} />
        <DiagramEdge from={{ x: 475, y: 175 }} to={{ x: 840, y: 150 }} color="cyan" opacity={d.getOpacity(4)} />
        <DiagramEdge from={{ x: 475, y: 240 }} to={{ x: 840, y: 220 }} color="amber" opacity={d.getOpacity(4)} />
        <DiagramEdge from={{ x: 475, y: 240 }} to={{ x: 840, y: 290 }} color="purple" curved opacity={d.getOpacity(4)} />

        <DiagramEdge from={{ x: 500, y: 150 }} to={{ x: 560, y: 112 }} color="red" dashed label="Retry failed" opacity={d.getOpacity(2)} />

        <DiagramGroup x={20} y={440} width={1010} height={130} label="Padrões de Entrega" color={COLORS.textMuted} opacity={d.getOpacity(5)}>
          <DiagramNode
            x={40} y={475} label="At-Most-Once" sublabel="Fire and forget" icon="💨"
            color={COLORS.amber} width={160} height={55}
            opacity={d.getOpacity(5)} active={d.isActive('at-most')}
            tooltip="Mensagem enviada sem confirmação — pode perder dados, mas nunca duplica"
          />
          <DiagramNode
            x={220} y={475} label="At-Least-Once" sublabel="Ack after process" icon="✅"
            color={COLORS.green} width={160} height={55}
            opacity={d.getOpacity(5)} active={d.isActive('at-least')}
            tooltip="Ack após processamento — pode duplicar, mas nunca perde. Consumer deve ser idempotente"
          />
          <DiagramNode
            x={400} y={475} label="Exactly-Once" sublabel="Idempotency key" icon="🎯"
            color={COLORS.purple} width={160} height={55}
            opacity={d.getOpacity(5)} active={d.isActive('exactly')}
            tooltip="Idempotency key garante processamento exatamente uma vez — o mais difícil de implementar"
          />
          <DiagramNode
            x={580} y={475} label="Fan-Out" sublabel="1 msg → N consumers" icon="📢"
            color={COLORS.blue} width={160} height={55}
            opacity={d.getOpacity(6)} active={d.isActive('fan-out')}
            tooltip="Uma mensagem entregue a múltiplos consumers independentes — padrão pub/sub"
          />
          <DiagramNode
            x={760} y={475} label="FIFO" sublabel="Ordem garantida" icon="📋"
            color={COLORS.cyan} width={160} height={55}
            opacity={d.getOpacity(6)} active={d.isActive('fifo')}
            tooltip="Ordem de entrega garantida — essencial para eventos que dependem de sequência"
          />
        </DiagramGroup>
      </DiagramCanvas>
    </AlgorithmShell>
  );
}
