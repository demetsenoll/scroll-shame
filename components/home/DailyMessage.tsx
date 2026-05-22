import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';
import { getContextualMessages } from '../../utils/shameEngine';

interface Props {
  shameScore: number;
  streak?: number;
}

export function DailyMessage({ shameScore, streak = 0 }: Props) {
  const messages = getContextualMessages(shameScore, streak);
  const [msgIndex, setMsgIndex] = useState(() => Math.floor(Math.random() * messages.length));
  const messagesRef = useRef(messages);
  const opacity = useSharedValue(1);

  // Refresh pool when score/streak changes
  useEffect(() => {
    messagesRef.current = getContextualMessages(shameScore, streak);
  }, [shameScore, streak]);

  useEffect(() => {
    const interval = setInterval(() => {
      opacity.value = withTiming(0, { duration: 300 }, () => {
        opacity.value = withTiming(1, { duration: 400 });
      });
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % messagesRef.current.length);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const borderColor = shameScore > 60 ? Colors.primary : shameScore > 30 ? Colors.orange : Colors.recovery;
  const currentMsg = messagesRef.current[msgIndex % messagesRef.current.length];

  return (
    <LinearGradient
      colors={['#1a0a0a', '#111111']}
      style={[styles.container, { borderColor: borderColor + '40' }]}
    >
      <View style={[styles.dot, { backgroundColor: borderColor }]} />
      <Animated.Text style={[styles.message, fadeStyle]}>
        {currentMsg}
      </Animated.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    flex: 1,
    fontStyle: 'italic',
  },
});
