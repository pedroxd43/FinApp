import React from 'react';
import { View, Text, StyleSheet } from '../primitives';
import { useTheme } from '../lib/theme';
import { formatCurrency } from '../lib/format';

interface BalanceCardProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  periodLabel: string;
}

export function BalanceCard({ totalIncome, totalExpense, balance, periodLabel }: BalanceCardProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
      <Text style={[styles.periodLabel, { color: colors.textSecondary }]}>{periodLabel}</Text>
      <Text style={[styles.balanceLabel, { color: colors.textTertiary }]}>Balance</Text>
      <Text style={[styles.balanceAmount, { color: balance >= 0 ? colors.textPrimary : colors.expense }]}>
        {formatCurrency(balance)}
      </Text>
      <View style={styles.row}>
        <View style={styles.half}>
          <View style={[styles.badge, { backgroundColor: colors.incomeLight }]}>
            <Text style={[styles.badgeLabel, { color: colors.textSecondary }]}>Ingresos</Text>
          </View>
          <Text style={[styles.amount, { color: colors.incomeDark }]}>{formatCurrency(totalIncome)}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.half}>
          <View style={[styles.badge, { backgroundColor: colors.expenseLight }]}>
            <Text style={[styles.badgeLabel, { color: colors.textSecondary }]}>Gastos</Text>
          </View>
          <Text style={[styles.amount, { color: colors.expenseDark }]}>{formatCurrency(totalExpense)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  periodLabel: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  balanceLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    marginTop: 2,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  half: {
    flex: 1,
  },
  divider: {
    width: 1,
    height: 40,
    marginLeft: 12,
    marginRight: 12,
  },
  badge: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  badgeLabel: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
  },
  amount: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
});
