import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from '../primitives';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { X, Trash2, Check } from 'lucide-react';
import * as Lucide from 'lucide-react';
import { useData } from '../lib/storage';
import { useTheme } from '../lib/theme';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../lib/constants';
import { TransactionType } from '../lib/types';
import { showInterstitialAd } from '../lib/admob';

export default function CategoryEditScreen() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') || undefined;
  const typeParam = searchParams.get('type') || undefined;
  const navigate = useNavigate();
  const { colors } = useTheme();
  const { categories, addCategory, updateCategory, deleteCategory, transactions } = useData();

  const editingCat = useMemo(() => categories.find((c) => c.id === id), [categories, id]);

  const [name, setName] = useState(editingCat?.name || '');
  const [type, setType] = useState<TransactionType>(editingCat?.type || (typeParam as TransactionType) || 'expense');
  const [color, setColor] = useState(editingCat?.color || CATEGORY_COLORS[0]);
  const [icon, setIcon] = useState(editingCat?.icon || CATEGORY_ICONS[0]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { setError('Ingresa un nombre'); return; }
    setSaving(true);
    const data = { name: name.trim(), type, color, icon };
    if (editingCat) updateCategory(editingCat.id, data);
    else addCategory(data);
    await showInterstitialAd();
    navigate(-1);
  };

  const handleDelete = () => {
    if (!editingCat) return;
    const txCount = transactions.filter((t) => t.categoryId === editingCat.id).length;
    Alert.alert('Eliminar categoría', txCount > 0 ? `Hay ${txCount} transacción(es) asociadas. ¿Eliminar de todos modos?` : '¿Eliminar esta categoría?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => { deleteCategory(editingCat.id); navigate(-1); } },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate(-1)} style={styles.closeBtn}><X size={22} color={colors.textSecondary} /></TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>{editingCat ? 'Editar categoría' : 'Nueva categoría'}</Text>
        <View style={styles.headerRight}>{editingCat && <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}><Trash2 size={20} color={colors.expense} /></TouchableOpacity>}</View>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.typeToggle}>
          <TouchableOpacity style={[styles.typeBtn, type === 'expense' && { backgroundColor: colors.expense }]} onPress={() => setType('expense')} disabled={!!editingCat}>
            <Text style={[styles.typeBtnText, { color: colors.textSecondary }, type === 'expense' && { color: '#fff', fontFamily: 'Poppins-SemiBold' }]}>Gasto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.typeBtn, type === 'income' && { backgroundColor: colors.income }]} onPress={() => setType('income')} disabled={!!editingCat}>
            <Text style={[styles.typeBtnText, { color: colors.textSecondary }, type === 'income' && { color: '#fff', fontFamily: 'Poppins-SemiBold' }]}>Ingreso</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.preview, { backgroundColor: color + '22' }]}>
          {(() => { const IconComp = (Lucide as any)[icon] || Lucide.Circle; return <IconComp size={32} color={color} strokeWidth={2} />; })()}
          <Text style={[styles.previewName, { color }]}>{name || 'Nombre de categoría'}</Text>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>Nombre</Text>
        <TextInput style={[styles.nameInput, { backgroundColor: colors.card, color: colors.textPrimary, borderColor: colors.border }]} placeholder="Ej: Suscripciones" placeholderTextColor={colors.textTertiary} value={name} onChangeText={(v) => { setName(v); setError(null); }} maxLength={30} />

        <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>Color</Text>
        <View style={styles.colorGrid}>
          {CATEGORY_COLORS.map((c) => (
            <TouchableOpacity key={c} style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotSelected]} onPress={() => setColor(c)}>
              {color === c && <Check size={16} color="#fff" strokeWidth={3} />}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>Icono</Text>
        <View style={styles.iconGrid}>
          {CATEGORY_ICONS.map((iconName) => {
            const IconComp = (Lucide as any)[iconName] || Lucide.Circle;
            return (
              <TouchableOpacity key={iconName} style={[styles.iconBox, { backgroundColor: icon === iconName ? color + '22' : colors.card }, icon === iconName && { borderColor: color }]} onPress={() => setIcon(iconName)}>
                <IconComp size={22} color={icon === iconName ? color : colors.textSecondary} strokeWidth={2} />
              </TouchableOpacity>
            );
          })}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.bg }]}>
        <TouchableOpacity style={[styles.saveBtn, { backgroundColor: colors.primary }]} onPress={handleSave} disabled={saving}>
          <Text style={styles.saveBtnText}>{saving ? 'Guardando...' : editingCat ? 'Guardar cambios' : 'Crear categoría'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, display: 'flex', flexDirection: 'column' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 56, paddingLeft: 16, paddingRight: 16, paddingBottom: 12 },
  closeBtn: { padding: 4 },
  headerTitle: { fontSize: 17, fontFamily: 'Poppins-SemiBold' },
  headerRight: { width: 40, alignItems: 'flex-end' },
  deleteBtn: { padding: 4 },
  content: { padding: 16, paddingBottom: 100 },
  typeToggle: { flexDirection: 'row', borderRadius: 12, padding: 3, marginBottom: 20 },
  typeBtn: { flex: 1, paddingTop: 10, paddingBottom: 10, borderRadius: 9, alignItems: 'center' },
  typeBtnText: { fontSize: 14, fontFamily: 'Poppins-Regular' },
  preview: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, paddingTop: 16, paddingBottom: 16, paddingLeft: 20, paddingRight: 20, marginBottom: 20 },
  previewName: { fontSize: 18, fontFamily: 'Poppins-SemiBold' },
  sectionLabel: { fontSize: 14, fontFamily: 'Poppins-SemiBold', marginBottom: 10 },
  nameInput: { borderRadius: 12, paddingTop: 14, paddingBottom: 14, paddingLeft: 16, paddingRight: 16, fontSize: 15, fontFamily: 'Poppins-Regular', borderWidth: 1, marginBottom: 20 },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  colorDot: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', display: 'flex' },
  colorDotSelected: { borderWidth: 3, borderColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0', display: 'flex' },
  errorText: { fontSize: 14, fontFamily: 'Poppins-Regular', color: '#EF4444', marginTop: 12, textAlign: 'center' },
  footer: { padding: 16, paddingBottom: 32 },
  saveBtn: { borderRadius: 14, paddingTop: 16, paddingBottom: 16, alignItems: 'center' },
  saveBtnText: { fontSize: 16, fontFamily: 'Poppins-SemiBold', color: '#fff' },
});
