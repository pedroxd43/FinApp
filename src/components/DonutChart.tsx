import React from 'react';
import { View, Text, StyleSheet } from '../primitives';
import { useTheme } from '../lib/theme';

interface DonutChartProps {
  data: { label: string; color: string; total: number }[];
  size?: number;
}

export function DonutChart({ data, size = 160 }: DonutChartProps) {
  const { colors } = useTheme();
  const total = data.reduce((sum, d) => sum + d.total, 0);
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let offset = 0;
  const segments = data.map((d, i) => {
    const pct = total > 0 ? d.total / total : 0;
    const dash = pct * circumference;
    const seg = (
      <circle key={i} cx={center} cy={center} r={radius} fill="none" stroke={d.color} strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${circumference - dash}`} strokeDashoffset={-offset}
        transform={`rotate(-90 ${center} ${center})`} />
    );
    offset += dash;
    return seg;
  });

  return (
    <View style={styles.container}>
      <View style={styles.chartWrap}>
        <svg width={size} height={size}>
          <circle cx={center} cy={center} r={radius} fill="none" stroke={colors.border} strokeWidth={strokeWidth} />
          {total > 0 && segments}
        </svg>
        <View style={styles.centerLabel}>
          <Text style={[styles.centerAmount, { color: colors.textPrimary }]}>
            {total > 0 ? `$${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(total)}` : '$0'}
          </Text>
          <Text style={[styles.centerText, { color: colors.textTertiary }]}>Total</Text>
        </View>
      </View>
      <View style={styles.legend}>
        {data.map((d, i) => (
          <View key={i} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: d.color }]} />
            <Text style={[styles.legendLabel, { color: colors.textSecondary }]} numberOfLines={1}>{d.label}</Text>
            <Text style={[styles.legendPct, { color: colors.textPrimary }]}>{total > 0 ? `${Math.round((d.total / total) * 100)}%` : '0%'}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingTop: 8, paddingBottom: 8 },
  chartWrap: { position: 'relative', alignItems: 'center', justifyContent: 'center', display: 'flex' },
  centerLabel: { position: 'absolute', alignItems: 'center', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center' },
  centerAmount: { fontSize: 18, fontFamily: 'Poppins-Bold' },
  centerText: { fontSize: 12, fontFamily: 'Poppins-Regular' },
  legend: { marginTop: 16, width: '100%', gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', paddingTop: 4, paddingBottom: 4 },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8, flexShrink: 0 },
  legendLabel: { flex: 1, fontSize: 13, fontFamily: 'Poppins-Regular' },
  legendPct: { fontSize: 13, fontFamily: 'Poppins-SemiBold' },
});
