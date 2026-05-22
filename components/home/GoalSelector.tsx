import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import type { Goal } from '../../types';

const GOALS: { id: Goal; label: string; icon: string; description: string }[] = [
  { id: 'focus', label: 'Daha İyi Odak', icon: '🎯', description: 'Derin çalışma kapasiteni artır' },
  { id: 'less_social', label: 'Daha Az Sosyal Medya', icon: '📵', description: 'Scroll süresini azalt' },
  { id: 'study', label: 'Ders Çalışma', icon: '📚', description: 'Akademik başarı için odaklan' },
  { id: 'coding', label: 'Yazılım Öğrenme', icon: '💻', description: 'Gerçek beceriler kazan' },
  { id: 'fitness', label: 'Fitness', icon: '💪', description: 'Ekran süresini harekete çevir' },
  { id: 'dopamine_detox', label: 'Dopamin Detoksu', icon: '🧘', description: 'Beynini sıfırla' },
];

interface Props {
  selected: Goal[];
  onToggle: (goal: Goal) => void;
}

export function GoalSelector({ selected, onToggle }: Props) {
  const handleToggle = (goal: Goal) => {
    Haptics.selectionAsync();
    onToggle(goal);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {GOALS.map((goal) => {
        const isSelected = selected.includes(goal.id);
        return (
          <TouchableOpacity
            key={goal.id}
            onPress={() => handleToggle(goal.id)}
            activeOpacity={0.7}
            style={[
              styles.item,
              isSelected && styles.itemSelected,
            ]}
          >
            <Text style={styles.icon}>{goal.icon}</Text>
            <View style={styles.text}>
              <Text style={[styles.label, isSelected && styles.labelSelected]}>
                {goal.label}
              </Text>
              <Text style={styles.description}>{goal.description}</Text>
            </View>
            <View style={[styles.check, isSelected && styles.checkSelected]}>
              {isSelected && <Text style={styles.checkMark}>✓</Text>}
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    gap: Spacing.md,
  },
  itemSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryGlow,
  },
  icon: {
    fontSize: 24,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  label: {
    ...Typography.h4,
    color: Colors.textSecondary,
  },
  labelSelected: {
    color: Colors.text,
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.textMuted,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  checkMark: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
});
