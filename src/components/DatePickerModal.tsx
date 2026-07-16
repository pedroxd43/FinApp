import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from '../primitives';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useTheme } from '../lib/theme';

interface DatePickerModalProps {
  visible: boolean;
  date: Date;
  onClose: () => void;
  onSelect: (date: Date) => void;
}

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const WEEKDAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

export function DatePickerModal({ visible, date, onClose, onSelect }: DatePickerModalProps) {
  const { colors } = useTheme();
  const [viewDate, setViewDate] = useState(new Date(date));
  const [selected, setSelected] = useState(new Date(date));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const isToday = (d: number) => isSameDay(new Date(year, month, d), new Date());

  const handleSelect = () => {
    const result = new Date(selected);
    result.setHours(new Date().getHours(), new Date().getMinutes(), 0, 0);
    onSelect(result);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.sheet, { backgroundColor: colors.card }]} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}><Text style={[styles.cancelBtn, { color: colors.textSecondary }]}>Cancelar</Text></TouchableOpacity>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Seleccionar fecha</Text>
            <TouchableOpacity onPress={handleSelect}><Check size={22} color={colors.primary} /></TouchableOpacity>
          </View>
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={prevMonth} style={styles.navBtn}><ChevronLeft size={22} color={colors.textSecondary} /></TouchableOpacity>
            <Text style={[styles.monthLabel, { color: colors.textPrimary }]}>{MONTHS[month]} {year}</Text>
            <TouchableOpacity onPress={nextMonth} style={styles.navBtn}><ChevronRight size={22} color={colors.textSecondary} /></TouchableOpacity>
          </View>
          <View style={styles.weekdays}>
            {WEEKDAYS.map((d, i) => <Text key={i} style={[styles.weekday, { color: colors.textTertiary }]}>{d}</Text>)}
          </View>
          <View style={styles.daysGrid}>
            {days.map((d, i) => {
              if (d === null) return <View key={i} style={styles.dayCell} />;
              const isSelected = isSameDay(new Date(year, month, d), selected);
              const today = isToday(d);
              return (
                <TouchableOpacity key={i} style={styles.dayCell} onPress={() => setSelected(new Date(year, month, d))}>
                  <View style={[styles.dayInner, isSelected && { backgroundColor: colors.primary }]}>
                    <Text style={[styles.dayText, { color: colors.textPrimary }, today && !isSelected && { color: colors.primary, fontFamily: 'Poppins-SemiBold' }, isSelected && { color: '#fff', fontFamily: 'Poppins-SemiBold' }]}>{d}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(15, 23, 42, 0.5)', paddingBottom: 40, paddingLeft: 16, paddingRight: 16 },
  sheet: { borderRadius: 20, padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  cancelBtn: { fontSize: 15, fontFamily: 'Poppins-Regular' },
  title: { fontSize: 16, fontFamily: 'Poppins-SemiBold' },
  monthNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  navBtn: { padding: 8 },
  monthLabel: { fontSize: 16, fontFamily: 'Poppins-SemiBold' },
  weekdays: { flexDirection: 'row', marginBottom: 8 },
  weekday: { flex: 1, textAlign: 'center', fontSize: 12, fontFamily: 'Poppins-Medium' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: '14.28%', alignItems: 'center', paddingTop: 4, paddingBottom: 4 },
  dayInner: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', display: 'flex' },
  dayText: { fontSize: 15, fontFamily: 'Poppins-Regular' },
});
