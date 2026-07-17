import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useSettingsStore } from '../../store/settingsStore';

export function SplashScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const hasCompletedOnboarding = useSettingsStore((s) => s.hasCompletedOnboarding);
  const isSignedIn = useSettingsStore((s) => s.isSignedIn);
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, tension: 60, useNativeDriver: true }),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.06, duration: 900, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])
      ).start();
    });

    const next = !hasCompletedOnboarding ? 'OnboardingBenefits' : !isSignedIn ? 'Auth' : 'Main';
    const t = setTimeout(() => navigation.replace(next), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../../assets/trackly_mark.png')}
        style={[styles.logo, { opacity, transform: [{ scale }] }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#4338CA' },
  logo: { width: 220, height: 220 },
});
