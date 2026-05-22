import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { ProgressRing } from '../ui/ProgressRing';
import { getShameLabel, getDopamineLevel } from '../../utils/shameEngine';
import type { DailyLog } from '../../types';

interface Props {
  log: DailyLog | null;
}

export function ShameHeroCard({ log }: Props) {
  const pulseAnim = useSharedValue(1);
  const shameScore = log?.shameScore ?? 0;
  const totalMinutes = log?.total ?? 0;
  const shameInfo = getShameLabel(shameScore);
  const dopamineInfo = getDopamineLevel(shameScore);

  useEffect(() => {
    if (shameScore > 50) {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.04, { duration: 900, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) })
        ),
        -1
      );
    }
  }, [shameScore]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  return (
    <TouchableOpacity
      onPress={() => router.push('/add-time')}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={['#1f0a0a', '#141414']}
        style={styles.card}
      >
        <View style={styles.topRow}>
          <View>
            <Text style={styles.cardLabel}>BUGÜN</Text>
            <Text style={styles.cardTitle}>Shame Score</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: shameInfo.color + '25', borderColor: shameInfo.color + '60' }]}>
            <Text style={styles.badgeEmoji}>{shameInfo.emoji}</Text>
            <Text style={[styles.badgeText, { color: shameInfo.color }]}>{shameInfo.label}</Text>
          </View>
        </View>

        <View style={styles.ringRow}>
          <Animated.View style={pulseStyle}>
            <ProgressRing
              size={180}
              strokeWidth={14}
              progress={shameScore}
              color={shameInfo.color}
              centerValue={`${shameScore}`}
              label="SHAME SCORE"
              sublabel="0 - 100"
            />
          </Animated.View>

          <View style={styles.sideStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalMinutes}</Text>
              <Text style={styles.statUnit}>dk scroll</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{(totalMinutes / 60).toFixed(1)}</Text>
              <Text style={styles.statUnit}>saat</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <View style={styles.dopamineRow}>
                <View style={[styles.dopamineDot, { backgroundColor: dopamineInfo.color }]} />
                <Text style={[styles.statValue, { fontSize: 12, color: dopamineInfo.color }]}>
                  {dopamineInfo.level}
                </Text>
              </View>
              <Text style={styles.statUnit}>dopamin</Text>
            </View>
          </View>
        </View>

        <LinearGradient
          colors={[Colors.primary + '20', Colors.orange + '20']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.addRow}
        >
          <Text style={styles.addText}>
            {log ? '✏️  Güncelle' : '➕  Bugünü ekle'}
          </Text>
        </LinearGradient>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardLabel: {
    ...Typography.label,
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  cardTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  badgeEmoji: {
    fontSize: 14,
  },
  badgeText: {
    ...Typography.bodySmall,
    fontWeight: '700',
  },
  ringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideStats: {
    flex: 1,
    paddingLeft: Spacing.lg,
    gap: Spacing.md,
  },
  statItem: {
    gap: 2,
  },
  statValue: {
    ...Typography.h2,
    color: Colors.text,
  },
  statUnit: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  dopamineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dopamineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  addRow: {
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  addText: {
    ...Typography.h4,
    color: Colors.text,
  },
});
