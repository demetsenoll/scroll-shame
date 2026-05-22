import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors, Radius } from '../../constants/theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  gradient?: readonly [string, string, ...string[]];
  blur?: boolean;
  intensity?: number;
}

export function GradientCard({ children, style, gradient, blur = false, intensity = 20 }: Props) {
  const colors = gradient ?? (['#1f1f1f', '#141414'] as const);

  if (blur) {
    return (
      <BlurView intensity={intensity} tint="dark" style={[styles.card, style]}>
        {children}
      </BlurView>
    );
  }

  return (
    <LinearGradient colors={colors} style={[styles.card, style]}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
});
