import { DiagramCanvas, DiagramNode, DiagramEdge, DiagramBadge, DiagramGroup, DiagramShell, COLORS } from '../index';
import { useInteractiveDiagram, type DiagramStepDef } from '../useInteractiveDiagram';

const STEPS: DiagramStepDef[] = [
  { description: '4 roles do OAuth 2.0: Resource Owner, Client, Authorization Server, Resource Server', activeElements: ['roles'] },
  { description: 'Authorization Code Flow: mais seguro para server-side apps — código trocado por token no backend', activeElements: ['auth-code'] },
  { description: 'User dá consentimento (scopes): openid, profile, email, etc. Princípio do menor privilégio', activeElements: ['consent'] },
  { description: 'Auth Server redireciona com authorization code via query string (vida curta: ~10 min)', activeElements: ['code-redirect'] },
  { description: 'Backend troca code por access token (server-to-server, com client_secret)', activeElements: ['token-exchange'] },
  { description: 'PKCE (Proof Key for Code Exchange): proteção extra para public clients (SPA, mobile)', activeElements: ['pkce'] },
  { description: 'JWT structure: Header (alg) . Payload (claims) . Signature — base64url encoded', activeElements: ['jwt-structure'] },
  { description: 'JWT claims: iss, sub, aud, exp, iat, nbf + custom claims. Validação sem consulta ao DB', activeElements: ['jwt-claims'] },
  { description: 'Refresh token rotation: access token curto (15min) + refresh token longo (7d) com rotação', activeElements: ['refresh'] },
  { description: 'OIDC (OpenID Connect): camada de identidade sobre OAuth 2.0 — ID Token com userinfo', activeElements: ['oidc'] },
];

