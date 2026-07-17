import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export function AnimatedProgressBar({ percent, color, delay = 0 }: { percent: number; color: string; delay?: number }) {
  const { colors, radius } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: percent, duration: 700, delay, useNativeDriver: false }).start();
  }, [percent]);

  const width = anim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'], extrapolate: 'clamp' });

  return (
    <View style={{ height: 6, borderRadius: radius.sm, overflow: 'hidden', backgroundColor: colors.bgSurfaceSecondary }}>
      <Animated.View style={{ height: 6, width, backgroundColor: color, borderRadius: radius.sm }} />
    </View>
  );
}
