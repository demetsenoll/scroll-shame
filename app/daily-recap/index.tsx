import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { getRecapMessage } from '../../utils/shameEngine';
import { useAppStore } from '../../store/useAppStore';

function RecapLine({ text, delay }: { text: string; delay: number }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 800 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.Text style={[styles.recapLine, style]}>{text}</Animated.Text>;
}

// Hook ihlalini önlemek için ayrı component
function StatRow({ label, value, color, delay }: { label: string; value: string; color: string; delay: number }) {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-20);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    translateX.value = withDelay(delay, withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[styles.statRow, style]}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </Animated.View>
  );
}

export default function DailyRecapScreen() {
  const { currentDay } = useAppStore();
  const totalMinutes = currentDay?.total ?? 0;
  const messages = getRecapMessage(totalMinutes);
  const baseDelay = messages.length * 900;

  const btnOpacity = useSharedValue(0);
  useEffect(() => {
    btnOpacity.value = withDelay(baseDelay + 500, withTiming(1, { duration: 600 }));
  }, []);
  const btnStyle = useAnimatedStyle(() => ({ opacity: btnOpacity.value }));

  const stats = [
    { label: 'Scroll süresi',      value: `${totalMinutes} dk`,                           color: Colors.primary },
    { label: 'Shame Score',        value: `${currentDay?.shameScore ?? 0}`,                color: Colors.orange },
    { label: 'Kayıp kitap sayfası', value: `${Math.round(totalMinutes * 0.35)} sayfa`,     color: Colors.purple },
  ];

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#1a0a0a', '#0a0a0a', '#000000']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <Text style={styles.eyebrow}>GÜN ÖZETI</Text>

          <View style={styles.messages}>
            {messages.map((msg, i) => (
              <RecapLine key={i} text={msg} delay={i * 900 + 400} />
            ))}
          </View>

          <View style={styles.stats}>
            {stats.map((s, i) => (
              <StatRow
                key={i}
                label={s.label}
                value={s.value}
                color={s.color}
                delay={baseDelay + 200 + i * 150}
              />
            ))}
          </View>
        </View>

        <Animated.View style={[styles.footer, btnStyle]}>
          <TouchableOpacity onPress={() => router.replace('/(tabs)')} activeOpacity={0.8}>
            <LinearGradient
              colors={[Colors.primary, Colors.orange]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.closeBtn}
            >
              <Text style={styles.closeBtnText}>Anlıyorum →</Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.footerNote}>Yarın daha iyisini yapabilirsin.</Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:        { flex: 1, backgroundColor: '#000000' },
  safe:        { flex: 1, paddingHorizontal: Spacing.xl },
  content:     { flex: 1, justifyContent: 'center', gap: Spacing.xl, paddingTop: Spacing.xxxl },
  eyebrow:     { ...Typography.label, color: Colors.primary, letterSpacing: 4 },
  messages:    { gap: Spacing.lg },
  recapLine:   { fontSize: 28, fontWeight: '700', color: Colors.text, letterSpacing: -0.5, lineHeight: 34 },
  stats:       { gap: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.lg },
  statRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statLabel:   { ...Typography.body, color: Colors.textSecondary },
  statValue:   { ...Typography.h3 },
  footer:      { paddingBottom: Spacing.xl, gap: Spacing.md, alignItems: 'center' },
  closeBtn:    { paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.md, borderRadius: Radius.full },
  closeBtnText: { ...Typography.h3, color: Colors.text },
  footerNote:  { ...Typography.bodySmall, color: Colors.textMuted },
});
