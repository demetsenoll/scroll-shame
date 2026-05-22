import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

interface Props {
  score: number;
}

const getRecoveryState = (score: number) => {
  if (score >= 80) return {
    label: 'Zihin Açık',
    description: 'Beynin tam kapasitede çalışıyor. Odak güçlü, dopamin dengeli.',
    color: Colors.recovery,
    emoji: '🌿',
    gradient: ['#022c22', '#0a0a0a'] as const,
  };
  if (score >= 60) return {
    label: 'İyileşiyor',
    description: 'Dopamin seviyeleri normale dönüyor. Devam et.',
    color: '#86EFAC',
    emoji: '🌱',
    gradient: ['#052e16', '#0a0a0a'] as const,
  };
  if (score >= 40) return {
    label: 'Orta',
    description: 'Biraz daha çaba gerekiyor. Touch Grass görevlerini tamamla.',
    color: Colors.gold,
    emoji: '🌾',
    gradient: ['#1c1007', '#0a0a0a'] as const,
  };
  if (score >= 20) return {
    label: 'Yorgun',
    description: 'Beyin aşırı uyarılmış durumda. Mola zamanı.',
    color: Colors.orange,
    emoji: '🍂',
    gradient: ['#2d1507', '#0a0a0a'] as const,
  };
  return {
    label: 'Kritik',
    description: 'Dopamin sistemi ciddi baskı altında. Hemen dur.',
    color: Colors.primary,
    emoji: '🥀',
    gradient: ['#2d0a0a', '#0a0a0a'] as const,
  };
};

export function BrainMeter({ score }: Props) {
  const pulseAnim = useSharedValue(1);
  const state = getRecoveryState(score);

  useEffect(() => {
    if (score >= 70) {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 2000 }),
          withTiming(1, { duration: 2000 })
        ),
        -1
      );
    }
  }, [score]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const SEGMENTS = 20;

  return (
    <Animated.View style={pulseStyle}>
      <LinearGradient colors={state.gradient} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.emoji}>{state.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.label, { color: state.color }]}>{state.label}</Text>
            <Text style={styles.description}>{state.description}</Text>
          </View>
          <View style={[styles.scoreBadge, { borderColor: state.color + '60', backgroundColor: state.color + '20' }]}>
            <Text style={[styles.scoreValue, { color: state.color }]}>{score}%</Text>
          </View>
        </View>

        {/* Segmented bar */}
        <View style={styles.segmentContainer}>
          {Array.from({ length: SEGMENTS }).map((_, i) => {
            const threshold = (i + 1) / SEGMENTS;
            const filled = score / 100 >= threshold;
            const segColor = i < 4 ? Colors.primary : i < 8 ? Colors.orange : i < 12 ? Colors.gold : state.color;
            return (
              <View
                key={i}
                style={[
                  styles.segment,
                  {
                    backgroundColor: filled ? segColor : Colors.border,
                    opacity: filled ? 1 : 0.3,
                  },
                ]}
              />
            );
          })}
        </View>

        <View style={styles.scale}>
          <Text style={styles.scaleText}>Kritik</Text>
          <Text style={styles.scaleText}>Optimal</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  emoji: {
    fontSize: 36,
  },
  label: {
    ...Typography.h3,
  },
  description: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  scoreBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  scoreValue: {
    ...Typography.h4,
    fontWeight: '800',
  },
  segmentContainer: {
    flexDirection: 'row',
    gap: 3,
  },
  segment: {
    flex: 1,
    height: 12,
    borderRadius: 3,
  },
  scale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
