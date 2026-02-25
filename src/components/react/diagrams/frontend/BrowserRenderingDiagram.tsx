import { DiagramCanvas, DiagramNode, DiagramEdge, DiagramBadge, DiagramGroup, DiagramShell, COLORS } from '../index';
import { useInteractiveDiagram, type DiagramStepDef } from '../useInteractiveDiagram';

const STEPS: DiagramStepDef[] = [
  { description: 'Navigation: browser recebe URL → DNS lookup → TCP + TLS → HTTP request. TTFB ideal < 200ms (varia com infra)', activeElements: ['navigation'] },
  { description: 'HTML Parser constrói o DOM token a token. Parser-blocking: <script> sem async/defer trava o parsing', activeElements: ['html-parse'] },
  { description: 'CSS Parser gera o CSSOM. Render-blocking: CSS deve ser carregado antes do primeiro paint. Critical CSS inline', activeElements: ['css-parse'] },
  { description: 'Render Tree = DOM + CSSOM. Só nós visíveis (exclui display:none, <head>). Cada nó com computed styles', activeElements: ['render-tree'] },
  { description: 'Layout (Reflow): calcula posição e tamanho de cada elemento. Operação cara — O(n) no DOM subtree afetado', activeElements: ['layout'] },
  { description: 'Paint: rasteriza pixels em layers. Operações: background, border, text, shadow. Paint recording → display list', activeElements: ['paint'] },
  { description: 'Composite: GPU compõe layers independentes. transform/opacity são "cheap" — só afetam compositing, não layout/paint', activeElements: ['composite'] },
  { description: 'Reflow triggers: width/height, margin, padding, font-size, DOM insert/remove. Batch DOM reads, then writes', activeElements: ['reflow'] },
  { description: 'Repaint triggers: color, background, visibility, box-shadow. Mais barato que reflow (sem recalcular geometry)', activeElements: ['repaint'] },
  { description: 'Critical Rendering Path: minimize render-blocking resources, inline critical CSS, defer JS, preload key assets', activeElements: ['critical-path'] },
];

