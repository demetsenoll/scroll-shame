import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { GoalSelector } from '../../components/home/GoalSelector';
import { useAppStore } from '../../store/useAppStore';
import { scheduleDailyReminder } from '../../utils/notifications';
import type { Goal } from '../../types';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: 0,
    headline: 'Dikkatin\nsenden\nçalınıyor.',
    sub: 'Her scroll, her swipe, her bildirim — bunlar tesadüf değil. Senin zamanın için tasarlanmış tuzaklar.',
    accent: Colors.primary,
    emoji: '📱',
    bg: ['#2d0a0a', '#0a0a0a'] as const,
  },
  {
    id: 1,
    headline: 'Tembel\ndeğilsin.',
    sub: 'Aşırı uyarılmış durumdasın. Dopamin sistemin saldırı altında. Bu seninle ilgili değil — algoritmalarla.',
    accent: Colors.orange,
    emoji: '🧠',
    bg: ['#2d1a0a', '#0a0a0a'] as const,
  },
  {
    id: 2,
    headline: 'Sen scroll\nyaparken\nhayat devam\nediyor.',
    sub: 'O kitap hâlâ okunmayı bekliyor. O antrenman, o dil, o hedef — hepsi seni bekliyor.',
    accent: Colors.purple,
    emoji: '⏳',
    bg: ['#150a2d', '#0a0a0a'] as const,
  },
  {
    id: 3,
    headline: 'Beynini\ngeri kazan.',
    sub: 'Scroll Shame, zamanını görmen için var. Utandırmak için değil — farkında kılmak için.',
    accent: Colors.recovery,
    emoji: '✨',
    bg: ['#0a2d1a', '#0a0a0a'] as const,
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([]);
  const [username, setUsername] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const setOnboarded = useAppStore((s) => s.setOnboarded);

  const isGoalSlide = currentSlide === SLIDES.length;

  const goToNext = () => {
    if (currentSlide < SLIDES.length) {
      const next = currentSlide + 1;
      setCurrentSlide(next);
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
    }
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentSlide(idx);
  };

  const handleFinish = () => {
    if (selectedGoals.length === 0) return;
    setOnboarded(selectedGoals, username.trim() || 'Kullanıcı');
    scheduleDailyReminder();
    router.replace('/(tabs)');
  };

  const slide = SLIDES[currentSlide];

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={!isGoalSlide}
        onMomentumScrollEnd={handleScroll}
        style={styles.scroll}
      >
        {SLIDES.map((s) => (
          <LinearGradient
            key={s.id}
            colors={s.bg}
            style={styles.slide}
          >
            <SafeAreaView style={styles.slideInner}>
              <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>{s.emoji}</Text>
              </View>

              <View style={styles.content}>
                <Text style={[styles.headline, { color: Colors.text }]}>
                  {s.headline}
                </Text>
                <View style={[styles.accentLine, { backgroundColor: s.accent }]} />
                <Text style={styles.sub}>{s.sub}</Text>
              </View>
            </SafeAreaView>
          </LinearGradient>
        ))}

        {/* Goal Selection Slide */}
        <LinearGradient
          colors={['#0a0a0a', '#0a0a0a']}
          style={styles.slide}
        >
          <SafeAreaView style={styles.slideInner}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
            >
            <View style={styles.goalSlideContent}>
              <Text style={styles.goalTitle}>Merhaba.</Text>
              <Text style={styles.goalSub}>Seni nasıl çağıralım?</Text>

              <TextInput
                style={styles.nameInput}
                value={username}
                onChangeText={setUsername}
                placeholder="Adın..."
                placeholderTextColor={Colors.textMuted}
                maxLength={24}
                autoCorrect={false}
              />

              <Text style={[styles.goalSub, { marginTop: Spacing.md }]}>
                Bu yolculukta ne için buradasın?
              </Text>
              <GoalSelector
                selected={selectedGoals}
                onToggle={(goal) => {
                  setSelectedGoals((prev) =>
                    prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
                  );
                }}
              />
              <TouchableOpacity
                style={[
                  styles.finishBtn,
                  selectedGoals.length === 0 && styles.finishBtnDisabled,
                ]}
                onPress={handleFinish}
                disabled={selectedGoals.length === 0}
              >
                <LinearGradient
                  colors={
                    selectedGoals.length > 0
                      ? [Colors.primary, Colors.orange]
                      : [Colors.border, Colors.border]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.finishGradient}
                >
                  <Text style={styles.finishText}>Başla →</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </LinearGradient>
      </ScrollView>

      {/* Bottom controls */}
      {!isGoalSlide && (
        <View style={styles.bottomBar}>
          <SafeAreaView edges={['bottom']}>
            <View style={styles.bottomInner}>
              <View style={styles.dots}>
                {SLIDES.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      i === currentSlide && [
                        styles.dotActive,
                        { backgroundColor: slide?.accent ?? Colors.primary },
                      ],
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity onPress={goToNext} style={styles.nextBtn}>
                <LinearGradient
                  colors={[slide?.accent ?? Colors.primary, Colors.orange]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.nextGradient}
                >
                  <Text style={styles.nextText}>
                    {currentSlide === SLIDES.length - 1 ? 'Devam Et' : 'İleri'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  slide: {
    width,
    height,
  },
  slideInner: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
    paddingBottom: 120,
  },
  emojiContainer: {
    paddingTop: Spacing.xxl,
    alignItems: 'flex-start',
  },
  emoji: {
    fontSize: 64,
  },
  content: {
    gap: Spacing.md,
  },
  headline: {
    fontSize: 52,
    fontWeight: '800',
    letterSpacing: -2,
    lineHeight: 56,
    color: Colors.text,
  },
  accentLine: {
    height: 3,
    width: 48,
    borderRadius: 2,
    marginVertical: Spacing.sm,
  },
  sub: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 26,
    maxWidth: 320,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background + 'EE',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
  bottomInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.md,
  },
  dots: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 24,
  },
  nextBtn: {
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  nextGradient: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
  },
  nextText: {
    ...Typography.h4,
    color: Colors.text,
  },
  goalSlideContent: {
    flex: 1,
    paddingTop: Spacing.xxl,
    paddingBottom: 40,
    gap: Spacing.md,
  },
  goalTitle: {
    ...Typography.hero,
    color: Colors.text,
    letterSpacing: -2,
  },
  goalSub: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  nameInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Typography.h3,
    color: Colors.text,
  },
  finishBtn: {
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginTop: 'auto',
  },
  finishBtnDisabled: {
    opacity: 0.4,
  },
  finishGradient: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
  },
  finishText: {
    ...Typography.h3,
    color: Colors.text,
  },
});
