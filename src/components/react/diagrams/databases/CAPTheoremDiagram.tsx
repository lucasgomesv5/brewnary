import { DiagramCanvas, DiagramNode, DiagramEdge, DiagramBadge, DiagramGroup, DiagramShell, COLORS } from '../index';
import { useInteractiveDiagram, type DiagramStepDef } from '../useInteractiveDiagram';

const STEPS: DiagramStepDef[] = [
  { description: 'CAP Theorem: num sistema distribuído, só é possível garantir 2 de 3 propriedades simultaneamente', activeElements: ['cap'] },
  { description: 'Partition Tolerance é obrigatório — rede falha sempre. Escolha real: Consistency vs Availability', activeElements: ['partition'] },
  { description: 'CP: consistência forte + tolerância a partições. Exemplos: etcd, ZooKeeper, HBase, MongoDB (w:majority)', activeElements: ['cp'] },
  { description: 'AP: disponibilidade + tolerância a partições. Exemplos: Cassandra, DynamoDB, CouchDB', activeElements: ['ap'] },
  { description: 'ACID: Atomicity, Consistency, Isolation, Durability — garantias fortes de transação (SQL tradicional)', activeElements: ['acid'] },
  { description: 'BASE: Basically Available, Soft state, Eventually consistent — trade-off pragmático (NoSQL)', activeElements: ['base'] },
  { description: 'Espectro de consistência: Strong → Sequential → Causal → Eventual → Weak', activeElements: ['spectrum'] },
  { description: 'Exemplos reais: cada sistema faz trade-offs diferentes baseados no caso de uso', activeElements: ['examples'] },
  { description: 'Framework de decisão: latência, throughput, consistência, disponibilidade — não existe bala de prata', activeElements: ['decision'] },
];

