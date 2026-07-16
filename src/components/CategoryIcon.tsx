import React from 'react';
import { View, StyleSheet } from '../primitives';
import * as Lucide from 'lucide-react';

interface CategoryIconProps {
  icon: string;
  color: string;
  size?: number;
}

export function CategoryIcon({ icon, color, size = 24 }: CategoryIconProps) {
  const IconComp = (Lucide as any)[icon] || Lucide.Circle;
  const bg = color + '22';
  return (
    <View style={[styles.container, { backgroundColor: bg, width: size + 16, height: size + 16, borderRadius: (size + 16) / 2 }]}>
      <IconComp size={size} color={color} strokeWidth={2} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', display: 'flex', flexShrink: 0 },
});
