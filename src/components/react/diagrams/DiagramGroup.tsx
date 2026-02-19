import { COLORS } from './constants';

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  color?: string;
  children?: React.ReactNode;
  opacity?: number;
}

export default function DiagramGroup({ x, y, width, height, label, color = COLORS.border, children, opacity = 1 }: Props) {
  return (
    <g style={{ opacity, transition: 'opacity 300ms ease', pointerEvents: opacity > 0 ? 'auto' : 'none' }}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={12}
        fill="none"
        stroke={color}
        strokeWidth={1}
        strokeDasharray="8 4"
        opacity={0.5}
      />
      <rect x={x} y={y} width={width} height={height} rx={12} fill={color} opacity={0.04} />
      <text
        x={x + 12}
        y={y + 16}
        fill={color}
        fontSize={10}
        fontWeight={600}
        fontFamily="Inter, system-ui, sans-serif"
        opacity={0.8}
      >
        {label}
      </text>
      {children}
    </g>
  );
}
