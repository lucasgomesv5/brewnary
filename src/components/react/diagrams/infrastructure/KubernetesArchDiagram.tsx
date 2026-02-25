import { DiagramCanvas, DiagramNode, DiagramEdge, DiagramBadge, DiagramGroup, DiagramShell, COLORS } from '../index';
import { useInteractiveDiagram, type DiagramStepDef } from '../useInteractiveDiagram';

const STEPS: DiagramStepDef[] = [
  { description: 'Control Plane: cérebro do cluster — gerencia estado desejado vs estado atual', activeElements: ['control-plane'] },
  { description: 'API Server: único ponto de entrada. Toda comunicação passa por ele (REST + gRPC)', activeElements: ['api-server'] },
  { description: 'etcd: key-value store distribuído com consenso Raft — source of truth do cluster', activeElements: ['etcd'] },
  { description: 'Scheduler: decide em qual node rodar pods baseado em resources, affinity, taints', activeElements: ['scheduler'] },
  { description: 'Controller Manager: reconciliation loops — ReplicaSet, Deployment, Job controllers', activeElements: ['controller'] },
  { description: 'Worker Node: kubelet é o agente que gerencia pods e reporta status ao API Server', activeElements: ['kubelet'] },
  { description: 'kube-proxy: regras de rede (iptables/IPVS) para Service → Pod routing', activeElements: ['kube-proxy'] },
  { description: 'Container Runtime (containerd): executa containers via OCI spec. CRI interface', activeElements: ['runtime'] },
  { description: 'Pod lifecycle: Pending → Running → Succeeded/Failed. Probes: liveness, readiness, startup', activeElements: ['pod'] },
  { description: 'Services (ClusterIP/NodePort/LB) + Ingress controller para routing HTTP externo', activeElements: ['services'] },
];

