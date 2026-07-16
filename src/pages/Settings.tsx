import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Share } from '../primitives';
import { Wallet, Download, Trash2, Info, Sun, Moon } from 'lucide-react';
import { useData } from '../lib/storage';
import { useTheme } from '../lib/theme';
import { DEFAULT_CATEGORIES } from '../lib/constants';

export default function SettingsScreen() {
  const { transactions, categories, deleteTransaction, addCategory } = useData();
  const { colors, mode, toggleTheme } = useTheme();

  const handleExport = async () => {
    const data = { transactions, categories, exportedAt: new Date().toISOString() };
    try {
      await Share.share({ message: JSON.stringify(data, null, 2), title: 'FinApp - Exportar datos' });
    } catch {
      Alert.alert('Error', 'No se pudieron exportar los datos');
    }
  };

  const handleClearTransactions = () => {
    Alert.alert('Borrar transacciones', 'Se eliminarán todas tus transacciones. Esta acción no se puede deshacer.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Borrar todo', style: 'destructive', onPress: () => { transactions.forEach((t) => deleteTransaction(t.id)); Alert.alert('Listo', 'Todas las transacciones han sido eliminadas'); } },
    ]);
  };

  const handleResetCategories = () => {
    Alert.alert('Restaurar categorías', 'Se restaurarán las categorías por defecto. Las categorías personalizadas no se eliminarán.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Restaurar', onPress: () => { DEFAULT_CATEGORIES.forEach((cat) => { if (!categories.find((c) => c.id === cat.id)) addCategory(cat); }); Alert.alert('Listo', 'Categorías por defecto restauradas'); } },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Ajustes</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Configura tu aplicación</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Apariencia</Text>
        <TouchableOpacity style={[styles.row, { backgroundColor: colors.card }]} onPress={toggleTheme}>
          <View style={[styles.rowIcon, { backgroundColor: mode === 'dark' ? colors.primaryLight : colors.warningLight }]}>
            {mode === 'dark' ? <Moon size={20} color={colors.primary} /> : <Sun size={20} color={colors.warningDark} />}
          </View>
          <View style={styles.rowContent}>
            <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Modo {mode === 'dark' ? 'oscuro' : 'claro'}</Text>
            <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>Cambia entre tema claro y oscuro</Text>
          </View>
          <View style={[styles.toggleTrack, { backgroundColor: mode === 'dark' ? colors.primary : colors.border }]}>
            <View style={[styles.toggleThumb, { alignSelf: mode === 'dark' ? 'flex-end' : 'flex-start' }]} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Datos</Text>
        <TouchableOpacity style={[styles.row, { backgroundColor: colors.card }]} onPress={handleExport}>
          <View style={[styles.rowIcon, { backgroundColor: colors.primaryLight }]}><Download size={20} color={colors.primary} /></View>
          <View style={styles.rowContent}><Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Exportar datos</Text><Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>Comparte tus transacciones y categorías</Text></View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.row, { backgroundColor: colors.card }]} onPress={handleResetCategories}>
          <View style={[styles.rowIcon, { backgroundColor: colors.warningLight }]}><Wallet size={20} color={colors.warningDark} /></View>
          <View style={styles.rowContent}><Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Restaurar categorías</Text><Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>Volver a las categorías por defecto</Text></View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.row, { backgroundColor: colors.card }]} onPress={handleClearTransactions}>
          <View style={[styles.rowIcon, { backgroundColor: colors.expenseLight }]}><Trash2 size={20} color={colors.expense} /></View>
          <View style={styles.rowContent}><Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Borrar transacciones</Text><Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>Eliminar todas las transacciones</Text></View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Información</Text>
        <View style={[styles.row, { backgroundColor: colors.card }]}>
          <View style={[styles.rowIcon, { backgroundColor: colors.incomeLight }]}><Info size={20} color={colors.incomeDark} /></View>
          <View style={styles.rowContent}><Text style={[styles.rowTitle, { color: colors.textPrimary }]}>FinApp</Text><Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>Versión 1.0.0</Text></View>
        </View>
        <View style={[styles.row, { backgroundColor: colors.card }]}>
          <View style={[styles.rowIcon, { backgroundColor: colors.expenseLight }]}><Wallet size={20} color={colors.expenseDark} /></View>
          <View style={styles.rowContent}><Text style={[styles.rowTitle, { color: colors.textPrimary }]}>{transactions.length} transacciones</Text><Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>{categories.length} categorías registradas</Text></View>
        </View>
      </View>

      <View style={styles.footer}><Text style={[styles.footerText, { color: colors.textTertiary }]}>Tus datos se guardan localmente en tu dispositivo</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, display: 'flex', flexDirection: 'column' },
  header: { paddingLeft: 16, paddingRight: 16, paddingTop: 56, paddingBottom: 12 },
  title: { fontSize: 24, fontFamily: 'Poppins-Bold' },
  subtitle: { fontSize: 14, fontFamily: 'Poppins-Regular' },
  section: { marginTop: 20, marginLeft: 16, marginRight: 16 },
  sectionTitle: { fontSize: 13, fontFamily: 'Poppins-SemiBold', marginBottom: 8, marginLeft: 4, textTransform: 'uppercase' },
  row: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 14, marginBottom: 8 },
  rowIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', display: 'flex' },
  rowContent: { flex: 1, marginLeft: 12 },
  rowTitle: { fontSize: 15, fontFamily: 'Poppins-SemiBold' },
  rowSubtitle: { fontSize: 13, fontFamily: 'Poppins-Regular', marginTop: 2 },
  toggleTrack: { width: 48, height: 28, borderRadius: 14, padding: 3, justifyContent: 'center', display: 'flex' },
  toggleThumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
  footer: { alignItems: 'center', paddingTop: 24, paddingBottom: 24 },
  footerText: { fontSize: 12, fontFamily: 'Poppins-Regular' },
});
