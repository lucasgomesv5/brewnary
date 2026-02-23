import AlgorithmShell from '../algorithms/AlgorithmShell';
import { DiagramCanvas, DiagramNode, DiagramEdge, DiagramBadge, DiagramGroup, COLORS } from './index';
import { useInteractiveDiagram, type DiagramStepDef } from './useInteractiveDiagram';

const STEPS: DiagramStepDef[] = [
  { description: 'Servidor único recebendo todo o tráfego', activeElements: ['server', 'users'] },
  { description: 'Escala vertical (scale-up): mais CPU, RAM e disco no mesmo servidor', activeElements: ['server-big'] },
  { description: 'Limites da escala vertical: teto de hardware e ponto único de falha (SPOF)', activeElements: ['limits'] },
  { description: 'Escala horizontal (scale-out): múltiplos servidores atrás de um load balancer', activeElements: ['lb', 'srv1', 'srv2', 'srv3'] },
  { description: 'Serviços stateless + estado compartilhado em banco e cache', activeElements: ['db', 'cache'] },
  { description: 'Replicação de dados: leitura distribuída entre réplicas', activeElements: ['replica'] },
  { description: 'Sharding: particionamento horizontal de dados entre múltiplos nós', activeElements: ['shard'] },
];

export default function ScalingDiagram() {
  const d = useInteractiveDiagram(STEPS);

  return (
    <AlgorithmShell
      title="Escalabilidade: Vertical vs Horizontal"
      description="Estratégias de escalabilidade, trade-offs e quando usar cada uma"
      totalSteps={d.totalSteps}
      currentStep={d.currentStep}
      stepDescription={d.stepDescription}
      onStep={d.handleStep}
      onReset={d.handleReset}
      isComplete={d.isComplete}
      color="#22c55e"
    >
      <DiagramCanvas width={1000} height={600}>
        {/* === Step 0: Single server === */}
        <DiagramNode
          x={420} y={20} label="Usuários" icon="🌐" color={COLORS.textMuted} width={160} height={55}
          opacity={d.getOpacity(0)} active={d.isActive('users')}
          tooltip="Clientes fazendo requisições ao servidor"
        />
        <DiagramEdge from={{ x: 500, y: 75 }} to={{ x: 500, y: 120 }} color="green" opacity={d.getOpacity(0)} />
        <DiagramNode
          x={420} y={120} label="Servidor Único" sublabel="CPU 4c / 8GB RAM" icon="🖥️"
          color={COLORS.blue} width={160} height={65}
          opacity={d.getOpacity(0)} active={d.isActive('server')}
          tooltip="Um único servidor atende todas as requisições — app, API e banco"
        />
        <DiagramEdge from={{ x: 500, y: 185 }} to={{ x: 500, y: 230 }} color="blue" opacity={d.getOpacity(0)} />
        <DiagramNode
          x={430} y={230} label="DB" sublabel="PostgreSQL" icon="🗄️"
          color={COLORS.cyan} width={140} height={60}
          opacity={d.getOpacity(0)} active={d.isActive('server')}
          tooltip="Banco de dados no mesmo servidor ou em instância dedicada"
        />

        {/* === Step 1: Vertical scaling === */}
        <DiagramGroup x={30} y={320} width={420} height={250} label="Escala Vertical (Scale-Up)" color={COLORS.amber} opacity={d.getOpacity(1)}>
          <DiagramNode
            x={120} y={360} label="Servidor Maior" sublabel="CPU 32c / 128GB RAM" icon="🖥️"
            color={COLORS.amber} width={180} height={65}
            opacity={d.getOpacity(1)} active={d.isActive('server-big')}
            tooltip="Mesmo servidor com mais recursos: mais CPU, memória, disco SSD mais rápido"
          />
          <text x={140} y={450} fill={COLORS.textMuted} fontSize={10} fontFamily="Inter, system-ui, sans-serif" opacity={d.getOpacity(1)}>
            <tspan x={60} dy={0}>• Simples: não muda a arquitetura</tspan>
            <tspan x={60} dy={16}>• Sem estado distribuído</tspan>
            <tspan x={60} dy={16}>• Custo cresce exponencialmente</tspan>
            <tspan x={60} dy={16}>• Limite físico de hardware</tspan>
            <tspan x={60} dy={16}>• SPOF: se cai, tudo cai</tspan>
          </text>
        </DiagramGroup>

        {/* === Step 2: Limits badge === */}
        <DiagramBadge x={210} y={345} text="SPOF" type="spof" opacity={d.getOpacity(2)} />
        <DiagramBadge x={350} y={395} text="LIMITE HW" type="load" opacity={d.getOpacity(2)} />

        {/* === Step 3: Horizontal scaling === */}
        <DiagramGroup x={500} y={320} width={470} height={250} label="Escala Horizontal (Scale-Out)" color={COLORS.green} opacity={d.getOpacity(3)}>
          <DiagramNode
            x={630} y={355} label="Load Balancer" icon="⚖️"
            color={COLORS.green} width={140} height={55}
            opacity={d.getOpacity(3)} active={d.isActive('lb')}
            tooltip="Distribui requisições entre os servidores usando round-robin, least-connections ou IP hash"
          />

          <DiagramNode
            x={520} y={440} label="Srv 1" sublabel="Stateless" icon="📦"
            color={COLORS.blue} width={110} height={55}
            opacity={d.getOpacity(3)} active={d.isActive('srv1')}
            tooltip="Instância stateless — não armazena sessão localmente"
          />
          <DiagramNode
            x={660} y={440} label="Srv 2" sublabel="Stateless" icon="📦"
            color={COLORS.blue} width={110} height={55}
            opacity={d.getOpacity(3)} active={d.isActive('srv2')}
            tooltip="Segunda instância para distribuição de carga e redundância"
          />
          <DiagramNode
            x={800} y={440} label="Srv N" sublabel="Stateless" icon="📦"
            color={COLORS.blue} width={110} height={55}
            opacity={d.getOpacity(3)} active={d.isActive('srv3')}
            tooltip="Novas instâncias podem ser adicionadas conforme a demanda (auto-scaling)"
          />

          <DiagramEdge from={{ x: 700, y: 410 }} to={{ x: 575, y: 440 }} color="green" opacity={d.getOpacity(3)} />
          <DiagramEdge from={{ x: 700, y: 410 }} to={{ x: 715, y: 440 }} color="green" opacity={d.getOpacity(3)} />
          <DiagramEdge from={{ x: 700, y: 410 }} to={{ x: 855, y: 440 }} color="green" opacity={d.getOpacity(3)} />

          <text x={535} y={520} fill={COLORS.textMuted} fontSize={10} fontFamily="Inter, system-ui, sans-serif" opacity={d.getOpacity(3)}>
            <tspan x={520} dy={0}>• Redundância: se um cai, outros assumem</tspan>
            <tspan x={520} dy={16}>• Escala linear com custo proporcional</tspan>
            <tspan x={520} dy={16}>• Requer serviços stateless</tspan>
          </text>
        </DiagramGroup>

        {/* Edge from users to LB */}
        <DiagramEdge from={{ x: 580, y: 47 }} to={{ x: 700, y: 355 }} color="green" dashed label="Tráfego" opacity={d.getOpacity(3)} />

        {/* === Step 4: Shared state === */}
        <DiagramGroup x={30} y={590} width={940} height={0} label="" color="transparent" opacity={0} />

        <DiagramNode
          x={580} y={520} label="Cache" sublabel="Redis" icon="⚡"
          color={COLORS.red} width={120} height={55}
          opacity={d.getOpacity(4)} active={d.isActive('cache')}
          tooltip="Cache distribuído para sessões, tokens e dados frequentes — evita acessar o banco a cada request"
        />
        <DiagramNode
          x={740} y={520} label="DB Primary" sublabel="PostgreSQL" icon="🗄️"
          color={COLORS.cyan} width={130} height={55}
          opacity={d.getOpacity(4)} active={d.isActive('db')}
          tooltip="Banco de dados centralizado — fonte de verdade (source of truth) para todos os servidores"
        />
        <DiagramEdge from={{ x: 660, y: 495 }} to={{ x: 640, y: 520 }} color="red" label="Cache" opacity={d.getOpacity(4)} />
        <DiagramEdge from={{ x: 770, y: 495 }} to={{ x: 805, y: 520 }} color="cyan" label="Queries" opacity={d.getOpacity(4)} />

        {/* === Step 5: Replication === */}
        <DiagramNode
          x={890} y={520} label="DB Replica" sublabel="Read-only" icon="🗄️"
          color={COLORS.purple} width={120} height={55}
          opacity={d.getOpacity(5)} active={d.isActive('replica')}
          tooltip="Réplica de leitura — recebe cópia dos dados do primary via replicação assíncrona"
        />
        <DiagramEdge from={{ x: 870, y: 547 }} to={{ x: 890, y: 547 }} color="purple" label="Repl" opacity={d.getOpacity(5)} />
        <DiagramBadge x={950} y={512} text="READ" type="info" opacity={d.getOpacity(5)} />

        {/* === Step 6: Sharding === */}
        <DiagramGroup x={30} y={590} width={440} height={0} label="" color="transparent" opacity={0} />

        <text x={60} y={595} fill={COLORS.amber} fontSize={11} fontWeight={600} fontFamily="Inter, system-ui, sans-serif" opacity={d.getOpacity(6)}>
          Sharding (Particionamento Horizontal)
        </text>
        <DiagramNode
          x={50} y={610} label="Shard A" sublabel="users A-M" icon="🗄️"
          color={COLORS.amber} width={120} height={55}
          opacity={d.getOpacity(6)} active={d.isActive('shard')}
          tooltip="Shard por range de chave: usuários com nomes A-M ficam neste nó"
        />
        <DiagramNode
          x={200} y={610} label="Shard B" sublabel="users N-Z" icon="🗄️"
          color={COLORS.amber} width={120} height={55}
          opacity={d.getOpacity(6)} active={d.isActive('shard')}
          tooltip="Shard por range de chave: usuários com nomes N-Z ficam neste nó"
        />
        <DiagramNode
          x={350} y={610} label="Shard C" sublabel="hash-based" icon="🗄️"
          color={COLORS.amber} width={120} height={55}
          opacity={d.getOpacity(6)} active={d.isActive('shard')}
          tooltip="Alternativa: sharding por hash da chave distribui dados uniformemente entre nós"
        />

        <text x={60} y={690} fill={COLORS.textMuted} fontSize={9} fontFamily="Inter, system-ui, sans-serif" opacity={d.getOpacity(6)}>
          <tspan x={50} dy={0}>Cada shard contém um subconjunto dos dados.</tspan>
          <tspan x={50} dy={14}>Estratégias: range-based, hash-based ou directory-based.</tspan>
        </text>
      </DiagramCanvas>
    </AlgorithmShell>
  );
}
