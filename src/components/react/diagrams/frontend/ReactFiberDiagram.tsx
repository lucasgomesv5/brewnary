import { DiagramCanvas, DiagramNode, DiagramEdge, DiagramBadge, DiagramGroup, DiagramShell, COLORS } from '../index';
import { useInteractiveDiagram, type DiagramStepDef } from '../useInteractiveDiagram';

const STEPS: DiagramStepDef[] = [
  { description: 'Virtual DOM: representação em memória do UI como árvore de objetos JavaScript. Diff otimizado O(n)', activeElements: ['vdom'] },
  { description: 'Fiber node: unidade de trabalho do React. Cada component/element é um Fiber com ponteiros child/sibling/return', activeElements: ['fiber-node'] },
  { description: 'Fiber tree: duas árvores — current (na tela) e workInProgress (próximo commit). Double buffering', activeElements: ['fiber-tree'] },
  { description: 'Reconciliation: compara current vs novo VDOM. Heurísticas: mesmo tipo = update, diferente = unmount+mount', activeElements: ['reconciliation'] },
  { description: 'Diffing algorithm: O(n) com 2 heurísticas — elements de tipos diferentes produzem árvores diferentes; keys identificam filhos estáveis', activeElements: ['diffing'] },
  { description: 'Render Phase (interruptível): processa Fiber tree, marca efeitos (placement, update, deletion). Pode ser pausado pelo scheduler', activeElements: ['render-phase'] },
  { description: 'Commit Phase (síncrono): aplica mutações ao DOM real. 3 sub-fases: before mutation → mutation → layout. Não pode ser interrompido', activeElements: ['commit-phase'] },
  { description: 'Lanes & Priority: Sync (click) > Default (setState) > Transition (startTransition) > Idle. Time-slicing via scheduler', activeElements: ['lanes'] },
  { description: 'Hooks: useState/useReducer → state no Fiber. useEffect → passive effect queue. useMemo/useCallback → memoized value no Fiber', activeElements: ['hooks'] },
  { description: 'Batching: React 18+ auto-batches setState em promises, timeouts, event handlers. Reduz re-renders desnecessários', activeElements: ['batching'] },
  { description: 'Concurrent features: useTransition (defer updates), useDeferredValue, Suspense boundaries, streaming SSR', activeElements: ['concurrent'] },
];

