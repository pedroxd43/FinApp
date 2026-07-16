import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from '../primitives';
import { useNavigate } from 'react-router-dom';
import { Plus, Receipt, TrendingUp, TrendingDown } from 'lucide-react';
import { useData } from '../lib/storage';
import { useTheme } from '../lib/theme';
import { formatCurrency, getMonthRange, isDateInRange, getMonthName } from '../lib/format';
import { BalanceCard } from '../components/BalanceCard';
import { TransactionItem } from '../components/TransactionItem';
import { EmptyState } from '../components/EmptyState';

type Filter = 'all' | 'income' | 'expense';

export default function DashboardScreen() {
  const { transactions, getCategory, loading } = useData();
  const { colors } = useTheme();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');

  const now = new Date();
  const monthRange = useMemo(() => getMonthRange(now), []);
  const monthLabel = useMemo(() => getMonthName(new Date()), []);

  const monthTransactions = useMemo(
    () => transactions.filter((t) => isDateInRange(t.date, monthRange.start, monthRange.end)),
    [transactions, monthRange],
  );

  const totals = useMemo(() => {
    let income = 0, expense = 0;
    monthTransactions.forEach((t) => { t.type === 'income' ? (income += t.amount) : (expense += t.amount); });
    return { income, expense, balance: income - expense };
  }, [monthTransactions]);

  const filteredTransactions = useMemo(() => {
    if (filter === 'all') return transactions;
    return transactions.filter((t) => t.type === filter);
  }, [transactions, filter]);

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'income', label: 'Ingresos' },
    { key: 'expense', label: 'Gastos' },
  ];

  if (loading) {
    return <View style={[styles.loadingContainer, { backgroundColor: colors.bg }]}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textPrimary }]}>Mis Finanzas</Text>
          <Text style={[styles.subGreeting, { color: colors.textSecondary }]}>Resumen de {monthLabel}</Text>
        </View>
      </View>

      <BalanceCard totalIncome={totals.income} totalExpense={totals.expense} balance={totals.balance} periodLabel={monthLabel} />

      <View style={styles.quickStats}>
        <View style={[styles.quickCard, { backgroundColor: colors.incomeLight }]}>
          <TrendingUp size={18} color={colors.incomeDark} />
          <Text style={[styles.quickLabel, { color: colors.textSecondary }]}>Ingresos</Text>
          <Text style={[styles.quickAmount, { color: colors.incomeDark }]}>{formatCurrency(totals.income)}</Text>
        </View>
        <View style={[styles.quickCard, { backgroundColor: colors.expenseLight }]}>
          <TrendingDown size={18} color={colors.expenseDark} />
          <Text style={[styles.quickLabel, { color: colors.textSecondary }]}>Gastos</Text>
          <Text style={[styles.quickAmount, { color: colors.expenseDark }]}>{formatCurrency(totals.expense)}</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        {filters.map((f) => (
          <TouchableOpacity key={f.key} style={[styles.filterBtn, { backgroundColor: colors.card, borderColor: colors.border }, filter === f.key && { backgroundColor: colors.primary, borderColor: colors.primary }]} onPress={() => setFilter(f.key)}>
            <Text style={[styles.filterText, { color: colors.textSecondary }, filter === f.key && { color: '#fff', fontFamily: 'Poppins-SemiBold' }]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem transaction={item} category={getCategory(item.categoryId)} onPress={() => navigate(`/transaction?id=${item.id}`)} />}
        ListEmptyComponent={<EmptyState icon={<Receipt size={48} color={colors.textTertiary} />} title="Sin transacciones" subtitle="Presiona el botón + para registrar tu primer movimiento" />}
        contentContainerStyle={filteredTransactions.length === 0 ? styles.emptyList : undefined}
        style={styles.list}
      />

      <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={() => navigate('/transaction')} activeOpacity={0.85}>
        <Plus size={26} color="#fff" strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, display: 'flex', flexDirection: 'column' },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', display: 'flex' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 16, paddingRight: 16, paddingTop: 56, paddingBottom: 8 },
  greeting: { fontSize: 24, fontFamily: 'Poppins-Bold' },
  subGreeting: { fontSize: 14, fontFamily: 'Poppins-Regular', textTransform: 'capitalize' },
  quickStats: { flexDirection: 'row', gap: 12, paddingLeft: 16, paddingRight: 16, marginTop: 12 },
  quickCard: { flex: 1, borderRadius: 14, padding: 14 },
  quickLabel: { fontSize: 12, fontFamily: 'Poppins-Regular', marginTop: 4 },
  quickAmount: { fontSize: 16, fontFamily: 'Poppins-SemiBold', marginTop: 2 },
  filterRow: { flexDirection: 'row', paddingLeft: 16, paddingRight: 16, marginTop: 20, marginBottom: 4, gap: 8 },
  filterBtn: { paddingTop: 6, paddingBottom: 6, paddingLeft: 14, paddingRight: 14, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 13, fontFamily: 'Poppins-Regular' },
  list: { flex: 1 },
  emptyList: { flexGrow: 1, justifyContent: 'center' },
  fab: { position: 'absolute', right: 20, bottom: 24, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
});
