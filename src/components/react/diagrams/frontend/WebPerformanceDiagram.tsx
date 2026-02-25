import { DiagramCanvas, DiagramNode, DiagramEdge, DiagramBadge, DiagramGroup, DiagramShell, COLORS } from '../index';
import { useInteractiveDiagram, type DiagramStepDef } from '../useInteractiveDiagram';

const STEPS: DiagramStepDef[] = [
  { description: 'Core Web Vitals: 3 métricas do Google que impactam SEO e UX — LCP, INP, CLS', activeElements: ['vitals'] },
  { description: 'LCP (Largest Contentful Paint): tempo até o maior elemento visível renderizar. Target: < 2.5s', activeElements: ['lcp'] },
  { description: 'INP (Interaction to Next Paint): latência de interações do usuário. Target: < 200ms. Substitui FID', activeElements: ['inp'] },
  { description: 'CLS (Cumulative Layout Shift): quanto o layout "pula". Target: < 0.1. Causado por imagens sem dimensão, fonts, ads', activeElements: ['cls'] },
  { description: 'Bundle optimization: tree shaking remove dead code, code splitting divide chunks, minificação reduz tamanho', activeElements: ['bundle'] },
  { description: 'Caching strategy: Cache-Control, ETag, Service Worker. Stale-while-revalidate para UX máxima', activeElements: ['caching'] },
  { description: 'Runtime performance: long tasks (> 50ms) bloqueiam main thread. requestIdleCallback, Web Workers para offload', activeElements: ['runtime'] },
  { description: 'Rendering patterns: CSR vs SSR vs SSG vs ISR — cada um com trade-offs de TTFB, TTI e freshness', activeElements: ['rendering'] },
  { description: 'Resource hints: preload (ASAP), prefetch (idle), preconnect (DNS+TCP+TLS), dns-prefetch (DNS only)', activeElements: ['hints'] },
  { description: 'Monitoring: Real User Monitoring (RUM) via Performance API + web-vitals library. Synthetic: Lighthouse, WebPageTest', activeElements: ['monitoring'] },
];

