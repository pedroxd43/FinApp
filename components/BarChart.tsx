import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/theme';

interface BarChartProps {
  data: { label: string; income: number; expense: number }[];
  height?: number;
}

export function BarChart({ data, height = 160 }: BarChartProps) {
  const { colors } = useTheme();
  const maxVal = Math.max(...data.map((d) => Math.max(d.income, d.expense)), 1);

  return (
    <View style={styles.container}>
      <View style={[styles.chartRow, { height }]}>
        {data.map((d, i) => {
          const incomeH = (d.income / maxVal) * (height - 20);
          const expenseH = (d.expense / maxVal) * (height - 20);
          return (
            <View key={i} style={styles.barGroup}>
              <View style={styles.bars}>
                <View
                  style={[styles.bar, { height: Math.max(incomeH, 2), backgroundColor: colors.income }]}
                />
                <View
                  style={[styles.bar, { height: Math.max(expenseH, 2), backgroundColor: colors.expense }]}
                />
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.labelsRow}>
        {data.map((d, i) => (
          <Text key={i} style={[styles.label, { color: colors.textTertiary }]} numberOfLines={1}>
            {d.label}
          </Text>
        ))}
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.income }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Ingresos</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.expense }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Gastos</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  barGroup: {
    flex: 1,
    alignItems: 'center',
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  bar: {
    width: 10,
    borderRadius: 4,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
});
