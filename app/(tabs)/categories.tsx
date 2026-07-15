import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Pencil, Trash2, Tags } from 'lucide-react-native';
import { useData } from '@/lib/storage';
import { useTheme } from '@/lib/theme';
import { TransactionType } from '@/lib/types';
import { CategoryIcon } from '@/components/CategoryIcon';
import { EmptyState } from '@/components/EmptyState';

export default function CategoriesScreen() {
  const { categories, transactions, deleteCategory } = useData();
  const { colors } = useTheme();
  const router = useRouter();

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const incomeCategories = categories.filter((c) => c.type === 'income');

  const sections = [
    { title: 'Gastos', data: expenseCategories, type: 'expense' as TransactionType },
    { title: 'Ingresos', data: incomeCategories, type: 'income' as TransactionType },
  ].filter((s) => s.data.length > 0);

  const handleDelete = (categoryId: string, name: string) => {
    const txCount = transactions.filter((t) => t.categoryId === categoryId).length;
    Alert.alert(
      'Eliminar categoría',
      txCount > 0
        ? `Hay ${txCount} transacción(es) asociadas a "${name}". ¿Eliminar de todos modos?`
        : `¿Eliminar la categoría "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteCategory(categoryId),
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Categorías</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{categories.length} categorías</Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => (
          <View style={[styles.sectionHeader, { backgroundColor: colors.bg }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{section.title}</Text>
            <TouchableOpacity
              style={[
                styles.addSectionBtn,
                { backgroundColor: section.type === 'income' ? colors.incomeLight : colors.expenseLight },
              ]}
              onPress={() => router.push({ pathname: '/category-edit', params: { type: section.type } })}
            >
              <Plus
                size={16}
                color={section.type === 'income' ? colors.incomeDark : colors.expenseDark}
                strokeWidth={2.5}
              />
              <Text
                style={[
                  styles.addSectionText,
                  { color: section.type === 'income' ? colors.incomeDark : colors.expenseDark },
                ]}
              >
                Nueva
              </Text>
            </TouchableOpacity>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={[styles.categoryRow, { backgroundColor: colors.card }]}>
            <CategoryIcon icon={item.icon} color={item.color} size={22} />
            <Text style={[styles.categoryName, { color: colors.textPrimary }]}>{item.name}</Text>
            {item.isCustom && (
              <View style={[styles.customBadge, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.customBadgeText, { color: colors.primary }]}>Personal</Text>
              </View>
            )}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.bg }]}
                onPress={() => router.push({ pathname: '/category-edit', params: { id: item.id } })}
              >
                <Pencil size={16} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.bg }]}
                onPress={() => handleDelete(item.id, item.name)}
              >
                <Trash2 size={16} color={colors.expense} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon={<Tags size={48} color={colors.textTertiary} />}
            title="Sin categorías"
            subtitle="Crea categorías para organizar tus transacciones"
          />
        }
        contentContainerStyle={sections.length === 0 ? styles.emptyList : styles.listContent}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  addSectionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  addSectionText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  categoryName: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    marginLeft: 12,
  },
  customBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 8,
  },
  customBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
  },
  actions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionBtn: {
    padding: 8,
    borderRadius: 8,
  },
});