export default function BrowserRenderingDiagram() {
  const d = useInteractiveDiagram(STEPS);

  return (
    <DiagramShell
      title="Browser Rendering Pipeline"
      description="Critical Rendering Path: do HTML byte ao pixel na tela — parsing, layout, paint e compositing"
      totalSteps={d.totalSteps}
      currentStep={d.currentStep}
      stepDescription={d.stepDescription}
      onStep={d.handleStep}
      onReset={d.handleReset}
      isComplete={d.isComplete}
      showAll={d.showAll}
      onShowAll={d.handleShowAll}
      color="#ec4899"
    >
      <DiagramCanvas width={1100} height={650}>
        {/* Navigation */}
        <DiagramGroup x={20} y={20} width={310} height={100} label="1. Navigation" color={COLORS.textMuted} opacity={d.getOpacity(0)}>
          <DiagramNode
            x={40} y={52} label="DNS + TCP + TLS" sublabel="Connection Setup" icon="🌐"
            color={COLORS.textMuted} width={130} height={48}
            opacity={d.getOpacity(0)} active={d.isActive('navigation')}
            tooltip="DNS lookup (~20-120ms) → TCP 3-way handshake (~1 RTT) → TLS 1.3 (~1 RTT). Total: 100-500ms. HTTP/2: multiplexing na mesma conexão"
          />
          <DiagramNode
            x={190} y={52} label="HTTP Response" sublabel="TTFB" icon="📥"
            color={COLORS.textMuted} width={120} height={48}
            opacity={d.getOpacity(0)} active={d.isActive('navigation')}
            tooltip="Time to First Byte (TTFB): tempo até primeiro byte da resposta. Good: < 200ms (web.dev). Inclui: server processing + network latency. Varia muito com infra e região"
          />
          <DiagramEdge from={{ x: 170, y: 76 }} to={{ x: 190, y: 76 }} color="textMuted" opacity={d.getOpacity(0)} />
        </DiagramGroup>
        <DiagramBadge x={175} y={15} text="TTFB ideal < 200ms" type="latency" opacity={d.getOpacity(0)} />

        {/* Main Pipeline */}
        {/* HTML Parsing → DOM */}
        <DiagramNode
          x={370} y={30} label="HTML Parser" sublabel="Tokenizer → Tree" icon="📄"
          color={COLORS.orange} width={130} height={60}
          opacity={d.getOpacity(1)} active={d.isActive('html-parse')}
          tooltip="Bytes → Characters → Tokens → Nodes → DOM tree. Incremental: renderiza antes de terminar download. Speculative parsing para prefetch de resources"
        />
        <DiagramEdge from={{ x: 310, y: 76 }} to={{ x: 370, y: 60 }} color="orange" label="bytes" opacity={d.getOpacity(1)} />

        <DiagramNode
          x={370} y={110} label="DOM" sublabel="Document Object Model" icon="🌳"
          color={COLORS.orange} width={130} height={50}
          opacity={d.getOpacity(1)} active={d.isActive('html-parse')}
          tooltip="DOM tree: representação em memória do HTML. Cada tag = nó. Nós de texto, atributos, comentários. Live: atualiza com JavaScript"
        />
        <DiagramEdge from={{ x: 435, y: 90 }} to={{ x: 435, y: 110 }} color="orange" opacity={d.getOpacity(1)} />

        {/* Script blocking note */}
        <DiagramGroup x={520} y={25} width={230} height={70} label="Parser Blocking" color={COLORS.red} opacity={d.getOpacity(1)}>
          <text x={540} y={55} fill={COLORS.text} fontSize={9} fontFamily="JetBrains Mono, monospace">
            <tspan x={540} dy={0} opacity={d.getOpacity(1)}>{'<script>'}         → blocks parsing</tspan>
            <tspan x={540} dy={13} opacity={d.getOpacity(1)}>{'<script async>'}   → download parallel</tspan>
            <tspan x={540} dy={13} opacity={d.getOpacity(1)}>{'<script defer>'}   → execute after DOM</tspan>
          </text>
        </DiagramGroup>
        <DiagramBadge x={635} y={20} text="BLOCKING" type="spof" opacity={d.getOpacity(1)} />

        {/* CSS Parsing → CSSOM */}
        <DiagramNode
          x={370} y={190} label="CSS Parser" sublabel="Stylesheets → CSSOM" icon="🎨"
          color={COLORS.blue} width={130} height={55}
          opacity={d.getOpacity(2)} active={d.isActive('css-parse')}
          tooltip="Parse CSS de <style>, <link>, inline styles. Cascade, specificity, inheritance calculados. CSSOM = árvore de computed styles"
        />
        <DiagramNode
          x={370} y={265} label="CSSOM" sublabel="CSS Object Model" icon="🎯"
          color={COLORS.blue} width={130} height={48}
          opacity={d.getOpacity(2)} active={d.isActive('css-parse')}
          tooltip="CSSOM: cada nó com todos os computed styles. Body herda para filhos. Specificity: inline(1000) > id(100) > class(10) > tag(1)"
        />
        <DiagramEdge from={{ x: 435, y: 245 }} to={{ x: 435, y: 265 }} color="blue" opacity={d.getOpacity(2)} />
        <DiagramBadge x={435} y={183} text="RENDER BLOCKING" type="spof" opacity={d.getOpacity(2)} />

        {/* Render Tree */}
        <DiagramNode
          x={560} y={170} label="Render Tree" sublabel="DOM + CSSOM" icon="🌲"
          color={COLORS.green} width={140} height={60}
          opacity={d.getOpacity(3)} active={d.isActive('render-tree')}
          tooltip="Combinação de DOM + CSSOM. Exclui: display:none, <head>, <meta>, <script>. Inclui: pseudo-elements (::before, ::after). Cada nó = element + computed style"
        />
        <DiagramEdge from={{ x: 500, y: 135 }} to={{ x: 560, y: 195 }} color="green" label="DOM" opacity={d.getOpacity(3)} />
        <DiagramEdge from={{ x: 500, y: 289 }} to={{ x: 560, y: 215 }} color="green" label="CSSOM" opacity={d.getOpacity(3)} />

        {/* Layout */}
        <DiagramNode
          x={750} y={170} label="Layout" sublabel="Reflow / Geometry" icon="📐"
          color={COLORS.purple} width={130} height={60}
          opacity={d.getOpacity(4)} active={d.isActive('layout')}
          tooltip="Calcula: position (x,y), size (width, height), margins, padding de cada box. Box model. Flow layout, flexbox, grid. Viewport-relative units (vh, vw)"
        />
        <DiagramEdge from={{ x: 700, y: 200 }} to={{ x: 750, y: 200 }} color="purple" opacity={d.getOpacity(4)} />
        <DiagramBadge x={815} y={162} text="EXPENSIVE" type="warn" opacity={d.getOpacity(4)} />

        {/* Paint */}
        <DiagramNode
          x={930} y={170} label="Paint" sublabel="Rasterize Layers" icon="🖌️"
          color={COLORS.amber} width={130} height={60}
          opacity={d.getOpacity(5)} active={d.isActive('paint')}
          tooltip="Converte layout boxes em pixels reais. Paint order: background-color → background-image → border → children → outline. Gera display list per layer"
        />
        <DiagramEdge from={{ x: 880, y: 200 }} to={{ x: 930, y: 200 }} color="amber" opacity={d.getOpacity(5)} />

        {/* Composite */}
        <DiagramNode
          x={930} y={270} label="Composite" sublabel="GPU Layers" icon="🎮"
          color={COLORS.cyan} width={130} height={60}
          opacity={d.getOpacity(6)} active={d.isActive('composite')}
          tooltip="GPU compõe layers na ordem correta (z-index). Layers criados por: transform, opacity, will-change, position:fixed, video, canvas. Compositor thread: não bloqueia main thread"
        />
        <DiagramEdge from={{ x: 995, y: 230 }} to={{ x: 995, y: 270 }} color="cyan" opacity={d.getOpacity(6)} />
        <DiagramBadge x={995} y={262} text="GPU ACCELERATED" type="fix" opacity={d.getOpacity(6)} />

        {/* Cheap vs Expensive operations */}
        <DiagramGroup x={760} y={270} width={150} height={90} label="Custo por Operação" color={COLORS.green} opacity={d.getOpacity(6)}>
          <text x={780} y={302} fill={COLORS.text} fontSize={9} fontFamily="JetBrains Mono, monospace">
            <tspan x={780} dy={0} fill={COLORS.red}>Layout + Paint + Composite</tspan>
            <tspan x={780} dy={13} fill={COLORS.amber}>Paint + Composite</tspan>
            <tspan x={780} dy={13} fill={COLORS.green}>Composite only ✨</tspan>
            <tspan x={780} dy={13} fill={COLORS.textMuted}>(transform, opacity)</tspan>
          </text>
        </DiagramGroup>

        {/* Reflow Triggers */}
        <DiagramGroup x={20} y={380} width={520} height={120} label="Reflow Triggers (Layout Thrashing)" color={COLORS.red} opacity={d.getOpacity(7)}>
          <text x={40} y={415} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={40} dy={0} fill={COLORS.red}>Propriedades que triggeram reflow:</tspan>
            <tspan x={40} dy={16}>width, height, margin, padding, border-width</tspan>
            <tspan x={40} dy={16}>font-size, font-weight, line-height, text-align</tspan>
            <tspan x={40} dy={16}>position, display, float, overflow, top/left/right/bottom</tspan>
          </text>
          <DiagramNode
            x={380} y={400} label="Forced Sync" sublabel="Layout" icon="⚠️"
            color={COLORS.red} width={130} height={48}
            opacity={d.getOpacity(7)} active={d.isActive('reflow')}
            tooltip="Forced synchronous layout: ler offsetHeight/clientWidth APÓS escrever style causa reflow síncrono. Batch: leia tudo → escreva tudo. Use requestAnimationFrame"
          />
        </DiagramGroup>

        {/* Repaint Triggers */}
        <DiagramGroup x={560} y={380} width={500} height={120} label="Repaint Triggers (Paint Only)" color={COLORS.amber} opacity={d.getOpacity(8)}>
          <text x={580} y={415} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={580} dy={0} fill={COLORS.amber}>Propriedades que triggeram repaint (sem reflow):</tspan>
            <tspan x={580} dy={16}>color, background-color, background-image</tspan>
            <tspan x={580} dy={16}>visibility, outline, box-shadow, border-radius</tspan>
            <tspan x={580} dy={16}>border-style, text-decoration</tspan>
          </text>
          <DiagramBadge x={810} y={375} text="CHEAPER" type="fix" opacity={d.getOpacity(8)} />
        </DiagramGroup>

        {/* Critical Rendering Path Optimization */}
        <DiagramGroup x={20} y={530} width={1040} height={100} label="Critical Rendering Path — Otimizações" color={COLORS.green} opacity={d.getOpacity(9)}>
          <DiagramNode
            x={40} y={560} label="Critical CSS" sublabel="Inline <head>" icon="⚡"
            color={COLORS.green} width={110} height={42}
            opacity={d.getOpacity(9)} active={d.isActive('critical-path')}
            tooltip="Inline CSS necessário para above-the-fold no <head>. Restante: <link rel='preload' as='style'>. Elimina render-blocking. Tools: critical, critters"
          />
          <DiagramNode
            x={170} y={560} label="Defer JS" sublabel="async / defer" icon="📜"
            color={COLORS.green} width={100} height={42}
            opacity={d.getOpacity(9)} active={d.isActive('critical-path')}
            tooltip="defer: download parallel, execute após DOM ready (ordem mantida). async: download parallel, execute imediatamente (sem ordem). Ideal: defer para app, async para analytics"
          />
          <DiagramNode
            x={290} y={560} label="Preload" sublabel="<link rel=preload>" icon="📦"
            color={COLORS.cyan} width={110} height={42}
            opacity={d.getOpacity(9)} active={d.isActive('critical-path')}
            tooltip="<link rel='preload' as='font' crossorigin>: diz ao browser para baixar recurso ASAP. preconnect: resolve DNS+TCP+TLS antecipadamente. prefetch: low priority para próxima navegação"
          />
          <DiagramNode
            x={420} y={560} label="Code Split" sublabel="Dynamic import()" icon="✂️"
            color={COLORS.purple} width={110} height={42}
            opacity={d.getOpacity(9)} active={d.isActive('critical-path')}
            tooltip="import() dinâmico: carrega código sob demanda. Route-based splitting (React.lazy + Suspense). Reduz bundle inicial de ~500KB para ~100KB. Webpack/Vite splitChunks"
          />
          <DiagramNode
            x={550} y={560} label="Image Opt" sublabel="srcset + lazy" icon="🖼️"
            color={COLORS.amber} width={105} height={42}
            opacity={d.getOpacity(9)} active={d.isActive('critical-path')}
            tooltip="loading='lazy' para below-the-fold. srcset para responsive images. WebP/AVIF: 25-50% menor que JPEG. <picture> para format negotiation. aspect-ratio para CLS"
          />
          <DiagramNode
            x={675} y={560} label="Font Strategy" sublabel="font-display" icon="🔤"
            color={COLORS.blue} width={110} height={42}
            opacity={d.getOpacity(9)} active={d.isActive('critical-path')}
            tooltip="font-display: swap (show fallback → swap). preload font files. subset: latin only (~20KB vs ~200KB). Variable fonts: 1 file para múltiplos weights"
          />
          <DiagramNode
            x={805} y={560} label="Compression" sublabel="Brotli / gzip" icon="🗜️"
            color={COLORS.textMuted} width={110} height={42}
            opacity={d.getOpacity(9)} active={d.isActive('critical-path')}
            tooltip="Brotli: 15-25% menor que gzip para texto. Suportado por todos os browsers modernos. Content-Encoding: br. Pre-compress static assets no build"
          />
          <DiagramNode
            x={935} y={560} label="HTTP/2 Push" sublabel="103 Early Hints" icon="🚀"
            color={COLORS.orange} width={110} height={42}
            opacity={d.getOpacity(9)} active={d.isActive('critical-path')}
            tooltip="HTTP/2: multiplexing, header compression (HPACK), server push. 103 Early Hints: envia preload hints antes da resposta completa. HTTP/3: QUIC-based"
          />
        </DiagramGroup>
      </DiagramCanvas>
    </DiagramShell>
  );
}
