import { useState, useMemo } from 'react';
import { COLORS } from './constants';
import { TooltipContext } from './DiagramTooltipContext';

interface Props {
  width?: number;
  height?: number;
  children: React.ReactNode;
  title?: string;
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if (current && (current + ' ' + word).length > maxChars) {
      lines.push(current);
      current = word;
    } else {
      current = current ? current + ' ' + word : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function TooltipOverlay({
  text,
  x,
  y,
  nodeHeight,
  viewBoxWidth,
}: {
  text: string;
  x: number;
  y: number;
  nodeHeight: number;
  viewBoxWidth: number;
}) {
  const lines = wrapText(text, 36);
  const lineHeight = 15;
  const px = 12;
  const py = 8;
  const charW = 5.8;
  const maxLineLen = Math.max(...lines.map((l) => l.length));
  const boxW = Math.min(maxLineLen * charW + px * 2, 260);
  const boxH = lines.length * lineHeight + py * 2;
  const arrowH = 6;
  const gap = 6;

  // Default: show above
  let showAbove = true;
  let boxY = y - boxH - arrowH - gap;
  if (boxY < 5) {
    showAbove = false;
    boxY = y + nodeHeight + gap + arrowH;
  }

  let boxX = x - boxW / 2;
  if (boxX < 5) boxX = 5;
  if (boxX + boxW > viewBoxWidth - 5) boxX = viewBoxWidth - boxW - 5;

  const arrowX = Math.max(boxX + 10, Math.min(x, boxX + boxW - 10));

  return (
    <g style={{ pointerEvents: 'none' }}>
      {/* Shadow */}
      <rect x={boxX + 2} y={boxY + 2} width={boxW} height={boxH} rx={6} fill="black" opacity={0.3} />
      {/* Background */}
      <rect x={boxX} y={boxY} width={boxW} height={boxH} rx={6} fill="#1e293b" stroke="#475569" strokeWidth={1} />
      {/* Arrow */}
      {showAbove ? (
        <>
          <polygon
            points={`${arrowX - 6},${boxY + boxH} ${arrowX + 6},${boxY + boxH} ${arrowX},${boxY + boxH + arrowH}`}
            fill="#1e293b"
          />
          <line
            x1={arrowX - 6}
            y1={boxY + boxH}
            x2={arrowX + 6}
            y2={boxY + boxH}
            stroke="#1e293b"
            strokeWidth={2}
          />
        </>
      ) : (
        <>
          <polygon
            points={`${arrowX - 6},${boxY} ${arrowX + 6},${boxY} ${arrowX},${boxY - arrowH}`}
            fill="#1e293b"
          />
          <line x1={arrowX - 6} y1={boxY} x2={arrowX + 6} y2={boxY} stroke="#1e293b" strokeWidth={2} />
        </>
      )}
      {/* Text */}
      <text fill="#e2e8f0" fontSize={11} fontFamily="Inter, system-ui, sans-serif">
        {lines.map((line, i) => (
          <tspan key={i} x={boxX + px} y={boxY + py + 12 + i * lineHeight}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

export default function DiagramCanvas({ width = 1000, height = 600, children, title }: Props) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number; nodeHeight: number } | null>(null);

  const tooltipActions = useMemo(
    () => ({
      show: (text: string, x: number, y: number, nodeHeight: number) => setTooltip({ text, x, y, nodeHeight }),
      hide: () => setTooltip(null),
    }),
    [],
  );

  return (
    <TooltipContext.Provider value={tooltipActions}>
      <div className="w-full overflow-x-auto rounded-xl border" style={{ borderColor: COLORS.border }}>
        {title && (
          <div
            className="px-4 py-2.5"
            style={{ borderBottom: `1px solid ${COLORS.border}`, backgroundColor: COLORS.bg }}
          >
            <span className="text-xs font-medium" style={{ color: COLORS.textMuted }}>
              {title}
            </span>
          </div>
        )}
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[700px]" style={{ backgroundColor: COLORS.bg }}>
          <defs>
            {/* Grid pattern */}
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke={COLORS.grid} strokeWidth="0.5" />
            </pattern>

            {/* Glow filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Arrow markers */}
            {(['orange', 'blue', 'green', 'red', 'amber', 'purple', 'cyan', 'pink'] as const).map((color) => (
              <marker
                key={color}
                id={`arrow-${color}`}
                viewBox="0 0 10 7"
                refX="10"
                refY="3.5"
                markerWidth="8"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill={COLORS[color]} />
              </marker>
            ))}
            <marker
              id="arrow-default"
              viewBox="0 0 10 7"
              refX="10"
              refY="3.5"
              markerWidth="8"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.textMuted} />
            </marker>
          </defs>

          {/* Background grid */}
          <rect width="100%" height="100%" fill="url(#grid)" />

          {children}

          {tooltip && <TooltipOverlay {...tooltip} viewBoxWidth={width} />}
        </svg>
      </div>
    </TooltipContext.Provider>
  );
}
