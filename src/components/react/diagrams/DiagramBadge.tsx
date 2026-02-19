import { BADGE_COLORS } from './constants';

type BadgeType = keyof typeof BADGE_COLORS;

interface Props {
  x: number;
  y: number;
  text: string;
  type?: BadgeType;
  opacity?: number;
}

export default function DiagramBadge({ x, y, text, type = 'info', opacity = 1 }: Props) {
  const colors = BADGE_COLORS[type];
  const padding = 6;
  const charWidth = 6.5;
  const width = text.length * charWidth + padding * 2;
  const height = 18;

  return (
    <g style={{ opacity, transition: 'opacity 300ms ease' }}>
      <rect
        x={x - width / 2}
        y={y - height / 2}
        width={width}
        height={height}
        rx={4}
        fill={colors.bg}
        stroke={colors.border}
        strokeWidth={1}
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fill={colors.text}
        fontSize={9}
        fontWeight={700}
        fontFamily="'JetBrains Mono', monospace"
        letterSpacing="0.05em"
      >
        {text}
      </text>
    </g>
  );
}
