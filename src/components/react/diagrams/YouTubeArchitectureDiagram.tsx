import AlgorithmShell from '../algorithms/AlgorithmShell';
import { DiagramCanvas, DiagramNode, DiagramEdge, DiagramGroup, DiagramBadge, COLORS } from './index';
import { useInteractiveDiagram, type DiagramStepDef } from './useInteractiveDiagram';

const STEPS: DiagramStepDef[] = [
  { description: 'Ingestão: Creator faz upload via API resumable para Object Store', activeElements: ['creator', 'upload-api', 'obj-store', 'edge-upload-1', 'edge-upload-2'] },
  { description: 'Pipeline de transcode: Queue dispara FFmpeg cluster + Thumbnails', activeElements: ['queue', 'transcode', 'thumbnails', 'edge-trigger', 'edge-queue', 'edge-thumb'] },
  { description: 'Metadados armazenados em Vitess (sharded) + Search Index + Analytics', activeElements: ['metadata-db', 'search-idx', 'analytics-svc', 'edge-meta-1', 'edge-meta-2', 'edge-cross-meta'] },
  { description: 'Recommendation Engine: Candidate Gen → Ranking Model → Feed personalizado', activeElements: ['candidate', 'ranking', 'feed', 'edge-rec-1', 'edge-rec-2'] },
  { description: 'Serving Path: Viewer → CDN Edge (95% cache hit) → Origin → ABR Streaming', activeElements: ['viewer', 'cdn-edge', 'origin', 'abr', 'edge-view', 'edge-cache-miss', 'edge-origin-abr'] },
  { description: 'DRM protege conteúdo + Ad Server faz real-time bidding', activeElements: ['drm', 'ad-server', 'edge-drm', 'edge-ads'] },
  { description: 'Infraestrutura Google: Borg, Colossus, Spanner, Bigtable, Pub/Sub, TPU Pods', activeElements: ['borg', 'colossus', 'spanner', 'bigtable', 'pubsub', 'tpu'] },
  { description: 'Feed servido do Recommendation Engine para o Serving Path', activeElements: ['edge-serve'] },
];

