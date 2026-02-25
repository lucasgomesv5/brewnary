import { DiagramCanvas, DiagramNode, DiagramEdge, DiagramBadge, DiagramGroup, DiagramShell, COLORS } from '../index';
import { useInteractiveDiagram, type DiagramStepDef } from '../useInteractiveDiagram';

const STEPS: DiagramStepDef[] = [
  { description: '3 estados possíveis: Follower (passivo), Candidate (eleição), Leader (coordena writes)', activeElements: ['states'] },
  { description: 'Election timeout (150-300ms aleatório): Follower que não recebe heartbeat vira Candidate', activeElements: ['timeout'] },
  { description: 'RequestVote RPC: Candidate pede votos. Cada nó vota em no máximo 1 candidate por term', activeElements: ['vote'] },
  { description: 'Leader eleito: ganha maioria dos votos. Envia heartbeats periódicos para manter autoridade', activeElements: ['leader'] },
  { description: 'Client envia write para o Leader — Leader é o único que aceita writes', activeElements: ['client-write'] },
  { description: 'AppendEntries RPC: Leader replica log entry para todos os Followers', activeElements: ['append'] },
  { description: 'Commit: quando quorum (maioria) confirma, entry é committed e aplicada', activeElements: ['commit'] },
  { description: 'Apply: entry committed é aplicada à state machine — resposta enviada ao client', activeElements: ['apply'] },
  { description: 'Leader failure: Followers detectam via timeout, nova eleição começa automaticamente', activeElements: ['failure'] },
  { description: 'Safety: Election Safety, Log Matching, Leader Completeness — garantias formais do Raft', activeElements: ['safety'] },
];

