import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import type { Challenge } from '../../types';

const CATEGORY_COLORS: Record<string, string> = {
  outdoor: Colors.recovery,
  mindfulness: Colors.purple,
  health: Colors.orange,
  focus: Colors.blue,
  social: Colors.gold,
};

interface Props {
  challenge: Challenge;
  isCompleted: boolean;
  onComplete: () => void;
}

export function ChallengeCard({ challenge, isCompleted, onComplete }: Props) {
  const scale = useSharedValue(1);
  const flashOpacity = useSharedValue(0);
  const xpScale = useSharedValue(1);
  const categoryColor = CATEGORY_COLORS[challenge.category] ?? Colors.primary;

  const triggerFlash = () => {
    flashOpacity.value = withSequence(
      withTiming(0.6, { duration: 80 }),
      withTiming(0, { duration: 400 })
    );
    xpScale.value = withSequence(
      withSpring(1.5),
      withSpring(1)
    );
  };

  const handlePress = () => {
    if (isCompleted) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    scale.value = withSequence(
      withSpring(0.94),
      withSpring(1.06),
      withSpring(1, {}, () => runOnJS(triggerFlash)())
    );
    onComplete();
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
    ...StyleSheet.absoluteFillObject,
    borderRadius: Radius.lg,
    backgroundColor: Colors.recovery,
    pointerEvents: 'none' as const,
  }));

  const xpStyle = useAnimatedStyle(() => ({
    transform: [{ scale: xpScale.value }],
  }));

  return (
    <Animated.View style={cardStyle}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8} disabled={isCompleted}>
        <LinearGradient
          colors={
            isCompleted
              ? [Colors.recovery + '15', Colors.recovery + '08']
              : ['#1a1a1a', '#141414']
          }
          style={[
            styles.card,
            { borderColor: isCompleted ? Colors.recovery + '50' : Colors.border },
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: categoryColor + '20' }]}>
            <Text style={styles.icon}>{challenge.icon}</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.topRow}>
              <Text style={[styles.title, isCompleted && styles.titleDone]}>
                {challenge.title}
              </Text>
              {isCompleted && <Text style={styles.doneCheck}>✓</Text>}
            </View>
            <Text style={styles.description}>{challenge.description}</Text>
            <View style={styles.meta}>
              <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
                <Text style={[styles.categoryText, { color: categoryColor }]}>
                  {challenge.duration}dk
                </Text>
              </View>
              <Animated.View style={[styles.xpBadge, xpStyle]}>
                <Text style={styles.xpText}>⚡ {challenge.xp} XP</Text>
              </Animated.View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
      <Animated.View style={flashStyle} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 24 },
  content: { flex: 1, gap: Spacing.xs },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { ...Typography.h4, color: Colors.text, flex: 1 },
  titleDone: { color: Colors.textMuted, textDecorationLine: 'line-through' },
  doneCheck: { color: Colors.recovery, fontSize: 18, fontWeight: '800' },
  description: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 18 },
  meta: { flexDirection: 'row', gap: Spacing.sm, marginTop: 4 },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  categoryText: { ...Typography.caption, fontWeight: '700' },
  xpBadge: {
    backgroundColor: Colors.gold + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  xpText: { ...Typography.caption, color: Colors.gold, fontWeight: '700' },
});
