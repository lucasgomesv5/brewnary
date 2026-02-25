import { DiagramCanvas, DiagramNode, DiagramEdge, DiagramBadge, DiagramGroup, DiagramShell, COLORS } from '../index';
import { useInteractiveDiagram, type DiagramStepDef } from '../useInteractiveDiagram';

const STEPS: DiagramStepDef[] = [
  { description: 'TCP/IP: 4 camadas — Application, Transport, Internet, Network Access (vs 7 do OSI)', activeElements: ['layers'] },
  { description: 'Encapsulation: dados → segment (TCP) → packet (IP) → frame (Ethernet) → bits', activeElements: ['encapsulation'] },
  { description: '3-way handshake: SYN → SYN-ACK → ACK — estabelece conexão com seq numbers', activeElements: ['handshake'] },
  { description: 'Sliding window: sender envia até window_size bytes sem esperar ACK individual', activeElements: ['window'] },
  { description: 'Slow Start: começa com IW10 (10 MSS, RFC 6928), dobra a cada RTT até ssthresh', activeElements: ['slow-start'] },
  { description: 'Congestion Avoidance: após ssthresh, cresce 1 MSS por RTT (linear) — evita saturar a rede', activeElements: ['congestion'] },
  { description: 'Fast Retransmit: 3 duplicate ACKs → retransmite imediatamente (sem esperar timeout)', activeElements: ['fast-retransmit'] },
  { description: 'Algoritmos: Reno (AIMD), Cubic (default Linux), BBR (Google — model-based, não loss-based)', activeElements: ['algorithms'] },
  { description: '4-way teardown: FIN → ACK → FIN → ACK — graceful connection close com TIME_WAIT', activeElements: ['teardown'] },
  { description: 'QUIC: UDP-based, 0-RTT, multiplexing sem HoL blocking, built-in encryption (TLS 1.3)', activeElements: ['quic'] },
];