export default function YouTubeArchitectureDiagram() {
  const d = useInteractiveDiagram(STEPS);

  return (
    <AlgorithmShell
      title="Arquitetura do YouTube"
      description="Do upload ao playback: como o YouTube processa bilhões de vídeos"
      totalSteps={d.totalSteps}
      currentStep={d.currentStep}
      stepDescription={d.stepDescription}
      onStep={d.handleStep}
      onReset={d.handleReset}
      isComplete={d.isComplete}
      color="#ef4444"
    >
      <DiagramCanvas width={1100} height={620}>
        {/* Upload Path */}
        <DiagramGroup x={20} y={20} width={520} height={270} label="Ingestão de Vídeo (Upload Path)" color={COLORS.red} opacity={d.getOpacity(0)}>
          <DiagramNode
            x={40} y={55} label="Creator" sublabel="Upload vídeo" icon="🎬"
            color={COLORS.red} width={120} height={55}
            opacity={d.getOpacity(0)} active={d.isActive('creator')}
            tooltip="Criadores de conteúdo fazem upload de vídeos via app ou interface web"
          />
          <DiagramNode
            x={200} y={55} label="Upload API" sublabel="Resumable upload" icon="📤"
            color={COLORS.orange} width={130} height={55}
            opacity={d.getOpacity(0)} active={d.isActive('upload-api')}
            tooltip="API resumable permite upload de arquivos grandes com retomada automática após falha"
          />
          <DiagramNode
            x={370} y={55} label="Object Store" sublabel="Raw video (GCS)" icon="🪣"
            color={COLORS.green} width={140} height={55}
            opacity={d.getOpacity(0)} active={d.isActive('obj-store')}
            tooltip="Google Cloud Storage armazena o vídeo raw antes do processamento de transcode"
          />

          <DiagramEdge from={{ x: 160, y: 82 }} to={{ x: 200, y: 82 }} color="red" opacity={d.getOpacity(0)} />
          <DiagramEdge from={{ x: 330, y: 82 }} to={{ x: 370, y: 82 }} color="orange" opacity={d.getOpacity(0)} />

          <DiagramNode
            x={40} y={155} label="Queue" sublabel="Job dispatcher" icon="📨"
            color={COLORS.amber} width={110} height={55}
            opacity={d.getOpacity(1)} active={d.isActive('queue')}
            tooltip="Dispatcha jobs de transcode para o cluster de processamento de vídeo"
          />
          <DiagramNode
            x={180} y={155} label="Transcode" sublabel="FFmpeg cluster" icon="🔄"
            color={COLORS.purple} width={130} height={55}
            opacity={d.getOpacity(1)} active={d.isActive('transcode')}
            tooltip="Cluster com GPUs converte o vídeo em múltiplas resoluções e codecs (VP9, H.264, AV1)"
          />
          <DiagramNode
            x={350} y={155} label="Thumbnails" sublabel="Auto-generated" icon="🖼️"
            color={COLORS.pink} width={130} height={55}
            opacity={d.getOpacity(1)} active={d.isActive('thumbnails')}
            tooltip="Gera thumbnails automaticamente usando ML para selecionar os frames mais relevantes"
          />

          <DiagramEdge from={{ x: 440, y: 110 }} to={{ x: 100, y: 155 }} color="amber" label="Trigger" curved opacity={d.getOpacity(1)} />
          <DiagramEdge from={{ x: 150, y: 182 }} to={{ x: 180, y: 182 }} color="amber" opacity={d.getOpacity(1)} />
          <DiagramEdge from={{ x: 310, y: 182 }} to={{ x: 350, y: 182 }} color="purple" opacity={d.getOpacity(1)} />

          <DiagramBadge x={245} y={145} text="GPU FARM" type="load" opacity={d.getOpacity(1)} />
        </DiagramGroup>

        {/* Metadata & Search */}
        <DiagramGroup x={560} y={20} width={520} height={150} label="Metadados & Busca" color={COLORS.blue} opacity={d.getOpacity(2)}>
          <DiagramNode
            x={580} y={55} label="Metadata DB" sublabel="Vitess (MySQL)" icon="🗄️"
            color={COLORS.blue} width={140} height={55}
            opacity={d.getOpacity(2)} active={d.isActive('metadata-db')}
            tooltip="Vitess (MySQL sharded) armazena título, descrição, tags e estatísticas de cada vídeo"
          />
          <DiagramNode
            x={750} y={55} label="Search Index" sublabel="Invertido + ML" icon="🔍"
            color={COLORS.cyan} width={130} height={55}
            opacity={d.getOpacity(2)} active={d.isActive('search-idx')}
            tooltip="Índice invertido com ML que permite busca por texto, voz e conteúdo visual"
          />
          <DiagramNode
            x={910} y={55} label="Analytics" sublabel="View counts, CTR" icon="📊"
            color={COLORS.amber} width={130} height={55}
            opacity={d.getOpacity(2)} active={d.isActive('analytics-svc')}
            tooltip="Rastreia views, CTR, watch time e métricas de engajamento em tempo real"
          />

          <DiagramEdge from={{ x: 720, y: 82 }} to={{ x: 750, y: 82 }} color="blue" opacity={d.getOpacity(2)} />
          <DiagramEdge from={{ x: 880, y: 82 }} to={{ x: 910, y: 82 }} color="cyan" opacity={d.getOpacity(2)} />

          <DiagramBadge x={650} y={45} text="SHARDED" type="info" opacity={d.getOpacity(2)} />
        </DiagramGroup>

        {/* Recommendation Engine */}
        <DiagramGroup x={560} y={190} width={520} height={100} label="Recommendation Engine" color={COLORS.purple} opacity={d.getOpacity(3)}>
          <DiagramNode
            x={580} y={220} label="Candidate Gen" sublabel="Collaborative filtering" icon="🎯"
            color={COLORS.purple} width={150} height={55}
            opacity={d.getOpacity(3)} active={d.isActive('candidate')}
            tooltip="Filtragem colaborativa seleciona centenas de vídeos candidatos do catálogo de bilhões"
          />
          <DiagramNode
            x={760} y={220} label="Ranking Model" sublabel="Deep neural network" icon="🧠"
            color={COLORS.pink} width={150} height={55}
            opacity={d.getOpacity(3)} active={d.isActive('ranking')}
            tooltip="Deep neural network ranqueia candidatos por probabilidade de engajamento do usuário"
          />
          <DiagramNode
            x={940} y={220} label="Feed" sublabel="Personalized" icon="📱"
            color={COLORS.orange} width={100} height={55}
            opacity={d.getOpacity(3)} active={d.isActive('feed')}
            tooltip="Lista final personalizada de vídeos exibida na home e sidebar do usuário"
          />

          <DiagramEdge from={{ x: 730, y: 247 }} to={{ x: 760, y: 247 }} color="purple" opacity={d.getOpacity(3)} />
          <DiagramEdge from={{ x: 910, y: 247 }} to={{ x: 940, y: 247 }} color="pink" opacity={d.getOpacity(3)} />
        </DiagramGroup>

        {/* CDN & Serving */}
        <DiagramGroup x={20} y={320} width={1060} height={120} label="Serving Path (Playback)" color={COLORS.green} opacity={d.getOpacity(4)}>
          <DiagramNode
            x={40} y={355} label="Viewer" sublabel="Bilhões/dia" icon="👁️"
            color={COLORS.blue} width={110} height={55}
            opacity={d.getOpacity(4)} active={d.isActive('viewer')}
            tooltip="Bilhões de visualizações diárias vindas de browsers, apps mobile e smart TVs"
          />
          <DiagramNode
            x={190} y={355} label="CDN Edge" sublabel="Cache global" icon="🌐"
            color={COLORS.green} width={120} height={55}
            opacity={d.getOpacity(4)} active={d.isActive('cdn-edge')}
            tooltip="Servidores de cache distribuídos globalmente — 95% de cache hit para vídeos populares"
          />
          <DiagramNode
            x={350} y={355} label="Origin" sublabel="Fallback fetch" icon="🏠"
            color={COLORS.amber} width={110} height={55}
            opacity={d.getOpacity(4)} active={d.isActive('origin')}
            tooltip="Busca o vídeo no storage quando não está em cache (cold start ou conteúdo raro)"
          />
          <DiagramNode
            x={500} y={355} label="ABR Streaming" sublabel="DASH / HLS" icon="📺"
            color={COLORS.cyan} width={140} height={55}
            opacity={d.getOpacity(4)} active={d.isActive('abr')}
            tooltip="Adaptive Bitrate: alterna qualidade automaticamente conforme a banda disponível do usuário"
          />
          <DiagramNode
            x={680} y={355} label="DRM" sublabel="Widevine / FairPlay" icon="🔒"
            color={COLORS.red} width={130} height={55}
            opacity={d.getOpacity(5)} active={d.isActive('drm')}
            tooltip="Digital Rights Management protege conteúdo licenciado contra cópia não autorizada"
          />
          <DiagramNode
            x={850} y={355} label="Ad Server" sublabel="Real-time bidding" icon="💰"
            color={COLORS.amber} width={130} height={55}
            opacity={d.getOpacity(5)} active={d.isActive('ad-server')}
            tooltip="Real-time bidding insere anúncios personalizados durante a reprodução do vídeo"
          />

          <DiagramEdge from={{ x: 150, y: 382 }} to={{ x: 190, y: 382 }} color="blue" opacity={d.getOpacity(4)} />
          <DiagramEdge from={{ x: 310, y: 382 }} to={{ x: 350, y: 382 }} color="green" label="Cache miss" opacity={d.getOpacity(4)} />
          <DiagramEdge from={{ x: 460, y: 382 }} to={{ x: 500, y: 382 }} color="amber" opacity={d.getOpacity(4)} />
          <DiagramEdge from={{ x: 640, y: 382 }} to={{ x: 680, y: 382 }} color="cyan" opacity={d.getOpacity(5)} />
          <DiagramEdge from={{ x: 810, y: 382 }} to={{ x: 850, y: 382 }} color="red" opacity={d.getOpacity(5)} />

          <DiagramBadge x={250} y={345} text="CACHE HIT 95%" type="fix" opacity={d.getOpacity(4)} />
        </DiagramGroup>

        {/* Infrastructure */}
        <DiagramGroup x={20} y={470} width={1060} height={120} label="Infraestrutura" color={COLORS.textMuted} opacity={d.getOpacity(6)}>
          <DiagramNode
            x={40} y={500} label="Borg" sublabel="Orquestrador" icon="☸️"
            color={COLORS.cyan} width={120} height={55}
            opacity={d.getOpacity(6)} active={d.isActive('borg')}
            tooltip="Orquestrador de containers do Google — predecessor e inspiração do Kubernetes"
          />
          <DiagramNode
            x={200} y={500} label="Colossus" sublabel="Distributed FS" icon="💾"
            color={COLORS.purple} width={130} height={55}
            opacity={d.getOpacity(6)} active={d.isActive('colossus')}
            tooltip="Sistema de arquivos distribuído do Google — sucessor do GFS, base de todo storage"
          />
          <DiagramNode
            x={370} y={500} label="Spanner" sublabel="Global DB" icon="🌍"
            color={COLORS.blue} width={120} height={55}
            opacity={d.getOpacity(6)} active={d.isActive('spanner')}
            tooltip="Banco de dados globalmente distribuído com consistência forte e disponibilidade 99.999%"
          />
          <DiagramNode
            x={530} y={500} label="Bigtable" sublabel="Time-series" icon="📈"
            color={COLORS.green} width={120} height={55}
            opacity={d.getOpacity(6)} active={d.isActive('bigtable')}
            tooltip="Banco NoSQL de alta performance para dados time-series, analytics e contadores"
          />
          <DiagramNode
            x={690} y={500} label="Pub/Sub" sublabel="Event streaming" icon="📡"
            color={COLORS.orange} width={130} height={55}
            opacity={d.getOpacity(6)} active={d.isActive('pubsub')}
            tooltip="Sistema de event streaming para comunicação assíncrona entre milhares de serviços"
          />
          <DiagramNode
            x={860} y={500} label="TPU Pods" sublabel="ML training" icon="🧠"
            color={COLORS.pink} width={120} height={55}
            opacity={d.getOpacity(6)} active={d.isActive('tpu')}
            tooltip="Processadores especializados para treinar e servir modelos de ML em larga escala"
          />
        </DiagramGroup>

        {/* Cross-connections */}
        <DiagramEdge from={{ x: 310, y: 210 }} to={{ x: 650, y: 55 }} color="blue" dashed label="Write metadata" opacity={d.getOpacity(2)} />
        <DiagramEdge from={{ x: 990, y: 275 }} to={{ x: 990, y: 320 }} color="orange" label="Serve" opacity={d.getOpacity(7)} />
      </DiagramCanvas>
    </AlgorithmShell>
  );
}
