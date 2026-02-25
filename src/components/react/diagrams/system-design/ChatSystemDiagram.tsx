import { DiagramCanvas, DiagramNode, DiagramEdge, DiagramBadge, DiagramGroup, DiagramShell, COLORS } from '../index';
import { useInteractiveDiagram, type DiagramStepDef } from '../useInteractiveDiagram';

const STEPS: DiagramStepDef[] = [
  { description: 'WebSocket Gateway aceita conexões persistentes — milhões de conexões simultâneas', activeElements: ['ws-gw'] },
  { description: 'Connection Manager (Redis) mapeia userId → serverId para roteamento direto', activeElements: ['conn-mgr'] },
  { description: 'Message Service processa, valida e persiste mensagens', activeElements: ['msg-service'] },
  { description: 'Cassandra armazena mensagens — particionada por chatId, ordered por timestamp', activeElements: ['cassandra'] },
  { description: 'Kafka distribui mensagens via fan-out para todos os destinatários', activeElements: ['kafka'] },
  { description: 'Delivery guarantees: ✓ sent → ✓✓ delivered → 🔵 read com ACKs bidirecionais', activeElements: ['delivery'] },
  { description: 'Presence service via heartbeat a cada 30s — online/offline/typing/last seen', activeElements: ['presence'] },
  { description: 'Push notifications (APNs/FCM) para usuários offline', activeElements: ['push'] },
  { description: 'Group messages: fan-out on write (< 500 membros) vs fan-out on read (> 500)', activeElements: ['group'] },
  { description: 'End-to-end encryption via Signal Protocol — servidor nunca vê plaintext', activeElements: ['e2e'] },
  { description: 'Media upload via S3 pre-signed URLs — upload direto sem passar pelo server', activeElements: ['media'] },
];

