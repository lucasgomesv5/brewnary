import { DiagramCanvas, DiagramNode, DiagramEdge, DiagramBadge, DiagramGroup, DiagramShell, COLORS } from '../index';
import { useInteractiveDiagram, type DiagramStepDef } from '../useInteractiveDiagram';

const STEPS: DiagramStepDef[] = [
  { description: 'B-Tree: estrutura balanceada com nós internos (ponteiros) e folhas (dados). Usado em PostgreSQL, MySQL', activeElements: ['btree-root'] },
  { description: 'Page layout: cada nó é uma página de 4-16KB no disco. Fan-out alto (~100-500 keys/page)', activeElements: ['btree-pages'] },
  { description: 'B-Tree read: O(log_B n) — com B=500, 1B registros = ~3 disk reads', activeElements: ['btree-read'] },
  { description: 'B-Tree write: in-place update + WAL (Write-Ahead Log) para crash recovery. Random I/O: reescreve página inteira', activeElements: ['btree-write'] },
  { description: 'B-Tree trade-offs: read-optimized, random I/O para writes, fragmentação com deletes', activeElements: ['btree-tradeoffs'] },
  { description: 'LSM-Tree write: Memtable (in-memory, sorted) → flush para SSTable (immutable, sorted) no disco', activeElements: ['lsm-write'] },
  { description: 'Compaction: merge SSTables para reduzir read amplification. Leveled (RocksDB) vs Sized-Tiered (Cassandra)', activeElements: ['compaction'] },
  { description: 'LSM read: Memtable → L0 SSTables → ... → Ln. Bloom filter evita reads desnecessários', activeElements: ['lsm-read'] },
  { description: 'LSM trade-offs: write-optimized (10-100x faster writes), space amplification, compaction CPU spikes', activeElements: ['lsm-tradeoffs'] },
  { description: 'Comparação final: B-Tree para OLTP read-heavy, LSM para write-heavy (logs, time-series, IoT)', activeElements: ['comparison'] },
];

