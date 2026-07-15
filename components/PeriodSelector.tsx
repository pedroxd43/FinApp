import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/lib/theme';
import { PeriodType } from '@/lib/types';

interface PeriodSelectorProps {
  period: PeriodType;
  onPeriodChange: (p: PeriodType) => void;
  label: string;
  onPrev: () => void;
  onNext: () => void;
  disableNext?: boolean;
}

export function PeriodSelector({
  period,
  onPeriodChange,
  label,
  onPrev,
  onNext,
  disableNext,
}: PeriodSelectorProps) {
  const { colors } = useTheme();
  const periods: { key: PeriodType; label: string }[] = [
    { key: 'week', label: 'Semana' },
    { key: 'month', label: 'Mes' },
    { key: 'year', label: 'Año' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
      <View style={styles.tabs}>
        {periods.map((p) => (
          <TouchableOpacity
            key={p.key}
            style={[styles.tab, period === p.key && { backgroundColor: colors.primary }]}
            onPress={() => onPeriodChange(p.key)}
          >
            <Text style={[styles.tabText, { color: colors.textSecondary }, period === p.key && { color: '#fff', fontFamily: 'Poppins-SemiBold' }]}>
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.navRow}>
        <TouchableOpacity onPress={onPrev} style={styles.navBtn}>
          <ChevronLeft size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={[styles.navLabel, { color: colors.textPrimary }]}>{label}</Text>
        <TouchableOpacity onPress={onNext} disabled={disableNext} style={styles.navBtn}>
          <ChevronRight size={20} color={disableNext ? colors.border : colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    padding: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 3,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navBtn: {
    padding: 4,
  },
  navLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    textTransform: 'capitalize',
  },
});