export default function RaftConsensusDiagram() {
  const d = useInteractiveDiagram(STEPS);

  return (
    <DiagramShell
      title="Raft Consensus"
      description="Algoritmo de consenso distribuído usado em etcd, CockroachDB e TiKV"
      totalSteps={d.totalSteps}
      currentStep={d.currentStep}
      stepDescription={d.stepDescription}
      onStep={d.handleStep}
      onReset={d.handleReset}
      isComplete={d.isComplete}
      showAll={d.showAll}
      onShowAll={d.handleShowAll}
      color="#ef4444"
    >
      <DiagramCanvas width={1100} height={650}>
        {/* Node States */}
        <DiagramGroup x={20} y={20} width={450} height={110} label="Node States" color={COLORS.red} opacity={d.getOpacity(0)}>
          <DiagramNode
            x={40} y={55} label="Follower" sublabel="Passivo" icon="👂"
            color={COLORS.textMuted} width={110} height={48}
            opacity={d.getOpacity(0)} active={d.isActive('states')}
            tooltip="Estado inicial de todo nó. Recebe e replica entradas do Leader. Responde a RequestVote. Redireciona clients para Leader"
          />
          <DiagramNode
            x={180} y={55} label="Candidate" sublabel="Eleição" icon="🗳️"
            color={COLORS.amber} width={110} height={48}
            opacity={d.getOpacity(0)} active={d.isActive('states')}
            tooltip="Follower que não recebe heartbeat dentro do election timeout vira Candidate. Incrementa term, vota em si mesmo, pede votos"
          />
          <DiagramNode
            x={320} y={55} label="Leader" sublabel="Coordena" icon="👑"
            color={COLORS.red} width={110} height={48}
            opacity={d.getOpacity(0)} active={d.isActive('states')}
            tooltip="Único nó que aceita writes. Envia heartbeats a cada ~50ms. Replica log entries. Decide quando commit. Um Leader por term"
          />
          <DiagramEdge from={{ x: 150, y: 79 }} to={{ x: 180, y: 79 }} color="amber" label="timeout" opacity={d.getOpacity(0)} />
          <DiagramEdge from={{ x: 290, y: 79 }} to={{ x: 320, y: 79 }} color="red" label="majority" opacity={d.getOpacity(0)} />
        </DiagramGroup>

        {/* Election Timeout */}
        <DiagramGroup x={500} y={20} width={280} height={80} label="Election Timeout" color={COLORS.amber} opacity={d.getOpacity(1)}>
          <text x={520} y={55} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={520} dy={0}>Timeout: 150-300ms (aleatório)</tspan>
            <tspan x={520} dy={16}>Randomizado para evitar split vote</tspan>
            <tspan x={520} dy={16}>{'Heartbeat interval << election timeout'}</tspan>
          </text>
        </DiagramGroup>
        <DiagramBadge x={640} y={15} text="RANDOMIZED" type="tradeoff" opacity={d.getOpacity(1)} />

        {/* Cluster Visualization */}
        <DiagramGroup x={20} y={170} width={700} height={200} label="Cluster (5 nós — tolera 2 falhas)" color={COLORS.blue} opacity={d.getOpacity(2)}>
          {/* Node 1 - Leader */}
          <DiagramNode
            x={40} y={220} label="Node 1" sublabel="LEADER" icon="👑"
            color={COLORS.red} width={110} height={55}
            opacity={d.getOpacity(3)} active={d.isActive('leader')}
            tooltip="Leader do term atual. Aceita writes, replica para followers. Heartbeat a cada 50ms. Step down se vê term maior"
          />
          <DiagramBadge x={95} y={212} text="TERM 3" type="spof" opacity={d.getOpacity(3)} />

          {/* Followers */}
          <DiagramNode
            x={200} y={205} label="Node 2" sublabel="FOLLOWER" icon="👂"
            color={COLORS.green} width={100} height={48}
            opacity={d.getOpacity(2)} active={d.isActive('vote')}
            tooltip="Follower ativo: log replicado, voto dado ao Node 1. Reseta election timer a cada heartbeat recebido"
          />
          <DiagramNode
            x={330} y={205} label="Node 3" sublabel="FOLLOWER" icon="👂"
            color={COLORS.green} width={100} height={48}
            opacity={d.getOpacity(2)} active={d.isActive('vote')}
            tooltip="Follower ativo: parte do quorum. Em caso de Leader failure, pode iniciar eleição"
          />
          <DiagramNode
            x={460} y={205} label="Node 4" sublabel="FOLLOWER" icon="👂"
            color={COLORS.green} width={100} height={48}
            opacity={d.getOpacity(2)} active={d.isActive('vote')}
            tooltip="Follower: pode estar com log atrasado (será catching up). Leader envia entries faltantes"
          />
          <DiagramNode
            x={590} y={205} label="Node 5" sublabel="FOLLOWER" icon="👂"
            color={COLORS.green} width={100} height={48}
            opacity={d.getOpacity(2)} active={d.isActive('vote')}
            tooltip="5 nós: quorum = 3. Tolera 2 falhas simultâneas. Fórmula: 2f+1 nós para tolerar f falhas"
          />

          {/* Heartbeats */}
          <DiagramEdge from={{ x: 150, y: 247 }} to={{ x: 200, y: 229 }} color="red" dashed opacity={d.getOpacity(3)} />
          <DiagramEdge from={{ x: 150, y: 247 }} to={{ x: 330, y: 229 }} color="red" dashed opacity={d.getOpacity(3)} />
          <DiagramEdge from={{ x: 150, y: 247 }} to={{ x: 460, y: 229 }} color="red" dashed opacity={d.getOpacity(3)} />
          <DiagramEdge from={{ x: 150, y: 247 }} to={{ x: 590, y: 229 }} color="red" dashed opacity={d.getOpacity(3)} />

          {/* Vote labels */}
          <DiagramNode
            x={200} y={280} label="✓ Vote" sublabel=""
            color={COLORS.green} width={70} height={28}
            opacity={d.getOpacity(2)} active={d.isActive('vote')}
            tooltip="Voto concedido: nó não votou em outro candidate neste term. Persiste voto em disco antes de responder"
          />
          <DiagramNode
            x={330} y={280} label="✓ Vote" sublabel=""
            color={COLORS.green} width={70} height={28}
            opacity={d.getOpacity(2)} active={d.isActive('vote')}
            tooltip="Quorum alcançado: 3 votos (self + 2 followers) de 5 nós = maioria. Node 1 se torna Leader"
          />
        </DiagramGroup>
        <DiagramBadge x={370} y={165} text="QUORUM = 3/5" type="info" opacity={d.getOpacity(2)} />

        {/* Client Write */}
        <DiagramNode
          x={770} y={130} label="Client" sublabel="Write Request" icon="💻"
          color={COLORS.textMuted} width={120} height={55}
          opacity={d.getOpacity(4)} active={d.isActive('client-write')}
          tooltip="Client envia write para qualquer nó. Se não é Leader, redireciona. Linearizable reads requerem Leader também (ou lease)"
        />
        <DiagramEdge from={{ x: 770, y: 157 }} to={{ x: 150, y: 247 }} color="red" label="write" opacity={d.getOpacity(4)} />

        {/* AppendEntries */}
        <DiagramGroup x={20} y={400} width={700} height={100} label="Log Replication (AppendEntries RPC)" color={COLORS.orange} opacity={d.getOpacity(5)}>
          <text x={40} y={435} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={40} dy={0}>Leader → AppendEntries(term, prevLogIndex, prevLogTerm, entries[], leaderCommit)</tspan>
            <tspan x={40} dy={16}>Follower valida: prevLogIndex e prevLogTerm devem bater (Log Matching Property)</tspan>
            <tspan x={40} dy={16}>Se inconsistente: Leader decrementa nextIndex e reenvia (backtracking)</tspan>
          </text>
        </DiagramGroup>

        {/* Commit */}
        <DiagramGroup x={20} y={520} width={340} height={100} label="Commit (Quorum)" color={COLORS.green} opacity={d.getOpacity(6)}>
          <text x={40} y={555} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={40} dy={0}>Quando maioria (3/5) confirma →</tspan>
            <tspan x={40} dy={16}>Entry é committed (durável)</tspan>
            <tspan x={40} dy={16}>commitIndex avança, notifica followers</tspan>
          </text>
        </DiagramGroup>
        <DiagramBadge x={190} y={515} text="MAJORITY ACK" type="fix" opacity={d.getOpacity(6)} />

        {/* Apply */}
        <DiagramGroup x={380} y={520} width={340} height={100} label="Apply to State Machine" color={COLORS.cyan} opacity={d.getOpacity(7)}>
          <text x={400} y={555} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={400} dy={0}>Committed entry → apply ao state machine</tspan>
            <tspan x={400} dy={16}>State machine: key-value store (etcd)</tspan>
            <tspan x={400} dy={16}>Resposta enviada ao client após apply</tspan>
          </text>
        </DiagramGroup>

        {/* Leader Failure */}
        <DiagramNode
          x={770} y={260} label="Leader Failure" sublabel="Timeout → Election" icon="💥"
          color={COLORS.red} width={140} height={55}
          opacity={d.getOpacity(8)} active={d.isActive('failure')}
          tooltip="Se Leader falha: Followers detectam via election timeout. Primeiro a expirar vira Candidate. Nova eleição em ~300ms. Committed entries nunca perdidas"
        />
        <DiagramBadge x={840} y={252} text="AUTO RECOVERY" type="fix" opacity={d.getOpacity(8)} />

        {/* Safety Guarantees */}
        <DiagramGroup x={740} y={350} width={340} height={140} label="Safety Guarantees" color={COLORS.purple} opacity={d.getOpacity(9)}>
          <text x={760} y={385} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={760} dy={0} fill={COLORS.green}>✓ Election Safety: 1 leader/term</tspan>
            <tspan x={760} dy={16} fill={COLORS.green}>✓ Log Matching: same idx+term = same</tspan>
            <tspan x={760} dy={16} fill={COLORS.green}>✓ Leader Completeness: committed</tspan>
            <tspan x={760} dy={16} fill={COLORS.green}>  entries in all future leaders</tspan>
            <tspan x={760} dy={16} fill={COLORS.green}>✓ State Machine Safety: same order</tspan>
            <tspan x={760} dy={16} fill={COLORS.amber}>⚡ Availability: requires majority</tspan>
          </text>
        </DiagramGroup>
      </DiagramCanvas>
    </DiagramShell>
  );
}