export default function BTreeVsLSMDiagram() {
  const d = useInteractiveDiagram(STEPS);

  return (
    <DiagramShell
      title="B-Tree vs LSM-Tree"
      description="Duas estruturas fundamentais de storage engines: trade-offs entre read e write performance"
      totalSteps={d.totalSteps}
      currentStep={d.currentStep}
      stepDescription={d.stepDescription}
      onStep={d.handleStep}
      onReset={d.handleReset}
      isComplete={d.isComplete}
      showAll={d.showAll}
      onShowAll={d.handleShowAll}
      color="#8B5CF6"
    >
      <DiagramCanvas width={1100} height={650}>
        {/* B-Tree Section */}
        <DiagramGroup x={20} y={20} width={520} height={600} label="B-Tree (PostgreSQL, MySQL, InnoDB)" color={COLORS.blue} opacity={d.getOpacity(0)}>
          {/* Root */}
          <DiagramNode
            x={200} y={60} label="Root Node" sublabel="[30 | 70]" icon="🌳"
            color={COLORS.blue} width={140} height={50}
            opacity={d.getOpacity(0)} active={d.isActive('btree-root')}
            tooltip="Nó raiz: sempre em memória (cached). Contém keys separadoras e ponteiros para filhos. Fan-out: ~500 keys por página"
          />

          {/* Internal Nodes */}
          <DiagramNode
            x={70} y={140} label="[10|20]" sublabel="Internal"
            color={COLORS.blue} width={100} height={40}
            opacity={d.getOpacity(0)} active={d.isActive('btree-root')}
            tooltip="Nó interno: keys separadoras que direcionam a busca. Cada nível filtra ~500x o espaço de busca"
          />
          <DiagramNode
            x={330} y={140} label="[50|60]" sublabel="Internal"
            color={COLORS.blue} width={100} height={40}
            opacity={d.getOpacity(0)} active={d.isActive('btree-root')}
            tooltip="Nós internos contêm apenas keys e ponteiros — dados reais ficam nas folhas (B+Tree)"
          />
          <DiagramEdge from={{ x: 240, y: 110 }} to={{ x: 120, y: 140 }} color="blue" opacity={d.getOpacity(0)} />
          <DiagramEdge from={{ x: 310, y: 110 }} to={{ x: 380, y: 140 }} color="blue" opacity={d.getOpacity(0)} />

          {/* Leaf Nodes */}
          <DiagramNode
            x={30} y={210} label="Leaf [5,8,10]" sublabel="4-16KB page"
            color={COLORS.cyan} width={110} height={38}
            opacity={d.getOpacity(1)} active={d.isActive('btree-pages')}
            tooltip="Página de folha: 4-16KB. Contém key-value pairs ordenados. Ponteiros para próxima/anterior folha (linked list para range scans)"
          />
          <DiagramNode
            x={160} y={210} label="Leaf [12,15,20]" sublabel="4-16KB page"
            color={COLORS.cyan} width={120} height={38}
            opacity={d.getOpacity(1)} active={d.isActive('btree-pages')}
            tooltip="Fill factor: ~70% para permitir inserts sem page split. Page split: operação cara que reorganiza dados"
          />
          <DiagramEdge from={{ x: 100, y: 180 }} to={{ x: 85, y: 210 }} color="cyan" opacity={d.getOpacity(1)} />
          <DiagramEdge from={{ x: 145, y: 180 }} to={{ x: 220, y: 210 }} color="cyan" opacity={d.getOpacity(1)} />

          {/* Read Path */}
          <DiagramGroup x={40} y={280} width={200} height={70} label="Read Path" color={COLORS.green} opacity={d.getOpacity(2)}>
            <text x={60} y={310} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
              <tspan x={60} dy={0}>O(log_B n)</tspan>
              <tspan x={60} dy={14}>1B rows, B=500 → ~3 reads</tspan>
            </text>
          </DiagramGroup>
          <DiagramBadge x={140} y={275} text="READ OPTIMIZED" type="fix" opacity={d.getOpacity(2)} />

          {/* Write Path */}
          <DiagramGroup x={260} y={280} width={250} height={70} label="Write Path" color={COLORS.amber} opacity={d.getOpacity(3)}>
            <text x={280} y={310} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
              <tspan x={280} dy={0}>In-place update + WAL</tspan>
              <tspan x={280} dy={14}>Random I/O (page rewrite completa)</tspan>
            </text>
          </DiagramGroup>
          <DiagramBadge x={385} y={275} text="WAL + RANDOM I/O" type="warn" opacity={d.getOpacity(3)} />

          {/* Trade-offs */}
          <DiagramGroup x={40} y={380} width={470} height={100} label="B-Tree Trade-offs" color={COLORS.blue} opacity={d.getOpacity(4)}>
            <text x={60} y={415} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
              <tspan x={60} dy={0} fill={COLORS.green}>✓ Reads O(log_B n) — muito rápidos</tspan>
              <tspan x={60} dy={16} fill={COLORS.green}>✓ Range scans eficientes (folhas encadeadas)</tspan>
              <tspan x={60} dy={16} fill={COLORS.red}>✗ Random I/O para writes (WAL + page rewrite)</tspan>
              <tspan x={60} dy={16} fill={COLORS.red}>✗ Fragmentação com muitos deletes</tspan>
            </text>
          </DiagramGroup>
        </DiagramGroup>

        {/* LSM-Tree Section */}
        <DiagramGroup x={560} y={20} width={520} height={600} label="LSM-Tree (RocksDB, Cassandra, LevelDB)" color={COLORS.purple} opacity={d.getOpacity(5)}>
          {/* Memtable */}
          <DiagramNode
            x={700} y={60} label="Memtable" sublabel="In-memory (Red-Black Tree)" icon="🧠"
            color={COLORS.purple} width={180} height={55}
            opacity={d.getOpacity(5)} active={d.isActive('lsm-write')}
            tooltip="Writes vão para Memtable (sorted in-memory). Red-Black tree ou Skip list. Flush quando atinge ~64MB. WAL para durabilidade"
          />
          <DiagramBadge x={790} y={52} text="~64MB" type="info" opacity={d.getOpacity(5)} />

          {/* SSTables */}
          <DiagramNode
            x={620} y={150} label="L0 SSTables" sublabel="Unsorted between"
            color={COLORS.purple} width={130} height={42}
            opacity={d.getOpacity(5)} active={d.isActive('lsm-write')}
            tooltip="Level 0: SSTables recém-flushed. Podem ter overlap entre si. Cada SSTable é internamente sorted. Compaction: L0 → L1"
          />
          <DiagramNode
            x={780} y={150} label="WAL" sublabel="Append-only" icon="📝"
            color={COLORS.amber} width={110} height={42}
            opacity={d.getOpacity(5)} active={d.isActive('lsm-write')}
            tooltip="Write-Ahead Log: sequential write, crash recovery. Deletado após flush bem-sucedido do Memtable. Append-only = rápido"
          />
          <DiagramEdge from={{ x: 790, y: 115 }} to={{ x: 685, y: 150 }} color="purple" label="flush" opacity={d.getOpacity(5)} />
          <DiagramEdge from={{ x: 790, y: 115 }} to={{ x: 835, y: 150 }} color="amber" label="WAL" dashed opacity={d.getOpacity(5)} />

          {/* Compaction Levels */}
          <DiagramNode
            x={620} y={220} label="L1" sublabel="10x size, no overlap"
            color={COLORS.cyan} width={130} height={38}
            opacity={d.getOpacity(6)} active={d.isActive('compaction')}
            tooltip="Level 1: 10x maior que L0. SSTables não se sobrepõem (sorted run). Merge sort com L0 durante compaction"
          />
          <DiagramNode
            x={620} y={275} label="L2" sublabel="100x size"
            color={COLORS.cyan} width={130} height={38}
            opacity={d.getOpacity(6)} active={d.isActive('compaction')}
            tooltip="Level 2: 100x maior que L0. Compaction: pega 1 SSTable de Ln + overlap de Ln+1, merge, gera novos SSTables em Ln+1"
          />
          <DiagramNode
            x={620} y={330} label="Ln" sublabel="10^n × size"
            color={COLORS.cyan} width={130} height={38}
            opacity={d.getOpacity(6)} active={d.isActive('compaction')}
            tooltip="Cada nível é 10x maior. Leveled compaction (RocksDB): menor space amp. Tiered (Cassandra): menor write amp. Trade-off entre os dois"
          />
          <DiagramEdge from={{ x: 685, y: 192 }} to={{ x: 685, y: 220 }} color="cyan" label="compact" opacity={d.getOpacity(6)} />
          <DiagramEdge from={{ x: 685, y: 258 }} to={{ x: 685, y: 275 }} color="cyan" opacity={d.getOpacity(6)} />
          <DiagramEdge from={{ x: 685, y: 313 }} to={{ x: 685, y: 330 }} color="cyan" opacity={d.getOpacity(6)} />
          <DiagramBadge x={775} y={245} text="LEVELED" type="tradeoff" opacity={d.getOpacity(6)} />

          {/* Read Path + Bloom Filter */}
          <DiagramGroup x={780} y={220} width={270} height={90} label="Read Path" color={COLORS.green} opacity={d.getOpacity(7)}>
            <text x={800} y={252} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
              <tspan x={800} dy={0}>Memtable → L0 → L1 → ... → Ln</tspan>
              <tspan x={800} dy={14}>Bloom filter: skip ~99% SSTables</tspan>
              <tspan x={800} dy={14}>Worst case: O(levels × log n)</tspan>
            </text>
          </DiagramGroup>

          {/* Trade-offs */}
          <DiagramGroup x={580} y={400} width={470} height={100} label="LSM-Tree Trade-offs" color={COLORS.purple} opacity={d.getOpacity(8)}>
            <text x={600} y={435} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
              <tspan x={600} dy={0} fill={COLORS.green}>✓ Writes 10-100x mais rápidos (sequential I/O)</tspan>
              <tspan x={600} dy={16} fill={COLORS.green}>✓ Sem fragmentação (immutable SSTables)</tspan>
              <tspan x={600} dy={16} fill={COLORS.red}>✗ Reads mais lentos (múltiplos levels)</tspan>
              <tspan x={600} dy={16} fill={COLORS.red}>✗ Compaction CPU spikes + space amplification</tspan>
            </text>
          </DiagramGroup>
        </DiagramGroup>

        {/* Final Comparison */}
        <DiagramGroup x={200} y={530} width={700} height={85} label="Quando usar cada um?" color={COLORS.amber} opacity={d.getOpacity(9)}>
          <text x={220} y={562} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={220} dy={0}>B-Tree → OLTP read-heavy: PostgreSQL, MySQL, SQLite (transacional, baixa latência de read)</tspan>
            <tspan x={220} dy={16}>LSM    → Write-heavy: Cassandra, RocksDB, LevelDB (logs, time-series, IoT, analytics ingest)</tspan>
            <tspan x={220} dy={16}>Híbrido → TiDB (B-Tree para OLTP + LSM para OLAP), CockroachDB (Pebble/LSM com SQL)</tspan>
          </text>
        </DiagramGroup>
      </DiagramCanvas>
    </DiagramShell>
  );
}