export default function TCPIPStackDiagram() {
  const d = useInteractiveDiagram(STEPS);

  return (
    <DiagramShell
      title="TCP/IP Stack & Congestion Control"
      description="Stack TCP/IP, handshake, controle de congestionamento, e comparação com QUIC"
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
      <DiagramCanvas width={1100} height={650}>
        {/* 4 Layers */}
        <DiagramGroup x={20} y={20} width={280} height={250} label="TCP/IP Model" color={COLORS.cyan} opacity={d.getOpacity(0)}>
          <DiagramNode
            x={60} y={55} label="Application" sublabel="HTTP, DNS, SMTP" icon="📱"
            color={COLORS.blue} width={200} height={40}
            opacity={d.getOpacity(0)} active={d.isActive('layers')}
            tooltip="Camada de aplicação: protocolos de alto nível. HTTP/1.1, HTTP/2, HTTP/3, DNS, SMTP, FTP, WebSocket. Dados da aplicação"
          />
          <DiagramNode
            x={60} y={105} label="Transport" sublabel="TCP / UDP" icon="🔀"
            color={COLORS.green} width={200} height={40}
            opacity={d.getOpacity(0)} active={d.isActive('layers')}
            tooltip="Camada de transporte: TCP (confiável, ordered) ou UDP (fast, unordered). Port numbers (80, 443, 53). Segmentation"
          />
          <DiagramNode
            x={60} y={155} label="Internet" sublabel="IP (v4/v6)" icon="🌐"
            color={COLORS.orange} width={200} height={40}
            opacity={d.getOpacity(0)} active={d.isActive('layers')}
            tooltip="Camada de rede: IP addressing, routing (BGP, OSPF), packet forwarding. IPv4 (32-bit, NAT) vs IPv6 (128-bit). TTL, fragmentation"
          />
          <DiagramNode
            x={60} y={205} label="Network Access" sublabel="Ethernet, WiFi" icon="🔌"
            color={COLORS.purple} width={200} height={40}
            opacity={d.getOpacity(0)} active={d.isActive('layers')}
            tooltip="Camada de enlace: Ethernet (frames, MAC), WiFi (802.11), ARP (IP→MAC). MTU: 1500 bytes (Ethernet). CRC para error detection"
          />
        </DiagramGroup>

        {/* Encapsulation */}
        <DiagramGroup x={330} y={20} width={400} height={100} label="Encapsulation" color={COLORS.amber} opacity={d.getOpacity(1)}>
          <text x={350} y={55} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={350} dy={0} fill={COLORS.blue} opacity={d.getOpacity(1)}>Data        → Application (HTTP payload)</tspan>
            <tspan x={350} dy={16} fill={COLORS.green} opacity={d.getOpacity(1)}>Segment     → Transport (TCP header + data)</tspan>
            <tspan x={350} dy={16} fill={COLORS.orange} opacity={d.getOpacity(1)}>Packet      → Internet (IP header + segment)</tspan>
            <tspan x={350} dy={16} fill={COLORS.purple} opacity={d.getOpacity(1)}>Frame       → Link (ETH header + packet + CRC)</tspan>
          </text>
        </DiagramGroup>
        <DiagramBadge x={530} y={15} text="PDU" type="info" opacity={d.getOpacity(1)} />

        {/* 3-Way Handshake */}
        <DiagramGroup x={20} y={290} width={300} height={200} label="3-Way Handshake" color={COLORS.green} opacity={d.getOpacity(2)}>
          <DiagramNode x={40} y={325} label="Client" color={COLORS.blue} width={80} height={35} opacity={d.getOpacity(2)} active={d.isActive('handshake')}
            tooltip="Client inicia conexão enviando SYN com seq number aleatório. Estado: SYN_SENT" />
          <DiagramNode x={210} y={325} label="Server" color={COLORS.green} width={80} height={35} opacity={d.getOpacity(2)} active={d.isActive('handshake')}
            tooltip="Server responde SYN-ACK: seu seq number + ack do client. Estado: SYN_RECEIVED" />

          <DiagramEdge from={{ x: 120, y: 370 }} to={{ x: 210, y: 390 }} color="blue" label="SYN seq=100" opacity={d.getOpacity(2)} />
          <DiagramEdge from={{ x: 210, y: 410 }} to={{ x: 120, y: 430 }} color="green" label="SYN-ACK seq=300 ack=101" opacity={d.getOpacity(2)} />
          <DiagramEdge from={{ x: 120, y: 450 }} to={{ x: 210, y: 470 }} color="blue" label="ACK ack=301" opacity={d.getOpacity(2)} />
        </DiagramGroup>
        <DiagramBadge x={170} y={285} text="1 RTT" type="latency" opacity={d.getOpacity(2)} />

        {/* Sliding Window */}
        <DiagramGroup x={340} y={140} width={290} height={100} label="Sliding Window" color={COLORS.blue} opacity={d.getOpacity(3)}>
          <text x={360} y={175} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={360} dy={0} opacity={d.getOpacity(3)}>Window Size = min(cwnd, rwnd)</tspan>
            <tspan x={360} dy={16} opacity={d.getOpacity(3)}>cwnd: congestion window (sender)</tspan>
            <tspan x={360} dy={16} opacity={d.getOpacity(3)}>rwnd: receive window (receiver)</tspan>
            <tspan x={360} dy={16} opacity={d.getOpacity(3)}>Throughput ≈ window_size / RTT</tspan>
          </text>
        </DiagramGroup>

        {/* Congestion Control */}
        <DiagramGroup x={340} y={270} width={420} height={220} label="Congestion Control" color={COLORS.red} opacity={d.getOpacity(4)}>
          {/* Slow Start */}
          <DiagramNode
            x={360} y={305} label="Slow Start" sublabel="Exponential" icon="🚀"
            color={COLORS.green} width={110} height={48}
            opacity={d.getOpacity(4)} active={d.isActive('slow-start')}
            tooltip="cwnd começa em IW10 (10 MSS ≈ 14.6KB, RFC 6928 — Linux 3.1+). Dobra a cada RTT até ssthresh. Exponencial: probe rápido da capacidade da rede"
          />
          <DiagramBadge x={415} y={297} text="cwnd × 2/RTT" type="throughput" opacity={d.getOpacity(4)} />

          {/* Congestion Avoidance */}
          <DiagramNode
            x={500} y={305} label="Cong. Avoidance" sublabel="Linear" icon="📈"
            color={COLORS.amber} width={120} height={48}
            opacity={d.getOpacity(5)} active={d.isActive('congestion')}
            tooltip="Após ssthresh: cwnd += 1 MSS por RTT (linear, AIMD). Crescimento conservador. Detecção de congestionamento: packet loss ou ECN"
          />
          <DiagramEdge from={{ x: 470, y: 329 }} to={{ x: 500, y: 329 }} color="amber" label="ssthresh" opacity={d.getOpacity(5)} />
          <DiagramBadge x={560} y={297} text="cwnd + 1/RTT" type="latency" opacity={d.getOpacity(5)} />

          {/* Fast Retransmit */}
          <DiagramNode
            x={650} y={305} label="Fast Retransmit" sublabel="3 dup ACKs" icon="⚡"
            color={COLORS.red} width={100} height={48}
            opacity={d.getOpacity(6)} active={d.isActive('fast-retransmit')}
            tooltip="3 duplicate ACKs: packet perdido. Retransmite sem esperar RTO timeout. ssthresh = cwnd/2. cwnd = ssthresh (Fast Recovery em Reno)"
          />
          <DiagramEdge from={{ x: 620, y: 329 }} to={{ x: 650, y: 329 }} color="red" label="loss!" opacity={d.getOpacity(6)} />

          {/* Algorithms */}
          <DiagramGroup x={360} y={380} width={380} height={90} label="Congestion Algorithms" color={COLORS.purple} opacity={d.getOpacity(7)}>
            <DiagramNode x={380} y={405} label="Reno" sublabel="AIMD" color={COLORS.blue} width={80} height={35}
              opacity={d.getOpacity(7)} active={d.isActive('algorithms')}
              tooltip="Reno: Additive Increase, Multiplicative Decrease. Clássico. Loss-based: reage a packet loss. Sawtooth pattern" />
            <DiagramNode x={475} y={405} label="Cubic" sublabel="Linux default" color={COLORS.purple} width={90} height={35}
              opacity={d.getOpacity(7)} active={d.isActive('algorithms')}
              tooltip="Cubic: default no Linux. Função cúbica para crescimento de cwnd. Mais agressivo que Reno em redes de alta bandwidth. Loss-based" />
            <DiagramNode x={580} y={405} label="BBR" sublabel="Google" color={COLORS.green} width={80} height={35}
              opacity={d.getOpacity(7)} active={d.isActive('algorithms')}
              tooltip="BBR: Bottleneck Bandwidth and RTT. Model-based (não loss-based). Estima bandwidth e RTT mínimo. Throughput varia: melhoria significativa em redes com perda de pacotes" />
            <DiagramNode x={675} y={405} label="QUIC CC" sublabel="Custom" color={COLORS.cyan} width={50} height={35}
              opacity={d.getOpacity(7)} active={d.isActive('algorithms')}
              tooltip="QUIC usa congestion control plugável. Default: Cubic-like. Google usa BBR v2. Customizável por aplicação" />
          </DiagramGroup>
        </DiagramGroup>

        {/* 4-Way Teardown */}
        <DiagramGroup x={20} y={510} width={300} height={120} label="4-Way Teardown" color={COLORS.amber} opacity={d.getOpacity(8)}>
          <text x={40} y={545} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={40} dy={0} opacity={d.getOpacity(8)}>Client → FIN     (quero fechar)</tspan>
            <tspan x={40} dy={14} opacity={d.getOpacity(8)}>Server → ACK     (ok, recebi)</tspan>
            <tspan x={40} dy={14} opacity={d.getOpacity(8)}>Server → FIN     (eu também)</tspan>
            <tspan x={40} dy={14} opacity={d.getOpacity(8)}>Client → ACK     (ok, TIME_WAIT 2×MSL)</tspan>
          </text>
          <DiagramBadge x={170} y={502} text="TIME_WAIT 60s" type="warn" opacity={d.getOpacity(8)} />
        </DiagramGroup>

        {/* QUIC */}
        <DiagramGroup x={340} y={510} width={420} height={120} label="QUIC (HTTP/3)" color={COLORS.cyan} opacity={d.getOpacity(9)}>
          <DiagramNode
            x={360} y={545} label="0-RTT" sublabel="Resumption" icon="⚡"
            color={COLORS.cyan} width={80} height={40}
            opacity={d.getOpacity(9)} active={d.isActive('quic')}
            tooltip="0-RTT connection establishment para conexões repetidas (TLS session resumption). vs TCP+TLS: 2-3 RTTs. Economia de ~100-300ms"
          />
          <DiagramNode
            x={460} y={545} label="Multiplexing" sublabel="No HoL blocking" icon="🔀"
            color={COLORS.green} width={110} height={40}
            opacity={d.getOpacity(9)} active={d.isActive('quic')}
            tooltip="Streams independentes: perda em um stream não bloqueia outros (vs TCP: HoL blocking). Ideal para HTTP/3 multiplexing"
          />
          <DiagramNode
            x={590} y={545} label="Built-in TLS" sublabel="TLS 1.3" icon="🔐"
            color={COLORS.purple} width={100} height={40}
            opacity={d.getOpacity(9)} active={d.isActive('quic')}
            tooltip="Encryption obrigatório (TLS 1.3 integrado). Headers também encriptados (vs TCP: plaintext headers). Connection migration (mudar de rede sem reconectar)"
          />
          <DiagramNode
            x={710} y={545} label="UDP Based" sublabel="User-space" icon="📡"
            color={COLORS.orange} width={90} height={40}
            opacity={d.getOpacity(9)} active={d.isActive('quic')}
            tooltip="Implementado sobre UDP (bypassa ossificação do TCP nos middleboxes). User-space: atualizações sem mudar kernel. Connection ID para mobilidade"
          />
        </DiagramGroup>

        {/* TCP vs QUIC comparison */}
        <DiagramGroup x={780} y={140} width={290} height={130} label="TCP vs QUIC" color={COLORS.amber} opacity={d.getOpacity(9)}>
          <text x={800} y={175} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={800} dy={0}>              TCP+TLS    QUIC</tspan>
            <tspan x={800} dy={16}>Handshake:  2-3 RTT    0-1 RTT</tspan>
            <tspan x={800} dy={16}>HoL Block:  yes        no</tspan>
            <tspan x={800} dy={16}>Encryption: optional   always</tspan>
            <tspan x={800} dy={16}>Migration:  no         yes</tspan>
          </text>
        </DiagramGroup>
      </DiagramCanvas>
    </DiagramShell>
  );
}
