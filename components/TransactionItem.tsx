import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CategoryIcon } from './CategoryIcon';
import { Category, Transaction } from '@/lib/types';
import { useTheme } from '@/lib/theme';
import { formatCurrencySigned, formatDateShort, formatTime } from '@/lib/format';

interface TransactionItemProps {
  transaction: Transaction;
  category?: Category;
  onPress?: () => void;
}

export function TransactionItem({ transaction, category, onPress }: TransactionItemProps) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <CategoryIcon
        icon={category?.icon || 'Circle'}
        color={category?.color || colors.textTertiary}
        size={22}
      />
      <View style={styles.info}>
        <Text style={[styles.categoryName, { color: colors.textPrimary }]} numberOfLines={1}>
          {category?.name || 'Sin categoría'}
        </Text>
        <Text style={[styles.note, { color: colors.textSecondary }]} numberOfLines={1}>
          {transaction.note || formatDateShort(transaction.date)}
        </Text>
      </View>
      <View style={styles.right}>
        <Text
          style={[
            styles.amount,
            { color: transaction.type === 'income' ? colors.incomeDark : colors.expenseDark },
          ]}
        >
          {formatCurrencySigned(transaction.amount, transaction.type)}
        </Text>
        <Text style={[styles.time, { color: colors.textTertiary }]}>{formatTime(transaction.date)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  categoryName: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
  },
  note: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
  },
  time: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
});