export default function WebPerformanceDiagram() {
  const d = useInteractiveDiagram(STEPS);

  return (
    <DiagramShell
      title="Web Performance & Core Web Vitals"
      description="Core Web Vitals, bundle optimization, caching, rendering patterns e monitoramento de performance"
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
      <DiagramCanvas width={1100} height={680}>
        {/* Core Web Vitals Overview */}
        <DiagramGroup x={20} y={20} width={1050} height={80} label="Core Web Vitals (Google — impacta ranking SEO)" color={COLORS.green} opacity={d.getOpacity(0)}>
          <DiagramNode x={40} y={48} label="LCP" sublabel="< 2.5s" icon="🖼️"
            color={COLORS.green} width={90} height={38}
            opacity={d.getOpacity(0)} active={d.isActive('vitals')}
            tooltip="Largest Contentful Paint: quanto tempo para o maior elemento above-the-fold renderizar (imagem hero, heading principal, video poster)" />
          <DiagramNode x={150} y={48} label="INP" sublabel="< 200ms" icon="👆"
            color={COLORS.amber} width={90} height={38}
            opacity={d.getOpacity(0)} active={d.isActive('vitals')}
            tooltip="Interaction to Next Paint: pior latência de interação (click, tap, keypress) durante a visita. Substitui FID (que media só primeiro input)" />
          <DiagramNode x={260} y={48} label="CLS" sublabel="< 0.1" icon="📏"
            color={COLORS.red} width={90} height={38}
            opacity={d.getOpacity(0)} active={d.isActive('vitals')}
            tooltip="Cumulative Layout Shift: soma dos shifts inesperados de layout. Score adimensional. 0 = perfeito. Penaliza conteúdo que 'pula'" />

          <text x={400} y={60} fill={COLORS.textMuted} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={400} dy={0} opacity={d.getOpacity(0)}>Good: verde | Needs improvement: amarelo | Poor: vermelho</tspan>
            <tspan x={400} dy={14} opacity={d.getOpacity(0)}>Medido no p75 de usuários reais (CrUX — Chrome UX Report)</tspan>
          </text>
        </DiagramGroup>

        {/* LCP Deep Dive */}
        <DiagramGroup x={20} y={120} width={340} height={150} label="LCP — Largest Contentful Paint" color={COLORS.green} opacity={d.getOpacity(1)}>
          <text x={40} y={155} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={40} dy={0} fill={COLORS.green} opacity={d.getOpacity(1)}>Elementos candidatos:</tspan>
            <tspan x={40} dy={14} opacity={d.getOpacity(1)}>{'<img>'}, {'<video poster>'}, background-image</tspan>
            <tspan x={40} dy={14} opacity={d.getOpacity(1)}>Block-level text elements (h1, p)</tspan>
            <tspan x={40} dy={18} fill={COLORS.green} opacity={d.getOpacity(1)}>Otimizações:</tspan>
            <tspan x={40} dy={14} opacity={d.getOpacity(1)}>preload hero image, AVIF/WebP, CDN</tspan>
            <tspan x={40} dy={14} opacity={d.getOpacity(1)}>SSR/SSG, critical CSS, fetchpriority=high</tspan>
          </text>
        </DiagramGroup>
        <DiagramBadge x={190} y={115} text="< 2.5s GOOD" type="fix" opacity={d.getOpacity(1)} />

        {/* INP Deep Dive */}
        <DiagramGroup x={380} y={120} width={340} height={150} label="INP — Interaction to Next Paint" color={COLORS.amber} opacity={d.getOpacity(2)}>
          <text x={400} y={155} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={400} dy={0} fill={COLORS.amber} opacity={d.getOpacity(2)}>Composição do INP:</tspan>
            <tspan x={400} dy={14} opacity={d.getOpacity(2)}>Input delay + Processing + Presentation</tspan>
            <tspan x={400} dy={14} opacity={d.getOpacity(2)}>Long tasks ({'>'} 50ms) bloqueiam resposta</tspan>
            <tspan x={400} dy={18} fill={COLORS.amber} opacity={d.getOpacity(2)}>Otimizações:</tspan>
            <tspan x={400} dy={14} opacity={d.getOpacity(2)}>Break long tasks (yield to main thread)</tspan>
            <tspan x={400} dy={14} opacity={d.getOpacity(2)}>requestAnimationFrame, Web Workers</tspan>
          </text>
        </DiagramGroup>
        <DiagramBadge x={550} y={115} text="< 200ms GOOD" type="warn" opacity={d.getOpacity(2)} />

        {/* CLS Deep Dive */}
        <DiagramGroup x={740} y={120} width={330} height={150} label="CLS — Cumulative Layout Shift" color={COLORS.red} opacity={d.getOpacity(3)}>
          <text x={760} y={155} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={760} dy={0} fill={COLORS.red} opacity={d.getOpacity(3)}>Causas comuns:</tspan>
            <tspan x={760} dy={14} opacity={d.getOpacity(3)}>Imagens sem width/height</tspan>
            <tspan x={760} dy={14} opacity={d.getOpacity(3)}>Ads/iframes injetados dinamicamente</tspan>
            <tspan x={760} dy={14} opacity={d.getOpacity(3)}>Web fonts (FOUT/FOIT)</tspan>
            <tspan x={760} dy={18} fill={COLORS.red} opacity={d.getOpacity(3)}>Fixes:</tspan>
            <tspan x={760} dy={14} opacity={d.getOpacity(3)}>aspect-ratio, font-display:optional</tspan>
            <tspan x={760} dy={14} opacity={d.getOpacity(3)}>Placeholder/skeleton antes de carregar</tspan>
          </text>
        </DiagramGroup>
        <DiagramBadge x={905} y={115} text="< 0.1 GOOD" type="spof" opacity={d.getOpacity(3)} />

        {/* Bundle Optimization */}
        <DiagramGroup x={20} y={300} width={520} height={110} label="Bundle Optimization" color={COLORS.purple} opacity={d.getOpacity(4)}>
          <DiagramNode
            x={40} y={335} label="Tree Shaking" sublabel="Dead code elimination" icon="🌳"
            color={COLORS.purple} width={115} height={42}
            opacity={d.getOpacity(4)} active={d.isActive('bundle')}
            tooltip="ES modules + bundler (Vite/webpack) removem exports não utilizados. sideEffects: false no package.json. Reduz 30-60% em libs como lodash-es"
          />
          <DiagramNode
            x={175} y={335} label="Code Split" sublabel="Dynamic import()" icon="✂️"
            color={COLORS.purple} width={110} height={42}
            opacity={d.getOpacity(4)} active={d.isActive('bundle')}
            tooltip="Route-based: React.lazy(() => import('./Page')). Component-based: heavy modals, charts. Vendor splitting: node_modules separado. Initial bundle < 100KB"
          />
          <DiagramNode
            x={305} y={335} label="Minify" sublabel="Terser / esbuild" icon="🗜️"
            color={COLORS.purple} width={100} height={42}
            opacity={d.getOpacity(4)} active={d.isActive('bundle')}
            tooltip="Remove whitespace, shortens variables, dead code. esbuild: 100x mais rápido que Terser. CSS: cssnano/lightningcss. HTML: html-minifier"
          />
          <DiagramNode
            x={425} y={335} label="Analyze" sublabel="Bundle visualizer" icon="📊"
            color={COLORS.amber} width={95} height={42}
            opacity={d.getOpacity(4)} active={d.isActive('bundle')}
            tooltip="rollup-plugin-visualizer, webpack-bundle-analyzer: treemap do bundle. Identifica deps pesadas (moment.js → day.js, lodash → lodash-es). Budget: alerta se bundle > threshold"
          />
        </DiagramGroup>
        <DiagramBadge x={280} y={295} text="INITIAL < 100KB" type="tradeoff" opacity={d.getOpacity(4)} />

        {/* Caching Strategy */}
        <DiagramGroup x={560} y={300} width={510} height={110} label="Caching Strategy" color={COLORS.cyan} opacity={d.getOpacity(5)}>
          <DiagramNode
            x={580} y={335} label="Cache-Control" sublabel="Immutable assets" icon="📦"
            color={COLORS.cyan} width={115} height={42}
            opacity={d.getOpacity(5)} active={d.isActive('caching')}
            tooltip="Assets com hash: max-age=31536000,immutable. HTML: no-cache (revalida sempre). API: private,max-age=0. CDN: s-maxage para edge cache"
          />
          <DiagramNode
            x={715} y={335} label="Service Worker" sublabel="Offline + Cache" icon="⚙️"
            color={COLORS.cyan} width={120} height={42}
            opacity={d.getOpacity(5)} active={d.isActive('caching')}
            tooltip="Cache API + fetch intercept. Strategies: Cache First (assets), Network First (API), Stale While Revalidate (balance). Workbox para abstração"
          />
          <DiagramNode
            x={855} y={335} label="SWR Pattern" sublabel="Stale-While-Rev" icon="🔄"
            color={COLORS.green} width={120} height={42}
            opacity={d.getOpacity(5)} active={d.isActive('caching')}
            tooltip="Serve stale imediatamente → revalida em background → atualiza cache. Melhor UX: sem loading state. useSWR (Vercel), React Query/TanStack Query implementam isso"
          />
          <DiagramNode
            x={995} y={335} label="ETag" sublabel="304 Not Modified" icon="🏷️"
            color={COLORS.textMuted} width={60} height={42}
            opacity={d.getOpacity(5)} active={d.isActive('caching')}
            tooltip="ETag: hash do conteúdo. If-None-Match no request. 304 sem body = economia de bandwidth. Complementa Cache-Control"
          />
        </DiagramGroup>

        {/* Runtime Performance */}
        <DiagramGroup x={20} y={440} width={520} height={110} label="Runtime Performance" color={COLORS.red} opacity={d.getOpacity(6)}>
          <DiagramNode
            x={40} y={475} label="Long Tasks" sublabel="> 50ms → jank" icon="🐢"
            color={COLORS.red} width={110} height={42}
            opacity={d.getOpacity(6)} active={d.isActive('runtime')}
            tooltip="Tasks > 50ms bloqueiam main thread → UI não responsiva (jank). Performance.measure() para identificar. PerformanceObserver('longtask') para monitoring"
          />
          <DiagramNode
            x={170} y={475} label="Web Workers" sublabel="Off main thread" icon="👷"
            color={COLORS.blue} width={110} height={42}
            opacity={d.getOpacity(6)} active={d.isActive('runtime')}
            tooltip="Offload computation pesada para thread separada. Comunicação via postMessage (structuredClone). SharedArrayBuffer para memória compartilhada. Comlink para DX"
          />
          <DiagramNode
            x={300} y={475} label="rAF / rIC" sublabel="Frame scheduling" icon="🎬"
            color={COLORS.green} width={100} height={42}
            opacity={d.getOpacity(6)} active={d.isActive('runtime')}
            tooltip="requestAnimationFrame: synca com refresh rate (16.6ms @60fps). requestIdleCallback: roda quando browser está idle. scheduler.yield() (proposta) para cooperar com browser"
          />
          <DiagramNode
            x={420} y={475} label="Virtualization" sublabel="Windowing" icon="📜"
            color={COLORS.purple} width={105} height={42}
            opacity={d.getOpacity(6)} active={d.isActive('runtime')}
            tooltip="Renderiza apenas itens visíveis (10-20 de milhares). react-virtuoso, @tanstack/virtual, react-window. Reduz DOM nodes de 10K para ~20. Scroll performance"
          />
        </DiagramGroup>
        <DiagramBadge x={280} y={435} text="60 FPS = 16.6ms/FRAME" type="latency" opacity={d.getOpacity(6)} />

        {/* Rendering Patterns */}
        <DiagramGroup x={560} y={440} width={510} height={110} label="Rendering Patterns" color={COLORS.orange} opacity={d.getOpacity(7)}>
          <DiagramNode
            x={580} y={475} label="CSR" sublabel="Client-Side" icon="📱"
            color={COLORS.orange} width={80} height={42}
            opacity={d.getOpacity(7)} active={d.isActive('rendering')}
            tooltip="Client-Side Rendering: HTML shell + JS bundle → render no browser. Bom: interatividade. Ruim: LCP lento, SEO depende de JS. SPA clássica (CRA)"
          />
          <DiagramNode
            x={680} y={475} label="SSR" sublabel="Server-Side" icon="🖥️"
            color={COLORS.blue} width={80} height={42}
            opacity={d.getOpacity(7)} active={d.isActive('rendering')}
            tooltip="Server-Side Rendering: HTML completo no servidor, hidrata no client. Bom: LCP rápido, SEO. Ruim: TTFB maior, server load. Next.js, Nuxt"
          />
          <DiagramNode
            x={780} y={475} label="SSG" sublabel="Static Gen" icon="📄"
            color={COLORS.green} width={80} height={42}
            opacity={d.getOpacity(7)} active={d.isActive('rendering')}
            tooltip="Static Site Generation: HTML gerado no build time. Bom: TTFB mínimo (CDN), zero server. Ruim: rebuild para atualizar. Ideal: blogs, docs. Astro, Next.js"
          />
          <DiagramNode
            x={880} y={475} label="ISR" sublabel="Incremental" icon="🔄"
            color={COLORS.purple} width={80} height={42}
            opacity={d.getOpacity(7)} active={d.isActive('rendering')}
            tooltip="Incremental Static Regeneration: SSG + revalidation em background. revalidate: 60 = regenera a cada 60s. On-demand ISR: webhook trigger. Vercel, Netlify"
          />
          <DiagramNode
            x={980} y={475} label="Streaming" sublabel="RSC + Suspense" icon="🌊"
            color={COLORS.cyan} width={80} height={42}
            opacity={d.getOpacity(7)} active={d.isActive('rendering')}
            tooltip="Streaming SSR: envia shell ASAP, streama Suspense fallbacks. React Server Components: zero client JS. Partial prerendering: estático + dinâmico. Next.js App Router"
          />
        </DiagramGroup>

        {/* Resource Hints */}
        <DiagramGroup x={20} y={580} width={520} height={80} label="Resource Hints" color={COLORS.blue} opacity={d.getOpacity(8)}>
          <DiagramNode x={40} y={605} label="preload" sublabel="ASAP download" color={COLORS.red} width={85} height={32}
            opacity={d.getOpacity(8)} active={d.isActive('hints')}
            tooltip="<link rel='preload' as='font' crossorigin>: download com prioridade alta. Para recursos descobertos tarde: fonts, above-fold images, critical scripts" />
          <DiagramNode x={140} y={605} label="prefetch" sublabel="Next page" color={COLORS.blue} width={85} height={32}
            opacity={d.getOpacity(8)} active={d.isActive('hints')}
            tooltip="<link rel='prefetch'>: download em idle para próxima navegação. Low priority. Não garante uso. Ideal: previsível next page (login → dashboard)" />
          <DiagramNode x={240} y={605} label="preconnect" sublabel="DNS+TCP+TLS" color={COLORS.green} width={95} height={32}
            opacity={d.getOpacity(8)} active={d.isActive('hints')}
            tooltip="<link rel='preconnect' href='https://api.example.com'>: resolve DNS + TCP + TLS antecipadamente. Economiza ~200-400ms. Max: 2-4 origins" />
          <DiagramNode x={350} y={605} label="dns-prefetch" sublabel="DNS only" color={COLORS.textMuted} width={90} height={32}
            opacity={d.getOpacity(8)} active={d.isActive('hints')}
            tooltip="<link rel='dns-prefetch'>: resolve apenas DNS. Mais leve que preconnect. Fallback para browsers antigos. Para third-party origins (analytics, fonts)" />
          <DiagramNode x={455} y={605} label="fetchpriority" sublabel="high/low/auto" color={COLORS.amber} width={75} height={32}
            opacity={d.getOpacity(8)} active={d.isActive('hints')}
            tooltip="fetchpriority='high' em <img> hero: prioriza download. fetchpriority='low' em below-fold images. Disponível em Chrome/Edge. Fine-tune de priorização" />
        </DiagramGroup>

        {/* Monitoring */}
        <DiagramGroup x={560} y={580} width={510} height={80} label="Performance Monitoring" color={COLORS.amber} opacity={d.getOpacity(9)}>
          <DiagramNode x={580} y={605} label="RUM" sublabel="web-vitals lib" icon="📊"
            color={COLORS.amber} width={100} height={32}
            opacity={d.getOpacity(9)} active={d.isActive('monitoring')}
            tooltip="Real User Monitoring: web-vitals library do Google. Coleta LCP, INP, CLS, TTFB, FCP de usuários reais. Envia para analytics. P75 para representar experiência típica" />
          <DiagramNode x={700} y={605} label="Lighthouse" sublabel="Synthetic" icon="🔦"
            color={COLORS.green} width={100} height={32}
            opacity={d.getOpacity(9)} active={d.isActive('monitoring')}
            tooltip="Lighthouse: audit sintético (lab data). Score 0-100 para Performance, A11y, Best Practices, SEO. CI: lighthouse-ci para regressions. Throttling: simula 4G/slow CPU" />
          <DiagramNode x={820} y={605} label="CrUX" sublabel="Chrome UX Report" icon="📈"
            color={COLORS.blue} width={105} height={32}
            opacity={d.getOpacity(9)} active={d.isActive('monitoring')}
            tooltip="Chrome UX Report: dados reais de milhões de Chrome users. Base do 'core web vitals assessment' do Google Search. PageSpeed Insights usa CrUX. BigQuery dataset público" />
          <DiagramNode x={945} y={605} label="Perf API" sublabel="PerformanceObserver" icon="⚙️"
            color={COLORS.purple} width={105} height={32}
            opacity={d.getOpacity(9)} active={d.isActive('monitoring')}
            tooltip="Performance API: performance.mark/measure para custom timing. PerformanceObserver: 'largest-contentful-paint', 'layout-shift', 'longtask'. Resource Timing para waterfall" />
        </DiagramGroup>
      </DiagramCanvas>
    </DiagramShell>
  );
}
