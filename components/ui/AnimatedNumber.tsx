import React, { useEffect } from 'react';
import { Text, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors, Typography } from '../../constants/theme';

interface Props {
  value: number;
  suffix?: string;
  style?: TextStyle;
  duration?: number;
}

export function AnimatedNumber({ value, suffix = '', style, duration = 1000 }: Props) {
  const displayValue = useSharedValue(0);

  useEffect(() => {
    displayValue.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [value]);

  return (
    <Animated.Text style={[{ color: Colors.text, ...Typography.hero }, style]}>
      {Math.round(displayValue.value)}{suffix}
    </Animated.Text>
  );
}
