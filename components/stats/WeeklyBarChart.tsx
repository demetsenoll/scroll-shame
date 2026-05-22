import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Colors, Typography, Spacing } from '../../constants/theme';
import type { DailyLog } from '../../types';

const CHART_HEIGHT = 140;
const DAYS = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'];

interface BarProps {
  value: number;
  maxValue: number;
  label: string;
  index: number;
  color: string;
  isToday: boolean;
}

function Bar({ value, maxValue, label, index, color, isToday }: BarProps) {
  const heightPercent = useSharedValue(0);
  const targetPercent = maxValue > 0 ? value / maxValue : 0;

  useEffect(() => {
    heightPercent.value = withDelay(
      index * 60,
      withTiming(targetPercent, { duration: 600, easing: Easing.out(Easing.cubic) })
    );
  }, [value, maxValue]);

  const barStyle = useAnimatedStyle(() => ({
    height: heightPercent.value * CHART_HEIGHT,
  }));

  return (
    <View style={styles.barWrapper}>
      <View style={styles.barOuter}>
        <Animated.View
          style={[
            styles.bar,
            { backgroundColor: isToday ? color : color + '60' },
            barStyle,
          ]}
        />
      </View>
      <Text style={[styles.barLabel, isToday && { color: Colors.text }]}>{label}</Text>
      {value > 0 && (
        <Text style={[styles.barValue, { color: isToday ? color : Colors.textMuted }]}>
          {value}
        </Text>
      )}
    </View>
  );
}

interface Props {
  logs: DailyLog[];
}

export function WeeklyBarChart({ logs }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const last7 = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const data = last7.map((date) => {
    const log = logs.find((l) => l.date === date);
    return { date, value: log?.total ?? 0, score: log?.shameScore ?? 0 };
  });

  const maxValue = Math.max(...data.map((d) => d.value), 60);

  const getColor = (score: number) => {
    if (score <= 30) return Colors.recovery;
    if (score <= 60) return Colors.orange;
    return Colors.primary;
  };

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {data.map((d, i) => (
          <Bar
            key={d.date}
            value={d.value}
            maxValue={maxValue}
            label={DAYS[new Date(d.date + 'T12:00:00').getDay() === 0 ? 6 : new Date(d.date + 'T12:00:00').getDay() - 1]}
            index={i}
            color={getColor(d.score)}
            isToday={d.date === today}
          />
        ))}
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.recovery }]} />
          <Text style={styles.legendText}>Düşük</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.orange }]} />
          <Text style={styles.legendText}>Orta</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
          <Text style={styles.legendText}>Yüksek</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: CHART_HEIGHT + 40,
    gap: 6,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    justifyContent: 'flex-end',
  },
  barOuter: {
    width: '100%',
    height: CHART_HEIGHT,
    justifyContent: 'flex-end',
    borderRadius: 6,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 6,
    minHeight: 4,
  },
  barLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
  barValue: {
    fontSize: 9,
    fontWeight: '700',
  },
  legend: {
    flexDirection: 'row',
    gap: Spacing.md,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...Typography.caption,
    color: Colors.textMuted,
  },
});
