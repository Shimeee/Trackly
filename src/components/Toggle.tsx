import React from 'react';
import { Pressable, Animated, StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';
import { useTheme } from '../theme/ThemeProvider';

export function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const { colors } = useTheme();
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: value ? 1 : 0, duration: 150, useNativeDriver: false }).start();
  }, [value]);

  const bg = anim.interpolate({ inputRange: [0, 1], outputRange: ['rgba(148,163,184,0.35)', colors.accentPrimary] });
  const knobX = anim.interpolate({ inputRange: [0, 1], outputRange: [2, 22] });

  return (
    <Pressable onPress={() => onChange(!value)} hitSlop={8}>
      <Animated.View style={[styles.track, { backgroundColor: bg }]}>
        <Animated.View style={[styles.knob, { transform: [{ translateX: knobX }] }]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: { width: 44, height: 24, borderRadius: 999, justifyContent: 'center' },
  knob: { width: 20, height: 20, borderRadius: 999, backgroundColor: '#FFFFFF' },
});