export default function KubernetesArchDiagram() {
  const d = useInteractiveDiagram(STEPS);

  return (
    <DiagramShell
      title="Kubernetes Architecture"
      description="Arquitetura interna do Kubernetes: Control Plane, Worker Nodes, networking e pod lifecycle"
      totalSteps={d.totalSteps}
      currentStep={d.currentStep}
      stepDescription={d.stepDescription}
      onStep={d.handleStep}
      onReset={d.handleReset}
      isComplete={d.isComplete}
      showAll={d.showAll}
      onShowAll={d.handleShowAll}
      color="#3b82f6"
    >
      <DiagramCanvas width={1100} height={650}>
        {/* Control Plane */}
        <DiagramGroup x={20} y={20} width={530} height={280} label="Control Plane (Master)" color={COLORS.blue} opacity={d.getOpacity(0)}>
          {/* API Server */}
          <DiagramNode
            x={40} y={70} label="API Server" sublabel="kube-apiserver" icon="🌐"
            color={COLORS.blue} width={140} height={60}
            opacity={d.getOpacity(1)} active={d.isActive('api-server')}
            tooltip="Único ponto de entrada do cluster. REST API + admission controllers + webhook. Autenticação via x509, token, OIDC. Audit logging"
          />
          <DiagramBadge x={110} y={60} text="SINGLE ENTRY" type="info" opacity={d.getOpacity(1)} />

          {/* etcd */}
          <DiagramNode
            x={40} y={190} label="etcd" sublabel="Raft Consensus" icon="🗄️"
            color={COLORS.amber} width={140} height={60}
            opacity={d.getOpacity(2)} active={d.isActive('etcd')}
            tooltip="Key-value distribuído. Consenso Raft para HA. Armazena todo o estado do cluster. Backup regular essencial. Latência típica: 5-50ms (depende de rede e disco). Quorum: 2f+1 nós"
          />
          <DiagramEdge from={{ x: 110, y: 130 }} to={{ x: 110, y: 190 }} color="amber" label="watch/store" opacity={d.getOpacity(2)} />
          <DiagramBadge x={110} y={180} text="SOURCE OF TRUTH" type="warn" opacity={d.getOpacity(2)} />

          {/* Scheduler */}
          <DiagramNode
            x={230} y={70} label="Scheduler" sublabel="kube-scheduler" icon="📋"
            color={COLORS.green} width={140} height={60}
            opacity={d.getOpacity(3)} active={d.isActive('scheduler')}
            tooltip="Algoritmo de scheduling: filtering (resource fit, taints) → scoring (spread, affinity). Latência varia: ~5-100ms dependendo do tamanho do cluster. Custom schedulers possíveis"
          />
          <DiagramEdge from={{ x: 180, y: 100 }} to={{ x: 230, y: 100 }} color="green" opacity={d.getOpacity(3)} />

          {/* Controller Manager */}
          <DiagramNode
            x={230} y={190} label="Controller Mgr" sublabel="Reconciliation" icon="🔄"
            color={COLORS.purple} width={140} height={60}
            opacity={d.getOpacity(4)} active={d.isActive('controller')}
            tooltip="Loops de reconciliação: desired state → observe → diff → act. Controllers: ReplicaSet, Deployment, StatefulSet, Job, CronJob, DaemonSet"
          />
          <DiagramEdge from={{ x: 300, y: 130 }} to={{ x: 300, y: 190 }} color="purple" opacity={d.getOpacity(4)} />

          {/* CCM */}
          <DiagramNode
            x={420} y={130} label="CCM" sublabel="Cloud Controller" icon="☁️"
            color={COLORS.cyan} width={110} height={55}
            opacity={d.getOpacity(4)} active={d.isActive('controller')}
            tooltip="Cloud Controller Manager: integração com cloud provider (AWS/GCP/Azure). Gerencia LoadBalancers, Volumes, Routes"
          />
        </DiagramGroup>

        {/* Worker Node 1 */}
        <DiagramGroup x={20} y={340} width={520} height={280} label="Worker Node 1" color={COLORS.green} opacity={d.getOpacity(5)}>
          {/* kubelet */}
          <DiagramNode
            x={40} y={385} label="kubelet" sublabel="Node Agent" icon="🤖"
            color={COLORS.green} width={120} height={55}
            opacity={d.getOpacity(5)} active={d.isActive('kubelet')}
            tooltip="Agente em cada node. Recebe PodSpec do API Server. Gerencia lifecycle dos containers. Reporta status (conditions, resources)"
          />
          <DiagramEdge from={{ x: 110, y: 300 }} to={{ x: 100, y: 385 }} color="green" label="PodSpec" opacity={d.getOpacity(5)} />

          {/* kube-proxy */}
          <DiagramNode
            x={190} y={385} label="kube-proxy" sublabel="iptables/IPVS" icon="🔀"
            color={COLORS.orange} width={120} height={55}
            opacity={d.getOpacity(6)} active={d.isActive('kube-proxy')}
            tooltip="Implementa Service abstraction. iptables mode: regras por Service. IPVS mode: mais eficiente para >1000 Services. Round-robin default"
          />

          {/* Container Runtime */}
          <DiagramNode
            x={340} y={385} label="containerd" sublabel="Container Runtime" icon="📦"
            color={COLORS.cyan} width={120} height={55}
            opacity={d.getOpacity(7)} active={d.isActive('runtime')}
            tooltip="OCI-compliant runtime. CRI (Container Runtime Interface). Image pull, container create/start/stop. cgroups + namespaces para isolamento"
          />
          <DiagramEdge from={{ x: 160, y: 412 }} to={{ x: 190, y: 412 }} color="orange" opacity={d.getOpacity(6)} />
          <DiagramEdge from={{ x: 310, y: 412 }} to={{ x: 340, y: 412 }} color="cyan" opacity={d.getOpacity(7)} />

          {/* Pods */}
          <DiagramGroup x={40} y={470} width={480} height={130} label="Pods" color={COLORS.purple} opacity={d.getOpacity(8)}>
            <DiagramNode
              x={60} y={502} label="Pod A" sublabel="Running" icon="🟢"
              color={COLORS.green} width={95} height={48}
              opacity={d.getOpacity(8)} active={d.isActive('pod')}
              tooltip="Pod = unidade mínima. 1+ containers compartilhando network namespace e volumes. IP único por pod"
            />
            <DiagramNode
              x={175} y={502} label="Pod B" sublabel="Running" icon="🟢"
              color={COLORS.green} width={95} height={48}
              opacity={d.getOpacity(8)} active={d.isActive('pod')}
              tooltip="Probes: liveness (restart if fails), readiness (remove from service), startup (grace period para cold start)"
            />
            <DiagramNode
              x={290} y={502} label="Pod C" sublabel="Pending" icon="🟡"
              color={COLORS.amber} width={95} height={48}
              opacity={d.getOpacity(8)} active={d.isActive('pod')}
              tooltip="Pending: aguardando scheduling. Razões: insufficient resources, node affinity, taints. Describe pod para diagnosticar"
            />
            <DiagramNode
              x={405} y={502} label="Init Container" sublabel="Complete" icon="⚙️"
              color={COLORS.textMuted} width={95} height={48}
              opacity={d.getOpacity(8)} active={d.isActive('pod')}
              tooltip="Init containers rodam antes do app container. Uso: migrations, config setup, wait-for-dependency. Rodam sequencialmente"
            />
          </DiagramGroup>
          <DiagramEdge from={{ x: 400, y: 440 }} to={{ x: 280, y: 470 }} color="cyan" label="create" opacity={d.getOpacity(8)} />
        </DiagramGroup>

        {/* Services + Ingress */}
        <DiagramGroup x={590} y={20} width={480} height={600} label="Networking" color={COLORS.orange} opacity={d.getOpacity(9)}>
          <DiagramNode
            x={610} y={70} label="Ingress" sublabel="NGINX / Traefik" icon="🌐"
            color={COLORS.orange} width={140} height={60}
            opacity={d.getOpacity(9)} active={d.isActive('services')}
            tooltip="L7 routing: host-based, path-based. TLS termination. Rate limiting. Annotations para customização. IngressClass para multi-controller"
          />

          <DiagramNode
            x={800} y={70} label="LoadBalancer" sublabel="Cloud LB" icon="⚖️"
            color={COLORS.cyan} width={130} height={60}
            opacity={d.getOpacity(9)} active={d.isActive('services')}
            tooltip="Service type LoadBalancer: provisiona LB no cloud provider. External IP. TCP/UDP. Health checks automáticos"
          />

          <DiagramNode
            x={610} y={180} label="ClusterIP" sublabel="Internal Only" icon="🔒"
            color={COLORS.blue} width={130} height={55}
            opacity={d.getOpacity(9)} active={d.isActive('services')}
            tooltip="Service padrão: IP virtual interno. Acessível apenas dentro do cluster. DNS: service-name.namespace.svc.cluster.local"
          />

          <DiagramNode
            x={790} y={180} label="NodePort" sublabel="30000-32767" icon="🔌"
            color={COLORS.green} width={130} height={55}
            opacity={d.getOpacity(9)} active={d.isActive('services')}
            tooltip="Expõe service em porta fixa de cada node. Range: 30000-32767. Acessível via nodeIP:nodePort. Base para LoadBalancer"
          />

          <DiagramEdge from={{ x: 680, y: 130 }} to={{ x: 680, y: 180 }} color="blue" opacity={d.getOpacity(9)} />
          <DiagramEdge from={{ x: 865, y: 130 }} to={{ x: 855, y: 180 }} color="green" opacity={d.getOpacity(9)} />

          {/* DNS */}
          <DiagramNode
            x={700} y={290} label="CoreDNS" sublabel="Service Discovery" icon="🔍"
            color={COLORS.purple} width={130} height={55}
            opacity={d.getOpacity(9)} active={d.isActive('services')}
            tooltip="DNS interno do cluster. Records automáticos para Services e Pods. Formato: svc.namespace.svc.cluster.local. Cache DNS"
          />

          {/* Network Policies */}
          <DiagramNode
            x={700} y={390} label="NetworkPolicy" sublabel="Firewall Rules" icon="🛡️"
            color={COLORS.red} width={140} height={55}
            opacity={d.getOpacity(9)} active={d.isActive('services')}
            tooltip="Regras de firewall L3/L4 por namespace/pod. Default deny recomendado. CNI plugin (Calico/Cilium) implementa as regras"
          />

          {/* HPA */}
          <DiagramNode
            x={700} y={480} label="HPA" sublabel="Auto Scaling" icon="📈"
            color={COLORS.amber} width={130} height={55}
            opacity={d.getOpacity(9)} active={d.isActive('services')}
            tooltip="Horizontal Pod Autoscaler: escala baseado em CPU/Memory/custom metrics. Min/Max replicas. Cooldown period: 5min. KEDA para event-driven"
          />
        </DiagramGroup>
      </DiagramCanvas>
    </DiagramShell>
  );
}
