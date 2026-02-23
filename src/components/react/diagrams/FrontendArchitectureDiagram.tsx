import AlgorithmShell from '../algorithms/AlgorithmShell';
import { DiagramCanvas, DiagramNode, DiagramEdge, DiagramGroup, COLORS } from './index';
import { useInteractiveDiagram, type DiagramStepDef } from './useInteractiveDiagram';

const STEPS: DiagramStepDef[] = [
  { description: 'Design Tokens: as variáveis fundamentais do sistema visual', activeElements: ['tokens'] },
  { description: 'Componentes Primitivos: os blocos básicos construídos sobre os tokens', activeElements: ['primitives'] },
  { description: 'Componentes Compostos: combinam primitivos para formar padrões de UI', activeElements: ['composites'] },
  { description: 'Templates e Páginas: layouts que organizam compostos na tela', activeElements: ['pages'] },
  { description: 'Gerenciamento de Estado: local, lifted, global e server state', activeElements: ['state'] },
  { description: 'Pipeline de Build: do código-fonte ao navegador do usuário', activeElements: ['build'] },
];

export default function FrontendArchitectureDiagram() {
  const d = useInteractiveDiagram(STEPS);

  return (
    <AlgorithmShell
      title="Arquitetura Frontend"
      description="Design system, componentização, estado e pipeline de entrega"
      totalSteps={d.totalSteps}
      currentStep={d.currentStep}
      stepDescription={d.stepDescription}
      onStep={d.handleStep}
      onReset={d.handleReset}
      isComplete={d.isComplete}
      color="#a855f7"
    >
      <DiagramCanvas width={1000} height={620}>
        {/* === Step 0: Design Tokens === */}
        <DiagramGroup x={30} y={20} width={940} height={90} label="Design Tokens" color={COLORS.purple} opacity={d.getOpacity(0)}>
          <DiagramNode
            x={50} y={50} label="Cores" sublabel="--color-primary" icon="🎨"
            color={COLORS.purple} width={130} height={50}
            opacity={d.getOpacity(0)} active={d.isActive('tokens')}
            tooltip="Paleta de cores semânticas: primary, secondary, danger, success. Definidas como CSS custom properties ou tokens em JSON"
          />
          <DiagramNode
            x={200} y={50} label="Tipografia" sublabel="font-size, weight" icon="🔤"
            color={COLORS.purple} width={130} height={50}
            opacity={d.getOpacity(0)} active={d.isActive('tokens')}
            tooltip="Escala tipográfica consistente: tamanhos, pesos e line-heights definidos como tokens reutilizáveis"
          />
          <DiagramNode
            x={350} y={50} label="Espaçamento" sublabel="4px, 8px, 16px..." icon="📏"
            color={COLORS.purple} width={130} height={50}
            opacity={d.getOpacity(0)} active={d.isActive('tokens')}
            tooltip="Sistema de espaçamento baseado em múltiplos (geralmente 4px ou 8px) para padding, margin e gap"
          />
          <DiagramNode
            x={500} y={50} label="Sombras" sublabel="elevation" icon="🌑"
            color={COLORS.purple} width={130} height={50}
            opacity={d.getOpacity(0)} active={d.isActive('tokens')}
            tooltip="Níveis de elevação (box-shadow) que comunicam hierarquia visual e profundidade"
          />
          <DiagramNode
            x={650} y={50} label="Breakpoints" sublabel="sm, md, lg, xl" icon="📱"
            color={COLORS.purple} width={130} height={50}
            opacity={d.getOpacity(0)} active={d.isActive('tokens')}
            tooltip="Pontos de quebra para layouts responsivos — definem quando o layout adapta para diferentes telas"
          />
          <DiagramNode
            x={800} y={50} label="Motion" sublabel="duration, easing" icon="✨"
            color={COLORS.purple} width={130} height={50}
            opacity={d.getOpacity(0)} active={d.isActive('tokens')}
            tooltip="Tokens de animação: durações e curvas de easing consistentes para transições na interface"
          />
        </DiagramGroup>

        {/* Arrow tokens → primitives */}
        <DiagramEdge from={{ x: 500, y: 110 }} to={{ x: 500, y: 135 }} color="purple" opacity={d.getOpacity(1)} />

        {/* === Step 1: Primitive Components === */}
        <DiagramGroup x={30} y={135} width={940} height={85} label="Componentes Primitivos" color={COLORS.blue} opacity={d.getOpacity(1)}>
          <DiagramNode
            x={60} y={160} label="Button" icon="🔘"
            color={COLORS.blue} width={110} height={45}
            opacity={d.getOpacity(1)} active={d.isActive('primitives')}
            tooltip="Botão base com variantes (primary, secondary, ghost) — consome tokens de cor, tipografia e espaçamento"
          />
          <DiagramNode
            x={190} y={160} label="Input" icon="📝"
            color={COLORS.blue} width={110} height={45}
            opacity={d.getOpacity(1)} active={d.isActive('primitives')}
            tooltip="Campo de entrada com estados: default, focus, error, disabled — acessível via label e aria"
          />
          <DiagramNode
            x={320} y={160} label="Text" icon="📄"
            color={COLORS.blue} width={110} height={45}
            opacity={d.getOpacity(1)} active={d.isActive('primitives')}
            tooltip="Componente de texto tipado: heading, body, caption — aplica escala tipográfica automaticamente"
          />
          <DiagramNode
            x={450} y={160} label="Icon" icon="⭐"
            color={COLORS.blue} width={110} height={45}
            opacity={d.getOpacity(1)} active={d.isActive('primitives')}
            tooltip="Sistema de ícones SVG com tamanhos padronizados e cores herdadas do contexto"
          />
          <DiagramNode
            x={580} y={160} label="Avatar" icon="👤"
            color={COLORS.blue} width={110} height={45}
            opacity={d.getOpacity(1)} active={d.isActive('primitives')}
            tooltip="Imagem de perfil com fallback para iniciais — tamanhos sm, md, lg"
          />
          <DiagramNode
            x={710} y={160} label="Badge" icon="🏷️"
            color={COLORS.blue} width={110} height={45}
            opacity={d.getOpacity(1)} active={d.isActive('primitives')}
            tooltip="Indicador visual para status, contagem ou categorias — variantes de cor e tamanho"
          />
          <DiagramNode
            x={840} y={160} label="Skeleton" icon="⬜"
            color={COLORS.blue} width={110} height={45}
            opacity={d.getOpacity(1)} active={d.isActive('primitives')}
            tooltip="Placeholder animado exibido enquanto dados carregam — melhora percepção de velocidade"
          />
        </DiagramGroup>

        {/* Arrow primitives → composites */}
        <DiagramEdge from={{ x: 500, y: 220 }} to={{ x: 500, y: 245 }} color="blue" opacity={d.getOpacity(2)} />

        {/* === Step 2: Composite Components === */}
        <DiagramGroup x={30} y={245} width={940} height={85} label="Componentes Compostos" color={COLORS.green} opacity={d.getOpacity(2)}>
          <DiagramNode
            x={60} y={270} label="Form" sublabel="Input + Button + validation"
            color={COLORS.green} width={170} height={45}
            opacity={d.getOpacity(2)} active={d.isActive('composites')}
            tooltip="Formulário com validação integrada: combina inputs, labels, mensagens de erro e botão de submit"
          />
          <DiagramNode
            x={250} y={270} label="Card" sublabel="Image + Text + Action"
            color={COLORS.green} width={170} height={45}
            opacity={d.getOpacity(2)} active={d.isActive('composites')}
            tooltip="Container visual com header, body e footer — agrupa informações relacionadas"
          />
          <DiagramNode
            x={440} y={270} label="Modal" sublabel="Overlay + Content"
            color={COLORS.green} width={170} height={45}
            opacity={d.getOpacity(2)} active={d.isActive('composites')}
            tooltip="Diálogo sobreposto que bloqueia interação com o fundo — usa portal e focus trap para acessibilidade"
          />
          <DiagramNode
            x={630} y={270} label="Table" sublabel="Header + Rows + Sort"
            color={COLORS.green} width={170} height={45}
            opacity={d.getOpacity(2)} active={d.isActive('composites')}
            tooltip="Tabela de dados com ordenação, paginação e seleção de linhas"
          />
          <DiagramNode
            x={820} y={270} label="Nav" sublabel="Links + Menu + Logo"
            color={COLORS.green} width={130} height={45}
            opacity={d.getOpacity(2)} active={d.isActive('composites')}
            tooltip="Barra de navegação responsiva com menu mobile, links e branding"
          />
        </DiagramGroup>

        {/* Arrow composites → pages */}
        <DiagramEdge from={{ x: 500, y: 330 }} to={{ x: 500, y: 355 }} color="green" opacity={d.getOpacity(3)} />

        {/* === Step 3: Templates / Pages === */}
        <DiagramGroup x={30} y={355} width={450} height={85} label="Templates e Páginas" color={COLORS.amber} opacity={d.getOpacity(3)}>
          <DiagramNode
            x={50} y={380} label="Layout" sublabel="Nav + Sidebar + Content"
            color={COLORS.amber} width={170} height={45}
            opacity={d.getOpacity(3)} active={d.isActive('pages')}
            tooltip="Template de layout que define a estrutura da página: navegação, sidebar e área de conteúdo"
          />
          <DiagramNode
            x={240} y={380} label="Página" sublabel="Route → Layout → Data"
            color={COLORS.amber} width={170} height={45}
            opacity={d.getOpacity(3)} active={d.isActive('pages')}
            tooltip="Componente de página conectado a uma rota — busca dados e compõe compostos dentro de um layout"
          />
        </DiagramGroup>

        {/* === Step 4: State Management === */}
        <DiagramGroup x={520} y={355} width={450} height={115} label="Gerenciamento de Estado" color={COLORS.cyan} opacity={d.getOpacity(4)}>
          <DiagramNode
            x={540} y={380} label="Local State" sublabel="useState"
            color={COLORS.cyan} width={120} height={40}
            opacity={d.getOpacity(4)} active={d.isActive('state')}
            tooltip="Estado local do componente — não compartilhado. Ideal para UI state como toggles, inputs e abas"
          />
          <DiagramNode
            x={680} y={380} label="Lifted State" sublabel="props drilling"
            color={COLORS.cyan} width={120} height={40}
            opacity={d.getOpacity(4)} active={d.isActive('state')}
            tooltip="Estado elevado ao ancestral comum — passado via props. Funciona para poucos níveis de profundidade"
          />
          <DiagramNode
            x={540} y={430} label="Global State" sublabel="Context / Zustand"
            color={COLORS.cyan} width={120} height={40}
            opacity={d.getOpacity(4)} active={d.isActive('state')}
            tooltip="Estado global acessível por qualquer componente — tema, auth, preferências. Context API, Redux ou Zustand"
          />
          <DiagramNode
            x={680} y={430} label="Server State" sublabel="React Query / SWR"
            color={COLORS.cyan} width={120} height={40}
            opacity={d.getOpacity(4)} active={d.isActive('state')}
            tooltip="Dados do servidor com cache, revalidação e sync automático. React Query e SWR gerenciam loading, error e stale"
          />
          <DiagramEdge from={{ x: 600, y: 420 }} to={{ x: 600, y: 430 }} color="cyan" arrow={false} opacity={d.getOpacity(4)} />
          <DiagramEdge from={{ x: 740, y: 420 }} to={{ x: 740, y: 430 }} color="cyan" arrow={false} opacity={d.getOpacity(4)} />
          <DiagramEdge from={{ x: 660, y: 400 }} to={{ x: 680, y: 400 }} color="cyan" arrow={false} opacity={d.getOpacity(4)} />
          <DiagramEdge from={{ x: 660, y: 450 }} to={{ x: 680, y: 450 }} color="cyan" arrow={false} opacity={d.getOpacity(4)} />
        </DiagramGroup>

        {/* === Step 5: Build Pipeline === */}
        <DiagramGroup x={30} y={490} width={940} height={110} label="Pipeline de Build e Entrega" color={COLORS.orange} opacity={d.getOpacity(5)}>
          <DiagramNode
            x={50} y={520} label="Código-fonte" sublabel="TS / JSX / CSS"
            color={COLORS.orange} width={140} height={50}
            opacity={d.getOpacity(5)} active={d.isActive('build')}
            tooltip="Código-fonte em TypeScript, JSX e CSS modules ou Tailwind — ponto de partida do build"
          />
          <DiagramEdge from={{ x: 190, y: 545 }} to={{ x: 220, y: 545 }} color="orange" opacity={d.getOpacity(5)} />
          <DiagramNode
            x={220} y={520} label="Bundler" sublabel="Vite / Webpack"
            color={COLORS.orange} width={130} height={50}
            opacity={d.getOpacity(5)} active={d.isActive('build')}
            tooltip="Empacota módulos, resolve imports, transpila TypeScript e processa CSS — Vite usa ESBuild + Rollup"
          />
          <DiagramEdge from={{ x: 350, y: 545 }} to={{ x: 380, y: 545 }} color="orange" opacity={d.getOpacity(5)} />
          <DiagramNode
            x={380} y={520} label="Tree Shaking" sublabel="Dead code elimination"
            color={COLORS.orange} width={140} height={50}
            opacity={d.getOpacity(5)} active={d.isActive('build')}
            tooltip="Remove código não utilizado do bundle final — analisa imports ES modules para determinar o que é usado"
          />
          <DiagramEdge from={{ x: 520, y: 545 }} to={{ x: 550, y: 545 }} color="orange" opacity={d.getOpacity(5)} />
          <DiagramNode
            x={550} y={520} label="Code Splitting" sublabel="Lazy loading"
            color={COLORS.orange} width={140} height={50}
            opacity={d.getOpacity(5)} active={d.isActive('build')}
            tooltip="Divide o bundle em chunks menores carregados sob demanda — React.lazy() e dynamic import()"
          />
          <DiagramEdge from={{ x: 690, y: 545 }} to={{ x: 720, y: 545 }} color="orange" opacity={d.getOpacity(5)} />
          <DiagramNode
            x={720} y={520} label="Minify + Gzip" sublabel="Compressão"
            color={COLORS.orange} width={130} height={50}
            opacity={d.getOpacity(5)} active={d.isActive('build')}
            tooltip="Minificação remove espaços e renomeia variáveis. Gzip/Brotli comprime o output — reduz ~70% do tamanho"
          />
          <DiagramEdge from={{ x: 850, y: 545 }} to={{ x: 880, y: 545 }} color="orange" opacity={d.getOpacity(5)} />
          <DiagramNode
            x={880} y={520} label="CDN" sublabel="Edge deploy"
            color={COLORS.green} width={80} height={50}
            opacity={d.getOpacity(5)} active={d.isActive('build')}
            tooltip="Assets estáticos servidos por CDN global — cache na borda com invalidação por hash no filename"
          />
        </DiagramGroup>
      </DiagramCanvas>
    </AlgorithmShell>
  );
}
