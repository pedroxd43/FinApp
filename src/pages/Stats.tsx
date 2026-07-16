import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from '../primitives';
import { ChartPie, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useData } from '../lib/storage';
import { useTheme } from '../lib/theme';
import { PeriodType } from '../lib/types';
import { formatCurrency, getWeekRange, getMonthRange, getYearRange, isDateInRange, getMonthName, getWeekdayLabel, getMonthLabel } from '../lib/format';
import { PeriodSelector } from '../components/PeriodSelector';
import { BarChart } from '../components/BarChart';
import { DonutChart } from '../components/DonutChart';

type BreakdownType = 'expense' | 'income';

export default function StatsScreen() {
  const { transactions, getCategory } = useData();
  const { colors } = useTheme();
  const [period, setPeriod] = useState<PeriodType>('month');
  const [offset, setOffset] = useState(0);
  const [breakdown, setBreakdown] = useState<BreakdownType>('expense');

  const refDate = useMemo(() => {
    const d = new Date();
    if (period === 'week') d.setDate(d.getDate() + offset * 7);
    else if (period === 'month') d.setMonth(d.getMonth() + offset);
    else d.setFullYear(d.getFullYear() + offset);
    return d;
  }, [period, offset]);

  const range = useMemo(() => {
    if (period === 'week') return getWeekRange(refDate);
    if (period === 'month') return getMonthRange(refDate);
    return getYearRange(refDate);
  }, [refDate, period]);

  const periodLabel = useMemo(() => {
    if (period === 'week') {
      return `${range.start.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })} - ${range.end.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}`;
    }
    if (period === 'month') return getMonthName(new Date(refDate));
    return String(refDate.getFullYear());
  }, [period, range, refDate]);

  const periodTransactions = useMemo(
    () => transactions.filter((t) => isDateInRange(t.date, range.start, range.end)),
    [transactions, range],
  );

  const totals = useMemo(() => {
    let income = 0, expense = 0;
    periodTransactions.forEach((t) => { t.type === 'income' ? (income += t.amount) : (expense += t.amount); });
    return { income, expense, balance: income - expense };
  }, [periodTransactions]);

  const byDayData = useMemo(() => {
    if (period === 'week') {
      const days: { label: string; income: number; expense: number }[] = [];
      for (let i = 0; i < 7; i++) {
        const day = new Date(range.start);
        day.setDate(day.getDate() + i);
        const dayTx = periodTransactions.filter((t) => {
          const td = new Date(t.date);
          return td.getFullYear() === day.getFullYear() && td.getMonth() === day.getMonth() && td.getDate() === day.getDate();
        });
        let income = 0, expense = 0;
        dayTx.forEach((t) => (t.type === 'income' ? (income += t.amount) : (expense += t.amount)));
        days.push({ label: getWeekdayLabel(day), income, expense });
      }
      return days;
    }
    if (period === 'month') {
      const days: { label: string; income: number; expense: number }[] = [];
      const daysInMonth = new Date(refDate.getFullYear(), refDate.getMonth() + 1, 0).getDate();
      const bucketSize = Math.ceil(daysInMonth / 6);
      for (let b = 0; b < 6; b++) {
        const startDay = b * bucketSize + 1;
        let income = 0, expense = 0;
        periodTransactions.forEach((t) => {
          const dayNum = new Date(t.date).getDate();
          if (dayNum >= startDay && dayNum < startDay + bucketSize) {
            t.type === 'income' ? (income += t.amount) : (expense += t.amount);
          }
        });
        days.push({ label: `${startDay}`, income, expense });
      }
      return days;
    }
    const months: { label: string; income: number; expense: number }[] = [];
    for (let m = 0; m < 12; m++) {
      let income = 0, expense = 0;
      periodTransactions.forEach((t) => {
        if (new Date(t.date).getMonth() === m) {
          t.type === 'income' ? (income += t.amount) : (expense += t.amount);
        }
      });
      months.push({ label: getMonthLabel(new Date(refDate.getFullYear(), m, 1)), income, expense });
    }
    return months;
  }, [periodTransactions, range, refDate, period]);

  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    periodTransactions.filter((t) => t.type === breakdown).forEach((t) => {
      map.set(t.categoryId, (map.get(t.categoryId) || 0) + t.amount);
    });
    return Array.from(map.entries())
      .map(([catId, total]) => {
        const cat = getCategory(catId);
        return { label: cat?.name || 'Sin categoría', color: cat?.color || colors.textTertiary, total };
      })
      .sort((a, b) => b.total - a.total);
  }, [periodTransactions, breakdown, getCategory, colors.textTertiary]);

  const disableNext = offset >= 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Estadísticas</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Analiza tus finanzas</Text>
      </View>

      <PeriodSelector period={period} onPeriodChange={(p) => { setPeriod(p); setOffset(0); }} label={periodLabel} onPrev={() => setOffset(offset - 1)} onNext={() => !disableNext && setOffset(offset + 1)} disableNext={disableNext} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <View style={[styles.summaryIcon, { backgroundColor: colors.incomeLight }]}><TrendingUp size={18} color={colors.incomeDark} /></View>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Ingresos</Text>
            <Text style={[styles.summaryAmount, { color: colors.incomeDark }]}>{formatCurrency(totals.income)}</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <View style={[styles.summaryIcon, { backgroundColor: colors.expenseLight }]}><TrendingDown size={18} color={colors.expenseDark} /></View>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Gastos</Text>
            <Text style={[styles.summaryAmount, { color: colors.expenseDark }]}>{formatCurrency(totals.expense)}</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <View style={[styles.summaryIcon, { backgroundColor: colors.primaryLight }]}><Wallet size={18} color={colors.primary} /></View>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Balance</Text>
            <Text style={[styles.summaryAmount, { color: totals.balance >= 0 ? colors.incomeDark : colors.expenseDark }]}>{formatCurrency(totals.balance)}</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Ingresos vs Gastos</Text>
          <BarChart data={byDayData} />
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.breakdownHeader}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Desglose por categoría</Text>
            <View style={[styles.breakdownToggle, { backgroundColor: colors.bg }]}>
              <TouchableOpacity style={[styles.breakdownBtn, breakdown === 'expense' && { backgroundColor: colors.expense }]} onPress={() => setBreakdown('expense')}>
                <Text style={[styles.breakdownBtnText, { color: colors.textSecondary }, breakdown === 'expense' && { color: '#fff', fontFamily: 'Poppins-SemiBold' }]}>Gastos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.breakdownBtn, breakdown === 'income' && { backgroundColor: colors.income }]} onPress={() => setBreakdown('income')}>
                <Text style={[styles.breakdownBtnText, { color: colors.textSecondary }, breakdown === 'income' && { color: '#fff', fontFamily: 'Poppins-SemiBold' }]}>Ingresos</Text>
              </TouchableOpacity>
            </View>
          </View>
          {categoryBreakdown.length > 0 ? (
            <DonutChart data={categoryBreakdown} />
          ) : (
            <View style={styles.emptyChart}>
              <ChartPie size={40} color={colors.textTertiary} />
              <Text style={[styles.emptyChartText, { color: colors.textTertiary }]}>Sin datos de {breakdown === 'expense' ? 'gastos' : 'ingresos'} en este periodo</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, display: 'flex', flexDirection: 'column' },
  header: { paddingLeft: 16, paddingRight: 16, paddingTop: 56, paddingBottom: 8 },
  title: { fontSize: 24, fontFamily: 'Poppins-Bold' },
  subtitle: { fontSize: 14, fontFamily: 'Poppins-Regular' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  summaryRow: { flexDirection: 'row', gap: 8, paddingLeft: 16, paddingRight: 16, marginTop: 12 },
  summaryCard: { flex: 1, borderRadius: 14, padding: 12, alignItems: 'center' },
  summaryIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 6, display: 'flex' },
  summaryLabel: { fontSize: 11, fontFamily: 'Poppins-Regular' },
  summaryAmount: { fontSize: 14, fontFamily: 'Poppins-SemiBold', marginTop: 2 },
  card: { borderRadius: 16, padding: 16, marginLeft: 16, marginRight: 16, marginTop: 12 },
  cardTitle: { fontSize: 16, fontFamily: 'Poppins-SemiBold', marginBottom: 12 },
  breakdownHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  breakdownToggle: { flexDirection: 'row', borderRadius: 8, padding: 2 },
  breakdownBtn: { paddingTop: 5, paddingBottom: 5, paddingLeft: 12, paddingRight: 12, borderRadius: 6 },
  breakdownBtnText: { fontSize: 12, fontFamily: 'Poppins-Regular' },
  emptyChart: { alignItems: 'center', paddingTop: 32, paddingBottom: 32 },
  emptyChartText: { fontSize: 14, fontFamily: 'Poppins-Regular', marginTop: 8 },
});