export default function CAPTheoremDiagram() {
  const d = useInteractiveDiagram(STEPS);

  return (
    <DiagramShell
      title="CAP Theorem + ACID vs BASE"
      description="Teorema CAP, garantias transacionais e o espectro de consistência em sistemas distribuídos"
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
        {/* CAP Triangle */}
        <DiagramNode
          x={380} y={30} label="Consistency" sublabel="Every read = latest write" icon="🔒"
          color={COLORS.blue} width={160} height={55}
          opacity={d.getOpacity(0)} active={d.isActive('cap')}
          tooltip="Consistency: toda leitura retorna o valor mais recente escrito, ou erro. Linearizability. Todos os nós veem a mesma coisa ao mesmo tempo"
        />
        <DiagramNode
          x={200} y={170} label="Availability" sublabel="Every request gets response" icon="✅"
          color={COLORS.green} width={170} height={55}
          opacity={d.getOpacity(0)} active={d.isActive('cap')}
          tooltip="Availability: todo request recebe uma resposta (não necessariamente a mais recente). Non-failing nodes sempre respondem. Sem timeouts"
        />
        <DiagramNode
          x={550} y={170} label="Partition Tolerance" sublabel="Survives network splits" icon="🌐"
          color={COLORS.orange} width={170} height={55}
          opacity={d.getOpacity(0)} active={d.isActive('cap')}
          tooltip="Partition Tolerance: sistema continua operando mesmo com mensagens perdidas ou atrasadas entre nós. Network partitions SEMPRE acontecem"
        />

        {/* Triangle edges */}
        <DiagramEdge from={{ x: 420, y: 85 }} to={{ x: 310, y: 170 }} color="blue" opacity={d.getOpacity(0)} />
        <DiagramEdge from={{ x: 500, y: 85 }} to={{ x: 610, y: 170 }} color="orange" opacity={d.getOpacity(0)} />
        <DiagramEdge from={{ x: 370, y: 197 }} to={{ x: 550, y: 197 }} color="green" opacity={d.getOpacity(0)} />

        {/* P is mandatory */}
        <DiagramBadge x={635} y={162} text="MANDATORY" type="spof" opacity={d.getOpacity(1)} />

        {/* CP Systems */}
        <DiagramGroup x={20} y={260} width={330} height={140} label="CP — Consistency + Partition Tolerance" color={COLORS.blue} opacity={d.getOpacity(2)}>
          <DiagramNode
            x={40} y={295} label="etcd" sublabel="Raft consensus" icon="🗄️"
            color={COLORS.blue} width={90} height={42}
            opacity={d.getOpacity(2)} active={d.isActive('cp')}
            tooltip="etcd: key-value distribuído com Raft. Usado no Kubernetes. Strong consistency. Sacrifica availability durante partitions"
          />
          <DiagramNode
            x={145} y={295} label="ZooKeeper" sublabel="ZAB protocol" icon="🐘"
            color={COLORS.blue} width={90} height={42}
            opacity={d.getOpacity(2)} active={d.isActive('cp')}
            tooltip="ZooKeeper: coordenação distribuída. ZAB consensus (similar a Raft). Líder único para writes. Quorum reads"
          />
          <DiagramNode
            x={250} y={295} label="HBase" sublabel="Strong reads" icon="📊"
            color={COLORS.blue} width={85} height={42}
            opacity={d.getOpacity(2)} active={d.isActive('cp')}
            tooltip="HBase: wide-column store sobre HDFS. Region servers com strong consistency. ZooKeeper para coordenação"
          />
          <text x={40} y={360} fill={COLORS.textMuted} fontSize={9} fontFamily="JetBrains Mono, monospace" opacity={d.getOpacity(2)}>
            Trade-off: rejeita writes durante partition
          </text>
        </DiagramGroup>

        {/* AP Systems */}
        <DiagramGroup x={380} y={260} width={350} height={140} label="AP — Availability + Partition Tolerance" color={COLORS.green} opacity={d.getOpacity(3)}>
          <DiagramNode
            x={400} y={295} label="Cassandra" sublabel="Tunable CL" icon="💎"
            color={COLORS.green} width={100} height={42}
            opacity={d.getOpacity(3)} active={d.isActive('ap')}
            tooltip="Cassandra: ring topology, gossip protocol. Consistency level tunable: ONE, QUORUM, ALL. AP com CL=ONE, CP-ish com CL=QUORUM"
          />
          <DiagramNode
            x={515} y={295} label="DynamoDB" sublabel="Eventually consistent" icon="⚡"
            color={COLORS.green} width={100} height={42}
            opacity={d.getOpacity(3)} active={d.isActive('ap')}
            tooltip="DynamoDB: managed NoSQL. Eventually consistent reads (default) ou strongly consistent (2x custo). DAX para cache"
          />
          <DiagramNode
            x={630} y={295} label="CouchDB" sublabel="Multi-master" icon="🛋️"
            color={COLORS.green} width={85} height={42}
            opacity={d.getOpacity(3)} active={d.isActive('ap')}
            tooltip="CouchDB: document store com multi-master replication. Conflict resolution automática. Ideal para offline-first apps"
          />
          <text x={400} y={360} fill={COLORS.textMuted} fontSize={9} fontFamily="JetBrains Mono, monospace" opacity={d.getOpacity(3)}>
            Trade-off: pode retornar dados stale durante partition
          </text>
        </DiagramGroup>

        {/* ACID */}
        <DiagramGroup x={20} y={430} width={330} height={110} label="ACID (Transações Fortes)" color={COLORS.purple} opacity={d.getOpacity(4)}>
          <text x={40} y={465} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={40} dy={0} fill={COLORS.purple}>A: Atomicity — tudo ou nada</tspan>
            <tspan x={40} dy={16} fill={COLORS.purple}>C: Consistency — invariantes mantidas</tspan>
            <tspan x={40} dy={16} fill={COLORS.purple}>I: Isolation — txn parecem seriais</tspan>
            <tspan x={40} dy={16} fill={COLORS.purple}>D: Durability — persist após commit</tspan>
          </text>
        </DiagramGroup>
        <DiagramBadge x={185} y={425} text="PostgreSQL, MySQL" type="info" opacity={d.getOpacity(4)} />

        {/* BASE */}
        <DiagramGroup x={380} y={430} width={350} height={110} label="BASE (Pragmatic Trade-off)" color={COLORS.orange} opacity={d.getOpacity(5)}>
          <text x={400} y={465} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={400} dy={0} fill={COLORS.orange}>BA: Basically Available — sempre responde</tspan>
            <tspan x={400} dy={16} fill={COLORS.orange}>S:  Soft state — estado pode mudar</tspan>
            <tspan x={400} dy={16} fill={COLORS.orange}>E:  Eventually consistent — converge</tspan>
            <tspan x={400} dy={16} fill={COLORS.textMuted}>    (em ~ms a ~s, dependendo da latência)</tspan>
          </text>
        </DiagramGroup>
        <DiagramBadge x={555} y={425} text="Cassandra, DynamoDB" type="info" opacity={d.getOpacity(5)} />

        {/* Consistency Spectrum */}
        <DiagramGroup x={20} y={570} width={710} height={60} label="Espectro de Consistência →" color={COLORS.cyan} opacity={d.getOpacity(6)}>
          <DiagramNode x={40} y={585} label="Strong" color={COLORS.blue} width={70} height={28} opacity={d.getOpacity(6)} active={d.isActive('spectrum')}
            tooltip="Strong/Linearizable: mais recente escrita sempre visível. Ex: Spanner (TrueTime), etcd. Custo: latência alta" />
          <DiagramNode x={125} y={585} label="Sequential" color={COLORS.blue} width={80} height={28} opacity={d.getOpacity(6)} active={d.isActive('spectrum')}
            tooltip="Sequential: todas operações em alguma ordem total. Mais fraca que linearizable. Ex: ZooKeeper ordered reads" />
          <DiagramNode x={220} y={585} label="Causal" color={COLORS.purple} width={70} height={28} opacity={d.getOpacity(6)} active={d.isActive('spectrum')}
            tooltip="Causal: operações causalmente relacionadas são ordenadas. Independentes podem divergir. Ex: MongoDB causal sessions" />
          <DiagramNode x={305} y={585} label="Eventual" color={COLORS.green} width={75} height={28} opacity={d.getOpacity(6)} active={d.isActive('spectrum')}
            tooltip="Eventual: dado suficiente tempo sem writes, todas réplicas convergem. Window: ms a s. Ex: DNS, Cassandra CL=ONE" />
          <DiagramNode x={395} y={585} label="Weak" color={COLORS.orange} width={60} height={28} opacity={d.getOpacity(6)} active={d.isActive('spectrum')}
            tooltip="Weak: sem garantia de ordem. Writes podem nunca ser vistos. Útil para best-effort (caches, analytics, counters approx)" />
          <text x={480} y={602} fill={COLORS.textMuted} fontSize={9} fontFamily="JetBrains Mono, monospace" opacity={d.getOpacity(6)}>
            ← mais latência, mais correto | mais rápido, menos garantias →
          </text>
        </DiagramGroup>

        {/* Decision Framework */}
        <DiagramGroup x={760} y={260} width={310} height={370} label="Framework de Decisão" color={COLORS.amber} opacity={d.getOpacity(7)}>
          <text x={780} y={295} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={780} dy={0} opacity={d.getOpacity(7)}>Exemplos reais:</tspan>
            <tspan x={780} dy={18} fill={COLORS.blue} opacity={d.getOpacity(7)}>Banking → CP + ACID (PostgreSQL)</tspan>
            <tspan x={780} dy={16} fill={COLORS.textMuted} opacity={d.getOpacity(7)}>  Dinheiro: sem eventual consistency</tspan>
            <tspan x={780} dy={22} fill={COLORS.green} opacity={d.getOpacity(7)}>Social Feed → AP + BASE (Cassandra)</tspan>
            <tspan x={780} dy={16} fill={COLORS.textMuted} opacity={d.getOpacity(7)}>  Post demora 1s a aparecer: OK</tspan>
            <tspan x={780} dy={22} fill={COLORS.purple} opacity={d.getOpacity(7)}>Cart → AP, Checkout → CP</tspan>
            <tspan x={780} dy={16} fill={COLORS.textMuted} opacity={d.getOpacity(7)}>  Mesmo sistema, garantias diferentes</tspan>
            <tspan x={780} dy={22} fill={COLORS.cyan} opacity={d.getOpacity(8)}>Perguntas-chave:</tspan>
            <tspan x={780} dy={16} fill={COLORS.textMuted} opacity={d.getOpacity(8)}>  1. Posso retornar dado stale?</tspan>
            <tspan x={780} dy={16} fill={COLORS.textMuted} opacity={d.getOpacity(8)}>  2. Posso rejeitar writes?</tspan>
            <tspan x={780} dy={16} fill={COLORS.textMuted} opacity={d.getOpacity(8)}>  3. Qual window de inconsistência?</tspan>
            <tspan x={780} dy={16} fill={COLORS.textMuted} opacity={d.getOpacity(8)}>  4. Read:Write ratio?</tspan>
            <tspan x={780} dy={16} fill={COLORS.textMuted} opacity={d.getOpacity(8)}>  5. Custo de inconsistência?</tspan>
          </text>
        </DiagramGroup>
      </DiagramCanvas>
    </DiagramShell>
  );
}