export default function ChatSystemDiagram() {
  const d = useInteractiveDiagram(STEPS);

  return (
    <DiagramShell
      title="Chat System (WhatsApp-scale)"
      description="Arquitetura de um sistema de mensagens real-time para bilhões de mensagens/dia"
      totalSteps={d.totalSteps}
      currentStep={d.currentStep}
      stepDescription={d.stepDescription}
      onStep={d.handleStep}
      onReset={d.handleReset}
      isComplete={d.isComplete}
      showAll={d.showAll}
      onShowAll={d.handleShowAll}
      color="#22c55e"
    >
      <DiagramCanvas width={1100} height={650}>
        {/* Clients */}
        <DiagramNode
          x={20} y={40} label="Client A" sublabel="Mobile/Web" icon="📱"
          color={COLORS.textMuted} width={110} height={55}
          opacity={d.getOpacity(0)} active={d.isActive('ws-gw')}
          tooltip="Cliente mobile ou web conectado via WebSocket. Mantém conexão persistente com heartbeat"
        />
        <DiagramNode
          x={20} y={540} label="Client B" sublabel="Mobile/Web" icon="📱"
          color={COLORS.textMuted} width={110} height={55}
          opacity={d.getOpacity(0)} active={d.isActive('ws-gw')}
          tooltip="Destinatário da mensagem. Se online, recebe via WebSocket; se offline, via push notification"
        />

        {/* WS Gateway */}
        <DiagramNode
          x={190} y={250} label="WS Gateway" sublabel="WebSocket" icon="🔌"
          color={COLORS.green} width={130} height={65}
          opacity={d.getOpacity(0)} active={d.isActive('ws-gw')}
          tooltip="Gateway WebSocket com epoll/kqueue. Cada server suporta ~500K conexões. Load balanced por consistent hashing"
        />
        <DiagramEdge from={{ x: 130, y: 67 }} to={{ x: 190, y: 270 }} color="green" label="WS" opacity={d.getOpacity(0)} />
        <DiagramEdge from={{ x: 130, y: 567 }} to={{ x: 190, y: 297 }} color="green" label="WS" opacity={d.getOpacity(0)} />
        <DiagramBadge x={255} y={240} text="500K conn/srv" type="throughput" opacity={d.getOpacity(0)} />

        {/* Connection Manager */}
        <DiagramNode
          x={190} y={130} label="Conn Manager" sublabel="Redis Cluster" icon="🗺️"
          color={COLORS.red} width={130} height={65}
          opacity={d.getOpacity(1)} active={d.isActive('conn-mgr')}
          tooltip="Redis Cluster mapeia userId → {serverId, connId}. Lookup O(1). Permite roteamento direto sem broadcast"
        />
        <DiagramEdge from={{ x: 255, y: 250 }} to={{ x: 255, y: 195 }} color="red" dashed opacity={d.getOpacity(1)} />

        {/* Message Service */}
        <DiagramNode
          x={380} y={250} label="Message Service" sublabel="Validate & Route" icon="⚙️"
          color={COLORS.blue} width={140} height={65}
          opacity={d.getOpacity(2)} active={d.isActive('msg-service')}
          tooltip="Valida mensagem (tamanho, formato, rate limit), atribui messageId (Snowflake), timestamp do servidor, roteia para destino"
        />
        <DiagramEdge from={{ x: 320, y: 282 }} to={{ x: 380, y: 282 }} color="blue" opacity={d.getOpacity(2)} />

        {/* Cassandra */}
        <DiagramNode
          x={380} y={390} label="Cassandra" sublabel="Messages Store" icon="🗄️"
          color={COLORS.cyan} width={140} height={65}
          opacity={d.getOpacity(3)} active={d.isActive('cassandra')}
          tooltip="Partition key: chatId, Clustering key: timestamp DESC. Write-optimized (LSM-tree). Replication factor 3. TTL opcional"
        />
        <DiagramEdge from={{ x: 450, y: 315 }} to={{ x: 450, y: 390 }} color="cyan" label="persist" opacity={d.getOpacity(3)} />
        <DiagramBadge x={450} y={380} text="RF=3" type="info" opacity={d.getOpacity(3)} />

        {/* Kafka */}
        <DiagramNode
          x={580} y={250} label="Kafka" sublabel="Message Fan-out" icon="📨"
          color={COLORS.orange} width={130} height={65}
          opacity={d.getOpacity(4)} active={d.isActive('kafka')}
          tooltip="Topic: chat-messages, particionado por recipientId. Consumer groups por WS Gateway server. Garante ordenação por partition"
        />
        <DiagramEdge from={{ x: 520, y: 282 }} to={{ x: 580, y: 282 }} color="orange" opacity={d.getOpacity(4)} />

        {/* Delivery */}
        <DiagramGroup x={570} y={380} width={200} height={110} label="Delivery Status" color={COLORS.green} opacity={d.getOpacity(5)}>
          <text x={590} y={420} fill={COLORS.text} fontSize={11} fontFamily="JetBrains Mono, monospace">
            <tspan x={590} dy={0} opacity={d.getOpacity(5)}>✓  sent (server ACK)</tspan>
            <tspan x={590} dy={18} opacity={d.getOpacity(5)}>✓✓ delivered (client ACK)</tspan>
            <tspan x={590} dy={18} opacity={d.getOpacity(5)}>🔵 read (read receipt)</tspan>
          </text>
        </DiagramGroup>

        {/* Presence */}
        <DiagramNode
          x={770} y={130} label="Presence" sublabel="Heartbeat 30s" icon="💚"
          color={COLORS.green} width={130} height={65}
          opacity={d.getOpacity(6)} active={d.isActive('presence')}
          tooltip="Heartbeat a cada 30s. Estados: online, offline, typing. Last seen com precisão de 1 min para privacidade. Redis EXPIRE para auto-cleanup"
        />
        <DiagramEdge from={{ x: 710, y: 267 }} to={{ x: 770, y: 175 }} color="green" dashed label="heartbeat" opacity={d.getOpacity(6)} />
        <DiagramBadge x={835} y={122} text="TTL 30s" type="latency" opacity={d.getOpacity(6)} />

        {/* Push */}
        <DiagramNode
          x={770} y={250} label="Push Service" sublabel="APNs / FCM" icon="🔔"
          color={COLORS.amber} width={130} height={65}
          opacity={d.getOpacity(7)} active={d.isActive('push')}
          tooltip="APNs (iOS) e FCM (Android) para usuários offline. Batching para eficiência. Rate limit por dispositivo"
        />
        <DiagramEdge from={{ x: 710, y: 282 }} to={{ x: 770, y: 282 }} color="amber" label="offline" dashed opacity={d.getOpacity(7)} />

        {/* Group fan-out */}
        <DiagramGroup x={790} y={380} width={280} height={110} label="Group Strategy" color={COLORS.purple} opacity={d.getOpacity(8)}>
          <text x={810} y={420} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={810} dy={0} opacity={d.getOpacity(8)}>{'< 500 membros: fan-out on WRITE'}</tspan>
            <tspan x={810} dy={16} opacity={d.getOpacity(8)}>{'> 500 membros: fan-out on READ'}</tspan>
            <tspan x={810} dy={16} opacity={d.getOpacity(8)}>Hot groups: híbrido com cache</tspan>
          </text>
        </DiagramGroup>

        {/* E2E Encryption */}
        <DiagramNode
          x={940} y={130} label="E2E Encryption" sublabel="Signal Protocol" icon="🔐"
          color={COLORS.red} width={140} height={65}
          opacity={d.getOpacity(9)} active={d.isActive('e2e')}
          tooltip="Signal Protocol: Double Ratchet + X3DH key agreement. Pre-keys no servidor. Servidor nunca acessa plaintext. Forward secrecy"
        />

        {/* Media */}
        <DiagramNode
          x={940} y={250} label="S3 Media" sublabel="Pre-signed URL" icon="🖼️"
          color={COLORS.green} width={140} height={65}
          opacity={d.getOpacity(10)} active={d.isActive('media')}
          tooltip="Upload direto para S3 via pre-signed URL (15min TTL). Thumbnail gerado via Lambda. CDN para delivery. Max 100MB"
        />
        <DiagramBadge x={1010} y={242} text="100MB max" type="warn" opacity={d.getOpacity(10)} />
      </DiagramCanvas>
    </DiagramShell>
  );
}
