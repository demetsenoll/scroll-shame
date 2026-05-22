import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

interface Props {
  icon: string;
  label: string;
  value: string;
  color?: string;
}

export function StatBadge({ icon, label, value, color = Colors.primary }: Props) {
  return (
    <View style={[styles.container, { borderColor: color + '40', backgroundColor: color + '15' }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  icon: {
    fontSize: 22,
  },
  value: {
    ...Typography.h3,
  },
  label: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
