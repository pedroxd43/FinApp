import React from 'react';
import { View, Text, StyleSheet } from '../primitives';
import { useTheme } from '../lib/theme';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      {subtitle && <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingTop: 48, paddingBottom: 48, paddingLeft: 32, paddingRight: 32 },
  iconWrap: { marginBottom: 16 },
  title: { fontSize: 17, fontFamily: 'Poppins-SemiBold', textAlign: 'center' },
  subtitle: { fontSize: 14, fontFamily: 'Poppins-Regular', textAlign: 'center', marginTop: 6 },
});
