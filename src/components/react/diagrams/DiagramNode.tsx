import { COLORS, NODE_DEFAULTS } from './constants';
import { useTooltip } from './DiagramTooltipContext';

interface Props {
  x: number;
  y: number;
  label: string;
  sublabel?: string;
  icon?: string;
  color?: string;
  width?: number;
  height?: number;
  glow?: boolean;
  opacity?: number;
  active?: boolean;
  tooltip?: string;
}

export default function DiagramNode({
  x,
  y,
  label,
  sublabel,
  icon,
  color = COLORS.blue,
  width = NODE_DEFAULTS.width,
  height = NODE_DEFAULTS.height,
  glow = false,
  opacity = 1,
  active = false,
  tooltip,
}: Props) {
  const cx = x + width / 2;
  const textY = sublabel ? y + height / 2 - 4 : y + height / 2;
  const showGlow = glow || active;
  const tooltipCtx = useTooltip();
  const interactive = tooltip && opacity > 0;

  return (
    <g
      filter={showGlow ? 'url(#glow)' : undefined}
      style={{
        opacity,
        transition: 'opacity 300ms ease',
        pointerEvents: opacity > 0 ? 'auto' : 'none',
        cursor: interactive ? 'pointer' : undefined,
      }}
      onMouseEnter={() => {
        if (interactive && tooltipCtx) tooltipCtx.show(tooltip, cx, y, height);
      }}
      onMouseLeave={() => {
        if (tooltipCtx) tooltipCtx.hide();
      }}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={NODE_DEFAULTS.rx}
        fill={COLORS.bg}
        stroke={color}
        strokeWidth={active ? 2.5 : 1.5}
      />
      {/* Subtle fill */}
      <rect x={x} y={y} width={width} height={height} rx={NODE_DEFAULTS.rx} fill={color} opacity={0.08} />
      {icon && (
        <text
          x={cx}
          y={textY - (sublabel ? 2 : 4)}
          textAnchor="middle"
          dominantBaseline="auto"
          fontSize={NODE_DEFAULTS.iconSize}
        >
          {icon}
        </text>
      )}
      <text
        x={cx}
        y={icon ? textY + 12 : textY}
        textAnchor="middle"
        dominantBaseline="central"
        fill={COLORS.text}
        fontSize={NODE_DEFAULTS.fontSize}
        fontWeight={600}
        fontFamily="Inter, system-ui, sans-serif"
      >
        {label}
      </text>
      {sublabel && (
        <text
          x={cx}
          y={icon ? textY + 26 : textY + 14}
          textAnchor="middle"
          dominantBaseline="central"
          fill={COLORS.textMuted}
          fontSize={10}
          fontFamily="Inter, system-ui, sans-serif"
        >
          {sublabel}
        </text>
      )}
    </g>
  );
}
