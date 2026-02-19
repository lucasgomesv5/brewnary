import { COLORS } from './constants';

type ColorKey = keyof typeof COLORS;

interface Point {
  x: number;
  y: number;
}

interface Props {
  from: Point;
  to: Point;
  color?: ColorKey | string;
  label?: string;
  dashed?: boolean;
  arrow?: boolean;
  curved?: boolean;
  opacity?: number;
}

function isColorKey(c: string): c is ColorKey {
  return c in COLORS;
}

export default function DiagramEdge({
  from,
  to,
  color = 'textMuted',
  label,
  dashed = false,
  arrow = true,
  curved = false,
  opacity: groupOpacity = 1,
}: Props) {
  const strokeColor = isColorKey(color) ? COLORS[color] : color;
  const markerId = isColorKey(color) && color !== 'textMuted' ? `arrow-${color}` : 'arrow-default';

  let d: string;
  if (curved) {
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const offset = Math.min(Math.abs(dx), Math.abs(dy)) * 0.3 + 20;
    const cx = midX - (dy / Math.hypot(dx, dy)) * offset;
    const cy = midY + (dx / Math.hypot(dx, dy)) * offset;
    d = `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
  } else {
    d = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  }

  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  return (
    <g style={{ opacity: groupOpacity, transition: 'opacity 300ms ease' }}>
      <path
        d={d}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeDasharray={dashed ? '6 4' : undefined}
        markerEnd={arrow ? `url(#${markerId})` : undefined}
        opacity={0.7}
      />
      {label && (
        <text
          x={midX}
          y={midY - 6}
          textAnchor="middle"
          fill={COLORS.textMuted}
          fontSize={9}
          fontFamily="Inter, system-ui, sans-serif"
        >
          {label}
        </text>
      )}
    </g>
  );
}
