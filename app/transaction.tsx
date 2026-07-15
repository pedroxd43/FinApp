import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X, Trash2, CalendarDays } from 'lucide-react-native';
import { useData } from '@/lib/storage';
import { useTheme } from '@/lib/theme';
import { TransactionType } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { CategoryIcon } from '@/components/CategoryIcon';
import { DatePickerModal } from '@/components/DatePickerModal';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';

export default function TransactionScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { showAd } = useInterstitialAd();
  const { transactions, categories, addTransaction, updateTransaction, deleteTransaction } = useData();

  const editingTx = useMemo(
    () => transactions.find((t) => t.id === id),
    [transactions, id],
  );

  const [type, setType] = useState<TransactionType>(editingTx?.type || 'expense');
  const [amount, setAmount] = useState(editingTx ? String(editingTx.amount) : '');
  const [categoryId, setCategoryId] = useState<string | null>(editingTx?.categoryId || null);
  const [date, setDate] = useState(new Date(editingTx?.date || new Date()));
  const [note, setNote] = useState(editingTx?.note || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSave = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setError('Ingresa un monto válido');
      return;
    }
    if (!categoryId) {
      setError('Selecciona una categoría');
      return;
    }
    const data = {
      type,
      amount: amt,
      categoryId,
      date: date.toISOString(),
      note: note.trim() || undefined,
    };
    if (editingTx) {
      updateTransaction(editingTx.id, data);
    } else {
      addTransaction(data);
    }
    await showAd();
    router.back();
  };

  const handleDelete = () => {
    if (!editingTx) return;
    Alert.alert('Eliminar transacción', '¿Estás seguro de que quieres eliminar esta transacción?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          deleteTransaction(editingTx.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <X size={22} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {editingTx ? 'Editar transacción' : 'Nueva transacción'}
        </Text>
        <View style={styles.headerRight}>
          {editingTx && (
            <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
              <Trash2 size={20} color={colors.expense} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.typeToggle}>
            <TouchableOpacity
              style={[styles.typeBtn, type === 'expense' && { backgroundColor: colors.expense }]}
              onPress={() => {
                setType('expense');
                setCategoryId(null);
              }}
            >
              <Text style={[styles.typeBtnText, { color: colors.textSecondary }, type === 'expense' && { color: '#fff', fontFamily: 'Poppins-SemiBold' }]}>
                Gasto
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeBtn, type === 'income' && { backgroundColor: colors.income }]}
              onPress={() => {
                setType('income');
                setCategoryId(null);
              }}
            >
              <Text style={[styles.typeBtnText, { color: colors.textSecondary }, type === 'income' && { color: '#fff', fontFamily: 'Poppins-SemiBold' }]}>
                Ingreso
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.amountContainer}>
            <Text style={[styles.currencySymbol, { color: colors.textTertiary }]}>$</Text>
            <TextInput
              style={[styles.amountInput, { color: colors.textPrimary }]}
              placeholder="0"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
              value={amount}
              onChangeText={(v) => {
                setAmount(v.replace(/[^0-9.]/g, ''));
                setError(null);
              }}
              autoFocus={!editingTx}
            />
          </View>

          <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>Categorías</Text>
          <View style={styles.categoryGrid}>
            {filteredCategories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  categoryId === cat.id && { backgroundColor: cat.color + '22', borderColor: cat.color },
                ]}
                onPress={() => {
                  setCategoryId(cat.id);
                  setError(null);
                }}
              >
                <CategoryIcon icon={cat.icon} color={cat.color} size={20} />
                <Text
                  style={[
                    styles.categoryChipText,
                    { color: colors.textSecondary },
                    categoryId === cat.id && { color: cat.color, fontFamily: 'Poppins-SemiBold' },
                  ]}
                  numberOfLines={1}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>Fecha</Text>
          <TouchableOpacity
            style={[styles.dateBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => setShowDatePicker(true)}
          >
            <CalendarDays size={20} color={colors.textSecondary} />
            <Text style={[styles.dateText, { color: colors.textPrimary }]}>{formatDate(date.toISOString())}</Text>
          </TouchableOpacity>

          <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>Nota (opcional)</Text>
          <TextInput
            style={[styles.noteInput, { backgroundColor: colors.card, color: colors.textPrimary, borderColor: colors.border }]}
            placeholder="Ej: Almuerzo con el equipo"
            placeholderTextColor={colors.textTertiary}
            value={note}
            onChangeText={setNote}
            multiline
            maxLength={100}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: colors.bg }]}>
          <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSave}>
            <Text style={styles.saveBtnText}>
              {editingTx ? 'Guardar cambios' : 'Agregar transacción'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <DatePickerModal
        visible={showDatePicker}
        date={date}
        onClose={() => setShowDatePicker(false)}
        onSelect={setDate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  closeBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  deleteBtn: {
    padding: 4,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  typeToggle: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
    marginBottom: 24,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
  },
  typeBtnText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  currencySymbol: {
    fontSize: 36,
    fontFamily: 'Poppins-Bold',
    marginRight: 4,
  },
  amountInput: {
    fontSize: 48,
    fontFamily: 'Poppins-Bold',
    minWidth: 100,
    textAlign: 'center',
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 10,
    marginTop: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
  },
  noteInput: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    borderWidth: 1,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#EF4444',
    marginTop: 12,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
  saveBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#fff',
  },
});
