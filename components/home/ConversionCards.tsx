import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { convertScrollTime } from '../../utils/shameEngine';
import type { ShameConversion } from '../../types';

interface ConversionItemProps {
  item: ShameConversion;
  index: number;
}

function ConversionItem({ item, index }: ConversionItemProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(index * 80, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(
      index * 80,
      withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) })
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <LinearGradient
        colors={[item.color + '18', item.color + '08']}
        style={[styles.item, { borderColor: item.color + '30' }]}
      >
        <Text style={styles.itemIcon}>{item.icon}</Text>
        <View style={styles.itemText}>
          <Text style={[styles.itemValue, { color: item.color }]}>{item.value}</Text>
          <Text style={styles.itemLabel}>{item.label}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

interface Props {
  totalMinutes: number;
}

export function ConversionCards({ totalMinutes }: Props) {
  const conversions = convertScrollTime(totalMinutes);

  if (totalMinutes === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Scroll süresini ekle, ne kaybettiğini gör.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Bunun yerine yapabilirdin</Text>
      <View style={styles.grid}>
        {conversions.map((item, i) => (
          <View key={i} style={styles.gridItem}>
            <ConversionItem item={item} index={i} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  gridItem: {
    width: '48%',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  itemIcon: {
    fontSize: 22,
  },
  itemText: {
    flex: 1,
    gap: 2,
  },
  itemValue: {
    ...Typography.h4,
  },
  itemLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  empty: {
    padding: Spacing.xl,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