export default function OAuthFlowDiagram() {
  const d = useInteractiveDiagram(STEPS);

  return (
    <DiagramShell
      title="OAuth 2.0 + OIDC"
      description="Fluxo completo de autenticação e autorização: Authorization Code, JWT, PKCE e OpenID Connect"
      totalSteps={d.totalSteps}
      currentStep={d.currentStep}
      stepDescription={d.stepDescription}
      onStep={d.handleStep}
      onReset={d.handleReset}
      isComplete={d.isComplete}
      showAll={d.showAll}
      onShowAll={d.handleShowAll}
      color="#f97316"
    >
      <DiagramCanvas width={1100} height={650}>
        {/* 4 Roles */}
        <DiagramGroup x={20} y={20} width={500} height={90} label="OAuth 2.0 Roles" color={COLORS.orange} opacity={d.getOpacity(0)}>
          <DiagramNode x={40} y={48} label="Resource Owner" sublabel="User" color={COLORS.textMuted} width={100} height={40}
            opacity={d.getOpacity(0)} active={d.isActive('roles')}
            tooltip="Resource Owner: o usuário que possui os dados. Dá consentimento para o Client acessar seus recursos" />
          <DiagramNode x={155} y={48} label="Client" sublabel="App" color={COLORS.blue} width={80} height={40}
            opacity={d.getOpacity(0)} active={d.isActive('roles')}
            tooltip="Client: a aplicação que quer acessar os recursos. Confidential (backend) ou Public (SPA/mobile)" />
          <DiagramNode x={250} y={48} label="Auth Server" sublabel="IdP" color={COLORS.orange} width={100} height={40}
            opacity={d.getOpacity(0)} active={d.isActive('roles')}
            tooltip="Authorization Server: emite tokens. Ex: Keycloak, Auth0, Okta, Google Identity. Gerencia consent e sessions" />
          <DiagramNode x={365} y={48} label="Resource Server" sublabel="API" color={COLORS.green} width={120} height={40}
            opacity={d.getOpacity(0)} active={d.isActive('roles')}
            tooltip="Resource Server: API que protege os recursos. Valida access token em cada request. Ex: sua API REST" />
        </DiagramGroup>

        {/* Authorization Code Flow */}
        <DiagramGroup x={20} y={140} width={700} height={330} label="Authorization Code Flow" color={COLORS.orange} opacity={d.getOpacity(1)}>
          {/* Step 1: User clicks login */}
          <DiagramNode
            x={40} y={180} label="User" sublabel="Clicks Login" icon="👤"
            color={COLORS.textMuted} width={100} height={55}
            opacity={d.getOpacity(1)} active={d.isActive('auth-code')}
            tooltip="Usuário clica em 'Login com Google/GitHub'. App redireciona para Authorization Server com: client_id, redirect_uri, scope, state"
          />

          {/* Step 2: Auth Server */}
          <DiagramNode
            x={280} y={180} label="Auth Server" sublabel="Login + Consent" icon="🔐"
            color={COLORS.orange} width={140} height={55}
            opacity={d.getOpacity(1)} active={d.isActive('auth-code')}
            tooltip="Auth Server mostra tela de login → verifica credenciais → mostra consent screen com scopes solicitados"
          />
          <DiagramEdge from={{ x: 140, y: 207 }} to={{ x: 280, y: 207 }} color="orange" label="1. redirect /authorize" opacity={d.getOpacity(1)} />

          {/* Consent */}
          <DiagramGroup x={460} y={170} width={240} height={80} label="Scopes (Consent)" color={COLORS.amber} opacity={d.getOpacity(2)}>
            <text x={480} y={202} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
              <tspan x={480} dy={0} opacity={d.getOpacity(2)}>openid   → ID token</tspan>
              <tspan x={480} dy={14} opacity={d.getOpacity(2)}>profile  → nome, foto</tspan>
              <tspan x={480} dy={14} opacity={d.getOpacity(2)}>email    → email verificado</tspan>
            </text>
          </DiagramGroup>

          {/* Step 3: Code redirect */}
          <DiagramNode
            x={40} y={290} label="Client Backend" sublabel="Receives Code" icon="🖥️"
            color={COLORS.blue} width={140} height={55}
            opacity={d.getOpacity(3)} active={d.isActive('code-redirect')}
            tooltip="Auth Server redireciona para redirect_uri com ?code=xyz&state=abc. Code é single-use e expira em ~10 min"
          />
          <DiagramEdge from={{ x: 350, y: 235 }} to={{ x: 110, y: 290 }} color="orange" label="2. redirect ?code=xyz" opacity={d.getOpacity(3)} />
          <DiagramBadge x={110} y={282} text="~10 MIN TTL" type="latency" opacity={d.getOpacity(3)} />

          {/* Step 4: Token exchange */}
          <DiagramNode
            x={280} y={290} label="Token Endpoint" sublabel="POST /token" icon="🔑"
            color={COLORS.red} width={140} height={55}
            opacity={d.getOpacity(4)} active={d.isActive('token-exchange')}
            tooltip="Backend troca code por tokens: POST /token {code, client_id, client_secret, redirect_uri}. Server-to-server, secret nunca exposto ao browser"
          />
          <DiagramEdge from={{ x: 180, y: 317 }} to={{ x: 280, y: 317 }} color="red" label="3. code + client_secret" opacity={d.getOpacity(4)} />

          {/* Tokens */}
          <DiagramNode
            x={480} y={290} label="Tokens" sublabel="access + refresh" icon="🎫"
            color={COLORS.green} width={130} height={55}
            opacity={d.getOpacity(4)} active={d.isActive('token-exchange')}
            tooltip="Resposta: {access_token (JWT, 15min), refresh_token (opaque, 7d), token_type: Bearer, expires_in: 900, id_token (OIDC)}"
          />
          <DiagramEdge from={{ x: 420, y: 317 }} to={{ x: 480, y: 317 }} color="green" label="4. tokens" opacity={d.getOpacity(4)} />

          {/* API Call */}
          <DiagramNode
            x={40} y={395} label="API Request" sublabel="Authorization: Bearer" icon="📡"
            color={COLORS.cyan} width={140} height={55}
            opacity={d.getOpacity(4)} active={d.isActive('token-exchange')}
            tooltip="Client usa access_token no header: Authorization: Bearer eyJhbG... API valida token (verify signature + exp + aud)"
          />
          <DiagramEdge from={{ x: 545, y: 345 }} to={{ x: 110, y: 395 }} color="cyan" label="5. use token" dashed opacity={d.getOpacity(4)} />
        </DiagramGroup>

        {/* PKCE */}
        <DiagramGroup x={740} y={20} width={330} height={130} label="PKCE (Public Clients)" color={COLORS.purple} opacity={d.getOpacity(5)}>
          <text x={760} y={55} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={760} dy={0} opacity={d.getOpacity(5)}>1. Gera code_verifier (random 43-128 chars)</tspan>
            <tspan x={760} dy={16} opacity={d.getOpacity(5)}>2. code_challenge = SHA256(verifier)</tspan>
            <tspan x={760} dy={16} opacity={d.getOpacity(5)}>3. Envia challenge no /authorize</tspan>
            <tspan x={760} dy={16} opacity={d.getOpacity(5)}>4. Envia verifier no /token</tspan>
            <tspan x={760} dy={16} opacity={d.getOpacity(5)}>5. Server valida: SHA256(verifier)==challenge</tspan>
          </text>
          <DiagramBadge x={905} y={15} text="SPA + MOBILE" type="tradeoff" opacity={d.getOpacity(5)} />
        </DiagramGroup>

        {/* JWT Structure */}
        <DiagramGroup x={740} y={170} width={330} height={100} label="JWT Structure" color={COLORS.blue} opacity={d.getOpacity(6)}>
          <text x={760} y={203} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={760} dy={0} fill={COLORS.red} opacity={d.getOpacity(6)}>Header: {'{"alg":"RS256","typ":"JWT"}'}</tspan>
            <tspan x={760} dy={16} fill={COLORS.purple} opacity={d.getOpacity(6)}>Payload: {'{"sub":"123","exp":...}'}</tspan>
            <tspan x={760} dy={16} fill={COLORS.cyan} opacity={d.getOpacity(6)}>Signature: RSASHA256(header.payload, key)</tspan>
          </text>
        </DiagramGroup>
        <DiagramBadge x={905} y={165} text="BASE64URL" type="info" opacity={d.getOpacity(6)} />

        {/* JWT Claims */}
        <DiagramGroup x={740} y={290} width={330} height={110} label="JWT Standard Claims" color={COLORS.purple} opacity={d.getOpacity(7)}>
          <text x={760} y={322} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={760} dy={0} opacity={d.getOpacity(7)}>iss: emissor   | sub: subject (userId)</tspan>
            <tspan x={760} dy={14} opacity={d.getOpacity(7)}>aud: audience  | exp: expiração</tspan>
            <tspan x={760} dy={14} opacity={d.getOpacity(7)}>iat: issued at | nbf: not before</tspan>
            <tspan x={760} dy={14} opacity={d.getOpacity(7)}>jti: unique ID | + custom claims</tspan>
          </text>
        </DiagramGroup>

        {/* Refresh Token Rotation */}
        <DiagramGroup x={740} y={420} width={330} height={100} label="Refresh Token Rotation" color={COLORS.red} opacity={d.getOpacity(8)}>
          <text x={760} y={452} fill={COLORS.text} fontSize={10} fontFamily="JetBrains Mono, monospace">
            <tspan x={760} dy={0} opacity={d.getOpacity(8)}>Access Token:  ~15 min (curto, JWT)</tspan>
            <tspan x={760} dy={14} opacity={d.getOpacity(8)}>Refresh Token: ~7 dias (longo, opaque)</tspan>
            <tspan x={760} dy={14} opacity={d.getOpacity(8)}>Rotation: cada uso gera novo refresh</tspan>
            <tspan x={760} dy={14} opacity={d.getOpacity(8)}>Reuse detection → revoga família inteira</tspan>
          </text>
        </DiagramGroup>
        <DiagramBadge x={905} y={415} text="ROTATION" type="fix" opacity={d.getOpacity(8)} />

        {/* OIDC */}
        <DiagramGroup x={20} y={500} width={700} height={120} label="OpenID Connect (OIDC) — Identity Layer" color={COLORS.cyan} opacity={d.getOpacity(9)}>
          <DiagramNode
            x={40} y={538} label="ID Token" sublabel="JWT com userinfo" icon="🪪"
            color={COLORS.cyan} width={130} height={48}
            opacity={d.getOpacity(9)} active={d.isActive('oidc')}
            tooltip="ID Token: JWT com claims de identidade. sub (user ID), name, email, picture. Emitido junto com access_token. Validação: iss, aud, exp, nonce"
          />
          <DiagramNode
            x={190} y={538} label="UserInfo Endpoint" sublabel="GET /userinfo" icon="👤"
            color={COLORS.green} width={140} height={48}
            opacity={d.getOpacity(9)} active={d.isActive('oidc')}
            tooltip="Endpoint opcional para claims adicionais. Resposta: {sub, name, email, email_verified, picture}. Útil quando ID Token não tem tudo"
          />
          <DiagramNode
            x={350} y={538} label="Discovery" sublabel="/.well-known/openid" icon="🔍"
            color={COLORS.purple} width={150} height={48}
            opacity={d.getOpacity(9)} active={d.isActive('oidc')}
            tooltip="Discovery document: JSON com authorization_endpoint, token_endpoint, jwks_uri, scopes_supported. Auto-configuração do client"
          />
          <DiagramNode
            x={520} y={538} label="JWKS" sublabel="Public Keys" icon="🔑"
            color={COLORS.amber} width={110} height={48}
            opacity={d.getOpacity(9)} active={d.isActive('oidc')}
            tooltip="JSON Web Key Set: endpoint com public keys para validação de assinatura JWT. Key rotation automática. Cache com max-age"
          />
        </DiagramGroup>
      </DiagramCanvas>
    </DiagramShell>
  );
}
