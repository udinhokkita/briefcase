import React from 'react';
import { View } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import { colors } from '../theme/colors';
import { RadarScores } from '../data/mockData';

interface Props {
  scores: RadarScores;
  labels: string[]; // 6 labels in axis order
  size?: number;
  color?: string;
}

const ORDER: (keyof RadarScores)[] = [
  'mechanical',
  'consistency',
  'teamplay',
  'clutch',
  'gamesense',
  'adapt',
];

export const RadarChart: React.FC<Props> = ({ scores, labels, size = 260, color = colors.primary }) => {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2 - 38;
  const n = 6;

  const angleFor = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const point = (i: number, r: number) => {
    const a = angleFor(i);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];

  const dataPoints = ORDER.map((key, i) => {
    const v = scores[key] / 100;
    return point(i, maxR * v);
  });
  const dataStr = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={size}>
        {gridLevels.map((lvl, idx) => {
          const pts = ORDER.map((_, i) => point(i, maxR * lvl))
            .map((p) => `${p.x},${p.y}`)
            .join(' ');
          return <Polygon key={idx} points={pts} fill="none" stroke={colors.border} strokeWidth={1} />;
        })}
        {ORDER.map((_, i) => {
          const outer = point(i, maxR);
          return <Line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke={colors.border} strokeWidth={1} />;
        })}
        <Polygon points={dataStr} fill={color + '40'} stroke={color} strokeWidth={2} />
        {dataPoints.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={3.5} fill={color} />
        ))}
        {labels.map((label, i) => {
          const lp = point(i, maxR + 18);
          const anchor = Math.abs(lp.x - cx) < 4 ? 'middle' : lp.x > cx ? 'start' : 'end';
          return (
            <SvgText
              key={i}
              x={lp.x}
              y={lp.y + 4}
              fill={colors.textMuted}
              fontSize={10}
              fontWeight="600"
              textAnchor={anchor as 'start' | 'middle' | 'end'}
            >
              {label}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
};