export default function ReactFiberDiagram() {
  const d = useInteractiveDiagram(STEPS);

  return (
    <DiagramShell
      title="React Fiber & Reconciliation"
      description="Internals do React: Fiber architecture, Virtual DOM diffing, concurrent rendering e hooks"
      totalSteps={d.totalSteps}
      currentStep={d.currentStep}
      stepDescription={d.stepDescription}
      onStep={d.handleStep}
      onReset={d.handleReset}
      isComplete={d.isComplete}
      showAll={d.showAll}
      onShowAll={d.handleShowAll}
      color="#61dafb"
    >
      <DiagramCanvas width={1100} height={680}>
        {/* Virtual DOM */}
        <DiagramGroup x={20} y={20} width={280} height={130} label="Virtual DOM" color={COLORS.cyan} opacity={d.getOpacity(0)}>
          <DiagramNode
            x={40} y={55} label="JSX" sublabel="React.createElement()" icon="📝"
            color={COLORS.cyan} width={110} height={48}
            opacity={d.getOpacity(0)} active={d.isActive('vdom')}
            tooltip="JSX compila para React.createElement(type, props, children). Retorna plain JS objects (React Elements). Lightweight: sem métodos DOM"
          />
          <DiagramNode
            x={170} y={55} label="VDOM Tree" sublabel="JS Objects" icon="🌳"
            color={COLORS.cyan} width={110} height={48}
            opacity={d.getOpacity(0)} active={d.isActive('vdom')}
            tooltip="Árvore de React Elements: {type, props, key, ref}. Imutável: cada render cria nova árvore. Diff com árvore anterior para minimizar DOM mutations"
          />
          <DiagramEdge from={{ x: 150, y: 79 }} to={{ x: 170, y: 79 }} color="cyan" opacity={d.getOpacity(0)} />
        </DiagramGroup>
        <DiagramBadge x={150} y={15} text="O(n) DIFF" type="latency" opacity={d.getOpacity(0)} />

        {/* Fiber Node */}
        <DiagramGroup x={330} y={20} width={350} height={140} label="Fiber Node (unit of work)" color={COLORS.purple} opacity={d.getOpacity(1)}>
          <text x={350} y={55} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={350} dy={0} opacity={d.getOpacity(1)}>fiber = {'{'}</tspan>
            <tspan x={350} dy={14} opacity={d.getOpacity(1)}>  tag: FunctionComponent | HostComponent,</tspan>
            <tspan x={350} dy={14} opacity={d.getOpacity(1)}>  type: App | 'div',</tspan>
            <tspan x={350} dy={14} opacity={d.getOpacity(1)}>  stateNode: DOM node | null,</tspan>
            <tspan x={350} dy={14} opacity={d.getOpacity(1)}>  child, sibling, return, // tree pointers</tspan>
            <tspan x={350} dy={14} opacity={d.getOpacity(1)}>  memoizedState, // hooks linked list</tspan>
            <tspan x={350} dy={14} opacity={d.getOpacity(1)}>  flags: Placement | Update | Deletion</tspan>
            <tspan x={350} dy={14} opacity={d.getOpacity(1)}>{'}'}</tspan>
          </text>
        </DiagramGroup>

        {/* Fiber Tree - Double Buffering */}
        <DiagramGroup x={20} y={180} width={660} height={170} label="Fiber Tree — Double Buffering" color={COLORS.blue} opacity={d.getOpacity(2)}>
          {/* Current tree */}
          <DiagramGroup x={40} y={210} width={280} height={120} label="current (on screen)" color={COLORS.green} opacity={d.getOpacity(2)}>
            <DiagramNode x={70} y={235} label="App" color={COLORS.green} width={70} height={30}
              opacity={d.getOpacity(2)} active={d.isActive('fiber-tree')}
              tooltip="Root fiber da árvore current. Aponta para o que está renderizado na tela. Após commit, workInProgress vira current" />
            <DiagramNode x={55} y={280} label="Header" color={COLORS.green} width={60} height={26}
              opacity={d.getOpacity(2)} active={d.isActive('fiber-tree')} tooltip="Child fiber: ponteiro child do App" />
            <DiagramNode x={130} y={280} label="Main" color={COLORS.green} width={55} height={26}
              opacity={d.getOpacity(2)} active={d.isActive('fiber-tree')} tooltip="Sibling fiber: ponteiro sibling do Header" />
            <DiagramNode x={200} y={280} label="Footer" color={COLORS.green} width={55} height={26}
              opacity={d.getOpacity(2)} active={d.isActive('fiber-tree')} tooltip="Sibling do Main. return → App" />
            <DiagramEdge from={{ x: 90, y: 265 }} to={{ x: 85, y: 280 }} color="green" opacity={d.getOpacity(2)} />
            <DiagramEdge from={{ x: 115, y: 293 }} to={{ x: 130, y: 293 }} color="green" opacity={d.getOpacity(2)} />
            <DiagramEdge from={{ x: 185, y: 293 }} to={{ x: 200, y: 293 }} color="green" opacity={d.getOpacity(2)} />
          </DiagramGroup>

          {/* WIP tree */}
          <DiagramGroup x={370} y={210} width={280} height={120} label="workInProgress (building)" color={COLORS.amber} opacity={d.getOpacity(2)}>
            <DiagramNode x={400} y={235} label="App" color={COLORS.amber} width={70} height={30}
              opacity={d.getOpacity(2)} active={d.isActive('fiber-tree')}
              tooltip="Root do workInProgress. Clone do current com updates aplicados. alternate pointer liga current ↔ WIP" />
            <DiagramNode x={385} y={280} label="Header" color={COLORS.amber} width={60} height={26}
              opacity={d.getOpacity(2)} active={d.isActive('fiber-tree')} tooltip="Fiber reutilizado se props/type não mudaram (bailout)" />
            <DiagramNode x={460} y={280} label="Main ⚡" color={COLORS.red} width={65} height={26}
              opacity={d.getOpacity(2)} active={d.isActive('fiber-tree')} tooltip="Fiber com flag Update: state mudou, precisa re-render. Marked for reconciliation" />
            <DiagramNode x={540} y={280} label="Footer" color={COLORS.amber} width={55} height={26}
              opacity={d.getOpacity(2)} active={d.isActive('fiber-tree')} tooltip="Fiber inalterado: reutiliza memoized output (bailout)" />
            <DiagramEdge from={{ x: 420, y: 265 }} to={{ x: 415, y: 280 }} color="amber" opacity={d.getOpacity(2)} />
            <DiagramEdge from={{ x: 445, y: 293 }} to={{ x: 460, y: 293 }} color="amber" opacity={d.getOpacity(2)} />
            <DiagramEdge from={{ x: 525, y: 293 }} to={{ x: 540, y: 293 }} color="amber" opacity={d.getOpacity(2)} />
          </DiagramGroup>

          <DiagramEdge from={{ x: 320, y: 260 }} to={{ x: 370, y: 260 }} color="blue" label="alternate" dashed opacity={d.getOpacity(2)} />
        </DiagramGroup>

        {/* Reconciliation */}
        <DiagramGroup x={700} y={20} width={370} height={130} label="Reconciliation (Diffing)" color={COLORS.orange} opacity={d.getOpacity(3)}>
          <text x={720} y={55} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={720} dy={0} fill={COLORS.orange} opacity={d.getOpacity(3)}>Heurísticas O(n):</tspan>
            <tspan x={720} dy={16} opacity={d.getOpacity(3)}>1. Tipo diferente → destroy + create</tspan>
            <tspan x={720} dy={14} opacity={d.getOpacity(3)}>{'   <div> → <span> = unmount subtree'}</tspan>
            <tspan x={720} dy={16} opacity={d.getOpacity(4)}>2. Mesmo tipo → update props/state</tspan>
            <tspan x={720} dy={14} opacity={d.getOpacity(4)}>{'   <div className="a"> → className="b"'}</tspan>
            <tspan x={720} dy={16} opacity={d.getOpacity(4)}>3. Keys para listas → reorder sem remount</tspan>
          </text>
        </DiagramGroup>
        <DiagramBadge x={885} y={15} text="KEYS MATTER" type="warn" opacity={d.getOpacity(4)} />

        {/* Render Phase */}
        <DiagramGroup x={700} y={170} width={370} height={110} label="Render Phase (interruptível)" color={COLORS.purple} opacity={d.getOpacity(5)}>
          <DiagramNode
            x={720} y={205} label="beginWork" sublabel="Top-down" icon="⬇️"
            color={COLORS.purple} width={100} height={40}
            opacity={d.getOpacity(5)} active={d.isActive('render-phase')}
            tooltip="Processa fiber: chama render/function component, calcula novo state, marca flags. Desce pela árvore (child). Pode ser interrompido entre fibers"
          />
          <DiagramNode
            x={840} y={205} label="completeWork" sublabel="Bottom-up" icon="⬆️"
            color={COLORS.purple} width={110} height={40}
            opacity={d.getOpacity(5)} active={d.isActive('render-phase')}
            tooltip="Cria/atualiza DOM nodes (mas NÃO insere no DOM real). Sobe pela árvore (sibling → return). Acumula effect list"
          />
          <DiagramNode
            x={970} y={205} label="Effect List" sublabel="Linked list" icon="📋"
            color={COLORS.amber} width={85} height={40}
            opacity={d.getOpacity(5)} active={d.isActive('render-phase')}
            tooltip="Lista encadeada de fibers com side effects (Placement, Update, Deletion). Commit phase percorre apenas esta lista, não a árvore toda"
          />
          <DiagramEdge from={{ x: 820, y: 225 }} to={{ x: 840, y: 225 }} color="purple" opacity={d.getOpacity(5)} />
          <DiagramEdge from={{ x: 950, y: 225 }} to={{ x: 970, y: 225 }} color="amber" opacity={d.getOpacity(5)} />
        </DiagramGroup>
        <DiagramBadge x={885} y={165} text="PAUSABLE" type="fix" opacity={d.getOpacity(5)} />

        {/* Commit Phase */}
        <DiagramGroup x={700} y={300} width={370} height={90} label="Commit Phase (síncrono)" color={COLORS.red} opacity={d.getOpacity(6)}>
          <DiagramNode x={720} y={330} label="Before Mutation" sublabel="getSnapshotBefore" color={COLORS.amber} width={100} height={35}
            opacity={d.getOpacity(6)} active={d.isActive('commit-phase')}
            tooltip="Lê do DOM antes das mutações. getSnapshotBeforeUpdate() para class components. Usado para scroll position, etc" />
          <DiagramNode x={840} y={330} label="Mutation" sublabel="DOM writes" color={COLORS.red} width={85} height={35}
            opacity={d.getOpacity(6)} active={d.isActive('commit-phase')}
            tooltip="Aplica mutations ao DOM real: appendChild, removeChild, commitUpdate. Altera current tree. ref callbacks" />
          <DiagramNode x={945} y={330} label="Layout" sublabel="useLayoutEffect" color={COLORS.green} width={95} height={35}
            opacity={d.getOpacity(6)} active={d.isActive('commit-phase')}
            tooltip="useLayoutEffect roda síncronamente após mutations. Pode ler layout e forçar re-render síncrono. useEffect é agendado para depois (passive)" />
          <DiagramEdge from={{ x: 820, y: 347 }} to={{ x: 840, y: 347 }} color="red" opacity={d.getOpacity(6)} />
          <DiagramEdge from={{ x: 925, y: 347 }} to={{ x: 945, y: 347 }} color="green" opacity={d.getOpacity(6)} />
        </DiagramGroup>
        <DiagramBadge x={885} y={295} text="SYNC — NO INTERRUPT" type="spof" opacity={d.getOpacity(6)} />

        {/* Lanes & Priority */}
        <DiagramGroup x={20} y={380} width={320} height={120} label="Lanes & Priority (Scheduler)" color={COLORS.amber} opacity={d.getOpacity(7)}>
          <text x={40} y={415} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={40} dy={0} fill={COLORS.red} opacity={d.getOpacity(7)}>SyncLane         → click, input (immediate)</tspan>
            <tspan x={40} dy={16} fill={COLORS.orange} opacity={d.getOpacity(7)}>DefaultLane      → setState (normal)</tspan>
            <tspan x={40} dy={16} fill={COLORS.green} opacity={d.getOpacity(7)}>TransitionLane   → startTransition (defer)</tspan>
            <tspan x={40} dy={16} fill={COLORS.textMuted} opacity={d.getOpacity(7)}>IdleLane         → offscreen, low priority</tspan>
          </text>
          <DiagramBadge x={180} y={375} text="~5ms YIELD TARGET" type="latency" opacity={d.getOpacity(7)} />
        </DiagramGroup>

        {/* Hooks */}
        <DiagramGroup x={360} y={380} width={310} height={120} label="Hooks Internals" color={COLORS.blue} opacity={d.getOpacity(8)}>
          <text x={380} y={415} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={380} dy={0} opacity={d.getOpacity(8)}>fiber.memoizedState → hooks linked list</tspan>
            <tspan x={380} dy={16} opacity={d.getOpacity(8)}>useState   → {'{queue, memoizedState}'}</tspan>
            <tspan x={380} dy={16} opacity={d.getOpacity(8)}>useEffect  → {'{tag, create, destroy, deps}'}</tspan>
            <tspan x={380} dy={16} opacity={d.getOpacity(8)}>useMemo    → {'{value, deps}'} (cached)</tspan>
          </text>
          <DiagramBadge x={515} y={375} text="LINKED LIST" type="info" opacity={d.getOpacity(8)} />
        </DiagramGroup>

        {/* Batching */}
        <DiagramGroup x={20} y={530} width={320} height={120} label="Automatic Batching (React 18+)" color={COLORS.green} opacity={d.getOpacity(9)}>
          <text x={40} y={565} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={40} dy={0} opacity={d.getOpacity(9)}>React 17: batch apenas em event handlers</tspan>
            <tspan x={40} dy={16} opacity={d.getOpacity(9)}>React 18: batch em TUDO:</tspan>
            <tspan x={40} dy={16} fill={COLORS.green} opacity={d.getOpacity(9)}>  ✓ Promises, setTimeout, fetch</tspan>
            <tspan x={40} dy={16} fill={COLORS.green} opacity={d.getOpacity(9)}>  ✓ Native event listeners</tspan>
          </text>
          <DiagramBadge x={180} y={525} text="FEWER RE-RENDERS" type="fix" opacity={d.getOpacity(9)} />
        </DiagramGroup>

        {/* Concurrent Features */}
        <DiagramGroup x={360} y={530} width={710} height={120} label="Concurrent Features (React 18+)" color={COLORS.cyan} opacity={d.getOpacity(10)}>
          <DiagramNode
            x={380} y={565} label="useTransition" sublabel="Defer updates" icon="⏳"
            color={COLORS.cyan} width={120} height={42}
            opacity={d.getOpacity(10)} active={d.isActive('concurrent')}
            tooltip="startTransition(() => setState(x)): marca update como low priority. UI permanece responsiva durante computation pesada. isPending para loading state"
          />
          <DiagramNode
            x={520} y={565} label="useDeferredValue" sublabel="Debounce render" icon="⏱️"
            color={COLORS.cyan} width={130} height={42}
            opacity={d.getOpacity(10)} active={d.isActive('concurrent')}
            tooltip="useDeferredValue(value): retorna versão 'atrasada' do valor. React renderiza com valor antigo primeiro (responsivo), depois atualiza. Parecido com debounce sem timer"
          />
          <DiagramNode
            x={670} y={565} label="Suspense" sublabel="Loading boundary" icon="⏸️"
            color={COLORS.purple} width={110} height={42}
            opacity={d.getOpacity(10)} active={d.isActive('concurrent')}
            tooltip="<Suspense fallback={<Spinner/>}>: boundary para loading states. Streaming SSR: envia HTML shell → hydrata incrementalmente. Suspense + lazy() para code splitting"
          />
          <DiagramNode
            x={800} y={565} label="Streaming SSR" sublabel="renderToPipeableStream" icon="🌊"
            color={COLORS.blue} width={130} height={42}
            opacity={d.getOpacity(10)} active={d.isActive('concurrent')}
            tooltip="Streaming HTML: envia shell imediatamente, streama Suspense boundaries conforme resolvem. Selective hydration: hidrata componentes interagidos primeiro"
          />
          <DiagramNode
            x={950} y={565} label="RSC" sublabel="Server Components" icon="🖥️"
            color={COLORS.green} width={100} height={42}
            opacity={d.getOpacity(10)} active={d.isActive('concurrent')}
            tooltip="React Server Components: renderizam no servidor, zero JS no client. 'use client' boundary. Reduz bundle size drasticamente. Data fetching no componente (async)"
          />
        </DiagramGroup>
      </DiagramCanvas>
    </DiagramShell>
  );
}
