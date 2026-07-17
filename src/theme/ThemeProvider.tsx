import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ColorTokens } from './colors';
import { useSettingsStore } from '../store/settingsStore';

type ThemeContextValue = {
  colors: ColorTokens;
  isDark: boolean;
  spacing: typeof spacing;
  radius: typeof radius;
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 40 };
export const radius = { sm: 8, md: 12, lg: 16, xl: 24, full: 999 };

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const appearance = useSettingsStore((s) => s.appearance);

  const isDark = appearance === 'system' ? systemScheme === 'dark' : appearance === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const value = useMemo(() => ({ colors, isDark, spacing, radius }), [colors, isDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
